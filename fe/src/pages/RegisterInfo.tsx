//import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/input-password";

export const RegisterInfo = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            phoneNumber: "",
            fullName: "",
        },
        mode: "onChange",
    });
    const navigate = useNavigate();
    const onSubmit = (data: {
        email: string,
        password: string,
        phoneNumber: string,
        fullName: string
    }) => {
        // handle next
        console.log(data);
        navigate("/register/otp");
    };

    return (
        <>
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
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#008DDA]" placeholder="Nhập số điện thoại của bạn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fullName"
                        rules={{
                            required: "Họ tên không được để trống!",
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ tên</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#008DDA]" placeholder="Nhập họ tên của bạn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        rules={{
                            required: "Mật khẩu không được để trống!",
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <PasswordInput className="focus-visible:ring-[#008DDA]" placeholder="Nhập mật khẩu của bạn" {...field} />
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