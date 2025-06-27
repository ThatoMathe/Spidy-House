import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BotmanWidget from './BotmanWidget';
import { useSettings } from '../context/SettingsContext';

const Assistance = () => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function generateDescription(title) {
      try {
        // Sending POST request with title as JSON
        const response = await axios.post('/api/google-ai', {
          title: title
        });
        // The response message will be inside the response.data.message
        return response.data.message;
      } catch (error) {
        console.error('Error generating description:', error);
        setError('Failed to generate description.');
        return null;
      }
    }

    generateDescription('hello').then((desc) => {
      if (desc) {
        setDescription(desc);
      }
    });
  }, []);

  return (
    <>
    
    <div className="container mt-5">
      <h1>AI Assistance</h1>
      {error && <p className="text-danger">{error}</p>}
      {description ? (
        <p><strong>Generated Description:</strong> {description}</p>
      ) : (
        <p>Loading description...</p>
      )}
    </div></>
  );
};

export default Assistance;
