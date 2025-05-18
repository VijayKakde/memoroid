/*
  # Add student profile information

  1. Changes
    - Add new columns to profiles table for student information
    - Add policies for profile management
    
  2. Notes
    - Extends existing profiles table with additional student fields
    - Maintains existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS student_id text,
ADD COLUMN IF NOT EXISTS date_of_birth date,
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS education_level text,
ADD COLUMN IF NOT EXISTS major text,
ADD COLUMN IF NOT EXISTS graduation_year integer;