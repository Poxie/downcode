import Link from "next/link"
import { motion } from 'framer-motion';
import { AddIcon } from "@/assets/icons/AddIcon"
import { useParams, useSearchParams } from "next/navigation"
import { useAppSelector } from "@/redux/store";
import { selectCourseSectionIds } from "@/redux/slices/courses";
import { DraftSidebarSection } from "./DraftSidebarSection";
import { useDraft } from ".";

export const DraftSidebar = () => {
    const { preview } = useDraft();
    const draftId = useParams().draftId as string;
    const activeSection = useSearchParams().get('s');

    const sectionIds = useAppSelector(state => selectCourseSectionIds(state, draftId));

    const defaultClassName = "py-1 pb-4 sm:pb-1 px-3 border-b-[1px] sm:border-b-0 sm:border-l-[1px] border-t-secondary-accent whitespace-nowrap text-xs transition-colors";
    const activeClassName = "text-c-primary font-semibold relative before:w-[7px] before:h-[7px] before:bg-c-primary before:rounded-full before:absolute before:left-2/4 before:-translate-x-2/4 before:-bottom-1 sm:before:-left-[0.4px] sm:before:top-2/4 sm:before:-translate-y-2/4"
    const inactiveClassName = "text-secondary hover:text-primary"
    return(
        <motion.div 
            className="w-full sm:w-[220px] bg-secondary border-[1px] border-tertiary rounded-lg"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            <ul className="p-4 flex sm:grid overflow-x-auto overflow-y-hidden scrollbar-x">
                <li className="flex">
                    <Link 
                        href={`/u/me/courses/drafts/${draftId}`}
                        className={`${defaultClassName} ${!activeSection ? activeClassName : inactiveClassName}`}
                        shallow
                    >
                        Overview
                    </Link>
                </li>
                {sectionIds?.map(sectionId => (
                    <DraftSidebarSection 
                        className={`${defaultClassName} ${activeSection === sectionId ? activeClassName : inactiveClassName}`}
                        draftId={draftId}
                        sectionId={sectionId}
                        key={sectionId}
                    />
                ))}
            </ul>
            {!preview && (
                <Link 
                    className="p-4 pt-0 flex gap-3 items-center w-full text-secondary hover:text-primary"
                    href={`/u/me/courses/drafts/${draftId}?s=new`}
                >
                    <AddIcon className="w-4 -m-[5px] transition-colors" />
                    <span className="text-xs transition-colors">
                        Add another lecture
                    </span>
                </Link>
            )}
        </motion.div>
    )
}