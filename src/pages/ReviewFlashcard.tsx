import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import FlashcardReviewer from '../components/FlashcardReviewer';
import { Flashcard } from '../types';
import { ArrowLeft, Dices } from 'lucide-react';

const ReviewFlashcard: React.FC = () => {
  const { fetchDueFlashcards, reviewFlashcard, loading, error, fetchFlashcards, flashcards: allFlashcards } = useFlashcardStore();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadFlashcards = async () => {
      const dueCards = await fetchDueFlashcards();
      setFlashcards(dueCards);
      if (dueCards.length === 0) {
        setIsReviewComplete(true);
      }
    };
    
    loadFlashcards();
  }, [fetchDueFlashcards]);

  const handleReview = async (id: string, known: boolean) => {
    await reviewFlashcard(id, known);
  };

  const handleComplete = () => {
    setIsReviewComplete(true);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleReviewRandom = async () => {
    try {
      // Fetch all flashcards
      await fetchFlashcards();
      
      if (allFlashcards.length === 0) {
        return; // No flashcards available
      }
      
      // Shuffle and take up to 5 cards
      const shuffled = [...allFlashcards].sort(() => 0.5 - Math.random());
      const randomCards = shuffled.slice(0, Math.min(5, shuffled.length));
      
      setFlashcards(randomCards);
      setIsReviewComplete(false);
    } catch (error) {
      console.error('Error loading random cards:', error);
    }
  };

  if (loading && flashcards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading flashcards...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={handleBackToDashboard}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Review Flashcards</h1>
        <p className="text-gray-600 mt-1">Test your knowledge and improve retention</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {isReviewComplete ? (
        <div className="card text-center py-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Review Complete!</h2>
          <p className="text-gray-600 mb-6">
            You've finished reviewing all the flashcards due today. Great job!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button onClick={handleBackToDashboard} className="btn-secondary">
              Back to Dashboard
            </button>
            <button 
              onClick={handleReviewRandom} 
              className="btn-primary flex items-center justify-center"
              disabled={loading}
            >
              <Dices size={18} className="mr-1" />
              Review Random Cards
            </button>
          </div>
        </div>
      ) : (
        <FlashcardReviewer
          flashcards={flashcards}
          onReview={handleReview}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default ReviewFlashcard;