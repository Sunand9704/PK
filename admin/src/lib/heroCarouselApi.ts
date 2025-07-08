import { API_BASE_URL, API_ENDPOINTS } from "./api";

export interface HeroCarouselSlide {
  _id: string;
  title: string;
  customContent?: string;
  description?: string;
  image: string;
  isActive: boolean;
  order: number;
  link?: string;
  linkText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSlideData {
  title: string;
  customContent?: string;
  description?: string;
  image: string;
  isActive?: boolean;
  order?: number;
  link?: string;
  linkText?: string;
}

export interface UpdateSlideData extends Partial<CreateSlideData> {}

// Get all slides (admin only)
export const getAllSlides = async (
  token: string
): Promise<HeroCarouselSlide[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/hero-carousel`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching all hero carousel slides:", error);
    throw error;
  }
};

// Get single slide by ID (admin only)
export const getSlideById = async (
  id: string,
  token: string
): Promise<HeroCarouselSlide> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/hero-carousel/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching hero carousel slide:", error);
    throw error;
  }
};

// Create new slide (admin only)
export const createSlide = async (
  slideData: CreateSlideData,
  token: string
): Promise<HeroCarouselSlide> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/hero-carousel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(slideData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating hero carousel slide:", error);
    throw error;
  }
};

// Update slide (admin only)
export const updateSlide = async (
  id: string,
  slideData: UpdateSlideData,
  token: string
): Promise<HeroCarouselSlide> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/hero-carousel/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(slideData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating hero carousel slide:", error);
    throw error;
  }
};

// Delete slide (admin only)
export const deleteSlide = async (id: string, token: string): Promise<void> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/hero-carousel/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error deleting hero carousel slide:", error);
    throw error;
  }
};

// Toggle slide active status (admin only)
export const toggleSlideStatus = async (
  id: string,
  token: string
): Promise<HeroCarouselSlide> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/hero-carousel/${id}/toggle`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling hero carousel slide status:", error);
    throw error;
  }
};

// Reorder slides (admin only)
export const reorderSlides = async (
  slides: { id: string; order: number }[],
  token: string
): Promise<HeroCarouselSlide[]> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/hero-carousel/reorder`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slides }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reordering hero carousel slides:", error);
    throw error;
  }
};
