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
import { requestBecomeSeller } from "@/services/userServices.ts";
import { AlertCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const NoneSellerView = () => {
    const { setUserInfo, userId, avatarUrl } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);

    const handleRequestBecomeSeller = async () => {
        setIsLoading(true);
        try {
            await requestBecomeSeller();

            // Update userStore with PENDING status
            setUserInfo(userId, avatarUrl, "PENDING");
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
                        <div className="rounded-full bg-yellow-100 p-4">
                            <AlertCircle className="w-12 h-12 text-yellow-600" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Bạn chưa phải là người bán
                        </h2>
                        <p className="text-gray-600">
                            Để đăng tin bán hoặc cho thuê bất động sản, bạn cần đăng ký trở thành người bán.
                            Quá trình xét duyệt sẽ diễn ra trong vòng 24-48 giờ.
                        </p>
                    </div>

                    <div className="space-y-3">
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

                        <p className="text-xs text-gray-500">
                            Bằng việc đăng ký, bạn đồng ý với điều khoản và chính sách của chúng tôi
                        </p>
                    </div>
                </div>
            </div>

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

