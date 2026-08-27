import apiClient from './axios'; // adjust path if needed

export const profileApi = {
  /**
   * Upload a new profile picture
   * @param formData - FormData containing the image file (key: "file")
   * @returns Promise<{ newProfilePicUrl: string }>
   */
  uploadProfilePicture: async (formData: FormData) => {
    // Axios will automatically set Content-Type to multipart/form-data for FormData
    const response = await apiClient.post('/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { newProfilePicUrl: string }
  },

  /**
   * Get a user's profile by ID (optional)
   * @param userId - The user's ID
   * @returns Promise<UserProfile>
   */
  getProfile: async (userId: string) => {
    const response = await apiClient.get(`/profile/${userId}`);
    return response.data;
  },

  /**
   * Update other profile fields (bio, etc.)
   * @param data - Object with fields to update
   * @returns Promise<updated user>
   */
  updateProfile: async (data: { bio?: string; username?: string }) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },
};

// If you prefer to export functions individually:
// export const uploadProfilePicture = profileApi.uploadProfilePicture;
// export const getProfile = profileApi.getProfile;
// etc.