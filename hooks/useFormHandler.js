import { useState, useEffect } from "react";

export default function useFormHandler({
  initialData = {},
  onSubmit,
  transformBeforeSubmit,
  resetAfterSubmit = true,
}) {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dataToSubmit = transformBeforeSubmit
        ? transformBeforeSubmit(formData)
        : formData;

      await onSubmit(dataToSubmit);

      if (resetAfterSubmit) {
        setFormData({});
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Error saving data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    isSubmitting,
  };
}
