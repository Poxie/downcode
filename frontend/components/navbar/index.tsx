"use client";

import Link from "next/link";
import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { LogoIcon } from "@/assets/icons/LogoIcon"
import { Button } from "../button";
import { usePathname } from "next/navigation";
import { useModal } from "@/contexts/modal";
import { LoginModal } from "@/modals/login";
import { SignUpModal } from "@/modals/sign-up";
import { useAuth } from "@/contexts/auth";
import { AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { selectSelf } from "@/redux/slices/users";
import { AccountIcon } from "@/assets/icons/AccountIcon";
import Image from "next/image";
import { getUserAvatar } from "@/utils/getImages";

const TABS = [
    { text: 'Home', path: '/' },
    { text: 'Courses', path: '/courses' },
];
const USER_GROUPS: {
    text: string;
    path?: string;
    onClick?: () => void;
    type?: 'danger'
}[][] = [
    [
        { text: 'My profile', path: '/u/me/profile' },
        { text: 'My learning', path: '/u/me/learning' },
        { text: 'My courses', path: '/u/me/courses' },
    ],
    [
        { text: 'Logout', type: 'danger', onClick: () => {
            window.localStorage.removeItem('accessToken');
            window.location.reload();
        } }
    ]
]

export const Navbar = () => {
    const { token, loading } = useAuth();
    const { setModal } = useModal();
    const asPath = usePathname();

    const user = useAppSelector(selectSelf);

    const [openUser, setOpenUser] = useState(false);
    const userButton = useRef<HTMLButtonElement>(null);
    const popup = useRef<HTMLUListElement>(null);

    useEffect(() => setOpenUser(false), [asPath]);

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
        <nav className={`w-full ${asPath === '/' ? 'absolute': 'relative'}`}>
            <div className="w-main max-w-main m-auto h-[100px] py-4 sm:py-7 flex justify-between items-center">
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
                    {!user ? (
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
                                <div className="flex items-center justify-center w-7 h-7 rounded-full overflow-hidden">
                                    {user.avatar ? (
                                        <Image 
                                            width={100}
                                            height={100}
                                            src={getUserAvatar(user.avatar)}
                                            alt={`${user.username}'s avatar`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <AccountIcon className="w-5" />
                                    )}
                                </div>
                                <span className="text-base">
                                    {user.displayName || user.username}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openUser && (
                                    <motion.ul
                                        animate={{ scale: 1, opacity: 1 }}
                                        initial={{ scale: .95, opacity: 0 }}
                                        exit={{ scale: .95, opacity: 0 }}
                                        transition={{ duration: .1 }}
                                        className="absolute right-0 top-[110%] bg-primary rounded-md p-2 min-w-[220px]"
                                        ref={popup}
                                    >
                                        {USER_GROUPS.map((group, key) => (
                                            <React.Fragment key={key}>
                                            {key !== 0 && (
                                                <div className="my-2.5 mx-3 h-[1px] bg-tertiary" />
                                            )}
                                            <ul className="grid">
                                                {group.map(tab => {
                                                    const className = "text-left text-sm py-2.5 px-3 rounded-md transition-colors hover:bg-secondary " + (tab.type === 'danger' ? 'text-red-400 hover:text-red-600' : 'text-secondary hover:text-primary');
                                                    return(
                                                        tab.path ? (
                                                            <Link 
                                                                className={className}
                                                                href={tab.path}
                                                                key={tab.text}
                                                            >
                                                                {tab.text}
                                                            </Link>
                                                        ) : (
                                                            <button
                                                                className={className}
                                                                onClick={tab.onClick}
                                                                key={tab.text}
                                                            >
                                                                {tab.text}
                                                            </button>
                                                        )
                                                    )
                                                })}
                                            </ul>
                                            </React.Fragment>
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