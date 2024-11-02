import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profileUrl: "",
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileUrl: (state, action) => {
      state.profileUrl = action.payload;
    },
  },
});

export const { setProfileUrl } = profileSlice.actions;

export default profileSlice.reducer;
