/**
 * Implementation of the SM-2 spaced repetition algorithm
 */

// Quality of response constants
export const QUALITY = {
  DONT_KNOW: 0,  // Complete blackout, failure to recall
  KNOW: 5,       // Perfect response
} as const;

export type Quality = typeof QUALITY[keyof typeof QUALITY];

/**
 * Calculate the next review date and updated parameters based on the user's response
 * 
 * @param quality - Quality of response (0 for "Don't Know", 5 for "Know")
 * @param repetitions - Number of successful reviews in a row
 * @param easiness - E-factor (easiness factor)
 * @param interval - Current interval in days
 * @returns Updated SM-2 parameters and next review date
 */
export function calculateNextReview(quality: Quality, repetitions: number, easiness: number, interval: number) {
  // Calculate new easiness factor
  let newEasiness = easiness + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure easiness factor doesn't go below 1.3
  newEasiness = Math.max(1.3, newEasiness);
  
  let newRepetitions = repetitions;
  let newInterval = interval;
  
  if (quality === QUALITY.DONT_KNOW) {
    // Reset repetitions if the user didn't know the answer
    newRepetitions = 0;
    newInterval = 1; // Review again after 1 day
  } else {
    // Increase repetitions count for correct response
    newRepetitions = repetitions + 1;
    
    // Calculate new interval based on the number of repetitions
    if (newRepetitions === 1) {
      newInterval = 1; // First successful recall: review after 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // Second successful recall: review after 6 days
    } else {
      // For subsequent successful recalls, multiply the previous interval by the easiness factor
      newInterval = Math.round(interval * newEasiness);
    }
  }
  
  // Calculate the next review date
  const now = new Date();
  const nextReviewDate = new Date();
  nextReviewDate.setDate(now.getDate() + newInterval);

  return {
    repetitions: newRepetitions,
    easiness: newEasiness,
    interval: newInterval,
    nextReviewDate
  };
}

/**
 * Determine if a flashcard is due for review
 */
export function isCardDueToday(nextReviewDate: Date | null): boolean {
  if (!nextReviewDate) return true; // New card, never reviewed
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);
  
  return reviewDate <= today;
}