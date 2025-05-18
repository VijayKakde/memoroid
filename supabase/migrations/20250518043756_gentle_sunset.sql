/*
  # Add missing columns to flashcards table

  1. Changes
    - Add `easiness` column to flashcards table
    - Add `repetitions` column to flashcards table
    - Add `interval` column to flashcards table

  2. Notes
    - Uses safe column addition with IF NOT EXISTS checks
    - Sets appropriate default values for spaced repetition algorithm
*/

DO $$
BEGIN
  -- Add easiness column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flashcards' AND column_name = 'easiness'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN easiness double precision DEFAULT 2.5;
  END IF;

  -- Add repetitions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flashcards' AND column_name = 'repetitions'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN repetitions integer DEFAULT 0;
  END IF;

  -- Add interval column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'flashcards' AND column_name = 'interval'
  ) THEN
    ALTER TABLE flashcards ADD COLUMN interval integer DEFAULT 0;
  END IF;
END $$;