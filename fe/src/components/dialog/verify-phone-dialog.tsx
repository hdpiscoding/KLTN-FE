import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Phone } from "lucide-react";
import { verifyPhoneNumberSendOtp } from "@/services/userServices.ts";
import { toast } from "react-toastify";
import { convertPhoneNumber } from "@/utils/generalFormat.ts";

interface VerifyPhoneDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    phoneNumber?: string;
    onVerify?: (otp: string) => Promise<void>;
}

export const VerifyPhoneDialog: React.FC<VerifyPhoneDialogProps> = ({
    open,
    onOpenChange,
    phoneNumber,
    onVerify,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(120); // 2 phút = 120 giây
    const [isResending, setIsResending] = useState(false);

    const form = useForm({
        defaultValues: {
            otp: "",
        },
        mode: "onSubmit",
    });

    useEffect(() => {
        if (open && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown, open]);

    useEffect(() => {
        // Reset countdown khi dialog mở
        if (open) {
            setCountdown(120);
            form.reset();
        }
    }, [open, form]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const handleResendOTP = async () => {
        if (!phoneNumber) {
            toast.error('Số điện thoại không hợp lệ!');
            return;
        }

        setIsResending(true);
        try {
            const internationalPhone = convertPhoneNumber(phoneNumber);
            console.log('Resending OTP to:', internationalPhone);

            // Call API to resend OTP
            await verifyPhoneNumberSendOtp(internationalPhone);

            setCountdown(120);
            toast.success('Mã OTP mới đã được gửi đến số điện thoại của bạn!');
        } catch (error) {
            console.error('Failed to resend OTP:', error);
            toast.error('Không thể gửi lại mã OTP. Vui lòng thử lại!');
        } finally {
            setIsResending(false);
        }
    };

    const onSubmit = async (data: { otp: string }) => {
        setIsLoading(true);
        try {
            if (onVerify) {
                await onVerify(data.otp);
            }
            // Close dialog on success
            onOpenChange(false);
        } catch (error) {
            console.error("Verification failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const maskedPhone = phoneNumber
        ? phoneNumber.slice(0, 3) + "****" + phoneNumber.slice(-3)
        : "***";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-[#008DDA]/10 flex items-center justify-center">
                            <Phone className="w-8 h-8 text-[#008DDA]" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-xl">
                        Xác thực số điện thoại
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Mã xác thực OTP đã được gửi đến số điện thoại{" "}
                        <span className="font-semibold text-gray-900">
                            {maskedPhone}
                        </span>
                        . Vui lòng kiểm tra tin nhắn và nhập mã OTP để xác thực.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                                    <FormLabel>Mã OTP</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="focus-visible:ring-[#008DDA] text-center text-lg tracking-widest"
                                            placeholder="000000"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="text-sm text-center text-gray-600">
                            {countdown > 0 ? (
                                <span>Gửi lại OTP sau {formatTime(countdown)}</span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isResending}
                                    className="text-[#008DDA] hover:underline disabled:opacity-50 cursor-pointer font-medium"
                                >
                                    {isResending ? "Đang gửi..." : "Gửi lại mã OTP"}
                                </button>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className={`w-full transition-colors duration-200 ${
                                isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"
                            } hover:bg-[#0064A6]`}
                            disabled={isLoading}
                        >
                            {isLoading && <Spinner />}
                            Xác thực
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

