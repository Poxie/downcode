import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, {
    onChange: (value: string) => void;
    value: string;
    label: string;
    name: string;
    autoFocus?: boolean;
    type?: 'text' | 'password';
    className?: string;
}>(({ onChange, value, label, autoFocus, name, type='text', className='' }, ref) => {
    return(
        <div className={"relative " + className}>
            <input 
                placeholder=""
                className="peer p-3 bg-tertiary border-[1px] border-quaternary outline-none rounded-md w-full text-sm"
                onChange={e => onChange(e.target.value)}
                autoFocus={autoFocus}
                value={value} 
                name={name}
                id={name}
                type={type}
                ref={ref}
            />
            <label
                className="absolute top-2/4 -mt-4 text-[10px] peer-focus:-mt-4 peer-focus:text-[10px] peer-placeholder-shown:mt-0 peer-placeholder-shown:text-sm text-secondary transition-all -translate-y-2/4 left-3 pointer-events-none"
                htmlFor={name}
            >
                {label}
            </label>
        </div>
    )
})