import React, { useEffect, useState } from 'react'; 
import FeedbackItem from './FeedbackItem'; 
import FeedbackForm from './FeedbackForm'; 
import { GetAllFeedbacks, AddFeedback, UpdateFeedback, DeleteFeedback } from '../../services/ApiServices/FeedbackService';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const feedbackList = await GetAllFeedbacks();
            setFeedbacks(feedbackList);
        } catch (error) {
            console.error("There was an error fetching the feedbacks!", error);
        }
    };

    const handleAddFeedback = async (feedback) => {
        try {
            const newFeedback = await AddFeedback(feedback);
            setFeedbacks([...feedbacks, newFeedback]);
        } catch (error) {
            console.error("There was an error adding the feedback!", error);
        }
    };

    const handleUpdateFeedback = async (feedback) => {
        try {
            const updatedFeedback = await UpdateFeedback(feedback);
            const updatedFeedbacks = feedbacks.map((fb) => 
                fb.id === feedback.id ? updatedFeedback : fb
            );
            setFeedbacks(updatedFeedbacks);
        } catch (error) {
            console.error("There was an error updating the feedback!", error);
        }
    };

    const handleDeleteFeedback = async (id) => {
        try {
            await DeleteFeedback(id);
            setFeedbacks(feedbacks.filter((fb) => fb.id !== id));
        } catch (error) {
            console.error("There was an error deleting the feedback!", error);
        }
    };

    return (
        <div style={{ 
            maxWidth: '600px', 
            margin: 'auto', 
            padding: '20px', 
            border: '1px solid #ccc', 
            borderRadius: '5px', 
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' 
        }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Feedback List</h2>
            <FeedbackForm onAddFeedback={handleAddFeedback} />
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {feedbacks.map((feedback) => (
                    <li key={feedback.id} style={{ 
                        marginBottom: '10px', 
                        padding: '10px', 
                        backgroundColor: '#f9f9f9', 
                        border: '1px solid #ddd', 
                        borderRadius: '5px' 
                    }}>
                        <FeedbackItem 
                            feedback={feedback} 
                            onUpdateFeedback={handleUpdateFeedback} 
                            onDeleteFeedback={handleDeleteFeedback} 
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FeedbackList;
