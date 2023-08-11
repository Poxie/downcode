"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Dropdown } from "@/components/dropdown";
import { CourseChip } from "../CourseChip";
import { Button } from "@/components/button";
import { AddIcon } from "@/assets/icons/AddIcon";
import { SkillLevel, useDraft } from "./Draft";
import { EditIcon } from '@/assets/icons/EditIcon';
import { EditableText } from './EditableText';

const SKILL_LEVELS: { id: SkillLevel, text: string }[] = [
    { id: 'beginner', text: 'Beginner' },
    { id: 'intermediate', text: 'Intermediate' },
    { id: 'advanced', text: 'Advanced' },
]
export const DraftOverview = () => {
    const { title, description, skillLevel, courseDuration, courseXP, sections, updateCourse, addSection } = useDraft();

    const durationInHours = ((courseDuration / 60) / 60).toFixed(1).replace('.0', '');
    const durationString = Number(durationInHours) < 1 ? `${courseDuration / 60} minutes` : `${durationInHours} hours`;
    return(
        <motion.div 
            className="flex-1 grid gap-4"
            exit={{ scale: .98, opacity: 0 }}
            initial={{ scale: .98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: .15 }}
        >
            <div className="p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                <Dropdown<typeof skillLevel> 
                    active={skillLevel}
                    onSelect={id => updateCourse('skillLevel', id)}
                    items={SKILL_LEVELS}
                    label={'Course skill level'}
                />
            </div>
            
            <div className="grid gap-4 p-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                <div className="flex gap-1 items-center">
                    <CourseChip>
                        {SKILL_LEVELS.find(level => level.id === skillLevel)?.text}
                    </CourseChip>
                    <CourseChip
                        className={!courseDuration ? 'italic' : ''}
                    >
                        {courseDuration ? durationString : 'Lecture durations not specified'}
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
                        className={`text-2xl ${title ? 'font-bold' : ''}`}
                        onChange={text => updateCourse('title', text)}
                        placeholder={'Course title not set'}
                        text={title}
                    />
                    <EditableText 
                        iconClassName="w-[13px]"
                        className="text-sm text-secondary"
                        onChange={text => updateCourse('description', text)}
                        placeholder={'Course description not set'}
                        text={description}
                    />
                </div>
                <div className="flex gap-2">
                    <Button type={'secondary'} isSmall>
                        Preview course
                    </Button>
                    <Button isSmall>
                        Publish course
                    </Button>
                </div>
            </div>
            
            <div>
                <span className="block text-xs text-secondary mb-2">
                    Course content
                </span>
                {sections.map((section, index) => (
                    <React.Fragment key={index}>
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
                                        <CourseChip className={!section.duration.amount ? 'italic' : ''}>
                                            {section.duration.amount ? `${section.duration.amount} ${section.duration.identifier}` : 'Lecture duration not set'}
                                        </CourseChip>
                                        <CourseChip 
                                            type={'xp'}
                                            className={!section.xp ? 'italic' : ''}
                                        >
                                            {section.xp ? `+${section.xp} XP` : 'Lecture XP not set'}
                                        </CourseChip>
                                    </div>
                                    <Button 
                                        href={`/u/me/courses/drafts/new?s=${index}`}
                                        className="-m-2"
                                        isSmall
                                    >
                                        Edit lecture
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="relative my-2 w-[95px] h-[28px] after:absolute after:h-[12px] after:w-[2px] after:top-0 after:left-2/4 after:-translate-x-2/4 after:bg-tertiary after:rounded-lg before:absolute before:h-[12px] before:w-[2px] before:bottom-0 before:left-2/4 before:-translate-x-2/4 before:bg-tertiary before:rounded-lg" />
                    </React.Fragment>
                ))}
                <button 
                    className="h-[120px] w-full text-xs text-secondary flex gap-2 justify-center items-center transition-colors hover:bg-secondary border-[1px] border-tertiary rounded-lg"
                    onClick={addSection}
                >
                    <AddIcon className="w-4" />
                    <span>
                        Add another lecture
                    </span>
                </button>
            </div>
        </motion.div>
    )
}