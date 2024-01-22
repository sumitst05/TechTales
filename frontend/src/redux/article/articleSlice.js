import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentArticle: {
    title: "",
    content: "",
  },
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
      state.currentArticle = action.payload;
      state.loading = false;
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
    resetCurrentArticle: (state) => {
      state.currentArticle = initialState.currentArticle;
      state.loading = false;
      state.error = false;
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
  resetCurrentArticle,
} = articleSlice.actions;

export default articleSlice.reducer;
