"use client";

import { useMemo } from "react";

import useFetchReviews from "@/hooks/useFetchReviews";

import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: {
    name: string;
  };
}

// @TODO samo za te restorane napravi page, tako ne moras da restric URL change
// @TODO design, mesage etc. return ugl
const ReviewWrapper = ({ restaurantId }: { restaurantId: number }) => {
  const { reviews, isLoading, message, setReviews } = useFetchReviews({
    restaurantId,
  });

  const handleAddReview = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  }, [reviews]);

  return (
    <section>
      {isLoading ? (
        <div className="loading" />
      ) : reviews.length > 0 ? (
        <p className="text-yellow-500 font-bold">
          ⭐ {averageRating.toFixed(1)} / 5
        </p>
      ) : (
        <p className="text-gray-500 italic">No ratings yet.</p>
      )}
      <ReviewForm
        restaurantId={restaurantId}
        handleAddReview={handleAddReview}
      />
      <ReviewList
        reviews={reviews}
        isLoading={isLoading}
        message={message}
        canDelete={false}
      />
    </section>
  );
};

export default ReviewWrapper;
