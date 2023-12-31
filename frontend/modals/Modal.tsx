import { motion } from 'framer-motion';

export const Modal: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    return(
        <motion.div
            exit={{ scale: .7, opacity: 0 }}
            initial={{ scale: .7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .2, ease: 'easeInOut' }}
            className="fixed z-30 top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none"
        >
            <div className="w-[600px] max-w-full max-h-full overflow-auto pointer-events-auto bg-secondary rounded-lg">
                {children}
            </div>
        </motion.div>
    )
}