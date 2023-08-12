import { useAuth } from "@/contexts/auth";
import { addCourses, selectDraftIds } from "@/redux/slices/courses"
import { useAppDispatch, useAppSelector } from "@/redux/store"
import { Course as CourseType } from "@/types";
import { useEffect, useState } from "react";
import { Course } from "./Course";
import { useParams } from "next/navigation";

const PLACEHOLDER_COUNT = 2;
export const Drafts = () => {
    const { get, loading: loadingAuth } = useAuth();
    const userId = useParams().userId as string;

    const dispatch = useAppDispatch()
    const draftIds = useAppSelector(selectDraftIds);

    const [loading, setLoading] = useState(draftIds.length === 0);

    useEffect(() => {
        if(loadingAuth || draftIds.length) return;

        get<CourseType[]>(`/users/${userId}/courses?type=draft`)
            .then(courses => {
                dispatch(addCourses(courses));
                setLoading(false);
            })
    }, [userId, draftIds.length, loadingAuth]);

    return(
        <>
            {loading && (
                Array.from(Array(PLACEHOLDER_COUNT)).map((_,key) => (
                    <div
                        className="h-[131px] bg-tertiary border-[1px] border-quaternary rounded-lg mb-2" 
                        key={key}
                    />
                ))
            )}
            {!loading && (
                draftIds.map(draftId => (
                    <Course 
                        draftId={draftId}
                        key={draftId}
                    />
                ))
            )}
        </>
    )
}