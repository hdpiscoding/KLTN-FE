import React, {useState} from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Home, Key, MapPin, Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { districtWards } from '@/constants/districtWard.ts';
import { PROPERTY_TYPES } from '@/constants/propertyTypes';
import { LEGAL_DOCS } from '@/constants/legalDocs';
import { PROPERTY_FURNITURE } from '@/constants/propertyFurniture';
import { PROPERTY_DIRECTIONS } from '@/constants/propertyDirections';

type DemandType = 'buy' | 'rent';

type CreatePostFormData = {
    demand: DemandType;
    province: string;
    district: string;
    ward: string;
    street: string;
    houseNumber: string;
    latitude: number | null;
    longitude: number | null;
    propertyType: string;
    area: string;
    price: string;
    title: string;
    description: string;
    // Optional fields
    legalDoc: string;
    furniture: string;
    bedrooms: string;
    bathrooms: string;
    floors: string;
    houseDirection: string;
    balconyDirection: string;
    roadWidth: string;
    frontWidth: string;
    images: File[];
};

export const CreatePost: React.FC = () => {
    const [selectedDemand, setSelectedDemand] = useState<DemandType>('buy');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [selectedWard, setSelectedWard] = useState<string>('');
    const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const form = useForm<CreatePostFormData>({
        defaultValues: {
            demand: 'buy',
            province: 'TP. Hồ Chí Minh',
            district: '',
            ward: '',
            street: '',
            houseNumber: '',
            latitude: null,
            longitude: null,
            propertyType: '',
            area: '',
            price: '',
            title: '',
            description: '',
            legalDoc: '',
            furniture: '',
            bedrooms: '',
            bathrooms: '',
            floors: '',
            houseDirection: '',
            balconyDirection: '',
            roadWidth: '',
            frontWidth: '',
            images: [],
        },
        mode: 'onChange',
    });

    // Get wards based on selected district
    const getWardsByDistrict = (districtId: string) => {
        const district = districtWards.find(d => d.id === districtId);
        return district?.ward || [];
    };

    const handleDistrictChange = (districtId: string) => {
        setSelectedDistrict(districtId);
        setSelectedWard(''); // Reset ward state
        setMapLocation(null); // Reset map location
        form.setValue('district', districtId);
        form.setValue('ward', ''); // Reset ward when district changes
        form.setValue('latitude', null);
        form.setValue('longitude', null);
    };

    const handleWardChange = (wardId: string) => {
        setSelectedWard(wardId);
        form.setValue('ward', wardId);
    };

    const handleMapLocationSelect = () => {
        // TODO: Implement actual map location picker
        // For now, set a dummy location
        const dummyLocation = { lat: 10.8231, lng: 106.6297 }; // Ho Chi Minh City center
        setMapLocation(dummyLocation);
        form.setValue('latitude', dummyLocation.lat);
        form.setValue('longitude', dummyLocation.lng);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const currentImages = uploadedImages.length;
        const availableSlots = 10 - currentImages;

        if (availableSlots <= 0) {
            alert('Bạn chỉ có thể tải lên tối đa 10 ảnh');
            return;
        }

        const filesToAdd = newFiles.slice(0, availableSlots);

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = filesToAdd.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            alert('Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP');
            return;
        }

        // Validate file sizes (max 5MB per image)
        const oversizedFiles = filesToAdd.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert('Kích thước mỗi ảnh không được vượt quá 5MB');
            return;
        }

        const updatedImages = [...uploadedImages, ...filesToAdd];
        setUploadedImages(updatedImages);
        form.setValue('images', updatedImages);

        // Create previews
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        event.target.value = '';
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

        setUploadedImages(updatedImages);
        setImagePreviews(updatedPreviews);
        form.setValue('images', updatedImages);
    };

    const onSubmit = async (data: CreatePostFormData) => {
        console.log('Create post data:', data);
        // TODO: Implement API call to create post
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-semibold mb-2">Đăng tin mới</h1>
                <p className="text-gray-600">
                    Điền thông tin chi tiết về bất động sản của bạn
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Section 1: Demand (Nhu cầu) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Nhu cầu <span className="text-red-500">*</span></h2>
                        <p className="text-sm text-gray-500 mb-4">
                            Bạn muốn đăng tin mua hay cho thuê?
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Buy Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDemand('buy');
                                    form.setValue('demand', 'buy');
                                }}
                                className={cn(
                                    "p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                                    "hover:shadow-lg active:scale-[0.98]",
                                    selectedDemand === 'buy'
                                        ? "border-[#008DDA] bg-[#008DDA]/5 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                        selectedDemand === 'buy'
                                            ? "bg-[#008DDA] text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        <Home className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className={cn(
                                            "text-lg font-semibold",
                                            selectedDemand === 'buy' ? "text-[#008DDA]" : "text-gray-700"
                                        )}>
                                            Mua
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Đăng tin bán bất động sản
                                        </p>
                                    </div>
                                </div>
                            </button>

                            {/* Rent Card */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedDemand('rent');
                                    form.setValue('demand', 'rent');
                                }}
                                className={cn(
                                    "p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                                    "hover:shadow-lg active:scale-[0.98]",
                                    selectedDemand === 'rent'
                                        ? "border-[#008DDA] bg-[#008DDA]/5 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                        selectedDemand === 'rent'
                                            ? "bg-[#008DDA] text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        <Key className="w-8 h-8" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className={cn(
                                            "text-lg font-semibold",
                                            selectedDemand === 'rent' ? "text-[#008DDA]" : "text-gray-700"
                                        )}>
                                            Cho thuê
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Đăng tin cho thuê bất động sản
                                        </p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Section 2: Address (Địa chỉ) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Địa chỉ <span className="text-red-500">*</span></h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Vui lòng cung cấp địa chỉ chính xác của bất động sản
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Province/City - Disabled */}
                            <FormField
                                control={form.control}
                                name="province"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tỉnh/Thành phố</FormLabel>
                                        <Select value={field.value} disabled>
                                            <FormControl>
                                                <SelectTrigger className="cursor-not-allowed opacity-75">
                                                    <SelectValue placeholder="Chọn tỉnh/thành phố" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* District */}
                            <FormField
                                control={form.control}
                                name="district"
                                rules={{
                                    required: 'Vui lòng chọn quận/huyện',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quận/Huyện <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleDistrictChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0">
                                                    <SelectValue placeholder="Chọn quận/huyện" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {districtWards.map((district) => (
                                                    <SelectItem key={district.id} value={district.id}>
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Ward */}
                            <FormField
                                control={form.control}
                                name="ward"
                                rules={{
                                    required: 'Vui lòng chọn phường/xã',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phường/Xã <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={handleWardChange}
                                            disabled={!selectedDistrict}
                                        >
                                            <FormControl>
                                                <SelectTrigger className={cn("cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0",
                                                    !selectedDistrict && "cursor-not-allowed opacity-50"
                                                )}>
                                                    <SelectValue placeholder="Chọn phường/xã" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {getWardsByDistrict(selectedDistrict).map((ward) => (
                                                    <SelectItem key={ward.id} value={ward.id}>
                                                        {ward.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Street */}
                            <FormField
                                control={form.control}
                                name="street"
                                rules={{
                                    required: 'Vui lòng nhập tên đường',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Đường <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập tên đường"
                                                className="focus-visible:ring-[#008DDA]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* House Number */}
                            <FormField
                                control={form.control}
                                name="houseNumber"
                                rules={{
                                    required: 'Vui lòng nhập số nhà',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Số nhà <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Nhập số nhà"
                                                className="focus-visible:ring-[#008DDA]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Map Location Picker - Only shown when district and ward are selected */}
                        {selectedDistrict && selectedWard && (
                            <div className="mt-6 pt-6 border-t">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    rules={{
                                        required: 'Vui lòng chọn vị trí trên bản đồ',
                                        validate: (value) => value !== null || 'Vui lòng chọn vị trí trên bản đồ'
                                    }}
                                    render={() => (
                                        <FormItem>
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <FormLabel className="text-base font-semibold">
                                                        Chọn vị trí trên bản đồ <span className="text-red-500">*</span>
                                                    </FormLabel>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Đánh dấu chính xác vị trí bất động sản trên bản đồ
                                                    </p>
                                                </div>
                                                {mapLocation && (
                                                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="text-sm font-medium">Đã chọn vị trí</span>
                                                    </div>
                                                )}
                                            </div>
                                            <FormControl>
                                                <div className="space-y-3">
                                                    {/* Map Placeholder */}
                                                    <div
                                                        className={cn(
                                                            "w-full h-96 rounded-lg border-2 flex flex-col items-center justify-center relative overflow-hidden",
                                                            mapLocation
                                                                ? "border-green-300 bg-green-50"
                                                                : "border-gray-300 bg-gray-50"
                                                        )}
                                                    >
                                                        {/* Placeholder gradient background */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100"></div>

                                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                                            <div className={cn(
                                                                "w-20 h-20 rounded-full flex items-center justify-center",
                                                                mapLocation ? "bg-green-200" : "bg-blue-200"
                                                            )}>
                                                                <MapPin className={cn(
                                                                    "w-10 h-10",
                                                                    mapLocation ? "text-green-600" : "text-blue-600"
                                                                )} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-gray-700 font-medium text-lg">
                                                                    {mapLocation
                                                                        ? "Vị trí đã được chọn"
                                                                        : "Google Maps sẽ được tích hợp tại đây"
                                                                    }
                                                                </p>
                                                                {mapLocation && (
                                                                    <p className="text-sm text-gray-500 mt-2">
                                                                        Tọa độ: {mapLocation.lat.toFixed(6)}, {mapLocation.lng.toFixed(6)}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Decorative grid pattern */}
                                                        <div className="absolute inset-0 opacity-5">
                                                            <div className="w-full h-full" style={{
                                                                backgroundImage: `
                                                                    linear-gradient(to right, #008DDA 1px, transparent 1px),
                                                                    linear-gradient(to bottom, #008DDA 1px, transparent 1px)
                                                                `,
                                                                backgroundSize: '40px 40px'
                                                            }}></div>
                                                        </div>
                                                    </div>

                                                    {/* Select Location Button */}
                                                    <Button
                                                        type="button"
                                                        onClick={handleMapLocationSelect}
                                                        className={cn(
                                                            "w-full transition-colors duration-200",
                                                            mapLocation
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : "bg-[#008DDA] hover:bg-[#0064A6]"
                                                        )}
                                                    >
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        {mapLocation ? "Chọn lại vị trí" : "Chọn vị trí trên bản đồ"}
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    {/* Section 3: Main Information (Thông tin chính) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin chính</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Cung cấp thông tin chi tiết về bất động sản của bạn
                        </p>

                        <div className="space-y-6">
                            {/* Property Type */}
                            <FormField
                                control={form.control}
                                name="propertyType"
                                rules={{
                                    required: 'Vui lòng chọn loại bất động sản',
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại bất động sản <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0">
                                                    <SelectValue placeholder="Chọn loại bất động sản" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {PROPERTY_TYPES.map((type) => (
                                                    <SelectItem key={type.id} value={type.id}>
                                                        {type.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Area */}
                                <FormField
                                    control={form.control}
                                    name="area"
                                    rules={{
                                        required: 'Vui lòng nhập diện tích',
                                        pattern: {
                                            value: /^[0-9]+(\.[0-9]+)?$/,
                                            message: 'Diện tích phải là số hợp lệ',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Diện tích <span className="text-red-500">*</span></FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập diện tích"
                                                        className="focus-visible:ring-[#008DDA] pr-16"
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const numericValue = e.target.value.replace(/\D/g, '');
                                                            field.onChange(numericValue);
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m²
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Price */}
                                <FormField
                                    control={form.control}
                                    name="price"
                                    rules={{
                                        required: 'Vui lòng nhập mức giá',
                                        pattern: {
                                            value: /^[0-9]+$/,
                                            message: 'Mức giá chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mức giá <span className="text-red-500">*</span></FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập mức giá"
                                                        className="focus-visible:ring-[#008DDA] pr-16"
                                                        value={field.value || ''}
                                                        onChange={(e) => {
                                                            const numericValue = e.target.value.replace(/\D/g, '');
                                                            field.onChange(numericValue);
                                                        }}
                                                        onBlur={(e) => {
                                                            // Format khi blur thay vì realtime
                                                            e.target.value = field.value ? Number(field.value).toLocaleString('vi-VN') : '';
                                                        }}
                                                        onFocus={(e) => {
                                                            // Show raw number khi focus
                                                            e.target.value = field.value || '';
                                                        }}
                                                    />
                                                </FormControl>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    VND
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                rules={{
                                    required: 'Vui lòng nhập tiêu đề',
                                    minLength: {
                                        value: 10,
                                        message: 'Tiêu đề phải có ít nhất 10 ký tự',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Tiêu đề không được vượt quá 100 ký tự',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tiêu đề <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="VD: Căn hộ 2 phòng ngủ view sông, full nội thất, giá tốt"
                                                className="focus-visible:ring-[#008DDA]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {field.value.length}/100 ký tự
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                rules={{
                                    required: 'Vui lòng nhập mô tả',
                                    minLength: {
                                        value: 50,
                                        message: 'Mô tả phải có ít nhất 50 ký tự',
                                    },
                                    maxLength: {
                                        value: 2000,
                                        message: 'Mô tả không được vượt quá 2000 ký tự',
                                    },
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mô tả <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="VD: Căn hộ nằm tại tầng cao, view thoáng mát hướng sông. Nội thất đầy đủ bao gồm: phòng khách, bếp, 2 phòng ngủ có giường tủ, máy lạnh. Khu vực an ninh 24/7, có hồ bơi, phòng gym..."
                                                className="focus-visible:ring-[#008DDA] min-h-32 resize-y"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {field.value.length}/2000 ký tự
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Section 4: Additional Information (Thông tin khác) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">Thông tin khác</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Các thông tin bổ sung giúp mô tả chi tiết hơn về bất động sản (không bắt buộc)
                        </p>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Legal Documents */}
                                <FormField
                                    control={form.control}
                                    name="legalDoc"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Giấy tờ pháp lý</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn loại giấy tờ" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LEGAL_DOCS.map((doc) => (
                                                        <SelectItem key={doc.id} value={doc.id.toString()}>
                                                            {doc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Furniture */}
                                <FormField
                                    control={form.control}
                                    name="furniture"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nội thất</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn tình trạng nội thất" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_FURNITURE.map((furniture) => (
                                                        <SelectItem key={furniture.id} value={furniture.id.toString()}>
                                                            {furniture.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Bedrooms */}
                                <FormField
                                    control={form.control}
                                    name="bedrooms"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số phòng ngủ</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số phòng ngủ"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Bathrooms */}
                                <FormField
                                    control={form.control}
                                    name="bathrooms"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số phòng tắm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số phòng tắm"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Floors */}
                                <FormField
                                    control={form.control}
                                    name="floors"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Số tầng</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số tầng"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* House Direction */}
                                <FormField
                                    control={form.control}
                                    name="houseDirection"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hướng nhà</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn hướng nhà" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_DIRECTIONS.map((direction) => (
                                                        <SelectItem key={direction.id} value={direction.id.toString()}>
                                                            {direction.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Balcony Direction */}
                                <FormField
                                    control={form.control}
                                    name="balconyDirection"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Hướng ban công</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0">
                                                        <SelectValue placeholder="Chọn hướng ban công" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_DIRECTIONS.map((direction) => (
                                                        <SelectItem key={direction.id} value={direction.id.toString()}>
                                                            {direction.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Road Width */}
                                <FormField
                                    control={form.control}
                                    name="roadWidth"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*\.?[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Đường vào</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập độ rộng đường vào"
                                                        className="focus-visible:ring-[#008DDA] pr-10"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9.]/g, '');
                                                            field.onChange(value);
                                                        }}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Front Width */}
                                <FormField
                                    control={form.control}
                                    name="frontWidth"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*\.?[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mặt tiền</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        type="text"
                                                        placeholder="Nhập độ rộng mặt tiền"
                                                        className="focus-visible:ring-[#008DDA] pr-10"
                                                        onChange={(e) => {
                                                            const value = e.target.value.replace(/[^0-9.]/g, '');
                                                            field.onChange(value);
                                                        }}
                                                        value={field.value}
                                                    />
                                                </FormControl>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m
                                                </div>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Images (Hình ảnh) */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Hình ảnh <span className="text-red-500">*</span>
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Tải lên ít nhất 1 ảnh và tối đa 10 ảnh. Ảnh đầu tiên sẽ là ảnh đại diện.
                        </p>

                        <FormField
                            control={form.control}
                            name="images"
                            rules={{
                                validate: (value) => {
                                    if (!value || value.length === 0) {
                                        return 'Vui lòng tải lên ít nhất 1 ảnh';
                                    }
                                    if (value.length > 10) {
                                        return 'Chỉ được tải lên tối đa 10 ảnh';
                                    }
                                    return true;
                                }
                            }}
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {/* Image Grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {/* Uploaded Images */}
                                                {imagePreviews.map((preview, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Image number badge */}
                                                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                            {index === 0 ? 'Ảnh đại diện' : `${index + 1}`}
                                                        </div>
                                                        {/* Remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Upload Button */}
                                                {uploadedImages.length < 10 && (
                                                    <label
                                                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-[#008DDA] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-blue-50"
                                                    >
                                                        <input
                                                            type="file"
                                                            multiple
                                                            accept="image/jpeg,image/jpg,image/png,image/webp"
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                        />
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Upload className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                        <div className="text-center px-2">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Tải ảnh lên
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {uploadedImages.length}/10
                                                            </p>
                                                        </div>
                                                    </label>
                                                )}
                                            </div>

                                            {/* Upload Instructions */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm text-blue-800">
                                                        <p className="font-medium mb-1">Lưu ý khi tải ảnh:</p>
                                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                                            <li>Định dạng: JPG, PNG, WEBP</li>
                                                            <li>Kích thước tối đa: 5MB/ảnh</li>
                                                            <li>Ảnh đầu tiên sẽ là ảnh đại diện</li>
                                                            <li>Nên chụp ảnh rõ nét, đầy đủ góc nhìn</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image count display */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Đã tải: <span className="font-semibold text-[#008DDA]">{uploadedImages.length}</span> ảnh
                                                </span>
                                                <span className="text-gray-500">
                                                    Còn lại: {10 - uploadedImages.length} ảnh
                                                </span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button - Sticky at bottom */}
                    <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg rounded-lg p-4 z-50">
                        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                            <p className="text-sm text-gray-600 hidden sm:block">
                                Vui lòng kiểm tra kỹ thông tin trước khi đăng tin
                            </p>
                            <Button
                                type="submit"
                                className="cursor-pointer w-full sm:w-auto px-8 py-6 text-base font-semibold transition-all duration-200 bg-[#008DDA] hover:bg-[#0064A6] shadow-md hover:shadow-lg"
                            >
                                Đăng tin
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
