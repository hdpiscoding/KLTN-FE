import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';

type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export const ChangePassword: React.FC = () => {
    const form = useForm<ChangePasswordFormData>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        console.log('Change password data:', data);
        // TODO: Implement API call to change password
        alert('Mật khẩu đã được thay đổi thành công!');
        form.reset();
    };

    return (
        <div className="max-w-2xl mx-auto my-20">
            <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl font-semibold mb-2">Đổi mật khẩu</h1>
                <p className="text-gray-600 mb-6">
                    Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Current Password */}
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            rules={{
                                required: 'Mật khẩu hiện tại không được để trống',
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu hiện tại</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Nhập mật khẩu hiện tại"
                                            className="focus-visible:ring-[#008DDA]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* New Password */}
                        <FormField
                            control={form.control}
                            name="newPassword"
                            rules={{
                                required: 'Mật khẩu mới không được để trống',
                                minLength: {
                                    value: 6,
                                    message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu mới</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Nhập mật khẩu mới"
                                            className="focus-visible:ring-[#008DDA]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Confirm Password */}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            rules={{
                                required: 'Mật khẩu xác nhận không được để trống',
                                validate: (value) => {
                                    const newPassword = form.getValues('newPassword');
                                    return value === newPassword || 'Mật khẩu xác nhận không khớp';
                                },
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu xác nhận</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="Nhập lại mật khẩu mới"
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
        </div>
    );
};

