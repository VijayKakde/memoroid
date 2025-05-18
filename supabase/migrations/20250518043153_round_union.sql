/*
  # Initial schema setup for Memoroid

  1. New Tables
    - `flashcards`: Stores user flashcards with spaced repetition metadata
    - `review_logs`: Tracks review history and performance

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
    
  3. Performance
    - Add indexes for frequently queried columns
*/

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  front text NOT NULL,
  back text NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_reviewed_at timestamptz,
  next_review_date timestamptz,
  repetitions integer DEFAULT 0,
  easiness double precision DEFAULT 2.5,
  interval integer DEFAULT 0
);

-- Create review_logs table
CREATE TABLE IF NOT EXISTS review_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  flashcard_id uuid REFERENCES flashcards ON DELETE CASCADE NOT NULL,
  known boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for flashcards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flashcards' 
    AND policyname = 'Users can create their own flashcards'
  ) THEN
    CREATE POLICY "Users can create their own flashcards"
    ON flashcards
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flashcards' 
    AND policyname = 'Users can view their own flashcards'
  ) THEN
    CREATE POLICY "Users can view their own flashcards"
    ON flashcards
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flashcards' 
    AND policyname = 'Users can update their own flashcards'
  ) THEN
    CREATE POLICY "Users can update their own flashcards"
    ON flashcards
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'flashcards' 
    AND policyname = 'Users can delete their own flashcards'
  ) THEN
    CREATE POLICY "Users can delete their own flashcards"
    ON flashcards
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create policies for review_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_logs' 
    AND policyname = 'Users can create their own review logs'
  ) THEN
    CREATE POLICY "Users can create their own review logs"
    ON review_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'review_logs' 
    AND policyname = 'Users can view their own review logs'
  ) THEN
    CREATE POLICY "Users can view their own review logs"
    ON review_logs
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;
END
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_next_review_date ON flashcards(next_review_date);
CREATE INDEX IF NOT EXISTS idx_review_logs_user_id ON review_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_review_logs_flashcard_id ON review_logs(flashcard_id);