import { selectCourseDuration, selectCourseInfo, selectCourseXP } from "@/redux/slices/courses";
import { useAppSelector } from "@/redux/store";
import { CourseChip } from "./CourseChip";
import Link from "next/link";

export const Course: React.FC<{
    draftId: string;
}> = ({ draftId }) => {
    const course = useAppSelector(state => selectCourseInfo(state, draftId));
    const courseDuration = useAppSelector(state => selectCourseDuration(state, draftId));
    const courseXP = useAppSelector(state => selectCourseXP(state, draftId));
    if(!course) return null;

    const { title, description, skillLevel, status } = course;

    return(
        <div className="border-[1px] border-quaternary bg-tertiary rounded-lg mb-2">
            <div className="p-4">
                <div className="flex sm:items-center flex-col-reverse sm:flex-row gap-4">
                    <span className="text-lg font-semibold">
                        {title || 'Course title not set'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                        <CourseChip>
                            {skillLevel.slice(0,1).toUpperCase() + skillLevel.slice(1)}
                        </CourseChip>
                        <CourseChip className={!courseDuration ? 'italic' : ''} >
                            {courseDuration || 'Lecture durations not set'}
                        </CourseChip>
                        <CourseChip
                            className={!courseXP ? 'italic' : ''} 
                            type={'xp'}
                        >
                            {courseXP ? `+100 XP` : 'Lecture XPs not set'}
                        </CourseChip>
                    </div>
                </div>
                <span className="text-sm text-secondary mt-2 block">
                    {description || 'Course description not set'}
                </span>
            </div>
            <div className="flex items-center justify-between p-4 border-t-[1px] border-quaternary">
                <CourseChip className="-my-1">
                    {status === 'idle' && 'Not yet published.'}
                    {status === 'pending' && 'Pending verification.'}
                    {status === 'published' && 'Published course.'}
                </CourseChip>
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