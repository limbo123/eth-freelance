import { createSlice } from "@reduxjs/toolkit";
import IUser from "../../models/user";
import { loginUser, registerUser } from "./authActions";

interface IState {
  user: IUser | undefined;
  loading: boolean;
  registerError: string;
  loginError: string;
  isAuthModalOpened: boolean
}

const initialState: IState = {
  user: {} as IUser,
  loading: false,
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

export const { setUser, openAuthModal, closeAuthModal, logout } = userSlice.actions;

export default userSlice.reducer;
