import { useAppSelector } from "@/redux/store";
import { CourseChip } from "../CourseChip";
import { Button } from "@/components/button";
import { selectSectionById } from "@/redux/slices/courses";

export const DraftOverviewSection: React.FC<{
    sectionId: string;
    draftId: string;
    index: number;
}> = ({ sectionId, draftId, index }) => {
    const section = useAppSelector(state => selectSectionById(state, draftId, sectionId));
    if(!section) return null;

    return(
        <>
            <div className="flex border-[1px] border-tertiary rounded-lg">
                <div className="min-w-[95px] flex items-center justify-center border-r-[1px] border-r-tertiary">
                    <span className="text-4xl text-secondary font-bold">
                        {index + 1}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="p-4 grid gap-1 border-b-[1px] border-b-tertiary">
                        <span className={`text-primary ${section.title ? 'font-bold' : ''}`}>
                            {section.title || 'Lecture title not set'}
                        </span>
                        <span className="text-sm text-secondary">
                            {section.description || 'Lecture description not set'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex gap-2">
                            <CourseChip className={!section.duration ? 'italic' : ''}>
                                {section.duration ? `${section.duration} ${section.durationIdentifier}` : 'Lecture duration not set'}
                            </CourseChip>
                            <CourseChip 
                                type={'xp'}
                                className={!section.xp ? 'italic' : ''}
                            >
                                {section.xp ? `+${section.xp} XP` : 'Lecture XP not set'}
                            </CourseChip>
                        </div>
                        <Button
                            href={`/u/me/courses/drafts/${draftId}?s=${sectionId}`}
                            className="-m-2"
                            isSmall
                        >
                            Edit lecture
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative my-2 w-[95px] h-[28px] after:absolute after:h-[12px] after:w-[2px] after:top-0 after:left-2/4 after:-translate-x-2/4 after:bg-tertiary after:rounded-lg before:absolute before:h-[12px] before:w-[2px] before:bottom-0 before:left-2/4 before:-translate-x-2/4 before:bg-tertiary before:rounded-lg" />
        </>
    )
}