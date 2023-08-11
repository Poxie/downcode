import { AddIcon } from "@/assets/icons/AddIcon"
import Link from "next/link"
import { useDraft } from "./Draft"
import { useSearchParams } from "next/navigation"

export const DraftSidebar = () => {
    const activeSection = useSearchParams().get('s');
    const { sections, addSection } = useDraft();

    const defaultClassName = "px-3 text-xs transition-colors";
    const activeClassName = "text-c-primary font-semibold relative before:w-[7px] before:h-[7px] before:bg-c-primary before:rounded-full before:absolute before:-left-[4px] before:top-2/4 before:-translate-y-2/4"
    const inactiveClassName = "text-secondary hover:text-primary"
    return(
        <div className="p-4 w-[220px] bg-secondary border-[1px] border-tertiary rounded-lg">
            <ul className="grid gap-2 border-l-[1px] border-l-t-secondary-accent">
                <li className="flex">
                    <Link 
                        href={'/u/me/courses/drafts/new'}
                        className={`px-3 text-xs ${!activeSection ? activeClassName : inactiveClassName}`}
                        shallow
                    >
                        Overview
                    </Link>
                </li>
                {sections.map((section, key) => (
                    <li className="flex" key={key}>
                        <Link 
                            href={`/u/me/courses/drafts/new?s=${key}`}
                            className={`${defaultClassName} ${Number(activeSection || '-1') === key ? activeClassName : inactiveClassName}` + (!section.title ? ' italic' : '')}
                        >
                            {section.title || 'Lecture title not set'}
                        </Link>
                    </li>
                ))}
            </ul>
            <button 
                className="flex gap-3 items-center mt-4 w-full text-secondary hover:text-primary"
                onClick={addSection}
            >
                <AddIcon className="w-4 -m-[5px] transition-colors" />
                <span className="text-xs transition-colors">
                    Add another lecture
                </span>
            </button>
        </div>
    )
}