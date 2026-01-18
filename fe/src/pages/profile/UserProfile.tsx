/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Skeleton } from "@/components/ui/skeleton.tsx";
import {
  User,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import {
  getMyProfile,
  updateMyProfile,
  verifyPhoneNumberSendOtp,
  verifyPhoneNumberVerifyOtp,
} from "@/services/userServices.ts";
import { uploadImage } from "@/services/mediaServices.ts";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import type { PlacePrediction } from "@/types/place-prediction";
import { placeAutocomplete } from "@/services/goongAPIServices.ts";
import { cn } from "@/lib/utils.ts";
import { useUserStore } from "@/store/userStore.ts";
import { VerifyPhoneDialog } from "@/components/dialog/verify-phone-dialog.tsx";
import { convertPhoneNumber } from "@/utils/generalFormat.ts";
import { Spinner } from "@/components/ui/spinner.tsx";
import { Capacitor } from "@capacitor/core";
import { Switch } from "@/components/ui/switch";
import { useLocationTracking } from "@/contexts/LocationContext";

type UserProfileFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
};

export const UserProfile: React.FC = () => {
  const { isTracking, startTracking, stopTracking } = useLocationTracking();

  const navigate = useNavigate();
  const [isVerifyPhoneDialogOpen, setIsVerifyPhoneDialogOpen] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const {
    setUserInfo,
    setApproveStatus,
    setPhoneVerificationStatus,
    verifiedPhone,
  } = useUserStore();
  const userId = useUserStore((state) => state.userId);

  // Autocomplete states for address
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isPhoneVerificationLoading, setIsPhoneVerificationLoading] =
    useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastTrimmedAddressRef = useRef<string>("");

  const getProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      const response = await getMyProfile();
      setFullName(response?.data.fullName);
      setEmail(response?.data.email);
      setPhoneNumber(response?.data.phoneNumber);
      setAddress(response?.data.liveAddress);
      setAvatarPreview(response?.data.avatarUrl);
      setUserInfo(userId, response?.data.avatarUrl);
      setApproveStatus(response?.data.becomeSellerApproveStatus);
      setPhoneVerificationStatus(response?.data.verifiedPhone);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [userId, setUserInfo, setApproveStatus, setPhoneVerificationStatus]);

  const form = useForm<UserProfileFormData>({
    defaultValues: {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
    },
    mode: "onSubmit",
  });

  // Load profile data only once on mount
  useEffect(() => {
    getProfile();
  }, [getProfile]);

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

    const trimmedAddress = debouncedAddress?.trim();
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
          prev < suggestions.length - 1 ? prev + 1 : prev,
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

  // Handle phone verification
  const handleVerifyPhone = async (otp: string) => {
    try {
      const currentPhone = form.getValues("phoneNumber");
      // Call API to verify phone with OTP
      await verifyPhoneNumberVerifyOtp(convertPhoneNumber(currentPhone), otp);
      // Update verification status in store
      setPhoneVerificationStatus(true);
      toast.success("Xác thực số điện thoại thành công!");
      // Dialog will close automatically via onOpenChange in the dialog component
    } catch (error: any) {
      console.error("Phone verification failed:", error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "Xác thực thất bại. Vui lòng thử lại!";
      toast.error(errorMessage);
      throw error; // Re-throw to keep dialog open
    }
  };

  const handleOpenVerifyDialog = async () => {
    const currentPhone = form.getValues("phoneNumber");
    if (!currentPhone || currentPhone.length !== 10) {
      toast.error("Vui lòng nhập số điện thoại hợp lệ (10 chữ số)");
      return;
    }
    setIsPhoneVerificationLoading(true);
    try {
      // Call API to send OTP to phone number
      await verifyPhoneNumberSendOtp(convertPhoneNumber(currentPhone));
      toast.success("Mã OTP đã được gửi đến số điện thoại của bạn!");
      setIsVerifyPhoneDialogOpen(true);
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "Không thể gửi mã OTP. Vui lòng thử lại!";
      toast.error(errorMessage);
    } finally {
      setIsPhoneVerificationLoading(false);
    }
  };

  // Combined submit handler for both profile and preferences
  const handleSaveAll = async () => {
    try {
      setIsSubmitting(true);

      // Get values from profile form
      const profileData = form.getValues();

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
        phoneNumber: profileData.phoneNumber,
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
                  required: "Số điện thoại không được để trống!",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Số điện thoại phải có 10 chữ số!",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Số điện thoại
                      {phoneNumber ? (
                        verifiedPhone ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-normal">
                            <CheckCircle2 className="w-4 h-4" />
                            Đã xác thực
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-600 font-normal">
                            <AlertCircle className="w-4 h-4" />
                            Chưa xác thực
                          </span>
                        )
                      ) : (
                        <div></div>
                      )}
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          type="tel"
                          className="focus-visible:ring-[#008DDA] flex-1"
                          maxLength={10}
                          {...field}
                        />
                        {phoneNumber && !verifiedPhone && (
                          <Button
                            type="button"
                            variant="outline"
                            className={`transition-colors text-white hover:text-white whitespace-nowrap duration-200 ${
                              isPhoneVerificationLoading
                                ? "bg-[#0064A6]"
                                : "bg-[#008DDA] cursor-pointer"
                            } hover:bg-[#0064A6] `}
                            onClick={handleOpenVerifyDialog}
                          >
                            {isPhoneVerificationLoading ? <Spinner /> : null}
                            Xác thực
                          </Button>
                        )}
                      </div>
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
                                  selectedIndex === index && "bg-gray-100",
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

      {/* Section: Settings (Mobile Only) */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sm:hidden">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          Cài đặt độ ưu tiên
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Tùy chỉnh độ ưu tiên của bạn
        </p>
        <Button
          type="button"
          onClick={() => navigate("/cai-dat")}
          className="cursor-pointer w-full transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6]"
        >
          Cài đặt
        </Button>
      </div>

      {/* Save Button */}
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

      {/* Verify Phone Dialog */}
      <VerifyPhoneDialog
        open={isVerifyPhoneDialogOpen}
        onOpenChange={setIsVerifyPhoneDialogOpen}
        phoneNumber={phoneNumber}
        onVerify={handleVerifyPhone}
      />
    </div>
  );
};
