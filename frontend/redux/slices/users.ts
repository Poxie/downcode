import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store";
import { User } from "@/types";

export type UsersState = User[];

const usersSlice = createSlice({
    name: 'dashboard',
    initialState: [] as UsersState,
    reducers: {
        addUsers: (state, action: PayloadAction<User[]>) => {
            const stateUserIds = state.map(user => user.id);
            const users = action.payload.filter(user => !stateUserIds.includes(user.id));

            state.push(...users);
        },
        updateUser: (state, action: PayloadAction<{ id: string, changes: Partial<User> }>) => {
            const user = state.find(user => user.id === action.payload.id);
            if(!user) return;
            
            for(const [property, value] of Object.entries(action.payload.changes)) {
                (user as Record<string, User[keyof User]>)[property] = value;
            }
        }
    }
})

// Actions & reducer
export const { addUsers, updateUser } = usersSlice.actions;
export default usersSlice.reducer;

// Selectors
const selectId = (_:RootState, id: string) => id;

export const selectSelf = (state: RootState) => state.users.find(user => user.isSelf);