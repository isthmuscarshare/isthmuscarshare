import { updateName, signOut } from "./authentication.js"
updateName(name => {
    const loginLink = document.getElementById("liLoginLink")
    const liDisplayUserName = document.getElementById("liDisplayUserName")
    const pUserName = document.getElementById("pDisplayUserName")
    if(name != null){
        loginLink.style.display = "none"
        liDisplayUserName.style.display = null
        pUserName.innerHTML = name
    }
    else{
        loginLink.style.display = null
        liDisplayUserName.style.display = "none"
    }
})
const logoutLink = document.getElementById("aLogoutLink")
logoutLink.onclick = signOut
