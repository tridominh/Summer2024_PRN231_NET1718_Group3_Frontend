import React, { useState } from 'react';
import FeedbackForm from './FeedbackForm';

const FeedbackItem = ({ feedback, onUpdateFeedback, onDeleteFeedback }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    return (
        <li>
            {isEditing ? (
                <FeedbackForm 
                    currentFeedback={feedback} 
                    onUpdateFeedback={(updatedFeedback) => {
                        onUpdateFeedback(updatedFeedback);
                        setIsEditing(false);
                    }}
                />
            ) : (
                <>
                    <span>{feedback.content}</span>
                    <button onClick={handleEditClick}>Edit</button>
                    <button onClick={() => onDeleteFeedback(feedback.id)}>Delete</button>
                </>
            )}
            {isEditing && <button onClick={handleCancelEdit}>Cancel</button>}
        </li>
    );
};

export default FeedbackItem;
