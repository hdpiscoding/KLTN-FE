//import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {PasswordInput} from "@/components/ui/input-password.tsx";

export const ForgotEmail = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            newPassword: "",
            confirmPassword: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();
    const onSubmit = (data: {
        email: string,
        newPassword: string,
        confirmPassword: string,
    }) => {
        // handle next
        console.log(data);
        navigate("/quen-mat-khau/otp");
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
                            required: "Mật khẩu không được để trống!",
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
                    <Button type="submit" className="w-full transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6]">
                        Tiếp theo
                    </Button>
                </form>
            </Form>
            <div className="mt-4 text-center text-sm">
                Đã có tài khoản?{" "}
                <a href="/login" className="text-[#518EE6] hover:underline hover:text-[#3A74C5]">
                    Đăng nhập tại đây.
                </a>
            </div>
        </>
    );
};