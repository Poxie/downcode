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
                autoComplete='off'
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
                className="flex items-center h-4 px-1 rounded bg-tertiary absolute left-2 top-2/4 -translate-y-2/4 text-secondary transition-all text-[8px] -mt-[20px] peer-focus:text-[8px] peer-focus:-mt-[20px] pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:mt-0"
                htmlFor={name}
            >
                {label}
            </label>
        </div>
    )
})