import { updateName as loginStatusChange, signOut } from "./authentication.js"
loginStatusChange(name => {
    const loginLink = document.getElementById("liLoginLink")
    const liDisplayUserName = document.getElementById("liDisplayUserName")
    const pUserName = document.getElementById("pDisplayUserName")
    const liManageReservation = document.getElementById("liManageReservation")
    if(name != null){
        loginLink.style.display = "none"
        liDisplayUserName.style.display = null
        pUserName.innerHTML = name
        liManageReservation.style.display = null
    }
    else{
        loginLink.style.display = null
        liDisplayUserName.style.display = "none"
        liManageReservation.style.display = "none"
    }
})
const logoutLink = document.getElementById("aLogoutLink")
logoutLink.onclick = signOut
