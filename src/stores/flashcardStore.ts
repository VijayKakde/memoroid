import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Flashcard, ReviewLog } from '../types';
import {
  calculateNextReview,
  QUALITY,
  isCardDueToday
} from '../lib/spaced-repetition';

interface FlashcardStore {
  flashcards: Flashcard[];
  loading: boolean;
  error: string | null;
  
  // Retrieve flashcards
  fetchFlashcards: () => Promise<void>;
  fetchDueFlashcards: () => Promise<Flashcard[]>;
  
  // Create, update, delete flashcards
  createFlashcard: (front: string, back: string) => Promise<Flashcard | null>;
  updateFlashcard: (id: string, front: string, back: string) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
  
  // Review operations
  reviewFlashcard: (id: string, known: boolean) => Promise<void>;
  
  // Stats
  getReviewStats: () => Promise<{
    known: number;
    unknown: number;
    dailyStats: { date: string; known: number; unknown: number }[];
  }>;
}

export const useFlashcardStore = create<FlashcardStore>((set, get) => ({
  flashcards: [],
  loading: false,
  error: null,
  
  fetchFlashcards: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      set({ flashcards: data || [], loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  fetchDueFlashcards: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Filter flashcards that are due today
      const dueCards = (data || []).filter(card => 
        isCardDueToday(card.next_review_date ? new Date(card.next_review_date) : null)
      );
      
      set({ flashcards: data || [], loading: false });
      return dueCards;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return [];
    }
  },
  
  createFlashcard: async (front, back) => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      const newFlashcard = {
        user_id: user.user.id,
        front,
        back,
        repetitions: 0,
        easiness: 2.5, // Default easiness factor
        interval: 0,
      };
      
      const { data, error } = await supabase
        .from('flashcards')
        .insert([newFlashcard])
        .select()
        .single();
        
      if (error) throw error;
      
      const updatedFlashcards = [...get().flashcards, data];
      set({ flashcards: updatedFlashcards, loading: false });
      
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return null;
    }
  },
  
  updateFlashcard: async (id, front, back) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ front, back })
        .eq('id', id);
        
      if (error) throw error;
      
      const updatedFlashcards = get().flashcards.map(card => 
        card.id === id ? { ...card, front, back } : card
      );
      
      set({ flashcards: updatedFlashcards, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  deleteFlashcard: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      const updatedFlashcards = get().flashcards.filter(card => card.id !== id);
      set({ flashcards: updatedFlashcards, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  reviewFlashcard: async (id, known) => {
    set({ loading: true, error: null });
    try {
      // Get the flashcard
      const flashcard = get().flashcards.find(card => card.id === id);
      if (!flashcard) throw new Error("Flashcard not found");
      
      // Calculate new values using the spaced repetition algorithm
      const quality = known ? QUALITY.KNOW : QUALITY.DONT_KNOW;
      const { repetitions, easiness, interval, nextReviewDate } = calculateNextReview(
        quality,
        flashcard.repetitions,
        flashcard.easiness,
        flashcard.interval
      );
      
      // Update the flashcard with last_reviewed_at
      const { error: updateError } = await supabase
        .from('flashcards')
        .update({
          last_reviewed_at: new Date().toISOString(),
          next_review_date: nextReviewDate.toISOString(),
          repetitions,
          easiness,
          interval
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      // Add review log
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      const { error: logError } = await supabase
        .from('review_logs')
        .insert([{
          user_id: user.user.id,
          flashcard_id: id,
          known
        }]);
        
      if (logError) throw logError;
      
      // Update the state
      const updatedFlashcards = get().flashcards.map(card => 
        card.id === id 
          ? { 
              ...card, 
              last_reviewed_at: new Date().toISOString(),
              next_review_date: nextReviewDate.toISOString(),
              repetitions,
              easiness,
              interval
            } 
          : card
      );
      
      set({ flashcards: updatedFlashcards, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  getReviewStats: async () => {
    set({ loading: true, error: null });
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");
      
      // Get review logs
      const { data: logs, error: logsError } = await supabase
        .from('review_logs')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: true });
        
      if (logsError) throw logsError;
      
      const reviewLogs = logs || [];
      
      // Calculate summary stats
      const known = reviewLogs.filter(log => log.known).length;
      const unknown = reviewLogs.filter(log => !log.known).length;
      
      // Calculate daily stats for the last 7 days
      const dailyStats: { date: string; known: number; unknown: number }[] = [];
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 6);
      lastWeek.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(lastWeek);
        date.setDate(date.getDate() + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const dayLogs = reviewLogs.filter(log => {
          const logDate = new Date(log.created_at);
          return logDate >= date && logDate < nextDate;
        });
        
        dailyStats.push({
          date: dateStr,
          known: dayLogs.filter(log => log.known).length,
          unknown: dayLogs.filter(log => !log.known).length
        });
      }
      
      set({ loading: false });
      return { known, unknown, dailyStats };
    } catch (error: any) {
      set({ error: error.message, loading: false });
      return { known: 0, unknown: 0, dailyStats: [] };
    }
  }
}));