import { ModalProvider } from "./modal";

export const Providers: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <ModalProvider>
        {children}
    </ModalProvider>
)