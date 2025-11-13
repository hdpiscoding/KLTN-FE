import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export const EstimatePropertyAddress: React.FC = () => {
    const navigate = useNavigate();
    const form = useForm({
        defaultValues: {
            address: ""
        },
        mode: "onChange",
    });

    const onSubmit = async (data: { address: string }) => {
        navigate("/dinh-gia-nha/ban-do");
        console.log(data);
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 sm:p-10 w-full max-w-2xl">
                <div className="flex flex-col gap-8">
                    <div className="w-full text-center">
                        <h2 className="text-3xl sm:text-4xl font-semibold">ĐỊNH GIÁ NHÀ</h2>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="address"
                                rules={{
                                    required: "Địa chỉ không được để trống!",
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Địa chỉ của bạn</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="focus-visible:ring-[#008DDA] h-11"
                                                placeholder="Nhập địa chỉ của bạn"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-11 transition-colors duration-200 bg-[#008DDA] cursor-pointer hover:bg-[#0064A6]">
                                Tiếp tục
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};