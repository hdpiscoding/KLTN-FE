import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/input-password";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {Spinner} from "@/components/ui/spinner.tsx";


export const Login = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const form = useForm({
        defaultValues: {
            email_phone: "",
            password: "",
        },
        mode: "onChange",
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        console.log(data);
    };

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return (
        <div className="bg-[#fff] w-screen h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                {/* App Icon Placeholder */}
                <div className="flex justify-center mb-4">
                    <img src="/src/assets/timnha-icon.png" className="w-[100px] h-[100px]" alt={"logo"}/>
                </div>
                <h2 className="text-4xl font-semibold text-center mb-6">ĐĂNG NHẬP</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email_phone"
                            rules={{
                                required: "Email/Số điện thoại không được để trống!",
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email/Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input className="focus-visible:ring-[#008DDA]" placeholder="Nhập email hoặc số điện thoại của bạn" {...field} />
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
                        <div className="flex justify-end">
                            <a href="/quen-mat-khau" className="text-sm mt-4 text-[#008DDA] hover:underline hover:text-[#0064A6]">
                                Quên mật khẩu?
                            </a>
                        </div>
                        <Button type="submit" className={`w-full transition-colors duration-200 ${isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"} hover:bg-[#0064A6] `}>
                            {isLoading ? <Spinner/> : null}
                            Đăng nhập
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm">
                    Chưa có tài khoản?{" "}
                    <a href="/dang-ky" className="text-[#008DDA] hover:underline hover:text-[#0064A6]">
                        Đăng ký tại đây.
                    </a>
                </div>
            </div>
        </div>
    );
};