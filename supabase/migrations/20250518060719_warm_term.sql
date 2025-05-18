/*
  # Add Collections Feature

  1. New Tables
    - `collections`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `description` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes
    - Add `collection_id` to `flashcards` table
    - Update RLS policies
    - Add indexes for performance

  3. Security
    - Enable RLS on collections table
    - Add policies for CRUD operations
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Create policies for collections
CREATE POLICY "Users can create their own collections"
  ON collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own collections"
  ON collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections"
  ON collections
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections"
  ON collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add collection_id to flashcards
ALTER TABLE flashcards
ADD COLUMN collection_id uuid REFERENCES collections(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_flashcards_collection_id ON flashcards(collection_id);

-- Create trigger for updated_at
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Create views for collection stats
CREATE OR REPLACE VIEW collection_stats AS
SELECT 
  c.id as collection_id,
  c.title as collection_title,
  c.user_id,
  COUNT(DISTINCT f.id) as total_cards,
  COUNT(DISTINCT CASE 
    WHEN f.last_reviewed_at >= CURRENT_DATE 
    THEN f.id 
    END) as cards_reviewed_today,
  COUNT(DISTINCT CASE 
    WHEN f.next_review_date <= CURRENT_DATE 
    THEN f.id 
    END) as cards_due_today
FROM collections c
LEFT JOIN flashcards f ON c.id = f.collection_id
GROUP BY c.id, c.title, c.user_id;

-- Create view for collection review stats
CREATE OR REPLACE VIEW collection_review_stats AS
SELECT 
  c.id as collection_id,
  c.title as collection_title,
  c.user_id,
  COUNT(CASE WHEN rl.known THEN 1 END) as known_count,
  COUNT(CASE WHEN NOT rl.known THEN 1 END) as unknown_count,
  COUNT(*) as total_reviews
FROM collections c
JOIN flashcards f ON c.id = f.collection_id
JOIN review_logs rl ON f.id = rl.flashcard_id
WHERE rl.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY c.id, c.title, c.user_id;