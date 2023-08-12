import { selectSectionById } from "@/redux/slices/courses";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";

export const DraftSidebarSection: React.FC<{
    draftId: string;
    sectionId: string;
    className: string;
}> = ({ draftId, sectionId, className }) => {
    const section = useAppSelector(state => selectSectionById(state, draftId, sectionId));
    return(
        <li className="flex">
            <Link
                href={`/u/me/courses/drafts/${draftId}?s=${sectionId}`}
                className={`${className} ${!section?.title ? ' italic' : ''}`}
            >
                {section?.title || 'Lecture title not set'}
            </Link>
        </li>
    )
}