import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlashcardForm from '../components/FlashcardForm';
import { useFlashcardStore } from '../stores/flashcardStore';
import { ArrowLeft } from 'lucide-react';

const EditFlashcard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { flashcards, fetchFlashcards, updateFlashcard, error } = useFlashcardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  const flashcard = flashcards.find(card => card.id === id);

  useEffect(() => {
    const loadData = async () => {
      await fetchFlashcards();
      if (!flashcards.some(card => card.id === id)) {
        setNotFound(true);
      }
    };
    
    if (flashcards.length === 0) {
      loadData();
    } else if (!flashcard) {
      setNotFound(true);
    }
  }, [id, flashcards, fetchFlashcards, flashcard]);

  const handleSubmit = async (front: string, back: string) => {
    if (!id) return;
    
    setIsSubmitting(true);
    await updateFlashcard(id, front, back);
    setIsSubmitting(false);
    
    navigate('/dashboard');
  };

  if (notFound) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700">Flashcard not found</h2>
        <p className="text-gray-500 mt-2">The flashcard you're trying to edit doesn't exist.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="btn-primary mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit Flashcard</h1>
        <p className="text-gray-600 mt-1">Update your flashcard</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {flashcard ? (
        <div className="card">
          <FlashcardForm
            initialFront={flashcard.front}
            initialBack={flashcard.back}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            buttonText="Save Changes"
          />
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading flashcard...</p>
        </div>
      )}
    </div>
  );
};

export default EditFlashcard;