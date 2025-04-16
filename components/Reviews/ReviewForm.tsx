"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import * as z from "zod";

import { createReview } from "@/actions/reviews";
import { ReviewSchema } from "@/schemas/menu";

import { Review } from "./ReviewsWrapper";

const ReviewForm = ({
  restaurantId,
  handleAddReview,
}: {
  restaurantId: number;
  // eslint-disable-next-line no-unused-vars
  handleAddReview: (newReview: Review) => void;
}) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | undefined>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const selectedRating = watch("rating");

  const onSubmit = useCallback(
    async (values: z.infer<typeof ReviewSchema>) => {
      setMessage("");
      startTransition(() => {
        createReview(restaurantId, values.rating, values.comment).then(
          (data) => {
            if (data?.success && data?.review) {
              const newReview: Review = {
                ...data.review,
                createdAt: new Date(data.review.createdAt).toISOString(),
              };
              handleAddReview(newReview);
              reset();
              setMessage(data.success);
            } else {
              setMessage(data?.error ?? "Something went wrong.");
            }
          }
        );
      });
    },
    [restaurantId, handleAddReview, reset]
  );

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star Rating Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating:
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setValue("rating", star, { shouldValidate: true })
                }
                className="text-2xl"
              >
                <FaStar
                  className={`transition ${
                    selectedRating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-sm text-red-500 mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment:
          </label>
          <textarea
            {...register("comment")}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            placeholder="Write your review..."
          />
          {errors.comment && (
            <p className="text-sm text-red-500 mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>
        {message && (
          <div
            className={`p-2 rounded text-sm ${
              message.toLowerCase().includes("success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending}
          className={`w-full py-2 px-4 text-white rounded-md transition ${
            isPending
              ? "bg-primary cursor-not-allowed"
              : "bg-secondary hover:bg-secondary/90"
          }`}
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
