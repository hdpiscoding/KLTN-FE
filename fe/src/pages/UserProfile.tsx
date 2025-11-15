import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { User, Upload, Shield, Heart, GraduationCap, ShoppingBag, Car, Leaf, Music } from 'lucide-react';

type UserProfileFormData = {
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
};

type PreferenceFormData = {
    security: number;
    healthcare: number;
    education: number;
    amenities: number;
    transportation: number;
    environment: number;
    entertainment: number;
};

export const UserProfile: React.FC = () => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const form = useForm<UserProfileFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            phoneNumber: '',
            address: '',
        },
        mode: 'onSubmit',
    });

    const preferenceForm = useForm<PreferenceFormData>({
        defaultValues: {
            security: 50,
            healthcare: 50,
            education: 50,
            amenities: 50,
            transportation: 50,
            environment: 50,
            entertainment: 50,
        },
        mode: 'onChange',
    });

    // Helper function to get preference level label
    const getPreferenceLabel = (value: number): string => {
        if (value === 0) return 'Không quan trọng';
        if (value <= 25) return 'Ít quan trọng';
        if (value <= 50) return 'Bình thường';
        if (value <= 75) return 'Quan trọng';
        return 'Rất quan trọng';
    };

    // Helper function to get label color
    const getLabelColor = (value: number): string => {
        if (value === 0) return 'text-gray-400';
        if (value <= 25) return 'text-gray-500';
        if (value <= 50) return 'text-black';
        if (value <= 75) return 'text-orange-500';
        return 'text-[#008DDA]';
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Chỉ chấp nhận file .png, .jpg, .jpeg, .webp');
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

    const onSubmit = async (data: UserProfileFormData) => {
        console.log('Profile data:', data);
        console.log('Avatar file:', avatarFile);
        // TODO: Implement API call to update profile
        alert('Cập nhật thông tin thành công!');
    };

    const onSubmitPreferences = async (data: PreferenceFormData) => {
        console.log('Preference data:', data);
        // TODO: Implement API call to update preferences
        alert('Lưu cài đặt ưu tiên thành công!');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Section 1: Personal Profile */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold mb-6">Hồ sơ cá nhân</h2>

                {/* Avatar Upload */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-6 border-b">
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
                        <label htmlFor="avatar-upload">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
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

                {/* Profile Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập họ tên của bạn"
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
                                    message: 'Email không đúng định dạng',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="example@email.com"
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
                                    message: 'Số điện thoại phải gồm đúng 10 chữ số',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            placeholder="0123456789"
                                            className="focus-visible:ring-[#008DDA]"
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
                                        <Input
                                            placeholder="Nhập địa chỉ của bạn"
                                            className="focus-visible:ring-[#008DDA]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="cursor-pointer w-full sm:w-auto transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6]"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Section 2: Preference Settings */}
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h2 className="text-2xl font-semibold mb-2">Cài đặt ưu tiên</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Hãy cho chúng tôi biết điều gì là quan trọng nhất với bạn. Hệ thống sẽ sử dụng các ưu tiên này để tính toán "Điểm của bạn" cho mỗi bất động sản.
                </p>

                <Form {...preferenceForm}>
                    <form onSubmit={preferenceForm.handleSubmit(onSubmitPreferences)} className="space-y-8">

                        {/* Security Slider */}
                        <FormField
                            control={preferenceForm.control}
                            name="security"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                <Shield className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <FormLabel className="text-base font-semibold">An ninh</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Độ an toàn của khu vực, camera, bảo vệ</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                                                <FormLabel className="text-base font-semibold">Y tế</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Bệnh viện, phòng khám gần khu vực</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                                                <FormLabel className="text-base font-semibold">Giáo dục</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Trường học, trung tâm đào tạo</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                            name="amenities"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <ShoppingBag className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <FormLabel className="text-base font-semibold">Tiện ích</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Chợ, siêu thị, nhà hàng, cửa hàng</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                                                <FormLabel className="text-base font-semibold">Giao thông</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Xe buýt, metro, gần trục đường chính</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                                                <FormLabel className="text-base font-semibold">Môi trường</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Công viên, cây xanh, không khí trong lành</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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
                                                <FormLabel className="text-base font-semibold">Giải trí</FormLabel>
                                                <p className="text-xs text-gray-500 mt-0.5">Rạp chiếu phim, khu vui chơi, gym</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-sm font-semibold ${getLabelColor(field.value)}`}>
                                                {getPreferenceLabel(field.value)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-0.5">{field.value}%</div>
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

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <Button
                                type="submit"
                                className="cursor-pointer w-full sm:w-auto transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6]"
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

