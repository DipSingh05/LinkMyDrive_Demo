/**
 * Utility functions for calculating and managing ratings
 */

/**
 * Calculate the final overall rating based on feedback data and existing ratings
 * 
 * @param feedbackData The feedback data from the form
 * @param completedFeedback Whether the user completed the feedback form
 * @param existingOverallRating The existing overall rating from the JSON (if any)
 * @returns The calculated final overall rating
 */
export const calculateFinalRating = (
  feedbackData: Record<string, { rating: number; feedback: string }>,
  completedFeedback: boolean,
  existingOverallRating?: number
): number => {
  // Early registration automatically gets 2 stars
  const earlyRegistrationRating = 2;

  let finalRating: number;

  if (completedFeedback) {
    // If feedback form was completed, average all ratings from the form
    const feedbackRatings = Object.values(feedbackData).map(item => item.rating);
    const totalRatings = [...feedbackRatings, earlyRegistrationRating]; // Add the 2 stars for early registration

    // Calculate average of all ratings including early registration bonus
    const sum = totalRatings.reduce((acc, curr) => acc + curr, 0);
    finalRating = sum / totalRatings.length;
  } else {
    // If feedback form was not completed, just use the early registration rating
    finalRating = earlyRegistrationRating;
  }

  // If there's an existing overall rating, average it with the new rating
  if (existingOverallRating !== undefined) {
    finalRating = (finalRating + existingOverallRating) / 2;
  }

  // Round to 1 decimal place for cleaner display
  return Math.round(finalRating * 10) / 10;
};

/**
 * Updates the JSON data with the calculated overall rating
 * 
 * @param jsonData The existing JSON data
 * @param finalRating The calculated final rating
 * @returns Updated JSON data with the new overall rating
 */
export const updateRatingInJson = (
  jsonData: any,
  finalRating: number
): any => {
  return {
    ...jsonData,
    overallRating: finalRating
  };
};