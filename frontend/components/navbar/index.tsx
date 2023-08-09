"use client";
import { LogoIcon } from "@/assets/icons/LogoIcon"
import Link from "next/link";
import { Button } from "../button";
import { usePathname } from "next/navigation";
import { useModal } from "@/contexts/modal";
import { LoginModal } from "@/modals/login";
import { SignUpModal } from "@/modals/sign-up";
import { useAuth } from "@/contexts/auth";

const TABS = [
    { text: 'Home', path: '/' },
    { text: 'Courses', path: '/courses' },
];
export const Navbar = () => {
    const { user, token, loading } = useAuth();
    const { setModal } = useModal();
    const asPath = usePathname();

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
                        <button className="flex items-center gap-2 transition-colors hover:bg-quaternary rounded-md p-2.5">
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
                    )}
                </div>
            </div>
        </nav>
    )
}