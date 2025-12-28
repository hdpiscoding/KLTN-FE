import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PasswordInput } from "@/components/ui/input-password.tsx";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { login } from "@/services/authServices.ts";
import { useUserStore } from "@/store/userStore.ts";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "@/services/userServices.ts";
import { getUserIdFromToken } from "@/utils/jwtHelper.ts";
import logo from "../../assets/timnha-icon.png";

export const Login = () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });
    const loginData = useUserStore((state) => state.login);
    const {setUserInfo, setApproveStatus, setPhoneVerificationStatus} = useUserStore();


    const onSubmit = async (data: {email: string, password: string}) => {
        setIsLoading(true);
        try {
            const response = await login(data.email, data.password);
            if (response.status === "200") {
                loginData(response.data.token);
                toast.success("Đăng nhập thành công!");
                const res = await getMyProfile();
                setUserInfo(getUserIdFromToken(response.data.token), res?.data.avatarUrl);
                setApproveStatus(res?.data.becomeSellerApproveStatus);
                setPhoneVerificationStatus(res?.data.verifiedPhone);
                navigate("/");
            }
        }
        catch (error) {
            toast.error("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.");
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

  return (
    <div className="bg-[#fff] w-screen h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {/* App Icon Placeholder */}
        <div className="flex justify-center mb-4">
          <img src={logo} className="w-[100px] h-[100px]" alt={"logo"} />
        </div>
        <h2 className="text-4xl font-semibold text-center mb-6">ĐĂNG NHẬP</h2>
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
                    <Input
                      className="focus-visible:ring-[#008DDA]"
                      placeholder="Nhập email của bạn"
                      {...field}
                    />
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
                    <PasswordInput
                      className="focus-visible:ring-[#008DDA]"
                      placeholder="Nhập mật khẩu của bạn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <a
                href="/quen-mat-khau"
                className="text-sm mt-4 text-[#008DDA] hover:underline hover:text-[#0064A6]"
              >
                Quên mật khẩu?
              </a>
            </div>
            <Button
              type="submit"
              className={`w-full transition-colors duration-200 ${
                isLoading ? "bg-[#0064A6]" : "bg-[#008DDA] cursor-pointer"
              } hover:bg-[#0064A6] `}
            >
              {isLoading ? <Spinner /> : null}
              Đăng nhập
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <a
            href="/dang-ky"
            className="text-[#008DDA] hover:underline hover:text-[#0064A6]"
          >
            Đăng ký tại đây.
          </a>
        </div>
      </div>
    </div>
  );
};