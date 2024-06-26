import React, { useState } from 'react';

const FeedbackForm = ({ onAddFeedback, onUpdateFeedback, currentFeedback }) => {
    const [feedback, setFeedback] = useState(currentFeedback || { id: 0, content: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFeedback({ ...feedback, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (feedback.id === 0) {
            onAddFeedback(feedback);
        } else {
            onUpdateFeedback(feedback);
        }
        setFeedback({ id: 0, content: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                name="content" 
                value={feedback.content} 
                onChange={handleChange} 
                placeholder="Enter feedback" 
                required 
            />
            <button type="submit">{feedback.id === 0 ? 'Add Feedback' : 'Update Feedback'}</button>
        </form>
    );
};

export default FeedbackForm;
