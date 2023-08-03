import { LogoIcon } from "@/assets/icons/LogoIcon"

export const Footer = () => {
    return(
        <div className="flex justify-between w-main max-w-main mx-auto py-8">
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
        </div>
    )
}