import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from './db.js'

    // Reference to the document
const docRef = doc(db, 'carshare_app', 'GCAL_API_PARAMS');

// Fetch the document
const docSnap = await getDoc(docRef);

    // Get data from the document
const data = docSnap.data();

// Extract API_KEY and calendarId
export const API_KEY = data.API_KEY;
export const CALENDAR_ID = data.calendarID;

window.constants = {
    API_KEY,
    CALENDAR_ID
  };
