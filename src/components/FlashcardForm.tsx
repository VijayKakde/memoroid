import React, { useState } from 'react';

interface FlashcardFormProps {
  initialFront?: string;
  initialBack?: string;
  onSubmit: (front: string, back: string) => void;
  isSubmitting: boolean;
  buttonText: string;
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({
  initialFront = '',
  initialBack = '',
  onSubmit,
  isSubmitting,
  buttonText,
}) => {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);
  const [errors, setErrors] = useState({ front: '', back: '' });

  const validate = (): boolean => {
    const newErrors = { front: '', back: '' };
    if (!front.trim()) newErrors.front = 'Question is required';
    if (!back.trim()) newErrors.back = 'Answer is required';
    
    setErrors(newErrors);
    return !newErrors.front && !newErrors.back;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(front, back);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="front" className="block text-sm font-medium text-gray-700 mb-1">
          Question (Front)
        </label>
        <textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className={`form-input min-h-24 ${errors.front ? 'border-red-500' : ''}`}
          placeholder="Enter the question or front side of your flashcard"
        />
        {errors.front && <p className="mt-1 text-sm text-red-600">{errors.front}</p>}
      </div>
      
      <div>
        <label htmlFor="back" className="block text-sm font-medium text-gray-700 mb-1">
          Answer (Back)
        </label>
        <textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className={`form-input min-h-24 ${errors.back ? 'border-red-500' : ''}`}
          placeholder="Enter the answer or back side of your flashcard"
        />
        {errors.back && <p className="mt-1 text-sm text-red-600">{errors.back}</p>}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : buttonText}
        </button>
      </div>
    </form>
  );
};

export default FlashcardForm;