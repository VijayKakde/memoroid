import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Flashcard } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashcardReviewerProps {
  flashcards: Flashcard[];
  onReview: (id: string, known: boolean) => Promise<void>;
  onComplete: () => void;
}

const FlashcardReviewer: React.FC<FlashcardReviewerProps> = ({
  flashcards,
  onReview,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [reviewedCards, setReviewedCards] = useState<string[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (flashcards.length > 0 && reviewedCards.length === flashcards.length) {
      onComplete();
    }
  }, [flashcards, reviewedCards, onComplete]);

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    if (!isAnimating && !isProcessing) {
      setIsFlipped(!isFlipped);
    }
  };

  const handleNextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
        setIsAnimating(false);
        setDirection(null);
      }, 300);
    }
  };

  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1);
        setIsFlipped(false);
        setIsAnimating(false);
        setDirection(null);
      }, 300);
    }
  };

  const handleReview = async (known: boolean) => {
    if (!currentCard || isProcessing) return;

    try {
      setIsProcessing(true);

      // If not flipped, flip first
      if (!isFlipped) {
        setIsFlipped(true);
        return;
      }

      await onReview(currentCard.id, known);
      setReviewedCards([...reviewedCards, currentCard.id]);

      if (currentIndex < flashcards.length - 1) {
        handleNextCard();
      } else {
        onComplete();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentCard) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700">No flashcards to review!</h2>
        <p className="text-gray-500 mt-2">Create some flashcards or check back later.</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? 300 : direction === 'right' ? -300 : 0,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right' | null) => ({
      x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0,
      opacity: 0
    })
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="flex justify-between w-full mb-6 items-center">
        <button
          onClick={handlePrevCard}
          disabled={currentIndex === 0 || isAnimating || isProcessing}
          className={`p-2 rounded-full ${
            currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-gray-500 font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </div>
        <button
          onClick={handleNextCard}
          disabled={currentIndex === flashcards.length - 1 || isAnimating || isProcessing}
          className={`p-2 rounded-full ${
            currentIndex === flashcards.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <motion.div
        key={currentCard.id}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3 }}
        className="w-full aspect-[3/2] mb-8"
      >
        <div 
          className={`flip-card w-full h-full ${isAnimating || isProcessing ? 'pointer-events-none' : ''}`}
          onClick={handleFlip}
        >
          <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
            <div className="flip-card-front card">
              <div className="flex flex-col justify-center h-full p-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Question</h3>
                <p className="text-gray-700 text-lg">{currentCard.front}</p>
              </div>
            </div>
            <div className="flip-card-back card">
              <div className="flex flex-col justify-center h-full p-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800">Answer</h3>
                <p className="text-gray-700 text-lg">{currentCard.back}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="text-sm text-gray-500 mb-6 italic">Click the card to flip</p>

      <div className="flex space-x-4 w-full">
        <button
          className="btn-red flex-1"
          onClick={() => handleReview(false)}
          disabled={isProcessing}
        >
          Don't Know
        </button>
        <button
          className="btn-green flex-1"
          onClick={() => handleReview(true)}
          disabled={isProcessing}
        >
          Know
        </button>
      </div>
    </div>
  );
};

export default FlashcardReviewer;