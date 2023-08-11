"use client";

import { AppleArrowIcon } from "@/assets/icons/AppleArrowIcon";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export type DropdownItem<T> = {
    id: T;
    text: string;
}

export function Dropdown<T>({ label, items, active, onSelect, width=175, selectedClassName='' }: {
    label?: string;
    active: T;
    items: DropdownItem<T>[];
    onSelect: (id: T) => void;
    selectedClassName?: string;
    width?: number;
}) {
    const [open, setOpen] = useState(false);

    const openButton = useRef<HTMLButtonElement>(null);
    const dropdown = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(openButton.current?.contains(e.target as Node)) return;
            if(dropdown.current && !dropdown.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdown]);

    return(
        <div className={`relative w-[${width}px]`}>
            {label && (
                <span className="block text-xs text-secondary mb-2">
                    {label}
                </span>
            )}
            <button 
                onClick={() => setOpen(!open)}
                className={"flex justify-between items-center w-full text-left text-xs p-[10px] transition-colors bg-tertiary hover:bg-quaternary border-[1px] border-quaternary rounded-md " + selectedClassName}
                ref={openButton}
            >
                {items.find(item => item.id === active)?.text}

                <AppleArrowIcon className={`w-3 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.ul 
                        animate={{ scale: 1, opacity: 1 }}
                        initial={{ scale: .95, opacity: 0 }}
                        exit={{ scale: .95, opacity: 0 }}
                        transition={{ duration: .1 }}
                        className="grid absolute top-[calc(100%+6px)] w-full p-1.5 bg-tertiary border-[1px] border-quaternary rounded-md" 
                        ref={dropdown}
                    >
                        {items.map((item, key) => (
                            <li 
                                className="w-full"
                                key={key}
                            >
                                <button
                                    onClick={() => {
                                        onSelect(item.id);
                                        setOpen(false);
                                    }}
                                    className="w-full text-left text-sm px-2.5 py-2 rounded-md transition-colors hover:bg-secondary active:bg-primary text-secondary hover:text-primary"
                                >
                                    {item.text}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}