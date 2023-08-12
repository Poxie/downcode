import { AddIcon } from "@/assets/icons/AddIcon";
import { useAppSelector } from "@/redux/store"
import { DraftOverviewSection } from "./DraftOverviewSection";
import { selectCourseSectionIds } from "@/redux/slices/courses";
import Link from "next/link";

export const DraftSections: React.FC<{
    draftId: string;
}> = ({ draftId }) => {
    const sectionIds = useAppSelector(state => selectCourseSectionIds(state, draftId));
    if(!sectionIds) return null;

    return(
        <div>
            <span className="block text-xs text-secondary mb-2">
                Course content
            </span>
            {sectionIds.map((sectionId, index) => (
                <DraftOverviewSection 
                    draftId={draftId}
                    sectionId={sectionId}
                    index={index}
                    key={index}
                />
            ))}
            <Link 
                className="h-[120px] w-full text-xs text-secondary flex gap-2 justify-center items-center transition-colors hover:bg-secondary border-[1px] border-tertiary rounded-lg"
                href={`/u/me/courses/drafts/${draftId}?s=new`}
            >
                <AddIcon className="w-4" />
                <span>
                    Add another lecture
                </span>
            </Link>
        </div>
    )
}