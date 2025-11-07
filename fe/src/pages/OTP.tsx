import React, {useEffect} from "react";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner.tsx";

export const OTP = ({from}: {from:string}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    useEffect(() => {
        if (isLoading) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const form = useForm({
        defaultValues: {
            otp: "",
        },
        mode: "onChange",
    });
    const onSubmit = async (data: any) => {
        // handle next
        setIsLoading(true);
        console.log(data);
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