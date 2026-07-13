import { db } from "./config.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export async function saveSection(sectionName, data) {

    await setDoc(
        doc(db, "sections", sectionName),
        data,
        { merge: true }
    );

}

export async function getSection(sectionName) {

    const snapshot = await getDoc(
        doc(db, "sections", sectionName)
    );

    if (snapshot.exists()) {
        return snapshot.data();
    }

    return null;

}

export async function updateSection(sectionName, data) {

    await updateDoc(
        doc(db, "sections", sectionName),
        data
    );

}