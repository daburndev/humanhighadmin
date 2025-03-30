import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  updateFlower,
  addFlower,
  uploadImage,
  deleteImage,
} from "@/utils/firestore";
import useFormHandler from "@/hooks/useFormHandler";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

const FlowerForm = ({
  setIsAddingNew,
  setEditingItem,
  editingItem,
  fetchData,
}) => {
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [effectsInput, setEffectsInput] = useState("");
  const [flavorsInput, setFlavorsInput] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  // Extract form handling logic
  const { formData, setFormData, handleInputChange, isSubmitting } =
    useFormHandler({
      initialData: {},
      onSubmit: handleSubmitWrapper,
    });

  // Initialize form data and arrays when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        price: editingItem.price || "",
        thc: editingItem.thc || "",
        sativa: editingItem.sativa || "",
        indica: editingItem.indica || "",
        description: editingItem.description || "",
        isBestSeller: editingItem.isBestSeller || false,
        isNewArrival: editingItem.isNewArrival || false,
        isPromotion: editingItem.isPromotion || false,
        isComingSoon: editingItem.isComingSoon || false,
      });

      setEffectsInput(
        Array.isArray(editingItem.effects) ? editingItem.effects.join(", ") : ""
      );
      setFlavorsInput(
        Array.isArray(editingItem.flavors) ? editingItem.flavors.join(", ") : ""
      );

      if (editingItem.imageUrl) {
        setImagePreview(editingItem.imageUrl);
      }
    }
  }, [editingItem, setFormData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleSubmitWrapper(formDataToSubmit) {
    // Set local upload loading state
    setUploadLoading(true);

    try {
      const effectsArray = effectsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const flavorsArray = flavorsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      // Handle image upload
      let imageData = null;
      if (imageFile) {
        try {
          imageData = await uploadImage(imageFile);
          if (!imageData) {
            throw new Error("Failed to upload image");
          }
        } catch (uploadError) {
          alert(`Error uploading image: ${uploadError.message}`);
          return; // Early return to maintain disabled state
        }
      }

      const finalFormData = {
        ...formDataToSubmit,
        effects: effectsArray,
        flavors: flavorsArray,
      };

      // Add image URL and path to the form data if we uploaded an image
      if (imageData) {
        finalFormData.imageUrl = imageData.url;
        finalFormData.imagePath = imageData.path;
      }

      if (editingItem) {
        // If we're updating and there's a new image, delete the old one if it exists
        if (imageData && editingItem.imagePath) {
          try {
            await deleteImage(editingItem.imagePath);
          } catch (deleteError) {
            console.error("Error deleting old image:", deleteError);
          }
        }
        await updateFlower(editingItem.id, finalFormData);
      } else {
        await addFlower(finalFormData);
      }

      // Reset form state
      setEffectsInput("");
      setFlavorsInput("");
      setImageFile(null);
      setImagePreview("");
      setEditingItem(null);
      setIsAddingNew(false);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again.");
    } finally {
      setUploadLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await handleSubmitWrapper(formData);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const checkboxOptions = [
    { id: "isBestSeller", label: "Best Seller" },
    { id: "isNewArrival", label: "New Arrival" },
    { id: "isPromotion", label: "Promotion" },
    { id: "isComingSoon", label: "Coming Soon" },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingItem ? "Edit Flower" : "Add New Flower"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="THC"
          name="thc"
          type="number"
          value={formData.thc}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="Sativa"
          name="sativa"
          type="number"
          value={formData.sativa}
          onChange={handleInputChange}
          required
        />
        <FormField
          label="Indica"
          name="indica"
          type="number"
          value={formData.indica}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Flower Image
        </label>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
            />
            <p className="text-xs text-gray-500 mt-1">
              Select an image file (JPG, PNG, etc.)
            </p>
          </div>
          {imagePreview && (
            <div className="w-24 h-24 relative">
              <Image
                src={imagePreview}
                alt="Preview"
                className="object-cover rounded border"
                fill
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setImageFile(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={handleInputChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {checkboxOptions.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="checkbox"
              id={option.id}
              name={option.id}
              checked={formData[option.id] || false}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [option.id]: e.target.checked,
                })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor={option.id}
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      <FormField
        label="Effects (comma-separated)"
        name="effects"
        value={effectsInput}
        onChange={(e) => setEffectsInput(e.target.value)}
        placeholder="Relaxed, Euphoric, Happy, etc."
      />

      <FormField
        label="Flavors (comma-separated)"
        name="flavors"
        value={flavorsInput}
        onChange={(e) => setFlavorsInput(e.target.value)}
        placeholder="Earthy, Sweet, Citrus, etc."
      />

      <div className="flex space-x-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting || uploadLoading}
          isLoading={isSubmitting || uploadLoading}
          variant="primary"
          loadingText={uploadLoading ? "Uploading..." : "Saving..."}
        >
          {editingItem ? "Update" : "Add"} Flower
        </Button>

        <Button
          type="button"
          onClick={() => {
            setIsAddingNew(false);
            setEditingItem(null);
          }}
          disabled={isSubmitting || uploadLoading}
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default FlowerForm;
