import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {useForm} from 'react-hook-form';
import {useParams, useNavigate} from 'react-router-dom';
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {Home, Key, MapPin, Upload, Image as ImageIcon, X, Loader2, AlertCircle} from 'lucide-react';
import {cn} from '@/lib/utils';
import {PROPERTY_TYPES} from '@/constants/propertyTypes';
import {LEGAL_DOCS} from '@/constants/legalDocs';
import {PROPERTY_FURNITURE} from '@/constants/propertyFurniture';
import {PROPERTY_DIRECTIONS} from '@/constants/propertyDirections';
import DraggableMarkerMap from '@/components/draggable-marker-map';
import type {Location} from '@/types/location.d.ts';
import {useDebounce} from 'use-debounce';
import type {PlacePrediction} from '@/types/place-prediction';
import {calculateDistance} from "@/utils/calculateDistance.ts";
import {MAX_DISTANCE_METERS} from "@/constants/mapConstants.ts";
import {toast} from "react-toastify";
import {placeAutocomplete, getPlaceDetails} from "@/services/goongAPIServices.ts";
import type {PropertyListing} from "@/types/property-listing";
import {getPropertyDetails as getPropertyDetailsAPI, updatePropertyListing} from "@/services/propertyServices.ts";
import {uploadImage} from "@/services/mediaServices.ts";

type DemandType = 'for_sale' | 'for_rent';

// Extend PropertyListing with UI-only fields for form management
type EditPostForm = PropertyListing & {
    addressInput: string;
    newImages: File[];  // New images to upload
    existingImageUrls: string[];  // URLs from API
};

