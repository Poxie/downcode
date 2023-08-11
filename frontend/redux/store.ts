import { $CombinedState, AnyAction, combineReducers, configureStore as _configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import usersReducer, { UsersState } from './slices/users';
import coursesReducer, { CoursesState } from './slices/courses';

const combinedReducers = combineReducers({
    users: usersReducer,
    courses: coursesReducer,
});

const reducer = (state: ReturnType<typeof combinedReducers>, action: AnyAction) => {
    if(action.type === HYDRATE) {
        const nextState = {
            ...state,
            ...(action.payload as typeof state)
        }
        return nextState;
    }
    return combinedReducers(state, action) as typeof state;
}

function configureStore() {
    const store = _configureStore({
        reducer: reducer as any,
        devTools: true,
    })

    return store;
}
export const store = configureStore();
export const wrapper = createWrapper(() => store);

// Types based on store
export type RootState = {
    readonly [$CombinedState]?: undefined;
} & {
    users: UsersState;
    courses: CoursesState;
}

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ReturnType<typeof configureStore>['dispatch'];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
type DispatchFunc = () => AppDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;