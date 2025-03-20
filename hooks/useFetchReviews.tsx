import { useEffect, useState } from "react";

import { getRestaurantReviews, getUserReviews } from "@/actions/reviews";

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: { name: string };
  restaurant?: { name: string };
}

interface UseFetchReviewsOptions {
  restaurantId?: number;
}

const useFetchReviews = ({ restaurantId }: UseFetchReviewsOptions) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        setMessage("");

        const data = restaurantId
          ? await getRestaurantReviews(restaurantId)
          : await getUserReviews();

        if (data?.success && data?.reviews) {
          const formattedReviews = data.reviews.map((review) => ({
            ...review,
            comment: review.comment ?? undefined,
            createdAt: review.createdAt.toISOString(),
            user: review.user || { name: "Unknown" },
          }));

          setReviews(formattedReviews);
        } else {
          setMessage(data?.error ?? "Something went wrong.");
        }
      } catch {
        setMessage("An error occurred while fetching reviews.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  return { reviews, isLoading, message, setReviews };
};

export default useFetchReviews;
