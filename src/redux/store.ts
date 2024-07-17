import { configureStore } from '@reduxjs/toolkit';
import notesReducer from './notesSlice';
import tagsReducer from './tagsSlice';
import { loadState, saveState } from './localStorage';
import { RootState as PreloadedRootState } from '../types'; 


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

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
