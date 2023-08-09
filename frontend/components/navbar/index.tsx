"use client";

import Link from "next/link";
import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { LogoIcon } from "@/assets/icons/LogoIcon"
import { Button } from "../button";
import { usePathname } from "next/navigation";
import { useModal } from "@/contexts/modal";
import { LoginModal } from "@/modals/login";
import { SignUpModal } from "@/modals/sign-up";
import { useAuth } from "@/contexts/auth";
import { AnimatePresence } from "framer-motion";

const TABS = [
    { text: 'Home', path: '/' },
    { text: 'Courses', path: '/courses' },
];
const USER_TABS = [
    { text: 'My profile', path: '/profile' },
    { text: 'My learning', path: '/learning' },
]

export const Navbar = () => {
    const { user, token, loading } = useAuth();
    const { setModal } = useModal();
    const asPath = usePathname();

    const [openUser, setOpenUser] = useState(false);
    const userButton = useRef<HTMLButtonElement>(null);
    const popup = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(userButton.current?.contains(e.target as Node)) return;
            if(popup.current && !popup.current.contains(e.target as Node)) {
                setOpenUser(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [popup]);

    const openModal = (type: 'sign-up' | 'login') => {
        setModal(type === 'sign-up' ? <SignUpModal /> : <LoginModal />);
    }

    return(
        <nav className="w-full absolute">
            <div className="w-main max-w-main m-auto h-[106px] py-4 sm:py-7 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link 
                        href={'/'}
                        aria-label="Home"
                    >
                        <LogoIcon />
                    </Link>
                    <ul className="flex gap-3">
                        {TABS.map(tab => {
                            const active = tab.path === asPath;
                            return(
                                <li key={tab.path}>
                                    <Link 
                                        className={`${active ? 'text-primary' : 'text-secondary'} hover:text-primary text-sm`}
                                        href={tab.path}
                                    >
                                        {tab.text}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="flex gap-3">
                    {!token ? (
                        <>
                        <Button 
                            type={'transparent'}
                            onClick={() => openModal('login')}
                        >
                            Log in
                        </Button>
                        <Button onClick={() => openModal('sign-up')}>
                            Sign up
                        </Button>
                        </>
                    ) : (
                        <div className="relative">
                            <button 
                                className="flex items-center gap-2 transition-colors hover:bg-primary rounded-md p-3"
                                onClick={() => setOpenUser(!openUser)}
                                ref={userButton}
                            >
                                {!user ? (
                                    <>
                                    <span className="w-7 h-7 rounded-full"></span>
                                    </>
                                ) : (
                                    <>
                                    <span className="flex items-center justify-center text-sm font-semibold w-7 h-7 rounded-full bg-secondary">
                                        ?
                                    </span>
                                    <span className="text-base">
                                        {user.displayName || user.username}
                                    </span>
                                    </>
                                )}
                            </button>

                            <AnimatePresence>
                                {openUser && (
                                    <motion.ul
                                        animate={{ scale: 1, opacity: 1 }}
                                        initial={{ scale: .95, opacity: 0 }}
                                        exit={{ scale: .95, opacity: 0 }}
                                        transition={{ duration: .1 }}
                                        className="absolute right-0 top-[110%] bg-primary rounded-md p-2 min-w-[220px] grid"
                                        ref={popup}
                                    >
                                        {USER_TABS.map(tab => (
                                            <Link 
                                                className="text-sm text-secondary py-2.5 px-3 rounded-md transition-colors hover:bg-secondary hover:text-primary"
                                                href={tab.path}
                                                key={tab.path}
                                            >
                                                {tab.text}
                                            </Link>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}