"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createReview } from "@/actions/reviews";
import { ReviewSchema } from "@/schemas/menu";

import { Review } from "./ReviewsWrapper";

// @TODO design, mesage etc. return ugl
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

  const form = useForm<z.infer<typeof ReviewSchema>>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

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
              form.reset();
              setMessage(data.success);
            } else {
              setMessage(data?.error ?? "Something went wrong.");
            }
          }
        );
      });
    },

    [form, restaurantId]
  );

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {/* <h2 className="text-lg font-semibold">
        {existingReview ? "Edit" : "Leave"} a Review
      </h2> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mt-3">
          Rating:
          <select
            {...register("rating")}
            className="block w-full p-2 border rounded"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </label>
        <p>{errors.rating?.message}</p>
        <label className="block mt-3">
          Comment:
          <textarea
            {...register("comment")}
            className="block w-full p-2 border rounded"
            rows={3}
            placeholder="Write your review..."
          />
        </label>
        <p>{errors.comment?.message}</p>
        {message && <p>{message}</p>}
        {/* {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>} */}
        <button
          type="submit"
          // disabled={loading}
          disabled={isPending}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
          {/* {loading
          ? "Submitting..."
          : existingReview
          ? "Update Review"
          : "Submit Review"} */}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