export const EditPost: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [selectedDemand, setSelectedDemand] = useState<DemandType>('for_sale');
    const [mapLocation, setMapLocation] = useState<Location | null>(null);
    const [originalLocation, setOriginalLocation] = useState<Location | null>(null);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Autocomplete states
    const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [addressSelected, setAddressSelected] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastTrimmedAddressRef = useRef<string>('');

    const form = useForm<EditPostForm>({
        defaultValues: {
            title: "",
            description: "",
            listingType: "for_sale",
            price: 0,
            priceUnit: "VND",
            area: 0,
            propertyType: "house",
            legalStatus: null,
            numBedrooms: null,
            numBathrooms: null,
            numFloors: null,
            facadeWidthM: null,
            roadWidthM: null,
            houseDirection: null,
            balconyDirection: null,
            furnitureStatus: null,
            projectName: null,
            buildingBlock: null,
            floorNumber: null,
            addressStreet: null,
            addressWard: "",
            addressDistrict: "",
            addressCity: "TPHCM",
            location: {
                type: "Point",
                coordinates: [0, 0],
            },
            imageUrls: null,
            features: null,
            tagNames: null,
            // UI-only fields
            addressInput: "",
            newImages: [],
            existingImageUrls: [],
        },
        mode: 'onSubmit',
    });

    // Watch addressInput from form
    const addressInput = form.watch('addressInput');

    // Debounce address value with 300ms delay
    const [debouncedAddress] = useDebounce(addressInput, 300);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) &&
                inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
            console.error('Error fetching autocomplete:', error);
            setSuggestions([]);
        } finally {
            setIsLoadingAddress(false);
        }
    }, []);

    // Fetch autocomplete suggestions when debounced address changes
    useEffect(() => {
        const trimmedAddress = debouncedAddress.trim();
        if (!trimmedAddress || trimmedAddress.length < 3 || addressSelected) {
            setSuggestions([]);
            setShowSuggestions(false);
            lastTrimmedAddressRef.current = '';
            return;
        }
        if (trimmedAddress === lastTrimmedAddressRef.current) {
            return;
        }
        lastTrimmedAddressRef.current = trimmedAddress;
        fetchAutocompleteSuggestions(trimmedAddress);
    }, [debouncedAddress, fetchAutocompleteSuggestions, addressSelected]);

    // Hide map when user manually changes address (not from suggestion)
    useEffect(() => {
        if (!addressSelected && mapLocation) {
            // User is typing or changed the address manually, hide the map
            setMapLocation(null);
            setOriginalLocation(null);
            form.setValue('location', {
                type: "Point",
                coordinates: [0, 0]
            });
        }
    }, [addressSelected, mapLocation, form]);

    const fetchPlaceDetail = async (placeId: string) => {
        setIsLoadingAddress(true);
        try {
            const data = await getPlaceDetails(placeId);
            if (data.result && data.result.geometry && data.result.geometry.location) {
                const {lat, lng} = data.result.geometry.location;
                const location: Location = {
                    latitude: lat,
                    longitude: lng,
                    address: data.result.formatted_address
                };
                setMapLocation(location);
                setOriginalLocation(location);
                form.setValue('location', {
                    type: "Point",
                    coordinates: [lng, lat]
                });
                return {lat, lng};
            }
        } catch (error) {
            console.error('Error fetching place details:', error);
            alert('Không thể lấy tọa độ của địa chỉ này');
        } finally {
            setIsLoadingAddress(false);
        }
        return null;
    };

    const handleSelectSuggestion = async (prediction: PlacePrediction) => {
        setAddressSelected(true); // Mark as selected from suggestion
        form.setValue('addressInput', prediction.description);
        setShowSuggestions(false);
        setSuggestions([]);

        // Extract address parts from description
        const parts = prediction.description.split(',').map(p => p.trim());
        if (parts.length >= 3) {
            const street = parts[0];
            const ward = parts[1];
            const district = parts[2];

            form.setValue('addressStreet', street);
            form.setValue('addressWard', ward);
            form.setValue('addressDistrict', district);
        }

        // Fetch place details to get coordinates
        await fetchPlaceDetail(prediction.place_id);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSelectSuggestion(suggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                break;
        }
    };

    const handleLocationChange = (newLocation: Location) => {
        setMapLocation(newLocation);
        form.setValue('location', {
            type: "Point",
            coordinates: [newLocation.longitude, newLocation.latitude]
        });
    };

    // Calculate distance from original location
    const distanceFromOriginal = useMemo(() => {
        if (!originalLocation || !mapLocation) return 0;
        return calculateDistance(
            originalLocation.latitude,
            originalLocation.longitude,
            mapLocation.latitude,
            mapLocation.longitude
        );
    }, [originalLocation, mapLocation]);

    // Check if location is valid (within 100m)
    const isLocationValid = distanceFromOriginal <= MAX_DISTANCE_METERS;

    // Load post data from API
    useEffect(() => {
        const loadPostData = async () => {
            if (!id) {
                toast.error('ID bài đăng không hợp lệ');
                navigate('/tin-dang');
                return;
            }

            try {
                setIsLoading(true);

                // Call API to get property details
                const response = await getPropertyDetailsAPI(id);

                // response.data contains PropertyListing
                const propertyData: PropertyListing = response.data;

                console.log('Loaded property data:', propertyData);

                // Set demand type from listingType
                setSelectedDemand(propertyData.listingType as DemandType);

                // Construct full address for display
                const fullAddress = `${propertyData.addressStreet || ''}, ${propertyData.addressWard}, ${propertyData.addressDistrict}, ${propertyData.addressCity}`.trim();

                // Set map location and mark address as selected (from API)
                if (propertyData.location && propertyData.location.coordinates) {
                    const location: Location = {
                        latitude: propertyData.location.coordinates[1],  // coordinates[1] is latitude
                        longitude: propertyData.location.coordinates[0], // coordinates[0] is longitude
                        address: fullAddress
                    };
                    setMapLocation(location);
                    setOriginalLocation(location);
                    setAddressSelected(true); // Mark as already selected since it's from API
                }

                // Reset form with all data from API
                form.reset({
                    ...propertyData,
                    addressInput: fullAddress,
                    newImages: [],
                    existingImageUrls: propertyData.imageUrls || [],
                });
            } catch (error) {
                console.error('Error loading post data:', error);
                toast.error('Không thể tải dữ liệu tin đăng');

                // Navigate back to my posts after showing error
                setTimeout(() => {
                    navigate('/tin-dang');
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            loadPostData();
        }
    }, [id, navigate, form]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const existingImageUrls = form.getValues('existingImageUrls');
        const currentNewImages = form.getValues('newImages');
        const totalImages = existingImageUrls.length + currentNewImages.length;
        const availableSlots = 10 - totalImages;

        if (availableSlots <= 0) {
            toast.error('Bạn chỉ có thể tải lên tối đa 10 ảnh');
            return;
        }

        const filesToAdd = newFiles.slice(0, availableSlots);

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = filesToAdd.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            toast.error('Chỉ chấp nhận file ảnh định dạng JPG, PNG, WEBP');
            return;
        }

        // Validate file sizes (max 5MB per image)
        const oversizedFiles = filesToAdd.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error('Kích thước mỗi ảnh không được vượt quá 5MB');
            return;
        }

        const updatedNewImages = [...currentNewImages, ...filesToAdd];
        form.setValue('newImages', updatedNewImages);

        // Create previews for new images
        filesToAdd.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        event.target.value = '';
    };

    const handleRemoveImage = (index: number, isExisting: boolean) => {
        if (isExisting) {
            // Remove from existing images (URLs)
            const updatedExisting = form.getValues('existingImageUrls').filter((_, i) => i !== index);
            form.setValue('existingImageUrls', updatedExisting);
        } else {
            // Remove from new images (Files)
            const existingImageUrls = form.getValues('existingImageUrls');
            const adjustedIndex = index - existingImageUrls.length;
            const updatedNewImages = form.getValues('newImages').filter((_, i) => i !== adjustedIndex);
            const updatedPreviews = newImagePreviews.filter((_, i) => i !== adjustedIndex);

            form.setValue('newImages', updatedNewImages);
            setNewImagePreviews(updatedPreviews);
        }
    };

    const onSubmit = async (data: EditPostForm) => {
        try {
            setIsSubmitting(true);

            const {newImages, existingImageUrls, ...propertyData} = data;
            let finalImageUrls = [...existingImageUrls];

            if (newImages.length > 0) {
                const uploadPromises = newImages.map(file => uploadImage(file));
                const uploadResponses = await Promise.all(uploadPromises);
                const newUploadedUrls = uploadResponses.map(response => response.data.mediaUrl);
                finalImageUrls = [...existingImageUrls, ...newUploadedUrls];
            }

            const finalData: PropertyListing = {
                ...propertyData,
                imageUrls: finalImageUrls,
            };

            await updatePropertyListing(Number(id), finalData);

            toast.success('Cập nhật tin đăng thành công!');

            setTimeout(() => {
                navigate('/tin-dang');
            }, 500);

        } catch (error) {
            console.error('Error updating property:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto space-y-6 py-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-[#008DDA]"/>
                        <p className="text-lg text-gray-600">Đang tải dữ liệu tin đăng...</p>
                        <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-3xl font-semibold mb-2">Chỉnh sửa tin đăng</h1>
                <p className="text-gray-600">
                    Cập nhật thông tin chi tiết về bất động sản của bạn
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
                                    setSelectedDemand('for_sale');
                                    form.setValue('listingType', 'for_sale');
                                }}
                                className={cn(
                                    "p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                                    "hover:shadow-lg active:scale-[0.98]",
                                    selectedDemand === 'for_sale'
                                        ? "border-[#008DDA] bg-[#008DDA]/5 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                        selectedDemand === 'for_sale'
                                            ? "bg-[#008DDA] text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        <Home className="w-8 h-8"/>
                                    </div>
                                    <div className="text-center">
                                        <h3 className={cn(
                                            "text-lg font-semibold",
                                            selectedDemand === 'for_sale' ? "text-[#008DDA]" : "text-gray-700"
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
                                    setSelectedDemand('for_rent');
                                    form.setValue('listingType', 'for_rent');
                                }}
                                className={cn(
                                    "p-6 rounded-lg border-2 transition-all duration-200 cursor-pointer",
                                    "hover:shadow-lg active:scale-[0.98]",
                                    selectedDemand === 'for_rent'
                                        ? "border-[#008DDA] bg-[#008DDA]/5 shadow-md"
                                        : "border-gray-200 hover:border-gray-300"
                                )}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
                                        selectedDemand === 'for_rent'
                                            ? "bg-[#008DDA] text-white"
                                            : "bg-gray-100 text-gray-600"
                                    )}>
                                        <Key className="w-8 h-8"/>
                                    </div>
                                    <div className="text-center">
                                        <h3 className={cn(
                                            "text-lg font-semibold",
                                            selectedDemand === 'for_rent' ? "text-[#008DDA]" : "text-gray-700"
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
                            Nhập địa chỉ của bất động sản và chọn vị trí chính xác trên bản đồ
                        </p>

                        {/* Address Autocomplete Input */}
                        <FormField
                            control={form.control}
                            name="addressInput"
                            rules={{
                                required: 'Địa chỉ không được để trống',
                                validate: () => {
                                    if (!addressSelected) {
                                        return 'Vui lòng chọn địa chỉ từ gợi ý';
                                    }
                                    return true;
                                }
                            }}
                            render={({field}) => (
                                <FormItem className="mb-6">
                                    <FormLabel className="text-base">Địa chỉ bất động sản</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                className="focus-visible:ring-[#008DDA] h-11"
                                                placeholder="Nhập địa chỉ (VD: 123 Nguyễn Huệ, Quận 1, TP.HCM)"
                                                {...field}
                                                ref={(e) => {
                                                    field.ref(e);
                                                    inputRef.current = e;
                                                }}
                                                onKeyDown={handleKeyDown}
                                                autoComplete="off"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setAddressSelected(false);
                                                    // Hide map immediately when user changes input
                                                    if (mapLocation) {
                                                        setMapLocation(null);
                                                        setOriginalLocation(null);
                                                        form.setValue('location', {
                                                            type: "Point",
                                                            coordinates: [0, 0]
                                                        });
                                                    }
                                                }}
                                            />

                                            {/* Loading indicator */}
                                            {isLoadingAddress && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Loader2 className="w-5 h-5 animate-spin text-[#008DDA]"/>
                                                </div>
                                            )}

                                            {/* Autocomplete suggestions dropdown */}
                                            {showSuggestions && suggestions.length > 0 && (
                                                <div
                                                    ref={suggestionRef}
                                                    className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto"
                                                >
                                                    {suggestions.map((prediction, index) => (
                                                        <div
                                                            key={prediction.place_id}
                                                            onClick={() => handleSelectSuggestion(prediction)}
                                                            className={cn(
                                                                "flex items-start gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0",
                                                                selectedIndex === index
                                                                    ? "bg-blue-50"
                                                                    : "hover:bg-gray-50"
                                                            )}
                                                        >
                                                            <MapPin
                                                                className="w-5 h-5 text-[#008DDA] flex-shrink-0 mt-0.5"/>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {prediction.structured_formatting.main_text}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-0.5 truncate">
                                                                    {prediction.structured_formatting.secondary_text}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Map Location Picker - Only shown when address is selected */}
                        {mapLocation && (
                            <div className="mt-6 pt-6 border-t space-y-4">
                                <div>
                                    <h3 className="text-base font-semibold mb-1">
                                        Chọn vị trí chính xác trên bản đồ <span className="text-red-500">*</span>
                                    </h3>
                                </div>

                                {/* Map */}
                                <div className={cn(
                                    "rounded-lg overflow-hidden border-2",
                                    !isLocationValid ? "border-red-300" : "border-gray-300"
                                )}>
                                    <DraggableMarkerMap
                                        location={mapLocation}
                                        onLocationChange={handleLocationChange}
                                        defaultZoom={16}
                                        height="500px"
                                        showNavigation={true}
                                    />
                                </div>
                                {/* Validation Messages */}
                                {!isLocationValid && distanceFromOriginal > 0 && (
                                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mt-4">
                                        <div className="flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"/>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-semibold text-red-800 mb-1">
                                                    Vị trí không trùng khớp với địa chỉ ban đầu
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                )}
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Loại bất động sản <span className="text-red-500">*</span></FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0">
                                                    <SelectValue placeholder="Chọn loại bất động sản"/>
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
                                        <FormMessage/>
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
                                    render={({field}) => (
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
                                                            field.onChange(numericValue ? Number(numericValue) : 0);
                                                        }}
                                                    />
                                                </FormControl>
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m²
                                                </div>
                                            </div>
                                            <FormMessage/>
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
                                    render={({field}) => (
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
                                                            field.onChange(numericValue ? Number(numericValue) : 0);
                                                        }}
                                                        onBlur={(e) => {
                                                            // Format khi blur thay vì realtime
                                                            e.target.value = field.value ? Number(field.value).toLocaleString('vi-VN') : '';
                                                        }}
                                                        onFocus={(e) => {
                                                            // Show raw number khi focus
                                                            e.target.value = String(field.value || 0);
                                                        }}
                                                    />
                                                </FormControl>
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    VND
                                                </div>
                                            </div>
                                            <FormMessage/>
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
                                render={({field}) => (
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
                                        <FormMessage/>
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
                                render={({field}) => (
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
                                        <FormMessage/>
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
                                    name="legalStatus"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Giấy tờ pháp lý</FormLabel>
                                            <Select
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn loại giấy tờ"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {LEGAL_DOCS.map((doc) => (
                                                        <SelectItem key={doc.id} value={doc.name}>
                                                            {doc.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Furniture */}
                                <FormField
                                    control={form.control}
                                    name="furnitureStatus"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Nội thất</FormLabel>
                                            <Select
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn tình trạng nội thất"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_FURNITURE.map((furniture) => (
                                                        <SelectItem key={furniture.id} value={furniture.name}>
                                                            {furniture.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Bedrooms */}
                                <FormField
                                    control={form.control}
                                    name="numBedrooms"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Số phòng ngủ</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số phòng ngủ"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value ? Number(value) : null);
                                                    }}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Bathrooms */}
                                <FormField
                                    control={form.control}
                                    name="numBathrooms"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Số phòng tắm</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số phòng tắm"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value ? Number(value) : null);
                                                    }}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Floors */}
                                <FormField
                                    control={form.control}
                                    name="numFloors"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Số tầng</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Nhập số tầng"
                                                    className="focus-visible:ring-[#008DDA]"
                                                    onChange={(e) => {
                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                        field.onChange(value ? Number(value) : null);
                                                    }}
                                                    value={field.value ?? ''}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* House Direction */}
                                <FormField
                                    control={form.control}
                                    name="houseDirection"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hướng nhà</FormLabel>
                                            <Select
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className="cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0 w-full">
                                                        <SelectValue placeholder="Chọn hướng nhà"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_DIRECTIONS.map((direction) => (
                                                        <SelectItem key={direction.id} value={direction.name}>
                                                            {direction.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Balcony Direction */}
                                <FormField
                                    control={form.control}
                                    name="balconyDirection"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Hướng ban công</FormLabel>
                                            <Select
                                                value={field.value ?? undefined}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        className="w-full cursor-pointer focus:ring-[#008DDA] focus:ring-2 focus:ring-offset-0">
                                                        <SelectValue placeholder="Chọn hướng ban công"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {PROPERTY_DIRECTIONS.map((direction) => (
                                                        <SelectItem key={direction.id} value={direction.name}>
                                                            {direction.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Road Width */}
                                <FormField
                                    control={form.control}
                                    name="roadWidthM"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*\.?[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({field}) => (
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
                                                            field.onChange(value ? Number(value) : null);
                                                        }}
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m
                                                </div>
                                            </div>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                {/* Front Width */}
                                <FormField
                                    control={form.control}
                                    name="facadeWidthM"
                                    rules={{
                                        pattern: {
                                            value: /^[0-9]*\.?[0-9]*$/,
                                            message: 'Chỉ được nhập số',
                                        },
                                    }}
                                    render={({field}) => (
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
                                                            field.onChange(value ? Number(value) : null);
                                                        }}
                                                        value={field.value ?? ''}
                                                    />
                                                </FormControl>
                                                <div
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                    m
                                                </div>
                                            </div>
                                            <FormMessage/>
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
                            name="newImages"
                            rules={{
                                validate: () => {
                                    const existingImageUrls = form.getValues('existingImageUrls');
                                    const newImages = form.getValues('newImages');
                                    const totalImages = existingImageUrls.length + newImages.length;
                                    if (totalImages === 0) {
                                        return 'Vui lòng giữ lại hoặc tải lên ít nhất 1 ảnh';
                                    }
                                    if (totalImages > 10) {
                                        return 'Chỉ được có tối đa 10 ảnh';
                                    }
                                    return true;
                                }
                            }}
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="space-y-4">
                                            {/* Image Grid */}
                                            <div
                                                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {/* Existing Images from API (URLs) */}
                                                {form.watch('existingImageUrls').map((imageUrl, index) => (
                                                    <div
                                                        key={`existing-${index}`}
                                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Existing ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Image number badge */}
                                                        <div
                                                            className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                            {index === 0 ? 'Ảnh đại diện' : `${index + 1}`}
                                                        </div>
                                                        {/* Remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index, true)}
                                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* New Uploaded Images (Files) */}
                                                {newImagePreviews.map((preview, index) => (
                                                    <div
                                                        key={`new-${index}`}
                                                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-300 group"
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`New ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Image number badge */}
                                                        <div
                                                            className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                                            Mới {form.watch('existingImageUrls').length + index + 1}
                                                        </div>
                                                        {/* Remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(form.getValues('existingImageUrls').length + index, false)}
                                                            className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4"/>
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Upload Button */}
                                                {(form.watch('existingImageUrls').length + field.value.length) < 10 && (
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
                                                        <div
                                                            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                                            <Upload className="w-6 h-6 text-gray-600"/>
                                                        </div>
                                                        <div className="text-center px-2">
                                                            <p className="text-sm font-medium text-gray-700">
                                                                Tải ảnh lên
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {form.watch('existingImageUrls').length + field.value.length}/10
                                                            </p>
                                                        </div>
                                                    </label>
                                                )}
                                            </div>

                                            {/* Upload Instructions */}
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"/>
                                                    <div className="text-sm text-blue-800">
                                                        <p className="font-medium mb-1">Lưu ý khi tải ảnh:</p>
                                                        <ul className="list-disc list-inside space-y-1 text-xs">
                                                            <li>Định dạng: JPG, PNG, WEBP</li>
                                                            <li>Kích thước tối đa: 5MB/ảnh</li>
                                                            <li>Ảnh đầu tiên sẽ là ảnh đại diện</li>
                                                            <li>Nên chụp ảnh rõ nét, đầy đủ góc nhìn</li>
                                                            <li>Ảnh cũ có viền xám, ảnh mới có viền xanh</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Image count display */}
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-600">
                                                        Tổng: <span
                                                        className="font-semibold text-[#008DDA]">{form.watch('existingImageUrls').length + field.value.length}</span> ảnh
                                                    </span>
                                                    <span className="text-gray-500">
                                                        (Cũ: {form.watch('existingImageUrls').length}, Mới: {field.value.length})
                                                    </span>
                                                </div>
                                                <span className="text-gray-500">
                                                    Còn lại: {10 - form.watch('existingImageUrls').length - field.value.length} ảnh
                                                </span>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button - Sticky at bottom */}
                    <div className="sticky bottom-0 left-0 right-0 bg-white border-t shadow-lg rounded-lg p-4 z-50">
                        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                            <p className="text-sm text-gray-600 hidden sm:block">
                                {isSubmitting ? 'Đang xử lý...' : 'Vui lòng kiểm tra kỹ thông tin trước khi cập nhật'}
                            </p>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="cursor-pointer w-full sm:w-auto px-8 py-6 text-base font-semibold transition-all duration-200 bg-[#008DDA] hover:bg-[#0064A6] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin inline"/>
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    'Cập nhật tin đăng'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
