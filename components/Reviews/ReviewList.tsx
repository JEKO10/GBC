import React from "react";
import { FaTrashCan } from "react-icons/fa6";

import { Review } from "./ReviewsWrapper";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const ReviewList = ({
  reviews,
  isLoading,
  message,
  title,
  handleDeleteReview,
  canDelete = false,
}: {
  reviews: Review[];
  isLoading: boolean;
  message: string | undefined;
  // eslint-disable-next-line no-unused-vars
  handleDeleteReview?: (reviewId: string) => void;
  title?: string;
  canDelete: boolean;
}) => {
  if (isLoading) return <div className="loading" />;
  return (
    <section className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {title || "Customer Reviews"}
      </h2>
      {message && <p className="text-blue-500">{message}</p>}
      {reviews.length === 0 ? (
        <p className="text-gray-600 italic">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="p-4 border rounded-lg bg-white shadow"
            >
              <div className="flex justify-between flex-wrap">
                <p className="font-bold text-lg">{review.user.name}</p>
                <p className="text-gray-500 text-sm my-2">
                  {formatDate(review.createdAt)}
                </p>
              </div>
              <p className="text-yellow-500 text-sm">⭐ {review.rating}/5</p>
              <p className="text-gray-700 mt-2">
                {review.comment || "No comment provided."}
              </p>
              {canDelete && handleDeleteReview && (
                <FaTrashCan
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDeleteReview(review.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ReviewList;
