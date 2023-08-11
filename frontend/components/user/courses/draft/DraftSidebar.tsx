import Link from "next/link"
import { motion } from 'framer-motion';
import { AddIcon } from "@/assets/icons/AddIcon"
import { useSearchParams } from "next/navigation"

export const DraftSidebar = () => {
    const draftId = useSearchParams().get('draftId');
    const activeSection = useSearchParams().get('s');

    const defaultClassName = "px-3 text-xs transition-colors";
    const activeClassName = "text-c-primary font-semibold relative before:w-[7px] before:h-[7px] before:bg-c-primary before:rounded-full before:absolute before:-left-[4px] before:top-2/4 before:-translate-y-2/4"
    const inactiveClassName = "text-secondary hover:text-primary"
    return(
        <motion.div 
            className="p-4 w-[220px] bg-secondary border-[1px] border-tertiary rounded-lg"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            <ul className="grid gap-2 border-l-[1px] border-l-t-secondary-accent">
                <li className="flex">
                    <Link 
                        href={`/u/me/courses/drafts/${draftId}`}
                        className={`px-3 text-xs ${!activeSection ? activeClassName : inactiveClassName}`}
                        shallow
                    >
                        Overview
                    </Link>
                </li>
                {/* {sections.map((section, key) => (
                    <li className="flex" key={key}>
                        <Link 
                            href={`/u/me/courses/drafts/${draftId}?s=${key}`}
                            className={`${defaultClassName} ${Number(activeSection || '-1') === key ? activeClassName : inactiveClassName}` + (!section.title ? ' italic' : '')}
                        >
                            {section.title || 'Lecture title not set'}
                        </Link>
                    </li>
                ))} */}
            </ul>
            {/* <button 
                className="flex gap-3 items-center mt-4 w-full text-secondary hover:text-primary"
                onClick={addSection}
            >
                <AddIcon className="w-4 -m-[5px] transition-colors" />
                <span className="text-xs transition-colors">
                    Add another lecture
                </span>
            </button> */}
        </motion.div>
    )
}