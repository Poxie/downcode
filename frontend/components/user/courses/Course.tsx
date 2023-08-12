import { selectCourseById } from "@/redux/slices/courses";
import { useAppSelector } from "@/redux/store";
import { CourseChip } from "./CourseChip";
import Link from "next/link";

export const Course: React.FC<{
    draftId: string;
}> = ({ draftId }) => {
    const course = useAppSelector(state => selectCourseById(state, draftId));

    return(
        <div className="border-[1px] border-quaternary bg-tertiary rounded-lg mb-2">
            <div className="p-[14px]">
                <div className="flex items-center gap-[14px]">
                    <span className="text-lg font-semibold">
                        {course?.title || 'Course title not set'}
                    </span>
                    <div className="flex gap-1">
                        <CourseChip>
                            30 minutes
                        </CourseChip>
                        <CourseChip type={'xp'}>
                            +100 XP
                        </CourseChip>
                    </div>
                </div>
                <span className="text-sm text-secondary mt-2 block">
                    {course?.description || 'Course description not set'}
                </span>
            </div>
            <div className="flex justify-between p-[14px] border-t-[1px] border-quaternary">
                <span className="text-xs">
                    
                </span>
                <Link 
                    className="text-xs transition-colors text-secondary hover:text-primary"
                    href={`/u/me/courses/drafts/${draftId}`}
                >
                    Go to course
                </Link>
            </div>
        </div>
    )
}