import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note } from '../types';
import { v4 as uuidv4 } from 'uuid';

const initialState: Note[] = [];

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        addNote: (state, action: PayloadAction<{ text: string; tagId: string | null; title: string }>) => {
            const newNote: Note = {
                id: uuidv4(),
                tagId: action.payload.tagId,
                title: action.payload.title,
                text: action.payload.text,
                created: new Date().toISOString(),
                updated: new Date().toISOString(),
            };
            state.push(newNote);
        },
        deleteNote: (state, action: PayloadAction<string>) => {
            return state.filter(note => note.id !== action.payload);
        },
        updateNote: (state, action: PayloadAction<{ id: string; text: string; tagId: string | null; title: string }>) => {
            const note = state.find(note => note.id === action.payload.id);
            if (note) {
                note.text = action.payload.text;
                note.tagId = action.payload.tagId;
                note.title = action.payload.title;
                note.updated = new Date().toISOString();
            }
        },
        removeTagFromNotes: (state, action: PayloadAction<string>) => {
            state.forEach(note => {
                if (note.tagId === action.payload) {
                    note.tagId = null;
                }
            });
        },
    },
});

export const { addNote, deleteNote, updateNote, removeTagFromNotes } = notesSlice.actions;
export default notesSlice.reducer;
