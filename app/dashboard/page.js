"use client";
import { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import {
  getFlowers,
  addFlower,
  updateFlower,
  deleteFlower,
  getMember,
  addMember,
  updateMember,
  deleteMember,
  uploadImage,
  deleteImage,
} from "@/utils/firestore";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [activeTab, setActiveTab] = useState("flowers");
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [effectsInput, setEffectsInput] = useState("");
  const [flavorsInput, setFlavorsInput] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchData();
      } else {
        router.push("/log-in");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (editingItem) {
      setEffectsInput(
        Array.isArray(editingItem.effects) ? editingItem.effects.join(", ") : ""
      );
      setFlavorsInput(
        Array.isArray(editingItem.flavors) ? editingItem.flavors.join(", ") : ""
      );
    } else {
      setEffectsInput("");
      setFlavorsInput("");
    }
  }, [editingItem]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const flowersData = await getFlowers();
      const membersData = await getMember();
      setFlowers(flowersData);
      setMemberData(membersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          setUploadLoading(false);
          return;
        }
      }

      const finalFormData = {
        ...formData,
        effects: effectsArray,
        flavors: flavorsArray,
      };

      // Add image URL and path to the form data if we uploaded an image
      if (imageData) {
        finalFormData.imageUrl = imageData.url;
        finalFormData.imagePath = imageData.path;
      }

      if (activeTab === "flowers") {
        if (editingItem) {
          // If we're updating and there's a new image, delete the old one if it exists
          if (imageData && editingItem.imagePath) {
            try {
              await deleteImage(editingItem.imagePath);
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
              // Continue with update even if old image deletion fails
            }
          }
          await updateFlower(editingItem.id, finalFormData);
        } else {
          await addFlower(finalFormData);
        }
      } else {
        if (editingItem) {
          await updateMember(editingItem.id, finalFormData);
        } else {
          await addMember(finalFormData);
        }
      }

      setFormData({});
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
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      if (activeTab === "flowers") {
        await deleteFlower(id);
      } else {
        await deleteMember(id);
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      effects: item.effects || [],
      flavors: item.flavors || [],
    });
    // Set image preview if the item has an image URL
    if (item.imageUrl) {
      setImagePreview(item.imageUrl);
    } else {
      setImagePreview("");
    }
    setImageFile(null);
    setIsAddingNew(true);
  };

  if (!user) {
    return <h1 className="text-white">Loading...</h1>;
  }

  const renderFlowersForm = () => (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {editingItem ? "Edit Flower" : "Add New Flower"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 text-black focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            THC
          </label>
          <input
            type="number"
            name="thc"
            value={formData.thc || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sativa
          </label>
          <input
            type="number"
            name="sativa"
            value={formData.sativa || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Indica
          </label>
          <input
            type="number"
            name="indica"
            value={formData.indica || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          className="w-full p-2 border text-black rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isBestSeller"
            name="isBestSeller"
            checked={formData.isBestSeller || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                isBestSeller: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isBestSeller"
            className="ml-2 block text-sm text-gray-700"
          >
            Best Seller
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isNewArrival"
            name="isNewArrival"
            checked={formData.isNewArrival || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                isNewArrival: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isNewArrival"
            className="ml-2 block text-sm text-gray-700"
          >
            New Arrival
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPromotion"
            name="isPromotion"
            checked={formData.isPromotion || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                isPromotion: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isPromotion"
            className="ml-2 block text-sm text-gray-700"
          >
            Promotion
          </label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Effects (comma-separated)
        </label>
        <input
          type="text"
          name="effects"
          value={effectsInput}
          onChange={(e) => setEffectsInput(e.target.value)}
          placeholder="Relaxed, Euphoric, Happy, etc."
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Flavors (comma-separated)
        </label>
        <input
          type="text"
          name="flavors"
          value={flavorsInput}
          onChange={(e) => setFlavorsInput(e.target.value)}
          placeholder="Earthy, Sweet, Citrus, etc."
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-400"
        />
      </div>
      <div className="flex space-x-2 pt-2">
        <button
          type="submit"
          disabled={uploadLoading}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            uploadLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploadLoading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            `${editingItem ? "Update" : "Add"} Flower`
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAddingNew(false);
            setEditingItem(null);
          }}
          disabled={uploadLoading}
          className={`px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 ${
            uploadLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const renderMemberForm = () => (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold mb-4">
        {editingItem ? "Edit Member" : "Add New Member"}
      </h2>
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Membership Level
        </label>
        <select
          name="membershipLevel"
          value={formData.membershipLevel || ""}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Level</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="vip">VIP</option>
        </select>
      </div>
      <div className="flex space-x-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingItem ? "Update" : "Add"} Member
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAddingNew(false);
            setEditingItem(null);
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Link href="/dashboard">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </Link>

        <div className="text-sm">
          Logged in as: <span className="font-medium">{user.email}</span>
          <button
            onClick={() => auth.signOut()}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium text-black ${
              activeTab === "flowers" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("flowers")}
          >
            Flowers
          </button>
          <button
            className={`px-6 py-3 font-medium text-black ${
              activeTab === "members" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-center py-4">Loading data...</p>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-bold text-black">
                  {activeTab === "flowers" ? "Flowers" : "Members"} List
                </h2>
                {!isAddingNew && (
                  <button
                    onClick={() => {
                      setIsAddingNew(true);
                      setFormData({});
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add New {activeTab === "flowers" ? "Flower" : "Member"}
                  </button>
                )}
              </div>

              {isAddingNew &&
                (activeTab === "flowers"
                  ? renderFlowersForm()
                  : renderMemberForm())}

              {!isAddingNew && activeTab === "flowers" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {flowers.length > 0 ? (
                    flowers.map((flower) => (
                      <div
                        key={flower.id}
                        className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                      >
                        {flower.imageUrl && (
                          <div className="relative">
                            <Image
                              width={100}
                              height={100}
                              src={flower.imageUrl}
                              alt={flower.name}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                              {flower.isBestSeller && (
                                <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                                  Best Seller
                                </span>
                              )}
                              {flower.isNewArrival && (
                                <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                  New
                                </span>
                              )}
                              {flower.isPromotion && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                                  Promo
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800">
                            {flower.name}
                          </h3>
                          <h4 className="font-bold text-black">
                            THC
                            <span className="text-green-400">
                              {" "}
                              {flower.thc}%
                            </span>
                          </h4>
                          <p className="text-green-600 font-medium">
                            ฿{flower.price}
                          </p>
                          {flower.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {flower.description}
                            </p>
                          )}
                          {flower.effects && flower.effects.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">
                                Effects:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {flower.effects.map((effect, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {effect}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {flower.flavors && flower.flavors.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">
                                Flavors:
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {flower.flavors.map((flavor, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full"
                                  >
                                    {flavor}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex space-x-2 mt-3 text-black">
                            <p>Sativa: {flower.sativa}%</p>
                            <p>Indica: {flower.indica}%</p>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <button
                              onClick={() => startEdit(flower)}
                              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(flower.id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center py-4 text-gray-500">
                      No flowers found. Add your first flower!
                    </p>
                  )}
                </div>
              )}

              {!isAddingNew && activeTab === "members" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Membership
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {memberData.length > 0 ? (
                        memberData.map((member) => (
                          <tr key={member.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {member.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {member.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {member.phone || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${
                                  member.membershipLevel === "premium"
                                    ? "bg-purple-100 text-purple-800"
                                    : member.membershipLevel === "vip"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {member.membershipLevel || "basic"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => startEdit(member)}
                                className="text-blue-600 hover:text-blue-900 mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(member.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-6 py-4 text-center text-gray-500"
                          >
                            No members found. Add your first member!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
