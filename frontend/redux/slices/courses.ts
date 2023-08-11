import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { Course, User } from "@/types";

export type CoursesState = Course[];

const coursesSlice = createSlice({
    name: 'courses',
    initialState: [] as CoursesState,
    reducers: {
        addCourses: (state, action: PayloadAction<Course[]>) => {
            const stateCourseIds = state.map(course => course.id);
            const courses = action.payload.filter(course => !stateCourseIds.includes(course.id));

            state.push(...courses);
        },
        updateCourse: (state, action: PayloadAction<{ id: string, changes: Partial<Course> }>) => {
            const course = state.find(course => course.id === action.payload.id);
            if(!course) return;
            
            for(const [property, value] of Object.entries(action.payload.changes)) {
                (course as Record<string, Course[keyof Course]>)[property] = value;
            }
        }
    }
})

// Actions & reducer
export const { addCourses, updateCourse } = coursesSlice.actions;
export default coursesSlice.reducer;

// Selectors
const selectId = (_:RootState, id: string) => id;

export const selectCourses = (state: RootState) => state.courses;
export const selectDrafts = (state: RootState) => state.courses.filter(course => course.type === 'draft');
export const selectCourseById = createSelector(
    [selectCourses, selectId],
    (courses, courseId) => {
        const course = courses.find(course => course.id === courseId);
        if(!course) return;

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            skillLevel: course.skillLevel,
        }
    }
)
export const selectCourseDuration = createSelector(
    [selectCourseById],
    course => 3600
)
export const selectCourseXP = createSelector(
    [selectCourseById],
    course => 250
)