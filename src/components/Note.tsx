import React from 'react';
import { Note } from '../types';

interface NoteComponentProps {
    note: Note;
}

const NoteComponent: React.FC<NoteComponentProps> = ({ note }) => {
    return (
        <div>
            <div className="note-title">{note.title}</div>
            <div>{note.text}</div>
            <div className="note-date">{note.created}</div>
        </div>
    );
};

export default NoteComponent;
