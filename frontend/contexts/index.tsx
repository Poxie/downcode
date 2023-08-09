import { AuthProvider } from "./auth";
import { ModalProvider } from "./modal";

export const Providers: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <AuthProvider>
        <ModalProvider>
            {children}
        </ModalProvider>
    </AuthProvider>
)