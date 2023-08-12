"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Dropdown } from "@/components/dropdown";
import { CourseChip } from "../CourseChip";
import { Button } from "@/components/button";
import { EditableText } from './EditableText';
import { Course } from '@/types';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { selectCourseDuration, updateCourse, selectCourseXP, selectCourseInfo } from '@/redux/slices/courses';
import { useAuth } from '@/contexts/auth';
import { DraftSections } from './DraftSections';
import { useDraft } from '.';

const SKILL_LEVELS: { id: Course['skillLevel'], text: string }[] = [
    { id: 'beginner', text: 'Beginner' },
    { id: 'intermediate', text: 'Intermediate' },
    { id: 'advanced', text: 'Advanced' },
]
export const DraftOverview: React.FC<{
    draftId: string;
}> = ({ draftId }) => {
    const { patch } = useAuth();
    const { preview, setPreview } = useDraft();

    const dispatch = useAppDispatch();
    const course = useAppSelector(state => selectCourseInfo(state, draftId));
    const courseDuration = useAppSelector(state => selectCourseDuration(state, draftId));
    const courseXP = useAppSelector(state => selectCourseXP(state, draftId));

    const updateProperty = async (changes: Partial<Course>) => {
        if(!course) return;
        dispatch(updateCourse({ id: draftId, changes }));

        let hasChanges = false;
        for(const [property, value] of Object.entries(changes)) {
            if(course[property as keyof typeof course] !== value) {
                hasChanges = true;
            }
        }
        if(!hasChanges) return;

        patch<Course>(`/courses/${draftId}`, changes)
            .catch(() => {
                if(!course) return;

                // Going back to previous state on error
                dispatch(updateCourse({ id: draftId, changes: course }))
            })
    }

    return(
        <motion.div
            className="flex-1 grid gap-4"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            {!preview && (
                <div className="flex p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                    <Dropdown<Course['skillLevel']> 
                        active={course?.skillLevel || 'beginner'}
                        onSelect={skillLevel => updateProperty({ skillLevel })}
                        items={SKILL_LEVELS}
                        label={'Course skill level'}
                    />
                </div>
            )}
            
            <div className="grid gap-4 p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                <div className="flex gap-1 items-center">
                    <CourseChip>
                        {SKILL_LEVELS.find(level => level.id === course?.skillLevel)?.text}
                    </CourseChip>
                    <CourseChip
                        className={!courseDuration ? 'italic' : ''}
                    >
                        {courseDuration || 'Lecture durations not specified'}
                    </CourseChip>
                    <span className="text-xs mx-1">
                        •
                    </span>
                    <CourseChip 
                        type={'xp'}
                        className={!courseXP ? 'italic' : ''}
                    >
                        {courseXP ? `+${courseXP} XP` : 'Lecture XPs not specified'}
                    </CourseChip>
                </div>
                <div className="grid gap-1">
                    <EditableText 
                        className={`text-2xl ${course?.title ? 'font-bold' : ''}`}
                        onChange={title => updateProperty({ title })}
                        placeholder={'Course title not set'}
                        text={course?.title || ''}
                        disabled={preview}
                    />
                    <EditableText 
                        iconClassName="w-[13px]"
                        className="text-sm text-secondary"
                        onChange={description => updateProperty({ description })}
                        placeholder={'Course description not set'}
                        text={course?.description || ''}
                        disabled={preview}
                    />
                </div>
                <div className="flex gap-2">
                    {!preview ? (
                        <>
                        <Button 
                            onClick={() => setPreview(true)}
                            type={'secondary'} 
                            isSmall
                            key={'preview'}
                        >
                            Preview course
                        </Button>
                        <Button isSmall>
                            Publish course
                        </Button>
                        </>
                    ) : (
                        <Button isSmall>
                            Start course
                        </Button>
                    )}
                </div>
            </div>
            
            <DraftSections draftId={draftId} />
        </motion.div>
    )
}