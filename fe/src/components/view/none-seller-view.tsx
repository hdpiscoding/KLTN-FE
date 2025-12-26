/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import { useUserStore } from "@/store/userStore.ts";
import { requestBecomeSeller, verifyPhoneNumberSendOtp, verifyPhoneNumberVerifyOtp, getMyProfile } from "@/services/userServices.ts";
import { AlertCircle, UserPlus, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { VerifyPhoneDialog } from "@/components/dialog/verify-phone-dialog.tsx";
import { convertPhoneNumber } from "@/utils/generalFormat.ts";

export const NoneSellerView = () => {
    const { setApproveStatus, verifiedPhone, setPhoneVerificationStatus } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [isVerifyPhoneDialogOpen, setIsVerifyPhoneDialogOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    // Fetch user profile to get phone number
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getMyProfile();
                setPhoneNumber(response?.data.phoneNumber || "");
                setPhoneVerificationStatus(response?.data.verifiedPhone);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [setPhoneVerificationStatus]);

    // Handle phone verification
    const handleVerifyPhone = async (otp: string) => {
        try {
            // Call API to verify phone with OTP
            await verifyPhoneNumberVerifyOtp(convertPhoneNumber(phoneNumber), otp);
            // Update verification status in store
            setPhoneVerificationStatus(true);
            toast.success('Xác thực số điện thoại thành công!');
            // Dialog will close automatically via onOpenChange in the dialog component
        } catch (error: any) {
            console.error('Phone verification failed:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Xác thực thất bại. Vui lòng thử lại!';
            toast.error(errorMessage);
            throw error; // Re-throw to keep dialog open
        }
    };

    const handleOpenVerifyDialog = async () => {
        if (!phoneNumber || phoneNumber.length !== 10) {
            toast.error('Số điện thoại không hợp lệ. Vui lòng cập nhật số điện thoại trong trang thông tin cá nhân!');
            return;
        }
        setIsLoading(true);
        try {
            // Call API to send OTP to phone number
            await verifyPhoneNumberSendOtp(convertPhoneNumber(phoneNumber));
            toast.success('Mã OTP đã được gửi đến số điện thoại của bạn!');
            setIsVerifyPhoneDialogOpen(true);
        } catch (error: any) {
            console.error('Failed to send OTP:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Không thể gửi mã OTP. Vui lòng thử lại!';
            toast.error(errorMessage);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleRequestBecomeSeller = async () => {
        setIsLoading(true);
        try {
            await requestBecomeSeller();

            // Update userStore with PENDING status
            setApproveStatus("PENDING");
            toast.success("Yêu cầu trở thành người bán đã được gửi thành công!");
        } catch (error) {
            console.error("Error requesting to become seller:", error);
            setShowErrorDialog(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-[60vh] p-4">
                <div className="max-w-md w-full p-8 text-center space-y-6 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="flex justify-center">
                        <div className={`rounded-full p-4 ${!verifiedPhone ? 'bg-orange-100' : 'bg-yellow-100'}`}>
                            {!verifiedPhone ? (
                                <ShieldCheck className="w-12 h-12 text-orange-600" />
                            ) : (
                                <AlertCircle className="w-12 h-12 text-yellow-600" />
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {!verifiedPhone
                                ? 'Số điện thoại chưa được xác thực'
                                : 'Bạn chưa phải là người bán'
                            }
                        </h2>
                        <p className="text-gray-600">
                            {!verifiedPhone
                                ? 'Để đăng ký trở thành người bán, bạn cần xác thực số điện thoại của mình. Mã OTP sẽ được gửi đến số điện thoại đã đăng ký trong hệ thống.'
                                : 'Để đăng tin bán hoặc cho thuê bất động sản, bạn cần đăng ký trở thành người bán. Quá trình xét duyệt sẽ diễn ra trong vòng 24-48 giờ.'
                            }
                        </p>
                    </div>

                    <div className="space-y-3">
                        {!verifiedPhone ? (
                            <Button
                                onClick={handleOpenVerifyDialog}
                                className={`w-full transition-colors duration-200 ${isLoading ? "bg-orange-600 hover:bg-orange-600" : "bg-orange-500 hover:bg-orange-600 cursor-pointer"}`}
                                size="lg"
                            >
                                { isLoading ? <Spinner/> : null}
                                Xác thực số điện thoại
                            </Button>
                        ) : (
                            <Button
                                onClick={handleRequestBecomeSeller}
                                className={`w-full transition-colors duration-200 ${isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"} hover:bg-[#0064A6] `}
                                size="lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Spinner className="mr-2" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-5 h-5 mr-2" />
                                        Đăng ký trở thành người bán
                                    </>
                                )}
                            </Button>
                        )}

                        <p className="text-xs text-gray-500">
                            {!verifiedPhone
                                ? 'Số điện thoại của bạn sẽ được bảo mật và chỉ dùng để xác thực tài khoản'
                                : 'Bằng việc đăng ký, bạn đồng ý với điều khoản và chính sách của chúng tôi'
                            }
                        </p>
                    </div>
                </div>
            </div>

            {/* Verify Phone Dialog */}
            <VerifyPhoneDialog
                open={isVerifyPhoneDialogOpen}
                onOpenChange={setIsVerifyPhoneDialogOpen}
                phoneNumber={phoneNumber}
                onVerify={handleVerifyPhone}
            />

            {/* Error Dialog */}
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-blue-100 p-3">
                                <AlertCircle className="w-8 h-8 text-[#008DDA]" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-center text-xl">
                            Thông báo
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-base">
                            Bạn đã đăng ký làm người bán trước đó. Vui lòng đợi quá trình xét duyệt hoàn tất.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction
                            className="bg-[#008DDA] hover:bg-[#007BC0] w-full sm:w-auto"
                            onClick={() => setShowErrorDialog(false)}
                        >
                            Đã hiểu
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

