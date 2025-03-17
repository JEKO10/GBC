"use client";

import React from "react";

import { deleteReview } from "@/actions/reviews";
import useFetchReviews from "@/hooks/useFetchReviews";

import ReviewList from "./ReviewList";

const UserReviews = () => {
  const { reviews, isLoading, message, setReviews } = useFetchReviews({});

  const handleDeleteReview = async (reviewId: string) => {
    const response = await deleteReview(reviewId);
    if (response.success) {
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    }
  };

  return (
    <ReviewList
      reviews={reviews}
      isLoading={isLoading}
      message={message}
      canDelete={true}
      handleDeleteReview={handleDeleteReview}
    />
  );
};

export default UserReviews;
