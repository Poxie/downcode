"use client";

import React, { useState } from 'react';
import { DraftSidebar } from './DraftSidebar';
import { DraftOverview } from './DraftOverview';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DraftSection } from './DraftSection';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
type Course = {
    title: string;
    description: string;
    sections: Section[];
    skillLevel: SkillLevel;
}
type CourseWithoutSection = Omit<Course, 'sections'>;
type Section = {
    title: string;
    description: string;
    duration: {
        amount: number;
        identifier: 'minutes' | 'hours';
    };
    xp: number;
}

type Context = Course & {
    courseXP: number;
    courseDuration: number;
    updateCourse: (property: keyof CourseWithoutSection, value: CourseWithoutSection[keyof CourseWithoutSection]) => void;
    updateSection: (index: number, property: keyof Section, value: Section[keyof Section]) => void;
    addSection: () => void;
}
const DraftContext = React.createContext<Context | null>(null);

export const useDraft = () => {
    const context = React.useContext(DraftContext);
    if(!context) throw new Error('Draft context provider does not wrap components.');
    return context;
}

const getEmptySection: () => Section = () => ({
    title: '',
    description: '',
    duration: {
        amount: 0,
        identifier: 'minutes'
    },
    xp: 0,
})

export const Draft: React.FC<{
    draftId: string;
}> = ({ draftId }) => {
    const sectionIndex = useSearchParams().get('s');

    const [info, setInfo] = useState<Course>({
        title: '',
        description: '',
        sections: [ getEmptySection() ],
        skillLevel: 'beginner'
    });

    // Total course duration in seconds
    const courseDuration = info.sections.map(section => section.duration).reduce((partialSum, a) => (
        partialSum + (a.amount * (a.identifier === 'minutes' ? 60 : 60 * 60)
    )), 0);
    const courseXP = info.sections.map(section => section.xp).reduce((partialSum, a) => partialSum + a, 0);

    const updateCourse: Context['updateCourse'] = (property, value) => {
        setInfo(prev => ({
            ...prev,
            [property]: value
        }))
    }
    const updateSection: Context['updateSection'] = (index, property, value) => {
        setInfo(prev => ({
            ...prev,
            sections: prev.sections.map((section, key) => {
                if(key !== index) return section;
                return {
                    ...section,
                    [property]: value
                }
            })
        }))
    }
    const addSection = () => setInfo(prev => ({
        ...prev,
        sections: prev.sections.concat(getEmptySection())
    }))

    const value = {
        ...info,
        courseXP,
        courseDuration,
        updateCourse,
        updateSection,
        addSection,
    }
    return(
        <DraftContext.Provider value={value}>
            <DraftSidebar />
            
            <AnimatePresence mode='wait'>
                {sectionIndex && (
                    <DraftSection 
                        sectionIndex={Number(sectionIndex)}
                        key={`section-${sectionIndex}`}
                    />
                )}
                {!sectionIndex && (
                    <DraftOverview key={'overview'} />
                )}
            </AnimatePresence>
        </DraftContext.Provider>
    )
}