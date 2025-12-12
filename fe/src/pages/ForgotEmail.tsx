/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/input-password.tsx";
import { forgotPassword } from "@/services/authServices";
import { useAuthStore } from "@/store/authStore";
import { toast } from "react-toastify";
import {Spinner} from "@/components/ui/spinner.tsx";

export const ForgotEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { forgotPassword: saveForgotPassword } = useAuthStore();

    const form = useForm({
        defaultValues: {
            email: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();

    const onSubmit = async (data: {
        email: string,
        newPassword: string,
        confirmPassword: string,
    }) => {
        try {
            setIsLoading(true);

            // Call API to send OTP to email
            await forgotPassword(data.email);

            // Save email and password to authStore
            saveForgotPassword(data.email, data.newPassword);

            toast.success("Mã OTP đã được gửi đến email của bạn!");
            navigate("/quen-mat-khau/otp");
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const errorCode = error?.response?.data?.error?.code;
            const errorMessage = error?.response?.data?.error?.message;
            let displayMessage = "Gửi mã OTP thất bại. Vui lòng thử lại.";
            if (errorCode === 'USER_FORGOT_PASSWORD_UserNotFound') {
                displayMessage = 'Email người dùng không tồn tại.';
            } else if (errorMessage) {
                displayMessage = errorMessage;
            }
            toast.error(displayMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <p className="mb-8">
                Vui lòng nhập email đã liên kết với tài khoản của bạn để nhận mã OTP.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        rules={{
                            required: "Email không được để trống!",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Email không hợp lệ!",
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#008DDA]" placeholder="Nhập email của bạn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newPassword"
                        rules={{
                            required: "Mật khẩu mới không được để trống",
                            minLength: {
                                value: 8,
                                message: "Mật khẩu phải có ít nhất 8 ký tự",
                            },
                            maxLength: {
                                value: 30,
                                message: "Mật khẩu tối đa 30 ký tự",
                            },
                            validate: {
                                hasDigit: (value) => /\d/.test(value) || "Mật khẩu phải chứa ít nhất 1 chữ số",
                                hasUppercase: (value) => /[A-Z]/.test(value) || "Mật khẩu phải chứa ít nhất 1 chữ in hoa",
                                noNewline: (value) => !/[\n\r]/.test(value) || "Mật khẩu không được chứa ký tự xuống dòng",
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <FormControl>
                                    <PasswordInput className="focus-visible:ring-[#008DDA]" placeholder="Nhập mật khẩu mới" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        rules={{
                            required: "Mật khẩu xác nhận không được để trống!",
                            validate: (value, formValues) =>
                                value === formValues.newPassword || "Mật khẩu xác nhận không khớp!",
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <FormControl>
                                    <PasswordInput className="focus-visible:ring-[#008DDA]" placeholder="Nhập lại mật khẩu mới" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="h-2">

                    </div>
                    <Button type="submit" className={`w-full transition-colors duration-200 ${isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"} hover:bg-[#0064A6] `}>
                        {isLoading ? <Spinner/> : null}
                        Tiếp theo
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/dang-nhap" className="text-[#008DDA] hover:underline hover:text-[#0064A6]">
                    Đăng nhập tại đây.
                </a>
            </div>
        </>
    );
};