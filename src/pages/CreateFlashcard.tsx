import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/FlashcardForm';
import { useFlashcardStore } from '../stores/flashcardStore';

const CreateFlashcard: React.FC = () => {
  const { createFlashcard, error } = useFlashcardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (front: string, back: string) => {
    setIsSubmitting(true);
    const result = await createFlashcard(front, back);
    setIsSubmitting(false);
    
    if (result) {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Flashcard</h1>
        <p className="text-gray-600 mt-1">Add a new flashcard to your collection</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      <div className="card">
        <FlashcardForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          buttonText="Create Flashcard"
        />
      </div>
    </div>
  );
};

export default CreateFlashcard;