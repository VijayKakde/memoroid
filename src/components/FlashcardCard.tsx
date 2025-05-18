import React from 'react';
import { Link } from 'react-router-dom';
import { Flashcard } from '../types';
import { Pencil, Trash } from 'lucide-react';

interface FlashcardCardProps {
  flashcard: Flashcard;
  onDelete: (id: string) => void;
  showActions?: boolean;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ 
  flashcard, 
  onDelete,
  showActions = true 
}) => {
  const { id, front, back, next_review_date } = flashcard;
  
  const formattedNextReviewDate = next_review_date 
    ? new Date(next_review_date).toLocaleDateString()
    : 'Not reviewed yet';

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {front.length > 100 ? front.substring(0, 100) + '...' : front}
        </h3>
        
        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/edit/${id}`}
              className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
              title="Edit"
            >
              <Pencil size={18} />
            </Link>
            <button
              onClick={() => onDelete(id)}
              className="p-1 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash size={18} />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-gray-600 mb-3">
        {back.length > 150 ? back.substring(0, 150) + '...' : back}
      </p>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <p className="text-sm text-gray-500">
          Next review: {formattedNextReviewDate}
        </p>
      </div>
    </div>
  );
};

export default FlashcardCard;