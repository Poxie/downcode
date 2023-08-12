import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { Course, Section, User } from "@/types";

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
        },
        addSection: (state, action: PayloadAction<Section>) => {
            const course = state.find(course => course.id === action.payload.courseId);
            if(!course) return;

            course.sections.push(action.payload);
        },
        updateSection: (state, action: PayloadAction<{ courseId: string, sectionId: string, changes: Partial<Section> }>) => {
            const course = state.find(course => course.id === action.payload.courseId);
            const section = course?.sections?.find(section => section.id === action.payload.sectionId);
            if(!section) return;

            for(const [property, value] of Object.entries(action.payload.changes)) {
                (section as Record<string, Section[keyof Section]>)[property] = value;
            }
        }
    }
})

// Actions & reducer
export const { addCourses, updateCourse, addSection, updateSection } = coursesSlice.actions;
export default coursesSlice.reducer;

// Selectors
const selectId = (_:RootState, id: string) => id;
const _selectId = (_:RootState, __: string, id: string) => id;

export const selectCourses = (state: RootState) => state.courses;
export const selectDrafts = (state: RootState) => state.courses.filter(course => course.type === 'draft');
export const selectDraftIds = createSelector(
    [selectDrafts],
    drafts => drafts.map(draft => draft.id)
)
export const selectCourseById = createSelector(
    [selectCourses, selectId],
    (courses, courseId) => courses.find(course => course.id === courseId)
)
export const selectCourseInfo = createSelector(
    [selectCourseById],
    course => (course ? {
        id: course.id,
        title: course.title,
        description: course.description,
        status: course.status,
        type: course.type,
        skillLevel: course.skillLevel,
        createdAt: course.createdAt,
        publishedAt: course.publishedAt,
    } : undefined)
)
export const selectCourseDuration = createSelector(
    [selectCourseById],
    course => 3600
)
export const selectCourseXP = createSelector(
    [selectCourseById],
    course => 250
)

export const selectCourseSectionIds = createSelector(
    [selectCourseById],
    course => course?.sections?.map(section => section.id)
)
export const selectSectionById = createSelector(
    [selectCourseById, _selectId],
    (course, sectionId) => {
        const section = course?.sections?.find(section => section.id === sectionId);
        return section;
    }
)