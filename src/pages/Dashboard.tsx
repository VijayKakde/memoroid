import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFlashcardStore } from '../stores/flashcardStore';
import FlashcardCard from '../components/FlashcardCard';
import { Brain, PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    flashcards, 
    loading, 
    error, 
    fetchFlashcards, 
    fetchDueFlashcards, 
    deleteFlashcard 
  } = useFlashcardStore();
  
  const [dueFlashcards, setDueFlashcards] = useState<typeof flashcards>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      await fetchFlashcards();
      const dueCards = await fetchDueFlashcards();
      setDueFlashcards(dueCards);
    };
    
    loadData();
  }, [fetchFlashcards, fetchDueFlashcards]);
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      setIsDeleting(id);
      await deleteFlashcard(id);
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and review your flashcards</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/create" className="btn-primary flex items-center">
            <PlusCircle size={18} className="mr-1" />
            New Flashcard
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Due flashcards section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Brain size={20} className="text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold">Flashcards Due Today</h2>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading flashcards...</p>
          </div>
        ) : dueFlashcards.length > 0 ? (
          <div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4 flex justify-between items-center">
              <p className="text-indigo-800">
                <span className="font-semibold">{dueFlashcards.length}</span> flashcards due for review today
              </p>
              <Link to="/review" className="btn-primary">
                Start Review
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {dueFlashcards.slice(0, 3).map((card) => (
                <FlashcardCard
                  key={card.id}
                  flashcard={card}
                  onDelete={handleDelete}
                />
              ))}
              {dueFlashcards.length > 3 && (
                <Link to="/review" className="text-center py-2 text-indigo-600 hover:text-indigo-800 font-medium">
                  View all {dueFlashcards.length} due flashcards
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-600 mb-4">No flashcards due for review today!</p>
            <Link to="/create" className="btn-primary inline-flex items-center">
              <PlusCircle size={18} className="mr-1" />
              Create New Flashcard
            </Link>
          </div>
        )}
      </div>
      
      {/* All flashcards section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Flashcards</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading flashcards...</p>
          </div>
        ) : flashcards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map((card) => (
              <FlashcardCard
                key={card.id}
                flashcard={card}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-600 mb-4">You haven't created any flashcards yet</p>
            <Link to="/create" className="btn-primary inline-flex items-center">
              <PlusCircle size={18} className="mr-1" />
              Create Your First Flashcard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;