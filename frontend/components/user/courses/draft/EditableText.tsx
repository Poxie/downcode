import { EditIcon } from "@/assets/icons/EditIcon";
import { useEffect, useRef, useState } from "react";

export const EditableText: React.FC<{
    text: string;
    placeholder: string;
    className?: string;
    iconClassName?: string;
    onChange: (text: string) => void;
}> = ({ text, placeholder, onChange, iconClassName='', className='' }) => {
    const [editing, setEditing] = useState(false);
    const input = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if(!editing) return;
        input.current?.select();
    }, [editing]);

    const close = () => {
        if(!input.current) return;
        onChange(input.current.value);
        setEditing(false);
    }

    return(
        <>
            <textarea 
                defaultValue={text}
                className={`w-full bg-transparent border-none outline-none ${editing ? 'block' : 'hidden'} ${className}`}
                onKeyDown={e => {
                    if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        close();
                    }
                    if(e.key === 'Escape') close();
                }}
                onBlur={close}
                ref={input}
            />
            <button 
                className={`flex gap-3 items-center text-left ${editing ? 'hidden' : 'block'} ${className}`}
                onClick={() => setEditing(true)}
                onFocus={() => setEditing(true)}
            >
                {text || placeholder}
                <EditIcon className={`w-4 text-secondary ${iconClassName}`} />
            </button>
        </>
    )
}