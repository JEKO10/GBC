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
    <section className="w-full max-w-3xl mx-auto my-12 px-4">
      <div className="mb-6 text-center">
        {isLoading ? (
          <div className="animate-pulse text-gray-400">Loading reviews...</div>
        ) : reviews.length > 0 ? (
          <p className="text-yellow-500 text-2xl font-semibold">
            ⭐ {averageRating.toFixed(1)} / 5
          </p>
        ) : (
          <p className="text-gray-500 italic text-lg">No ratings yet.</p>
        )}
      </div>

      <div className="mb-8">
        <ReviewForm
          restaurantId={restaurantId}
          handleAddReview={handleAddReview}
        />
      </div>

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
