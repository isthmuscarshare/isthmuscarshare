    import {trySignIn} from './authentication.js'
    const submitButton = document.getElementById("submit-button")
    submitButton.onclick = trySignIn
