import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  User,
  Upload,
  Shield,
  Heart,
  GraduationCap,
  ShoppingBag,
  Car,
  Leaf,
  Music,
  Loader2,
  MapPin,
} from "lucide-react";
import { PreferencePresetCard } from "@/components/card-item/preference-preset-card.tsx";
import type { PreferencePreset } from "@/types/preference-preset";
import { getMyProfile, updateMyProfile } from "@/services/userServices.ts";
import { uploadImage } from "@/services/mediaServices.ts";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { getAllPreferencePresets } from "@/services/preferencePresetServices.ts";
import type { PlacePrediction } from "@/types/place-prediction";
import { placeAutocomplete } from "@/services/goongAPIServices.ts";
import { cn } from "@/lib/utils.ts";
import { useUserStore } from "@/store/userStore.ts";
import { Capacitor } from "@capacitor/core";
import { Switch } from "@/components/ui/switch";
import { useBackgroundLocation } from "@/hooks/useBackgroundLocation";

type UserProfileFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

type PreferenceFormData = {
  safety: number;
  healthcare: number;
  education: number;
  shopping: number;
  transportation: number;
  environment: number;
  entertainment: number;
};

export const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [presets, setPresets] = useState<PreferencePreset[]>([]);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [preferences, setPreferences] = useState({
    safety: 50,
    healthcare: 50,
    education: 50,
    shopping: 50,
    transportation: 50,
    environment: 50,
    entertainment: 50,
  });
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const userId = useUserStore((state) => state.userId);

  // Tracking Hook
  const { isTracking, startTracking, stopTracking } = useBackgroundLocation();

  // Autocomplete states for address
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTrimmedAddressRef = useRef<string>("");

  // Flag to prevent clearing preset selection during preset update
  const isUpdatingPresetRef = useRef(false);

  // Fetch presets from API
  const fetchPresets = async () => {
    try {
      setIsLoadingPresets(true);
      const response = await getAllPreferencePresets();
      // Convert decimal values (0-1) from API to percentage values (0-100) for display
      const presetsWithPercentages = response.data.map(
        (preset: PreferencePreset) => {
          const presetId = String(preset.id); // Ensure ID is always string
          return {
            id: presetId,
            name: preset.name,
            image: preset.image,
            description: preset.description,
            preferenceSafety: Math.round(
              (preset.preferenceSafety ?? 0.5) * 100
            ),
            preferenceHealthcare: Math.round(
              (preset.preferenceHealthcare ?? 0.5) * 100
            ),
            preferenceEducation: Math.round(
              (preset.preferenceEducation ?? 0.5) * 100
            ),
            preferenceShopping: Math.round(
              (preset.preferenceShopping ?? 0.5) * 100
            ),
            preferenceTransportation: Math.round(
              (preset.preferenceTransportation ?? 0.5) * 100
            ),
            preferenceEnvironment: Math.round(
              (preset.preferenceEnvironment ?? 0.5) * 100
            ),
            preferenceEntertainment: Math.round(
              (preset.preferenceEntertainment ?? 0.5) * 100
            ),
          };
        }
      );
      console.log("Processed presets:", presetsWithPercentages);
      setPresets(presetsWithPercentages);
    } catch (error) {
      console.error("Error fetching presets:", error);
      toast.error("Không thể tải danh sách bộ ưu tiên!");
    } finally {
      setIsLoadingPresets(false);
    }
  };

  const getProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const response = await getMyProfile();
      setFullName(response?.data.fullName);
      setEmail(response?.data.email);
      setPhoneNumber(response?.data.phoneNumber);
      setAddress(response?.data.liveAddress);
      setAvatarPreview(response?.data.avatarUrl);
      setUserInfo(
        userId,
        response?.data.avatarUrl,
        response?.data.becomeSellerApproveStatus
      );

      // Convert decimal values (0-1) from API to percentage values (0-100) for display
      setPreferences({
        safety: Math.round((response?.data.preferenceSafety ?? 0.5) * 100),
        healthcare: Math.round(
          (response?.data.preferenceHealthcare ?? 0.5) * 100
        ),
        education: Math.round(
          (response?.data.preferenceEducation ?? 0.5) * 100
        ),
        shopping: Math.round((response?.data.preferenceShopping ?? 0.5) * 100),
        transportation: Math.round(
          (response?.data.preferenceTransportation ?? 0.5) * 100
        ),
        environment: Math.round(
          (response?.data.preferenceEnvironment ?? 0.5) * 100
        ),
        entertainment: Math.round(
          (response?.data.preferenceEntertainment ?? 0.5) * 100
        ),
      });

      // Set selected preset if exists
      const presetIdFromAPI = response?.data.preferencePresetId;

      if (presetIdFromAPI !== null && presetIdFromAPI !== undefined) {
        // Convert to string to match preset.id type (which is always string)
        const presetIdString = String(presetIdFromAPI);
        console.log("Setting selectedPresetId to:", presetIdString);
        setSelectedPresetId(presetIdString);
      } else {
        console.log(
          "No preferencePresetId found in response (null or undefined)"
        );
        setSelectedPresetId(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const form = useForm<UserProfileFormData>({
    defaultValues: {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
    },
    mode: "onSubmit",
  });

  const preferenceForm = useForm<PreferenceFormData>({
    defaultValues: {
      safety: preferences.safety,
      healthcare: preferences.healthcare,
      education: preferences.education,
      shopping: preferences.shopping,
      transportation: preferences.transportation,
      environment: preferences.environment,
      entertainment: preferences.entertainment,
    },
    mode: "onChange",
  });

  // Load profile data and presets only once on mount
  useEffect(() => {
    getProfile();
    fetchPresets();
  }, []);

  // Update form values when profile data is loaded
  useEffect(() => {
    if (fullName || email || phoneNumber || address) {
      form.reset({
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        address: address,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, phoneNumber, address]);

  // Update preference form values when preferences data is loaded
  useEffect(() => {
    if (preferences.safety !== undefined) {
      preferenceForm.reset({
        safety: preferences.safety,
        healthcare: preferences.healthcare,
        education: preferences.education,
        shopping: preferences.shopping,
        transportation: preferences.transportation,
        environment: preferences.environment,
        entertainment: preferences.entertainment,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    preferences.safety,
    preferences.healthcare,
    preferences.education,
    preferences.shopping,
    preferences.transportation,
    preferences.environment,
    preferences.entertainment,
  ]);

  // Watch address value
  const addressValue = form.watch("address");

  // Debounce address value with 300ms delay
  const [debouncedAddress] = useDebounce(addressValue, 300);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAutocompleteSuggestions = useCallback(async (input: string) => {
    setIsLoadingAddress(true);
    try {
      const data = await placeAutocomplete(input, 10);
      if (data.predictions && data.predictions.length > 0) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
      setSuggestions([]);
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  // Fetch autocomplete suggestions when debounced address changes
  useEffect(() => {
    // Only fetch suggestions if user has interacted with the input
    if (!hasUserInteracted) {
      return;
    }

    const trimmedAddress = debouncedAddress.trim();
    if (!trimmedAddress || trimmedAddress.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      lastTrimmedAddressRef.current = "";
      return;
    }
    if (trimmedAddress === lastTrimmedAddressRef.current) {
      return;
    }
    lastTrimmedAddressRef.current = trimmedAddress;
    fetchAutocompleteSuggestions(trimmedAddress);
  }, [debouncedAddress, fetchAutocompleteSuggestions, hasUserInteracted]);

  const handleSelectSuggestion = (prediction: PlacePrediction) => {
    form.setValue("address", prediction.description);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Watch all preference form values
  const watchedPreferences = preferenceForm.watch();

  // Effect to clear preset selection when user manually adjusts any slider
  useEffect(() => {
    // Skip if we're currently updating from preset selection
    if (isUpdatingPresetRef.current) {
      return;
    }

    if (selectedPresetId) {
      const selectedPreset = presets.find((p) => p.id === selectedPresetId);
      if (selectedPreset) {
        // Check if any value has been changed from the preset values
        const hasChanged =
          watchedPreferences.safety !== selectedPreset.preferenceSafety ||
          watchedPreferences.healthcare !==
            selectedPreset.preferenceHealthcare ||
          watchedPreferences.education !== selectedPreset.preferenceEducation ||
          watchedPreferences.shopping !== selectedPreset.preferenceShopping ||
          watchedPreferences.transportation !==
            selectedPreset.preferenceTransportation ||
          watchedPreferences.environment !==
            selectedPreset.preferenceEnvironment ||
          watchedPreferences.entertainment !==
            selectedPreset.preferenceEntertainment;

        // If any value changed, clear the preset selection
        if (hasChanged) {
          setSelectedPresetId(null);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedPreferences, selectedPresetId]);

  // Helper function to get preference level label
  const getPreferenceLabel = (value: number): string => {
    if (value === 0) return "Không quan trọng";
    if (value <= 25) return "Ít quan trọng";
    if (value <= 50) return "Bình thường";
    if (value <= 75) return "Quan trọng";
    return "Rất quan trọng";
  };

  // Helper function to get label color
  const getLabelColor = (value: number): string => {
    if (value === 0) return "text-gray-400";
    if (value <= 25) return "text-gray-500";
    if (value <= 50) return "text-black";
    if (value <= 75) return "text-orange-500";
    return "text-[#008DDA]";
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file .png, .jpg, .jpeg, .webp");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (presetId: string) => {
    // Set flag to prevent clearing preset during update
    isUpdatingPresetRef.current = true;

    setSelectedPresetId(presetId);
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      // Update preference form values with preset values
      preferenceForm.setValue("safety", preset.preferenceSafety);
      preferenceForm.setValue("healthcare", preset.preferenceHealthcare);
      preferenceForm.setValue("education", preset.preferenceEducation);
      preferenceForm.setValue("shopping", preset.preferenceShopping);
      preferenceForm.setValue(
        "transportation",
        preset.preferenceTransportation
      );
      preferenceForm.setValue("environment", preset.preferenceEnvironment);
      preferenceForm.setValue("entertainment", preset.preferenceEntertainment);
    }

    // Reset flag after a short delay to allow form values to settle
    setTimeout(() => {
      isUpdatingPresetRef.current = false;
    }, 100);
  };

  const handlePreferenceDefault = () => {
    setSelectedPresetId(null); // Clear preset selection
    preferenceForm.reset({
      safety: 50,
      healthcare: 50,
      education: 50,
      shopping: 50,
      transportation: 50,
      environment: 50,
      entertainment: 50,
    });
  };

  // Combined submit handler for both profile and preferences
  const handleSaveAll = async () => {
    try {
      setIsSubmitting(true);

      // Get values from both forms
      const profileData = form.getValues();
      const preferenceData = preferenceForm.getValues();

      let avatarUrl: string | undefined = avatarPreview || undefined;
      if (avatarFile) {
        try {
          const uploadResponse = await uploadImage(avatarFile);
          avatarUrl = uploadResponse.data.mediaUrl;
        } catch (uploadError) {
          console.error("Error uploading avatar:", uploadError);
          toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
          setIsSubmitting(false);
          return;
        }
      }

      await updateMyProfile({
        fullName: profileData.fullName,
        avatarUrl: avatarUrl,
        liveAddress: profileData.address,
        preferencePresetId: selectedPresetId ? Number(selectedPresetId) : null,
        preferenceSafety: preferenceData.safety / 100,
        preferenceHealthcare: preferenceData.healthcare / 100,
        preferenceEducation: preferenceData.education / 100,
        preferenceShopping: preferenceData.shopping / 100,
        preferenceTransportation: preferenceData.transportation / 100,
        preferenceEnvironment: preferenceData.environment / 100,
        preferenceEntertainment: preferenceData.entertainment / 100,
      });

      toast.success("Cập nhật thông tin thành công!");

      // Reload profile data to sync with server
      await getProfile();
      // Clear avatar file state after successful update
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Có lỗi xảy ra khi cập nhật thông tin!";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Section 1: Personal Profile */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-6">Hồ sơ cá nhân</h2>

        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b">
          {isLoadingProfile ? (
            <>
              {/* Avatar Skeleton */}
              <Skeleton className="w-32 h-32 rounded-full" />
              {/* Upload Button Skeleton */}
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </>
          ) : (
            <>
              {/* Avatar Preview */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  id="avatar-upload"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  <label htmlFor="avatar-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Tải ảnh
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500">
                    Chấp nhận: PNG, JPG, JPEG, WEBP
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Form */}
        {isLoadingProfile ? (
          <div className="space-y-6">
            {/* Skeleton for form fields */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="pt-4">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-[#008DDA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không đúng định dạng",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        disabled={true}
                        className="focus-visible:ring-[#008DDA]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Số điện thoại phải gồm đúng 10 chữ số",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        disabled={true}
                        className="focus-visible:ring-[#008DDA] cursor-not-allowed"
                        maxLength={10}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="focus-visible:ring-[#008DDA]"
                          {...field}
                          ref={(e) => {
                            field.ref(e);
                            inputRef.current = e;
                          }}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setHasUserInteracted(true)}
                          onChange={(e) => {
                            setHasUserInteracted(true);
                            field.onChange(e);
                          }}
                          autoComplete="off"
                        />
                        {isLoadingAddress && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#008DDA]" />
                          </div>
                        )}
                        {showSuggestions && suggestions.length > 0 && (
                          <div
                            ref={suggestionRef}
                            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                          >
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={suggestion.place_id}
                                className={cn(
                                  "px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors",
                                  selectedIndex === index && "bg-gray-100"
                                )}
                                onClick={() =>
                                  handleSelectSuggestion(suggestion)
                                }
                              >
                                <div className="text-sm text-gray-900">
                                  {suggestion.structured_formatting
                                    ?.main_text || suggestion.description}
                                </div>
                                {suggestion.structured_formatting
                                  ?.secondary_text && (
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {
                                      suggestion.structured_formatting
                                        .secondary_text
                                    }
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}
      </div>

      {/* Section: Tracking Location (Mobile Only) */}
      {Capacitor.isNativePlatform() && (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1 pr-4">
              <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#008DDA]" />
                Cài đặt theo dõi vị trí
              </h2>
              <p className="text-sm text-gray-500">
                Bật tính năng này để nhận thông báo về các bất động sản phù hợp
                khi bạn đi ngang qua. Ứng dụng sẽ sử dụng vị trí nền tiết kiệm
                pin.
              </p>
            </div>
            <Switch
              checked={isTracking}
              onCheckedChange={(checked) => {
                if (checked) {
                  startTracking();
                } else {
                  stopTracking();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Section: Password (Mobile Only) */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sm:hidden">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          Mật khẩu
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Thay đổi mật khẩu để bảo mật tài khoản của bạn
        </p>
        <Button
          type="button"
          onClick={() => navigate("/doi-mat-khau")}
          className="cursor-pointer w-full transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6]"
        >
          Đổi mật khẩu
        </Button>
      </div>

      {/* Section 2: Preference Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h2 className="text-2xl font-semibold mb-2">Cài đặt ưu tiên</h2>
        <p className="text-sm text-gray-500 mb-6">
          Hãy cho chúng tôi biết điều gì là quan trọng nhất với bạn. Hệ thống sẽ
          sử dụng các ưu tiên này để tính toán và gợi ý các bất động sản phù hợp
          nhất với bạn.
        </p>

        {isLoadingProfile || isLoadingPresets ? (
          <div className="space-y-6">
            {/* Skeleton for tabs */}
            <Skeleton className="h-10 w-full" />
            {/* Skeleton for preset cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        ) : (
          <Tabs defaultValue="presets" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="presets" className="cursor-pointer">
                Bộ có sẵn
              </TabsTrigger>
              <TabsTrigger value="custom" className="cursor-pointer">
                Tùy chỉnh
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Bộ có sẵn (Presets) */}
            <TabsContent value="presets" className="space-y-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Chọn một mẫu ưu tiên phù hợp với nhu cầu của bạn. Bạn có thể
                  chỉnh sửa chi tiết ở tab "Tùy chỉnh".
                </p>
              </div>

              {/* Preset Cards Grid */}
              {presets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {presets.map((preset) => {
                    const isSelected = selectedPresetId === preset.id;
                    console.log(
                      "Comparing preset.id:",
                      preset.id,
                      "with selectedPresetId:",
                      selectedPresetId,
                      "Result:",
                      isSelected
                    );
                    return (
                      <PreferencePresetCard
                        key={preset.id}
                        preset={preset}
                        isSelected={isSelected}
                        onSelect={() => handlePresetSelect(preset.id)}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    Không có bộ ưu tiên nào được tìm thấy.
                  </p>
                </div>
              )}

              {/* Selected Indicator */}
              {selectedPresetId && (
                <div className="pt-6 border-t">
                  <p className="text-sm text-gray-600">
                    Đã chọn:{" "}
                    <span className="font-semibold text-[#008DDA]">
                      {presets.find((p) => p.id === selectedPresetId)?.name}
                    </span>
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tab 2: Tùy chỉnh (Custom Sliders) */}
            <TabsContent value="custom">
              <Form {...preferenceForm}>
                <form className="space-y-8">
                  {/* Security Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="safety"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                              <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                An ninh
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Độ an toàn của khu vực, camera, bảo vệ
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Healthcare Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="healthcare"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <Heart className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Y tế
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Bệnh viện, phòng khám gần khu vực
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Education Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Giáo dục
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Trường học, trung tâm đào tạo
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Amenities Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <ShoppingBag className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Tiện ích
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Chợ, siêu thị, nhà hàng, cửa hàng
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Transportation Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="transportation"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                              <Car className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Giao thông
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Xe buýt, metro, gần trục đường chính
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Environment Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="environment"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                              <Leaf className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Môi trường
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Công viên, cây xanh, không khí trong lành
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Entertainment Slider */}
                  <FormField
                    control={preferenceForm.control}
                    name="entertainment"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                              <Music className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                              <FormLabel className="text-base font-semibold">
                                Giải trí
                              </FormLabel>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Rạp chiếu phim, khu vui chơi, gym
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div
                              className={`text-sm font-semibold ${getLabelColor(
                                field.value
                              )}`}
                            >
                              {getPreferenceLabel(field.value)}
                            </div>
                            <div className="text-xs text-gray-400 mt-0.5">
                              {field.value}%
                            </div>
                          </div>
                        </div>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            value={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="cursor-pointer"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Reset Default Button */}
                  <div className="pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer w-full sm:w-auto"
                      onClick={handlePreferenceDefault}
                    >
                      Đặt lại mặc định
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Global Save Button */}
      {!isLoadingProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sticky bottom-0 lg:flex lg:justify-end md:flex md:justify-end">
          <Button
            type="button"
            onClick={handleSaveAll}
            disabled={isSubmitting}
            className="cursor-pointer w-full sm:w-auto transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6] text-base px-8 py-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                Đang lưu...
              </>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
