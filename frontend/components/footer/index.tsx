import { LogoIcon } from "@/assets/icons/LogoIcon"

export const Footer = () => {
    return(
        <footer className="flex justify-between items-center w-main max-w-main mx-auto py-8 h-[100px]">
            <LogoIcon />
            <span>
                designed & created by
                {' '}
                <a 
                    className="text-c-primary"
                    referrerPolicy="no-referrer"
                    href={`https://poxen.dev`}
                    target="_blank"
                >
                    Poxen
                </a>
            </span>
        </footer>
    )
}