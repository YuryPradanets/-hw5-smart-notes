import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import tagsReducer from './tagsSlice';
import { loadState, saveState } from './localStorage';
import { RootState as PreloadedRootState } from '../types';  // Rename imported RootState to PreloadedRootState

// Load the state from localStorage and type it correctly
const preloadedState: PreloadedRootState | undefined = loadState();

const store = configureStore({
    reducer: {
        notes: notesReducer,
        tags: tagsReducer,
    },
    preloadedState,
});

store.subscribe(() => {
    saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;  // This is the local RootState declaration
export type AppDispatch = typeof store.dispatch;

export default store;
