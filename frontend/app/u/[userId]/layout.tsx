'use client';

import { useState, useEffect } from 'react';
import { User } from "@/types";
import { useAuth } from '@/contexts/auth';
import { AccountIcon } from '@/assets/icons/AccountIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/button';

const PROFILE_TABS = [
    { text: 'Profile', path: 'profile' },
    { text: 'Courses', path: 'courses' },
]

export default function UserLayout({ children, params: { userId } }: {
    children: React.ReactNode;
    params: { userId: string };
}) {
    const asPath = usePathname();
    const { get, loading } = useAuth();

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if(loading) return;
        get<User>(`/users/${userId}`).then(setUser);
    }, [loading, userId, get]);

    const timeFormater = Intl.DateTimeFormat('en', { dateStyle: 'medium' });
    return(
        <main 
            className="w-main max-w-main mx-auto"
            // 100dvh for full height - 200px (100px for navbar height, 100px for footer height)
            style={{ minHeight: `calc(100dvh - 200px)` }}
        >
            <div className="flex items-start justify-between gap-4 p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                <div className='flex gap-4'>
                    <div className="flex items-center justify-center text-3xl font-bold w-[100px] h-[100px] rounded-lg bg-tertiary border-[1px] border-quaternary">
                        ?
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xl font-semibold">
                            {user?.username}
                        </span>
                        <div className="flex gap-2 items-center text-secondary">
                            <AccountIcon className="w-[16px] h-[20px]" />
                            <span className="text-xs">
                                Member since {user?.createdAt && timeFormater.format(Number(user?.createdAt))}
                            </span>
                        </div>
                    </div>
                </div>
                {user?.isSelf && (
                    <Button 
                        type={'secondary'}
                        className="border-[1px] border-quaternary text-xs px-4 py-3"
                    >
                        Edit profile
                    </Button>
                )}
            </div>

            <ul className="flex bg-secondary border-tertiary border-[1px] rounded-lg p-2 my-3">
                {PROFILE_TABS.map(tab => {
                    const path = `/u/${userId}/${tab.path}`;
                    const active = path === asPath;

                    return(
                        <li key={tab.path}>
                            <Link
                                href={`/u/${userId}/${tab.path}`}
                                className={`block px-3 py-2 rounded-lg text-sm transition-colors hover:text-primary ${active ? 'bg-tertiary text-primary' : 'text-secondary'}`}
                            >
                                {tab.text}
                            </Link>
                        </li>
                    )
                })}
            </ul>

            {children}
        </main>
    )
}