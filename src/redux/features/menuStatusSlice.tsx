import { createSlice } from "@reduxjs/toolkit";

type MenuState = {
  value: number;
};
const initialState = {
  value: 0,
} as MenuState;
export const menuSlice = createSlice({
  name: "menuState",
  initialState,
  reducers: {
    setIcon: (state) => {
      state.value = 1;
    },
    setDefault: (state) => {
      state.value = 0;
    },
    toggle: (state) => {
      if (state.value == 0) state.value = 2;
      else if (state.value == 1) state.value = 2;
      else state.value = 0;
    },
    hidden: (state) => {
      state.value = 0;
    },
  },
});

export const { setIcon, setDefault, toggle, hidden } = menuSlice.actions;
export const selectMenu = (state: any) => state.menuState.value;
export default menuSlice.reducer;
