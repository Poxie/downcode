"use client";

import { Provider } from "react-redux";
import { AuthProvider } from "./auth";
import { ModalProvider } from "./modal";
import { store } from "@/redux/store";

export const Providers: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <Provider store={store}>
        <AuthProvider>
            <ModalProvider>
                {children}
            </ModalProvider>
        </AuthProvider>
    </Provider>
)