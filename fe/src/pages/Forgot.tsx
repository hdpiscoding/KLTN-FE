//import React from "react";
import {Outlet} from "react-router-dom";

export const Forgot = () => {
    return (
        <div className="bg-[#fff] h-screen w-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex justify-center mb-4">
                    <img src="/src/assets/timnha-icon.png" alt="icon" className="w-[100px] h-[100px]" />
                </div>
                <h2 className="text-4xl font-semibold text-center mb-6">QUÊN MẬT KHẨU</h2>

                <Outlet/>
            </div>
        </div>
    );
};