"use client";

import React, { useEffect, useRef, useState } from 'react';
import { DraftSidebar } from './DraftSidebar';
import { DraftOverview } from './DraftOverview';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { DraftSection } from './DraftSection';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addCourses, selectCourseById } from '@/redux/slices/courses';
import { Course } from '@/types';
import { useAuth } from '@/contexts/auth';

export const Draft = () => {
    const { get, post, loading } = useAuth();
    const router = useRouter();

    const draftId = useParams().draftId as string;
    const draft = useAppSelector(state => selectCourseById(state, draftId));
    const sectionId = useSearchParams().get('s');
    
    const dispatch = useAppDispatch();

    useEffect(() => {
        if(loading || draftId !== 'new') return;

        post<Course>(`/users/me/courses`)
            .then(course => {
                dispatch(addCourses([course]));
                router.replace(`/u/me/courses/drafts/${course.id}`);
            })
    }, [post, loading, draftId]);

    useEffect(() => {
        if(draftId === 'new' || loading || draft) return;

        get<Course[]>('/users/me/courses?type=draft')
            .then(courses => {
                dispatch(addCourses(courses));
            })
    }, [draftId, get, loading, draft]);

    if(draftId === 'new') return null;

    return(
        <>
            <DraftSidebar />
            
            <AnimatePresence mode='wait'>
                {sectionId && (
                    <DraftSection 
                        draftId={draftId}
                        sectionId={sectionId}
                        key={`section-${sectionId}`}
                    />
                )}
                {!sectionId && (               
                    <motion.div 
                        className="flex-1 grid gap-4"
                        exit={{ scale: .98, opacity: 0 }}
                        initial={{ scale: .98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: .15 }}
                        key={'overview'}
                    >
                        <DraftOverview />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}