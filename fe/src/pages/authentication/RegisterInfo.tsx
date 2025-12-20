//import React from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";
import { PasswordInput } from "@/components/ui/input-password.tsx";
import React from "react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {register} from "@/services/authServices.ts";
import {toast} from "react-toastify";
import {useAuthStore} from "@/store/authStore.ts";

export const RegisterInfo = () => {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
            phoneNumber: "",
            fullName: "",
        },
        mode: "onSubmit",
    });
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);
    const registerData = useAuthStore((state) => state.register);
    const onSubmit = async (data: {
        email: string,
        password: string,
        phoneNumber: string,
        fullName: string
    }) => {
        // handle next
        setIsLoading(true);
        console.log(data);
        try {
            await register(data.email, data.password, data.phoneNumber, data.fullName);
            registerData(data.email, data.phoneNumber, data.fullName, data.password);
            navigate("/dang-ky/otp");
        }
        catch (error) {
            toast.error("Đã có lỗi ")
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
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
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{10,}$/,
                                message: "Mật khẩu phải có ít nhất 10 ký tự gồm chữ thường, chữ in hoa, số và ký tự đặc biệt!",
                            },
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