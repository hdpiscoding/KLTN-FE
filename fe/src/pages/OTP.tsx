/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner.tsx";
import {verifyEmail, register, resetPassword, forgotPassword} from "@/services/authServices.ts";
import {useAuthStore} from "@/store/authStore.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const OTP = ({from}: {from:string}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [countdown, setCountdown] = useState(120); // 2 phút = 120 giây
    const [isResending, setIsResending] = useState(false);

    const form = useForm({
        defaultValues: {
            otp: "",
        },
        mode: "onSubmit",
    });
    const navigate = useNavigate();
    const email = useAuthStore((state) => state.email);
    const clear = useAuthStore((state) => state.clear);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResendOTP = async () => {
        setIsResending(true);
        try {
            if (from === "register") {
                // Resend OTP for registration
                const {email, phoneNumber, fullName, password} = useAuthStore.getState();
                const response = await register(email ?? "", password ?? "", fullName ?? "", phoneNumber ?? "");
                if (response.status === "200") {
                    toast.success("Đã gửi lại mã OTP!");
                    setCountdown(120);
                }
            } else if (from === "forgot") {
                // Resend OTP for forgot password
                const {email} = useAuthStore.getState();
                const response = await forgotPassword(email ?? "");
                if (response.status === "200") {
                    toast.success("Đã gửi lại mã OTP!");
                    setCountdown(120);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Gửi lại OTP thất bại!");
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: {otp: string}) => {
        setIsLoading(true);

        try {
            if (from === "register") {
                // Handle registration OTP verification
                console.log("data: ", data.otp, " email: ", email ?? "");
                const response = await verifyEmail(email ?? "", data.otp);
                if (response.status === "200") {
                    toast.success("Đăng ký thành công!");
                    navigate("/dang-nhap");
                    clear();
                }
            } else if (from === "forgot") {
                // Handle forgot password OTP verification and reset password
                const {email, password} = useAuthStore.getState();
                console.log("Reset password - email:", email, "otp:", data.otp);

                const response = await resetPassword({
                    otp: data.otp,
                    newPassword: password ?? "",
                    email: email ?? ""
                });

                if (response.status === "200") {
                    toast.success("Đặt lại mật khẩu thành công!");
                    navigate("/dang-nhap");
                    clear();
                }
            }
        }
        catch (error: any) {
            console.log(error);

            // Extract error message from response
            const errorCode = error?.response?.data?.error?.code;
            const errorMessage = error?.response?.data?.error?.message;

            let displayMessage = "OTP đã hết hạn hoặc không chính xác!";

            if (errorCode === "USER_VERIFY_EMAIL_InvalidOtp" || errorCode === "USER_FORGOT_PASSWORD_InvalidOtp") {
                displayMessage = "OTP đã hết hạn hoặc không chính xác!";
            } else if (errorMessage) {
                displayMessage = errorMessage;
            }

            toast.error(displayMessage);
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
                        name="otp"
                        rules={{
                            required: "OTP không được để trống!",
                            pattern: {
                                value: /^\d{6}$/,
                                message: "OTP phải gồm 6 chữ số!",
                            },
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
                                <FormControl>
                                    <Input className="focus-visible:ring-[#518EE6]" placeholder="Nhập mã OTP" {...field} />
                                </FormControl>
                                <FormMessage />
                                <div className="mr-2 text-[0.825rem] text-end text-gray-600 mt-2">
                                    {countdown > 0 ? (
                                        <span>Gửi lại OTP {formatTime(countdown)}</span>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleResendOTP}
                                            disabled={isResending}
                                            className="text-[#008DDA] hover:underline disabled:opacity-50 cursor-pointer"
                                        >
                                            {isResending ? "Đang gửi..." : "Gửi lại"}
                                        </button>
                                    )}
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="h-2">

                    </div>
                    <Button type="submit" className={`w-full transition-colors duration-200 ${isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"} hover:bg-[#0064A6] `}>
                        {isLoading ? <Spinner/> : null}
                        {from === "register" ? "Đăng ký" : "Xác nhận"}
                    </Button>
                </form>
            </Form>
        </>
    );
};