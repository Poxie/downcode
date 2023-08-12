import React, { useEffect, useRef, useState } from 'react';
import { DraftSidebar } from './DraftSidebar';
import { DraftOverview } from './DraftOverview';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { DraftSection } from './DraftSection';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { addCourses, selectCourseById } from '@/redux/slices/courses';
import { Course } from '@/types';
import { useAuth } from '@/contexts/auth';

const DraftContext = React.createContext({} as {
    preview: boolean;
    setPreview: (preview: boolean) => void;
});
export const useDraft = () => React.useContext(DraftContext)

export const Draft = () => {
    const { get, post, loading } = useAuth();
    const router = useRouter();

    const draftId = useParams().draftId as string;
    const draft = useAppSelector(state => selectCourseById(state, draftId));
    const sectionId = useSearchParams().get('s');
    
    const dispatch = useAppDispatch();

    const [preview, setPreview] = useState(false);

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
        <DraftContext.Provider value={{ preview, setPreview }}>
            <main className="w-main max-w-main mx-auto min-h-[calc(100dvh-200px)]">
                {preview && (
                    <div className="flex items-center justify-between p-4 mb-4 bg-secondary border-[1px] border-tertiary rounded-lg">
                        <span className="text-xs text-secondary">
                            You are currently in preview mode.
                        </span>
                        <button
                            onClick={() => setPreview(false)} 
                            className="text-xs px-2.5 py-2 -m-2 transition-colors text-secondary hover:text-primary hover:bg-tertiary rounded-lg"
                        >
                            Exit preview mode
                        </button>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-start">
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
                            <DraftOverview 
                                draftId={draftId}
                                key={'overview'}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </DraftContext.Provider>
    )
}