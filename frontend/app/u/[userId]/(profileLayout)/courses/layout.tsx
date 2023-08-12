"use client";

import Link from "next/link";
import { AddIcon } from "@/assets/icons/AddIcon"
import { useParams, usePathname } from "next/navigation";

const COURSE_TABS = [
    { text: 'Published courses', path: '' },
    { text: 'Drafts', path: '/drafts' },
]
export default function UserCourses({
    children
}: {
    children: React.ReactNode;
}) {
    const userId = useParams().userId as string;
    const pathname = usePathname();

    return(
        <div className="p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
            <ul className="flex gap-3 mb-3">
                {COURSE_TABS.map(tab => {
                    const path = `/u/${userId}/courses${tab.path}`;
                    const active = path === pathname;

                    return(
                        <li key={tab.path}>
                            <Link
                                href={path}
                                className={`block text-xs transition-colors hover:text-primary ${active ? 'text-primary' : 'text-secondary'}`}
                            >
                                {tab.text}
                            </Link>
                        </li>
                    )
                })}
            </ul>

            {children}

            <Link 
                className="w-full flex gap-1.5 justify-center items-center text-secondary p-6 rounded-lg border-[1px] border-quaternary transition-colors hover:bg-tertiary"
                href={'/u/me/courses/drafts/new'}
            >
                <AddIcon className="w-4" />
                <span className="text-xs">
                    Create a new course
                </span>
            </Link>
        </div>
    )
}