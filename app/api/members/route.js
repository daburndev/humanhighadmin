import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// GET all members
export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "memberData"));
    const members = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST to create new member
export async function POST(request) {
  try {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "memberData"), data);

    return NextResponse.json(
      {
        id: docRef.id,
        ...data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
