import React, { useState, useEffect } from "react";
import PropertyServices from "../../../../../Services/property";

interface ImagesGalleryProps {
  propertyId: string;
  property: {
    address: string;
  };
}

const fallbackImage =
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg";

const PropertyImagesGallery: React.FC<ImagesGalleryProps> = ({
  propertyId,
  property,
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(fallbackImage);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await PropertyServices.getPropertyImages(propertyId);
        const imageUrls = response.map((img: { url: string }) => img.url);
        setImages(imageUrls);
        setSelectedImage(imageUrls[0] || fallbackImage);
      } catch (error) {
        console.error("Error fetching property images:", error);
        setSelectedImage(fallbackImage);
      } finally {
        setIsLoading(false);
      }
    };

    if (propertyId) {
      fetchImages();
    }
  }, [propertyId]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    fallback: string
  ) => {
    e.currentTarget.src = fallback;
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + images.length) % images.length;
      setSelectedImage(images[nextIndex]);
      return nextIndex;
    });
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
      return nextIndex;
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="relative space-y-4 w-auto">
      {/* Main Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg max-h-[370pxpx] min-h-[370px]">
        <img
          src={selectedImage}
          alt={`Property at ${property.address}`}
          onError={(e) => handleImageError(e, fallbackImage)}
          className="w-full h-full object-fill"
        />

        {/* Thumbnails at Bottom-Left */}
        {images.length > 0 && (
          <div className="absolute bottom-4 left-4 flex gap-1 bg-black/40 py-1 px-4 rounded-md">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Property thumbnail ${index + 1} for ${property.address}`}
                onClick={() => {
                  setSelectedImage(src);
                  setCurrentIndex(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedImage(src);
                    setCurrentIndex(index);
                  }
                }}
                tabIndex={0}
                loading="lazy"
                onError={(e) => handleImageError(e, fallbackImage)}
                className={`w-10 h-10 object-cover cursor-pointer rounded-md border ${
                  selectedImage === src
                    ? "border-blue-500"
                    : "border-transparent"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-80 hover:opacity-100 transition-opacity`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fallback Message */}
      {images.length === 0 && (
        <p className="text-gray-500 mb-2 hidden">
          No additional images available.
        </p>
      )}
    </div>
  );
};

export default PropertyImagesGallery;
