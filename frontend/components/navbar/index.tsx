"use client";
import { LogoIcon } from "@/assets/icons/LogoIcon"
import Link from "next/link";
import { Button } from "../button";
import { usePathname } from "next/navigation";

const TABS = [
    { text: 'Home', path: '/' },
    { text: 'Courses', path: '/courses' },
];
export const Navbar = () => {
    const asPath = usePathname()

    return(
        <nav className="w-full absolute">
            <div className="w-main max-w-main m-auto py-4 sm:py-7 flex justify-between items-center">
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
                    <Button type={'transparent'}>
                        Log in
                    </Button>
                    <Button>
                        Sign up
                    </Button>
                </div>
            </div>
        </nav>
    )
}