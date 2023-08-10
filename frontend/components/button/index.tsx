import Link from "next/link";

type ButtonType = 'primary' | 'secondary' | 'danger' | 'transparent';

const typeToColor = (type: ButtonType) => {
    if(type === 'danger') return 'text-red-500';
    return 'text-primary'
}
const typeToBackground = (type: ButtonType) => {
    if(type === 'primary') return 'bg-c-primary';
    if(type === 'secondary' || type === 'danger') return 'bg-tertiary';
    if(type === 'transparent') return 'bg-transparent';
}
const typeToHover = (type: ButtonType) => {
    if(type === 'primary') return 'hover:bg-c-secondary';
    return 'hover:bg-quaternary';
}

export const Button: React.FC<{
    children: any;
    type?: ButtonType;
    onClick?: () => void;
    href?: string;
    className?: string;
    disabled?: boolean;
    isSmall?: boolean;
    withBorder?: boolean;
}> = ({ children, onClick, href, disabled, isSmall, withBorder, className='', type='primary' }) => {
    const color = typeToColor(type);
    const background = typeToBackground(type);
    const backgroundHover = typeToHover(type);

    const buttonSpacing = isSmall ? 'text-xs px-4 py-3' : 'py-[15px] px-[20px]';
    className = `block ${disabled ? 'opacity-50' : ''} ${buttonSpacing} ${withBorder ? 'border-[1px] border-quaternary' : ''} rounded-lg text-sm transition-colors ${color} ${background} ${backgroundHover} focus:ring-1 focus:ring-offset-2 ` + className;
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
                disabled={disabled}
            >
                {children}
            </button>
        )
    )
}