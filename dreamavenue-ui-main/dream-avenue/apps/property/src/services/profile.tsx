import apiInstance from "../Axios/Axios";

interface UpdateUserParams {
  firstName?: string;
  lastName?: string;
}

class ProfileService {
  // Get current user details
  getCurrentUser = async () => {
    try {
      const response = await apiInstance.get("/users/me");
      return response;
    } catch (error: any) {
      console.error("An error occurred while fetching current user:", error);
      throw error;
    }
  };

  // Update current user details
  updateCurrentUser = async (params: UpdateUserParams) => {
    try {
      const response = await apiInstance.put("/users/update-me", params);
      return response;
    } catch (error: any) {
      console.error("An error occurred while updating user details:", error);
      throw error;
    }
  };

  // Upload profile picture
  uploadProfilePicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiInstance.post(
        "/users/upload-profile-picture", 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error("An error occurred while uploading profile picture:", error);
      throw error;
    }
  };
}

const ProfileServices = new ProfileService();

export default ProfileServices;