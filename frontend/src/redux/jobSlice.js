import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    searchJobByText: "",
    allAppliedJobs: [],
    searchedQuery: "",
    savedJobs: [] // ✅ Added savedJobs array
  },
  reducers: {
    // Actions
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },

    // ✅ New actions for saved jobs
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload; // set all saved job IDs
    },
    addSavedJob: (state, action) => {
      if (!state.savedJobs.includes(action.payload)) {
        state.savedJobs.push(action.payload);
      }
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(id => id !== action.payload);
    }
  }
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
  setSavedJobs,       // ✅ New
  addSavedJob,        // ✅ New
  removeSavedJob      // ✅ New
} = jobSlice.actions;

export default jobSlice.reducer;
