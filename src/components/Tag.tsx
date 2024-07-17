import React from 'react';
import { Tag } from '../types';

interface TagComponentProps {
    tag: Tag;
}

const TagComponent: React.FC<TagComponentProps> = ({ tag }) => {
    return (
        <div>
            {tag.name}
        </div>
    );
};

export default TagComponent;
