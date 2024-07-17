import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tag } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: Tag[] = [];

const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    addTag: (state, action: PayloadAction<string>) => {
      state.push({ id: uuidv4(), name: action.payload, count: 0 });
    },
    renameTag: (state, action: PayloadAction<{ id: string; name: string }>) => {
      const tag = state.find(tag => tag.id === action.payload.id);
      if (tag) {
        tag.name = action.payload.name;
      }
    },
    deleteTag: (state, action: PayloadAction<string>) => {
      const index = state.findIndex(tag => tag.id === action.payload);
      if (index !== -1 && state[index].count === 0) {
        state.splice(index, 1);
      }
    },
    incrementTagCount: (state, action: PayloadAction<string>) => {
      const tag = state.find(tag => tag.id === action.payload);
      if (tag) {
        tag.count += 1;
      }
    },
    decrementTagCount: (state, action: PayloadAction<string>) => {
      const tag = state.find(tag => tag.id === action.payload);
      if (tag) {
        tag.count -= 1;
      }
    },
  },
});

export const { addTag, renameTag, deleteTag, incrementTagCount, decrementTagCount } = tagsSlice.actions;
export default tagsSlice.reducer;
