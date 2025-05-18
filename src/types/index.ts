export interface Flashcard {
  id: string;
  user_id: string;
  front: string;
  back: string;
  created_at: string;
  last_reviewed_at: string | null;
  next_review_date: string | null;
  repetitions: number;
  easiness: number;
  interval: number;
}

export interface ReviewLog {
  id: string;
  user_id: string;
  flashcard_id: string;
  known: boolean;
  created_at: string;
}

export interface ReviewStats {
  total_cards: number;
  known_cards: number;
  unknown_cards: number;
  review_history: {
    date: string;
    known: number;
    unknown: number;
  }[];
}