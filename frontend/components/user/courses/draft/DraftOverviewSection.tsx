import { useAppSelector } from "@/redux/store";
import { CourseChip } from "../CourseChip";
import { Button } from "@/components/button";
import { selectSectionById } from "@/redux/slices/courses";
import { useDraft } from ".";

export const DraftOverviewSection: React.FC<{
    isLast: boolean;
    sectionId: string;
    draftId: string;
    index: number;
}> = ({ sectionId, draftId, isLast, index }) => {
    const { preview } = useDraft();

    const section = useAppSelector(state => selectSectionById(state, draftId, sectionId));
    if(!section) return null;

    return(
        <>
            <div className={`flex flex-col sm:flex-row border-[1px] border-tertiary rounded-lg bg-gradient-to-r ${preview ? 'from-incomplete-from to-incomplete-to' : ''}`}>
                <div className="flex-1">
                    <div className="border-b-[1px] border-b-tertiary">
                        <div className="flex">
                            <div className="p-4 flex min-w-[70px] items-center justify-center border-r-[1px] border-r-tertiary">
                                <span className="text-2xl text-secondary font-bold">
                                    {index + 1}
                                </span>
                            </div>
                            <div className="p-4 grid gap-1">
                                <span className={`text-primary ${section.title ? 'font-bold' : ''}`}>
                                    {section.title || 'Lecture title not set'}
                                </span>
                                <span className="text-sm text-secondary">
                                    {section.description || 'Lecture description not set'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4">
                        <div className="flex-1 flex gap-1.5 flex-wrap">
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
                            type={'incomplete'}
                            href={`/u/me/courses/drafts/${draftId}?s=${sectionId}`}
                            className="-m-2 block"
                            isSmall
                        >
                            {preview ? 'Go to lecture' : 'Edit lecture'}
                        </Button>
                    </div>
                </div>
            </div>

            {(!preview || !isLast) && (
                <div className="relative my-2 w-[70px] h-[28px] after:absolute after:h-[12px] after:w-[2px] after:top-0 after:left-2/4 after:-translate-x-2/4 after:bg-tertiary after:rounded-lg before:absolute before:h-[12px] before:w-[2px] before:bottom-0 before:left-2/4 before:-translate-x-2/4 before:bg-tertiary before:rounded-lg" />
            )}
        </>
    )
}