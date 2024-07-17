export interface Note {
    id: string;
    tagId: string | null;
    title: string | null;
    text: string;
    created: string;  // Changed to string for serialization
    updated: string;  // Changed to string for serialization
}

export interface Tag {
    id: string;
    name: string;
    count: number;
}

export interface RootState {
    notes: Note[];
    tags: Tag[];
}
