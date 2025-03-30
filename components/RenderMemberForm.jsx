import React from "react";
import { updateMember, addMember } from "@/utils/firestore";
import useFormHandler from "@/hooks/useFormHandler";
import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";

const MemberForm = ({
  setIsAddingNew,
  setEditingItem,
  editingItem,
  fetchData,
}) => {
  const membershipOptions = [
    { value: "basic", label: "Basic" },
    { value: "premium", label: "Premium" },
    { value: "vip", label: "VIP" },
  ];

  // Use the shared form handling hook
  const { formData, handleInputChange, handleSubmit, isSubmitting } =
    useFormHandler({
      initialData: editingItem || {},
      onSubmit: async (formData) => {
        if (editingItem) {
          await updateMember(editingItem.id, formData);
        } else {
          await addMember(formData);
        }

        setEditingItem(null);
        setIsAddingNew(false);
        fetchData();
      },
    });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl text-black font-bold mb-4">
        {editingItem ? "Edit Member" : "Add New Member"}
      </h2>

      <FormField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      <FormField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
      />

      <FormField
        label="Membership Level"
        name="membershipLevel"
        type="select"
        value={formData.membershipLevel}
        onChange={handleInputChange}
        options={membershipOptions}
        placeholder="Select Level"
      />

      <div className="flex space-x-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          variant="primary"
        >
          {editingItem ? "Update" : "Add"} Member
        </Button>

        <Button
          type="button"
          onClick={() => {
            setIsAddingNew(false);
            setEditingItem(null);
          }}
          disabled={isSubmitting}
          variant="secondary"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MemberForm;
