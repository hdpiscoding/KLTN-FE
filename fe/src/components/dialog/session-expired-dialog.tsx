import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

interface SessionExpiredDialogProps {
    open: boolean;
    onLoginRedirect: () => void;
    onHomeRedirect: () => void;
}

export function SessionExpiredDialog({ open, onLoginRedirect, onHomeRedirect }: SessionExpiredDialogProps) {
    return (
        <Dialog open={open} onOpenChange={() => {}} modal>
            <DialogContent 
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                className="sm:max-w-md"
            >
                <DialogHeader>
                    <DialogTitle className="text-center">Phiên đăng nhập hết hạn</DialogTitle>
                    <DialogDescription className="text-center">
                        Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục sử dụng.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={onHomeRedirect}
                        variant="outline"
                        className="w-full lg:min-w-[160px] sm:w-auto cursor-pointer"
                    >
                        Quay về trang chủ
                    </Button>
                    <Button 
                        onClick={onLoginRedirect}
                        className="w-full lg:min-w-[160px] sm:w-auto bg-[#008DDA] hover:bg-[#0077b6] cursor-pointer"
                    >
                        Đăng nhập
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

