import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from './redux/store';
import { addNote, deleteNote, updateNote, removeTagFromNotes } from './redux/notesSlice';
import { addTag, renameTag, deleteTag, incrementTagCount, decrementTagCount } from './redux/tagsSlice';
import NoteComponent from './components/Note';
import TagComponent from './components/Tag';
import { Note, Tag } from './types';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const App: React.FC = () => {
  const notes = useSelector((state: RootState) => state.notes);
  const tags = useSelector((state: RootState) => state.tags);
  const dispatch = useDispatch<AppDispatch>();

  const [noteText, setNoteText] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteTag, setNoteTag] = useState<string | null>(null);
  const [tagText, setTagText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tagSearchTerm, setTagSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  const handleAddNote = () => {
    dispatch(addNote({
      text: noteText,
      tagId: noteTag,
      title: noteTitle,
    }));
    if (noteTag) {
      dispatch(incrementTagCount(noteTag));
    }
    setNoteText('');
    setNoteTitle('');
    setNoteTag(null);
    setIsNoteModalOpen(false);
  };

  const handleAddTag = () => {
    dispatch(addTag(tagText));
    setTagText('');
    setIsTagModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    const note = notes.find(note => note.id === id);
    if (note && note.tagId) {
      dispatch(decrementTagCount(note.tagId));
    }
    dispatch(deleteNote(id));
  };

  const handleDeleteTag = (id: string) => {
    const tag = tags.find(tag => tag.id === id);
    if (tag && tag.count === 0) {
      dispatch(deleteTag(id));
      dispatch(removeTagFromNotes(id));
    } else {
      alert("Can't delete tag with associated notes.");
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setNoteText(note.text);
    setNoteTitle(note.title || '');
    setNoteTag(note.tagId);
    setIsNoteModalOpen(true);
  };

  const handleEditTag = (tag: Tag) => {
    setEditingTag(tag);
    setTagText(tag.name);
    setIsTagModalOpen(true);
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      dispatch(updateNote({
        id: editingNote.id,
        text: noteText,
        tagId: noteTag,
        title: noteTitle,
      }));
      if (editingNote.tagId && editingNote.tagId !== noteTag) {
        dispatch(decrementTagCount(editingNote.tagId));
      }
      if (noteTag && editingNote.tagId !== noteTag) {
        dispatch(incrementTagCount(noteTag));
      }
      setEditingNote(null);
      setIsNoteModalOpen(false);
      setNoteText('');
      setNoteTitle('');
      setNoteTag(null);
    }
  };

  const handleUpdateTag = () => {
    if (editingTag) {
      dispatch(renameTag({
        id: editingTag.id,
        name: tagText,
      }));
      setEditingTag(null);
      setIsTagModalOpen(false);
      setTagText('');
    }
  };

  const filteredNotes = notes.filter((note: Note) =>
      note.text.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTag === null || note.tagId === selectedTag)
  );

  const filteredTags = tags.filter((tag: Tag) =>
      tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase())
  );

  return (
      <div className="container">
        <div className="notes-container">
          <h2>
            Notes ({notes.length})
            <button className="add-btn" onClick={() => setIsNoteModalOpen(true)}>+</button>
          </h2>
          <input
              type="text"
              placeholder="Search by the keyword"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
          />
          <select onChange={(e) => setSelectedTag(e.target.value || null)} value={selectedTag || ''}>
            <option value="">Select tag</option>
            {tags.map((tag: Tag) => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          {filteredNotes.map((note: Note) => (
              <div key={note.id} className="note">
                <NoteComponent note={note} />
                <div className="actions">
                  <button onClick={() => handleEditNote(note)}>edit</button>
                  <button onClick={() => handleDeleteNote(note.id)}>delete</button>
                </div>
              </div>
          ))}
        </div>
        <div className="tags-container">
          <h2>
            Tags ({tags.length})
            <button className="add-btn" onClick={() => setIsTagModalOpen(true)}>+</button>
          </h2>
          <input
              type="text"
              placeholder="Search by the keyword"
              value={tagSearchTerm}
              onChange={e => setTagSearchTerm(e.target.value)}
          />
          {filteredTags.map((tag: Tag) => (
              <div key={tag.id} className="tag">
                <TagComponent tag={tag} />
                <div className="tag-count">({tag.count})</div>
                <div className='buttons-tag'>
                  <button className="edit-btn" onClick={() => handleEditTag(tag)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteTag(tag.id)}>Delete</button>
                </div>
              </div>
          ))}
        </div>

        {/* Note Modal */}
        <Modal
            isOpen={isNoteModalOpen}
            onRequestClose={() => setIsNoteModalOpen(false)}
            contentLabel="Add/Edit Note"
            className="modal-content"
        >
          <h2>{editingNote ? 'Edit' : 'Add'} Note</h2>
          <select value={noteTag || ''} onChange={e => setNoteTag(e.target.value || null)}>
            <option value="">Select a tag</option>
            {tags.map((tag: Tag) => (
                <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <input
              type="text"
              placeholder="Title"
              value={noteTitle}
              onChange={e => setNoteTitle(e.target.value)}
          />
          <textarea
              placeholder="Type here text to note"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
          />
          <div className="modal-footer">
            <button onClick={() => setIsNoteModalOpen(false)}>Cancel</button>
            <button onClick={editingNote ? handleUpdateNote : handleAddNote}>OK</button>
          </div>
        </Modal>

        {/* Tag Modal */}
        <Modal
            isOpen={isTagModalOpen}
            onRequestClose={() => setIsTagModalOpen(false)}
            contentLabel="Add/Edit Tag"
            className="modal-content"
        >
          <h2>{editingTag ? 'Edit' : 'Add'} Tag</h2>
          <input
              type="text"
              placeholder="Tag Name"
              value={tagText}
              onChange={e => setTagText(e.target.value)}
          />
          <div className="modal-footer">
            <button onClick={() => setIsTagModalOpen(false)}>Cancel</button>
            <button onClick={editingTag ? handleUpdateTag : handleAddTag}>OK</button>
          </div>
        </Modal>
      </div>
  );
};

export default App;
