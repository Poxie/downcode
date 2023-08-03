import Link from "next/link";

type ButtonType = 'primary' | 'secondary' | 'transparent';

const typeToBackground = (type: ButtonType) => {
    if(type === 'primary') return 'bg-c-primary';
    if(type === 'secondary') return 'bg-tertiary';
    if(type === 'transparent') return 'bg-transparent';
}
const typeToHover = (type: ButtonType) => {
    if(type === 'primary') return 'hover:bg-c-secondary';
    if(type === 'secondary') return 'hover:bg-quaternary';
    if(type === 'transparent') return 'hover:bg-quaternary';
}

export const Button: React.FC<{
    children: any;
    type?: ButtonType;
    onClick?: () => void;
    href?: string;
    className?: string;
}> = ({ children, onClick, href, className, type='primary' }) => {
    const background = typeToBackground(type);
    const backgroundHover = typeToHover(type);

    className = (className ? className + ' ' : '') + `block py-[15px] px-[20px] rounded-lg text-sm transition-colors ${background} ${backgroundHover} focus:ring-1 focus:ring-offset-2`;
    return(
        href ? (
            <Link 
                href={href}
                className={className}
            >
                {children}
            </Link>
        ) : (
            <button 
                className={className}
                onClick={onClick}
            >
                {children}
            </button>
        )
    )
}