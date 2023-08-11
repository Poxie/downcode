'use client';

import { useState, useEffect } from 'react';
import { User } from "@/types";
import { useAuth } from '@/contexts/auth';
import { AccountIcon } from '@/assets/icons/AccountIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/button';
import { EditProfile } from '@/modals/edit-profile';
import { useModal } from '@/contexts/modal';
import Image from 'next/image';
import { getUserAvatar } from '@/utils/getImages';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addUsers, selectUserById } from '@/redux/slices/users';

const PROFILE_TABS = [
    { text: 'Profile', path: 'profile' },
    { text: 'Courses', path: 'courses' },
]

export default function UserLayout({ children, params: { userId } }: {
    children: React.ReactNode;
    params: { userId: string };
}) {
    const dispatch = useAppDispatch();
    const asPath = usePathname();
    const { setModal } = useModal();
    const { get, loading } = useAuth();

    const user = useAppSelector(state => selectUserById(state, userId));

    useEffect(() => {
        if(loading || user) return;

        get<User>(`/users/${userId}`)
            .then(user => {
                dispatch(addUsers([user]));
            });
    }, [loading, userId, get, user]);

    const timeFormater = Intl.DateTimeFormat('en', { dateStyle: 'medium' });
    return(
        <main 
            // 100dvh for full height - 200px (100px for navbar height, 100px for footer height)
            className="w-main max-w-main mx-auto min-h-[calc(100dvh-200px)]"
        >
            <div className="flex items-start justify-between gap-4 p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                <div className='flex gap-4'>
                    <div className="flex justify-center items-center w-[100px] h-[100px] rounded-md bg-tertiary border-[1px] border-quaternary overflow-hidden">
                        {user?.avatar ? (
                            <Image 
                                width={100}
                                height={100}
                                src={getUserAvatar(user.avatar)}
                                alt={`${user.username}'s avatar`}
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <AccountIcon className="w-7 text-secondary transition-opacity opacity-100 group-hover:opacity-0" />
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="text-xl font-semibold">
                            {user?.displayName || user?.username}
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
                        onClick={() => setModal(<EditProfile />)}
                        isSmall
                        withBorder
                    >
                        Edit profile
                    </Button>
                )}
            </div>

            <ul className="flex bg-secondary border-tertiary border-[1px] rounded-lg p-2 my-3">
                {PROFILE_TABS.map(tab => {
                    const path = `/u/${userId}/${tab.path}`;
                    const active = asPath.startsWith(path);

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