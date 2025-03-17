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
  const [averageRating, setAverageRating] = useState<number>(0);

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
          setAverageRating(data.averageRating || 0);
        } else {
          setMessage(data?.error ?? "Something went wrong.");
          setAverageRating(0);
        }
      } catch {
        setMessage("An error occurred while fetching reviews.");
        setAverageRating(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  return { reviews, isLoading, message, setReviews, averageRating };
};

export default useFetchReviews;
