import { IUser } from '@/utils/constants';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface UserState {
	user: IUser;
	isLoggedIn: boolean;
	isFirstUsed: boolean;
}

const initialState: UserState = {
	user: {
		id: '',
		email: '',
		role: '',
		jwt: {
			token: '',
			refreshToken: '',
			expired: new Date(),
		},
	},
	isLoggedIn: false,
	isFirstUsed: true,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<IUser>) => {
			state.user = action.payload;
			state.isLoggedIn = true;
		},
		logout: (state) => {
			state.user = initialState.user;
			state.isLoggedIn = false;
		},
		initData: (state, action: PayloadAction<UserState>) => {
			state.user = action.payload.user;
			state.isLoggedIn = action.payload.isLoggedIn;
			state.isFirstUsed = action.payload.isFirstUsed;
		},
	},
});

export const { login, logout, initData } = userSlice.actions;

export default userSlice.reducer;
