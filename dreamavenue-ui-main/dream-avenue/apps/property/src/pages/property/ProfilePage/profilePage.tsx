import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaUser,
} from "react-icons/fa";
import ProfileServices from "../../../Services/profile";
import { Button, InputField, Logo } from "container/components";

// Define TypeScript interfaces
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string;
  listings: number;
  totalSales: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage?: string;
  listings?: number;
  totalSales?: number;
}

const ProfilePage: React.FC = () => {
  const userObj = localStorage.getItem("user");
  const user = userObj ? JSON.parse(userObj) : null;

  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || "",
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: user?.email || "",
    phone: "+1 (212) 555-7890", // Default value
    location: "Manhattan, New York", // Default value
    profileImage: user?.picture || "", // Empty string as default
    listings: 24, // Default value
    totalSales: 12500000, // Default value
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch current user data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await ProfileServices.getCurrentUser();
        const userData: User = response.data;

        setProfile({
          id: userData.id,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone || profile.phone,
          location: userData.location || profile.location,
          profileImage: userData.profileImage || profile.profileImage,
          listings: userData.listings || profile.listings,
          totalSales: userData.totalSales || profile.totalSales,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          profileImage: event?.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);

      // Upload to server
      try {
        await ProfileServices.uploadProfilePicture(file);
        // If you need to refresh the profile image from server after upload
        // you could call fetchUserProfile() here
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
        // Revert to previous image or show error message
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Extract first and last name from the full name
      const nameParts = profile.name.split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ");

      const response = await ProfileServices.updateCurrentUser({
        firstName,
        lastName,
        // phone: profile.phone,
        // location: profile.location
      });

      // After successful update, update localStorage
      if (response) {
        const currentUser = localStorage.getItem("user");
        if (currentUser) {
          const updatedUser = {
            ...JSON.parse(currentUser),
            firstName: firstName,
            lastName: lastName,
            // Add other updated fields if needed
          };
          localStorage.setItem("user", JSON.stringify(updatedUser));

          // Dispatch the custom event to notify Header
          window.dispatchEvent(new Event("userProfileUpdated"));
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[85vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 overflow-auto">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl transition-all duration-300 hover:shadow-xl">
        {/* Profile Header with gradient background */}
        <div className="relative">
          <div className="h-24 bg-gradient-to-r from-emerald-600 to-emerald-700"></div>
          <div className="relative px-6 -mt-16 text-center">
            <div className="inline-block relative">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-white shadow-lg flex items-center justify-center">
                  <FaUser className="text-gray-400 text-4xl" />
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-3 cursor-pointer shadow-md hover:bg-emerald-700 transition-colors duration-200">
                  <FaCamera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-4">
          {/* Name and Edit Button */}
          <div className="text-center mb-4">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="text-2xl font-bold text-center w-full border-b-2 border-emerald-300 mb-2 pb-1 focus:outline-none focus:border-emerald-500"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">
                {profile.name}
              </h2>
            )}
            <div className="flex items-center justify-center mt-3">
              <Button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className="text-center flex justify-center items-center"
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-5">
            <div className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <FaEnvelope className="text-emerald-600 text-xl mr-4" />
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="font-semibold text-gray-800">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <FaPhone className="text-emerald-600 text-xl mr-4" />
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Phone
                </p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
              <FaMapMarkerAlt className="text-emerald-600 text-xl mr-4" />
              <div className="flex-grow">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Location
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    className="w-full bg-transparent font-semibold text-gray-800 focus:outline-none"
                  />
                ) : (
                  <p className="font-semibold text-gray-800">
                    {profile.location}
                  </p>
                )}
              </div>
            </div>

            {/* Professional Statistics */}
            {/* <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-emerald-50 p-5 rounded-xl text-center transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <p className="text-sm font-medium text-emerald-600 uppercase tracking-wide">
                  Total Listings
                </p>
                <p className="text-3xl font-bold text-emerald-800 mt-2">
                  {profile.listings}
                </p>
              </div>
              <div className="bg-green-50 p-5 rounded-xl text-center transform transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  Total Sales
                </p>
                <p className="text-3xl font-bold text-green-800 mt-2">
                  ${(profile.totalSales / 1000000).toFixed(1)}M
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
