/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/input-password';
import { Button } from '@/components/ui/button';
import { toast } from "react-toastify";
import { changePassword } from '@/services/userServices';

type ChangePasswordFormData = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export const ChangePassword: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ChangePasswordFormData>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onSubmit',
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        try {
            setIsLoading(true);
            await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });
            toast.success('Mật khẩu đã được thay đổi thành công!');
            form.reset();
        } catch (error: any) {
            console.error('Change password error:', error);
            const errorCode = error?.response?.data?.error?.code;
            const errorMessage = error?.response?.data?.error?.message;
            let displayMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
            if (errorCode === 'PASSWORD_INCORRECT') {
                displayMessage = 'Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.';
            } else if (errorMessage) {
                displayMessage = errorMessage;
            }
            toast.error(displayMessage);
        } finally {
            setIsLoading(false);
        }
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
                            name="oldPassword"
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
                                    value: 8,
                                    message: 'Mật khẩu phải có ít nhất 8 ký tự',
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'Mật khẩu tối đa 30 ký tự',
                                },
                                validate: {
                                    hasDigit: (value) => /\d/.test(value) || 'Mật khẩu phải chứa ít nhất 1 chữ số',
                                    hasUppercase: (value) => /[A-Z]/.test(value) || 'Mật khẩu phải chứa ít nhất 1 chữ in hoa',
                                    noNewline: (value) => !/[\n\r]/.test(value) || 'Mật khẩu không được chứa ký tự xuống dòng',
                                }
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
                                disabled={isLoading}
                                className="cursor-pointer w-full sm:w-auto transition-colors duration-200 bg-[#008DDA] hover:bg-[#0064A6] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

