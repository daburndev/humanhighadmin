import { db } from "@/firebaseConfig";
import { storage } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
} from "firebase/storage";

// Upload image to Firebase Storage
export const uploadImage = async (file, path = "flowers") => {
  try {
    if (!file) return null;

    // Create a unique file name with timestamp and original extension
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}.${fileExtension}`;

    // Create a reference to the full path including folder structure
    const fullPath = `${path}/${uniqueFileName}`;
    const imageRef = ref(storage, fullPath);

    // Upload the file
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);

    return {
      url: downloadURL,
      path: fullPath,
      name: uniqueFileName,
      ref: imageRef,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

// Delete image from Firebase Storage
export const deleteImage = async (imagePath) => {
  try {
    if (!imagePath) return;

    // Create a reference to the file to delete
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    console.log("Image deleted successfully");
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Add Flower
export const addFlower = async (flowerData) => {
  try {
    await addDoc(collection(db, "flowers"), flowerData);
    console.log("Flower added!");
  } catch (error) {
    console.error("Error adding flower:", error);
  }
};

// Update Flower
export const updateFlower = async (flowerId, updatedData) => {
  try {
    const flowerRef = doc(db, "flowers", flowerId);
    await updateDoc(flowerRef, updatedData);
    console.log("Flower updated!");
  } catch (error) {
    console.error("Error updating flower:", error);
  }
};

// Get Flower
export const getFlowers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "flowers"));
    const flowers = [];
    querySnapshot.forEach((doc) => {
      flowers.push({ id: doc.id, ...doc.data() });
    });
    return flowers;
  } catch (error) {
    console.error("Error getting flowers:", error);
    return [];
  }
};

// Delete Flower
export const deleteFlower = async (flowerId) => {
  try {
    await deleteDoc(doc(db, "flowers", flowerId));
    console.log("Flower deleted!");
  } catch (error) {
    console.error("Error deleting flower:", error);
  }
};

// Get Flower by ID
export const getFlowerById = async (flowerId) => {
  try {
    const flowerDoc = await getDoc(doc(db, "flowers", flowerId));
    if (flowerDoc.exists()) {
      return { id: flowerDoc.id, ...flowerDoc.data() };
    } else {
      console.log("No such flower exists!");
      return null;
    }
  } catch (error) {
    console.error("Error getting flower:", error);
    return null;
  }
};

// Query Flowers
export const queryFlowers = async (field, operator, value) => {
  try {
    const q = query(collection(db, "flowers"), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const flowers = [];
    querySnapshot.forEach((doc) => {
      flowers.push({ id: doc.id, ...doc.data() });
    });
    return flowers;
  } catch (error) {
    console.error("Error querying flowers:", error);
    return [];
  }
};

// Get Sorted Flowers
export const getSortedFlowers = async (
  sortField,
  sortDirection = "asc",
  flowerLimit = 100
) => {
  try {
    const q = query(
      collection(db, "flowers"),
      orderBy(sortField, sortDirection),
      limit(flowerLimit)
    );
    const querySnapshot = await getDocs(q);
    const flowers = [];
    querySnapshot.forEach((doc) => {
      flowers.push({ id: doc.id, ...doc.data() });
    });
    return flowers;
  } catch (error) {
    console.error("Error getting sorted flowers:", error);
    return [];
  }
};

// Subscribe to Flowers (Real-Time)
export const subscribeToFlowers = (callback) => {
  try {
    return onSnapshot(collection(db, "flowers"), (snapshot) => {
      const flowers = [];
      snapshot.forEach((doc) => {
        flowers.push({ id: doc.id, ...doc.data() });
      });
      callback(flowers);
    });
  } catch (error) {
    console.error("Error subscribing to flowers:", error);
    return () => {}; // Return empty unsubscribe function
  }
};

// Add Member
export const addMember = async (memberData) => {
  try {
    await addDoc(collection(db, "memberData"), memberData);
    console.log("Member added!");
  } catch (error) {
    console.error("Error adding member:", error);
  }
};

// Update Member
export const updateMember = async (memberId, updatedData) => {
  try {
    const memberRef = doc(db, "memberData", memberId);
    await updateDoc(memberRef, updatedData);
    console.log("Member updated!");
  } catch (error) {
    console.error("Error updating member:", error);
  }
};

// Get Members
export const getMember = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "memberData"));
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    return members;
  } catch (error) {
    console.error("Error getting members:", error);
    return [];
  }
};

// Delete Member
export const deleteMember = async (memberId) => {
  try {
    await deleteDoc(doc(db, "memberData", memberId));
    console.log("Member deleted!");
  } catch (error) {
    console.error("Error deleting member:", error);
  }
};

// Get Member by ID
export const getMemberById = async (memberId) => {
  try {
    const memberDoc = await getDoc(doc(db, "memberData", memberId));
    if (memberDoc.exists()) {
      return { id: memberDoc.id, ...memberDoc.data() };
    } else {
      console.log("No such member exists!");
      return null;
    }
  } catch (error) {
    console.error("Error getting member:", error);
    return null;
  }
};

// Query Members
export const queryMembers = async (field, operator, value) => {
  try {
    const q = query(
      collection(db, "memberData"),
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    return members;
  } catch (error) {
    console.error("Error querying members:", error);
    return [];
  }
};

// Get Sorted Members
export const getSortedMembers = async (
  sortField,
  sortDirection = "asc",
  memberLimit = 100
) => {
  try {
    const q = query(
      collection(db, "memberData"),
      orderBy(sortField, sortDirection),
      limit(memberLimit)
    );
    const querySnapshot = await getDocs(q);
    const members = [];
    querySnapshot.forEach((doc) => {
      members.push({ id: doc.id, ...doc.data() });
    });
    return members;
  } catch (error) {
    console.error("Error getting sorted members:", error);
    return [];
  }
};

// Subscribe to Members (Real-Time)
export const subscribeToMembers = (callback) => {
  try {
    return onSnapshot(collection(db, "memberData"), (snapshot) => {
      const members = [];
      snapshot.forEach((doc) => {
        members.push({ id: doc.id, ...doc.data() });
      });
      callback(members);
    });
  } catch (error) {
    console.error("Error subscribing to members:", error);
    return () => {}; // Return empty unsubscribe function
  }
};

//
