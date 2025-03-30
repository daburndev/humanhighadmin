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

import Link from "next/link";
import FlowerForm from "@/components/RenderFlowersForm";
import MemberForm from "@/components/RenderMemberForm";
import FlowerItem from "@/components/FlowerItem";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [flowers, setFlowers] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [activeTab, setActiveTab] = useState("flowers");
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
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
  // this is handleSubmit() moved to RenderFlowersForm component
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Header user={user} />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="p-6">
          {loading ? (
            <p className="text-center py-4">Loading data...</p>
          ) : (
            <>
              <ListHeader
                activeTab={activeTab}
                isAddingNew={isAddingNew}
                setIsAddingNew={setIsAddingNew}
              />

              {/* Form Section */}
              {isAddingNew &&
                (activeTab === "flowers" ? (
                  <FlowerForm
                    setIsAddingNew={setIsAddingNew}
                    setEditingItem={setEditingItem}
                    editingItem={editingItem}
                    fetchData={fetchData}
                    activeTab={activeTab}
                  />
                ) : (
                  <MemberForm
                    setIsAddingNew={setIsAddingNew}
                    setEditingItem={setEditingItem}
                    editingItem={editingItem}
                    fetchData={fetchData}
                    activeTab={activeTab}
                  />
                ))}

              {/* List Section */}
              {!isAddingNew &&
                (activeTab === "flowers" ? (
                  <FlowersList
                    flowers={flowers}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                  />
                ) : (
                  <MembersList
                    members={memberData}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                  />
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Header Component
const Header = ({ user }) => (
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
);

// Tab Navigation Component
const TabNavigation = ({ activeTab, setActiveTab }) => (
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
);

// List Header Component
const ListHeader = ({ activeTab, isAddingNew, setIsAddingNew }) => (
  <div className="flex justify-between mb-4">
    <h2 className="text-xl font-bold text-black">
      {activeTab === "flowers" ? "Flowers" : "Members"} List
    </h2>
    {!isAddingNew && (
      <button
        onClick={() => {
          setIsAddingNew(true);
        }}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Add New {activeTab === "flowers" ? "Flower" : "Member"}
      </button>
    )}
  </div>
);

// Flowers List Component
const FlowersList = ({ flowers, onEdit, onDelete }) => (
  <div className="space-y-2 mt-4">
    {flowers.length > 0 ? (
      flowers.map((flower) => (
        <FlowerItem
          key={flower.id}
          flower={flower}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    ) : (
      <p className="text-center py-6 text-gray-500 bg-white rounded-lg border border-gray-200">
        No flowers found. Add your first flower!
      </p>
    )}
  </div>
);

// Members List Component
const MembersList = ({ members, onEdit, onDelete }) => (
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
        {members.length > 0 ? (
          members.map((member) => (
            <tr key={member.id}>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                {member.name}
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
                {member.email}
              </td>
              <td className="px-6 py-4 text-black whitespace-nowrap">
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
                  onClick={() => onEdit(member)}
                  className="text-blue-600 hover:text-blue-900 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(member.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
              No members found. Add your first member!
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);
