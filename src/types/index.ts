export interface Note {
    id: string;
    tagId: string | null;
    title: string | null;
    text: string;
    created: string;  
    updated: string;  
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
