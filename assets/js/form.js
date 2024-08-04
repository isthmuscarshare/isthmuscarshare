import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { db } from './db.js'

// Reference to the document
const docRef = doc(db, 'carshare_app', 'GCAL_API_PARAMS');

// Fetch the document
const docSnap = await getDoc(docRef);

// Get data from the document
const data = docSnap.data();

// Extract API_KEY and calendarId
const API_KEY = data.API_KEY;
const CALENDAR_ID = data.calendarID;
const modal = new bootstrap.Modal(document.getElementById('errorModal')); // Create new modal instance

function showErrorModal(message) {
    document.getElementById('errorModalMessage').textContent = message; // Set error message in modal
    modal.show();
}

function hideErrorModal() {
    modal.hide();
}

function check_calendar(){
    const selectedDate = document.getElementById('date').value // Assuming 'date' is the ID of your date input field
    const startTimeString = document.getElementById('startTime').value // Value like 2:00 PM
    const endTimeString = document.getElementById('endTime').value // Value like 4:00 PM

    let startDateTime = new Date(selectedDate + ' ' + startTimeString)
    let endDateTime = new Date(selectedDate + ' ' + endTimeString)

    if (startDateTime >= endDateTime) {
        showErrorModal('End Time must be after Start Time.  Please revise your reservation start time to be before your end time')
        return
    }

    startDateTime.setMinutes(startDateTime.getMinutes() - 1)
    endDateTime.setMinutes(endDateTime.getMinutes() + 1)

    if (startDateTime < new Date()) {
        showErrorModal('Cannot check out car before current time.  Please revise your start time to be after '+ (new Date()).toLocaleString())
        return
    }

    const startIsoDateTime = startDateTime.toISOString()
    const endIsoDateTime = endDateTime.toISOString()

    fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?key=${API_KEY}&timeMin=${startIsoDateTime}&timeMax=${endIsoDateTime}`)
        .then(response => response.json())
        .then(data => {
            console.log(data.items.len)
            console.log(data.items)
            if(data.items.length>0){
                showErrorModal('The car was already reserved during that time.  Please consult the calendar below and choose a different time.')
                submitted = false
            }else{
                submitted = true
            }
        })
        .catch(error => {
            console.error('Error fetching events:', error)
        });

    showErrorModal('Submission in progress. Wait one moment.')
    hideErrorModal() 
    setTimeout(function (){
        hideErrorModal()
    }, 4000);
}

$("#myForm").on("submit", check_calendar)
