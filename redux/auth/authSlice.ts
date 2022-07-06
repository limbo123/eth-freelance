import { IDeveloper, IEmployer } from './../../models/user';
import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "./authActions";

type IUser = IDeveloper | IEmployer;

interface IState {
  user: IUser;
  loading: boolean;
  registerError: string;
  loginError: string;
  isAuthModalOpened: boolean,
  startLoading: boolean
}

const initialState: IState = {
  user: {} as IUser,
  loading: false,
  startLoading: true,
  registerError: "",
  loginError: "",
  isAuthModalOpened: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    openAuthModal: (state) => {
      state.isAuthModalOpened = true;
    },

    closeAuthModal: (state) => {
      state.isAuthModalOpened = false;
      state.registerError = "";
      state.loginError = "";
    },

    logout: (state) => {
      state.user = {} as IUser;
    },

    setStartLoading: (state, action) => {
      state.startLoading = action.payload;
      // console.log("loader off");
    }
  },
  extraReducers: (builder) => {
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.meta.arg;
      document.cookie = `user=${JSON.stringify({ username: action.meta.arg.username, type: action.meta.arg.type })}; path=/`
      state.loading = false; 
      state.isAuthModalOpened = false;
    });
    builder.addCase(registerUser.pending, (state) => {
      state.registerError = "";
      state.loading = true;
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.registerError = action.payload as string;
      state.loading = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      document.cookie = `user=${JSON.stringify({username: action.payload.username, type: action.payload.type})}; path=/`
      state.loading = false;
      state.isAuthModalOpened = false;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.loginError = "";
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loginError = action.payload as string;
      state.loading = false;
    });
  },
});

export const { setStartLoading, setUser, openAuthModal, closeAuthModal, logout } = userSlice.actions;

export default userSlice.reducer;
