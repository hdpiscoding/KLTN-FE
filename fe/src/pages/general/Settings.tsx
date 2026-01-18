import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PreferencePresetCard } from "@/components/card-item/preference-preset-card";
import { getAllPreferencePresets } from "@/services/preferencePresetServices";
import { updateMyProfile, getMyProfile } from "@/services/userServices";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-toastify";
import {
  Heart,
  GraduationCap,
  Shield,
  Music,
  Leaf,
  Car,
  ShoppingBag,
} from "lucide-react";

interface PreferencePreset {
  id: number;
  name: string;
  image: string;
  description: string;
  preferenceSafety: number;
  preferenceEducation: number;
  preferenceShopping: number;
  preferenceTransportation: number;
  preferenceEnvironment: number;
  preferenceEntertainment: number;
  preferenceHealthcare: number;
}

export const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Preference states
  const [preferenceSafety, setPreferenceSafety] = useState(50);
  const [preferenceEducation, setPreferenceEducation] = useState(50);
  const [preferenceShopping, setPreferenceShopping] = useState(50);
  const [preferenceTransportation, setPreferenceTransportation] = useState(50);
  const [preferenceEnvironment, setPreferenceEnvironment] = useState(50);
  const [preferenceEntertainment, setPreferenceEntertainment] = useState(50);
  const [preferenceHealthcare, setPreferenceHealthcare] = useState(50);

  const [selectedPresetId, setSelectedPresetId] = useState<number | null>(null);
  const [presets, setPresets] = useState<PreferencePreset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [presetsResponse, profileResponse] = await Promise.all([
          getAllPreferencePresets(),
          getMyProfile(),
        ]);

        if (presetsResponse?.data) {
          // Convert decimal values (0-1) from API to percentage values (0-100) for display
          const presetsWithPercentages = presetsResponse.data.map(
            (preset: PreferencePreset) => ({
              id: preset.id,
              name: preset.name,
              image: preset.image,
              description: preset.description,
              preferenceSafety: Math.round(
                (preset.preferenceSafety ?? 0.5) * 100,
              ),
              preferenceHealthcare: Math.round(
                (preset.preferenceHealthcare ?? 0.5) * 100,
              ),
              preferenceEducation: Math.round(
                (preset.preferenceEducation ?? 0.5) * 100,
              ),
              preferenceShopping: Math.round(
                (preset.preferenceShopping ?? 0.5) * 100,
              ),
              preferenceTransportation: Math.round(
                (preset.preferenceTransportation ?? 0.5) * 100,
              ),
              preferenceEnvironment: Math.round(
                (preset.preferenceEnvironment ?? 0.5) * 100,
              ),
              preferenceEntertainment: Math.round(
                (preset.preferenceEntertainment ?? 0.5) * 100,
              ),
            }),
          );
          setPresets(presetsWithPercentages);
        }

        if (profileResponse?.data) {
          const profile = profileResponse.data;
          setPreferenceSafety(
            Math.round((profile.preferenceSafety ?? 0.5) * 100),
          );
          setPreferenceEducation(
            Math.round((profile.preferenceEducation ?? 0.5) * 100),
          );
          setPreferenceShopping(
            Math.round((profile.preferenceShopping ?? 0.5) * 100),
          );
          setPreferenceTransportation(
            Math.round((profile.preferenceTransportation ?? 0.5) * 100),
          );
          setPreferenceEnvironment(
            Math.round((profile.preferenceEnvironment ?? 0.5) * 100),
          );
          setPreferenceEntertainment(
            Math.round((profile.preferenceEntertainment ?? 0.5) * 100),
          );
          setPreferenceHealthcare(
            Math.round((profile.preferenceHealthcare ?? 0.5) * 100),
          );
          setSelectedPresetId(profile.preferencePresetId || null);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Không thể tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSliderChange = () => {
    // If user manually adjusts any slider, unselect preset
    setSelectedPresetId(null);
  };

  const handlePresetSelect = (presetId: number) => {
    const preset = presets.find((p) => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setPreferenceSafety(preset.preferenceSafety);
    setPreferenceEducation(preset.preferenceEducation);
    setPreferenceShopping(preset.preferenceShopping);
    setPreferenceTransportation(preset.preferenceTransportation);
    setPreferenceEnvironment(preset.preferenceEnvironment);
    setPreferenceEntertainment(preset.preferenceEntertainment);
    setPreferenceHealthcare(preset.preferenceHealthcare);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateMyProfile({
        preferenceSafety: preferenceSafety / 100,
        preferenceHealthcare: preferenceHealthcare / 100,
        preferenceEducation: preferenceEducation / 100,
        preferenceShopping: preferenceShopping / 100,
        preferenceTransportation: preferenceTransportation / 100,
        preferenceEnvironment: preferenceEnvironment / 100,
        preferenceEntertainment: preferenceEntertainment / 100,
        preferencePresetId: selectedPresetId,
      });

      toast.success("Đã lưu cài đặt ưu tiên");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Không thể lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  const getPreferenceLabel = (value: number): string => {
    if (value === 0) return "Không quan trọng";
    if (value <= 25) return "Ít quan trọng";
    if (value <= 50) return "Bình thường";
    if (value <= 75) return "Quan trọng";
    return "Rất quan trọng";
  };

  const preferenceConfig = [
    {
      icon: Shield,
      label: "An ninh",
      description: "Mức độ an toàn của khu vực",
      value: preferenceSafety,
      setValue: setPreferenceSafety,
      color: "#F97316",
    },
    {
      icon: Heart,
      label: "Y tế",
      description: "Tiếp cận dịch vụ y tế",
      value: preferenceHealthcare,
      setValue: setPreferenceHealthcare,
      color: "#ef4444",
    },
    {
      icon: GraduationCap,
      label: "Giáo dục",
      description: "Trường học và cơ sở giáo dục",
      value: preferenceEducation,
      setValue: setPreferenceEducation,
      color: "#A855F7",
    },
    {
      icon: ShoppingBag,
      label: "Mua sắm",
      description: "Cửa hàng và dịch vụ",
      value: preferenceShopping,
      setValue: setPreferenceShopping,
      color: "#22C55E",
    },
    {
      icon: Car,
      label: "Giao thông",
      description: "Kết nối đi lại",
      value: preferenceTransportation,
      setValue: setPreferenceTransportation,
      color: "#eab308",
    },
    {
      icon: Leaf,
      label: "Môi trường",
      description: "Công viên và không gian xanh",
      value: preferenceEnvironment,
      setValue: setPreferenceEnvironment,
      color: "#14b8a6",
    },
    {
      icon: Music,
      label: "Giải trí",
      description: "Hoạt động vui chơi giải trí",
      value: preferenceEntertainment,
      setValue: setPreferenceEntertainment,
      color: "#ec4899",
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <h1 className="text-3xl font-bold mb-2">Cài đặt ưu tiên</h1>
        <p className="text-gray-600">
          Hãy cho chúng tôi biết điều gì là quan trọng nhất với bạn.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
        <Tabs defaultValue="presets" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="presets" className="cursor-pointer">
              Bộ có sẵn
            </TabsTrigger>
            <TabsTrigger value="custom" className="cursor-pointer">
              Tùy chọn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {presets.map((preset) => (
                <PreferencePresetCard
                  key={preset.id}
                  id={preset.id}
                  name={preset.name}
                  imageUrl={preset.image}
                  description={preset.description}
                  preferenceSafety={preset.preferenceSafety}
                  preferenceEducation={preset.preferenceEducation}
                  preferenceShopping={preset.preferenceShopping}
                  preferenceTransportation={preset.preferenceTransportation}
                  preferenceEnvironment={preset.preferenceEnvironment}
                  preferenceEntertainment={preset.preferenceEntertainment}
                  preferenceHealthcare={preset.preferenceHealthcare}
                  isSelected={selectedPresetId === preset.id}
                  onSelect={handlePresetSelect}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preferenceConfig.map((pref) => {
                const Icon = pref.icon;
                return (
                  <div
                    key={pref.label}
                    className="space-y-4 p-6 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${pref.color}15` }}
                      >
                        <Icon style={{ color: pref.color }} size={24} />
                      </div>
                      <div className="flex-1">
                        <Label className="text-base font-semibold">
                          {pref.label}
                        </Label>
                        <p className="text-sm text-gray-500">
                          {pref.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={[pref.value]}
                        onValueChange={(value) => {
                          pref.setValue(value[0]);
                          handleSliderChange();
                        }}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{pref.value}</span>
                        <span
                          className="font-medium"
                          style={{ color: pref.color }}
                        >
                          {getPreferenceLabel(pref.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Save Button Section */}
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 sticky bottom-0 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="cursor-pointer w-full sm:w-auto transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </div>
    </div>
  );
};
