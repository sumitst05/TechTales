import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentArticle: null,
  loading: false,
  error: false,
};

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {
    createArticleStart: (state) => {
      state.loading = true;
    },
    createArticleSuccess: (state, action) => {
      state.loading = false;
      state.currentArticle = action.payload;
      state.error = false;
    },
    createArticleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateArticleStart: (state) => {
      state.loading = true;
    },
    updateArticleSuccess: (state, action) => {
      state.currentArticle = action.payload;
      state.loading = false;
      state.error = false;
    },
    updateArticleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteArticleStart: (state) => {
      state.loading = true;
    },
    deleteArticleSuccess: (state) => {
      state.currentArticle = null;
      state.loading = false;
      state.error = false;
    },
    deleteArticleFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  createArticleStart,
  createArticleSuccess,
  createArticleFailure,
  updateArticleStart,
  updateArticleSuccess,
  updateArticleFailure,
  deleteArticleStart,
  deleteArticleSuccess,
  deleteArticleFailure,
} = articleSlice.actions;

export default articleSlice.reducer;
