"use server";

import { currentUser } from "@/lib/auth";
import db from "@/lib/db";

export const createReview = async (
  restaurantId: number | null,
  rating: number | null,
  comment?: string
) => {
  const user = await currentUser();

  if (!user?.id) return { error: "No user found!" };

  if (!restaurantId || rating === null)
    return { error: "Missing required fields!" };

  if (rating < 1 || rating > 5)
    return { error: "Rating must be between 1 and 5!" };

  try {
    const review = await db.review.create({
      data: {
        userId: user.id,
        restaurantId,
        rating,
        comment: comment?.trim() || null,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return { success: "Review successfully created!", review };
  } catch {
    return {
      error:
        "Failed to create review. Maybe you already have one for this restaurant!",
    };
  }
};

export const getRestaurantReviews = async (restaurantId: number) => {
  if (!restaurantId) return { error: "Restaurant ID is required!" };

  try {
    const reviews = await db.review.findMany({
      where: { restaurantId },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
      },
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    return { success: "Reviews retrieved!", reviews, averageRating };
  } catch {
    return {
      error: "Failed to fetch reviews.",
      reviews: [],
      averageRating: 0,
    };
  }
};

export const getUserReviews = async () => {
  const user = await currentUser();

  if (!user?.id) return { error: "No user found!" };

  try {
    const reviews = await db.review.findMany({
      where: { userId: user.id },
      include: { user: { select: { name: true } } },
    });

    return {
      success: "Review successfully retrived!",
      reviews,
      averageRating: 0,
    };
  } catch {
    return { error: "Failed to fetch user reviews.", reviews: [] };
  }
};

export const updateReview = async (
  reviewId: string | null,
  rating?: number,
  comment?: string
) => {
  if (!reviewId) return { error: "Review ID is required!" };
  if (rating !== undefined && (rating < 1 || rating > 5))
    return { error: "Rating must be between 1 and 5!" };

  try {
    await db.review.update({
      where: { id: reviewId },
      data: {
        rating: rating ?? undefined,
        comment: comment?.trim() || undefined,
      },
    });

    return { success: "Review successfully updated!" };
  } catch {
    return { error: "Failed to update review." };
  }
};

export const deleteReview = async (reviewId: string | null) => {
  if (!reviewId) return { error: "Review ID is required!" };

  try {
    await db.review.delete({ where: { id: reviewId } });

    return { success: "Review successfully deleted!" };
  } catch {
    return { error: "Failed to delete review." };
  }
};
