console.log("Hello World");
const modalHeader = document.querySelector(".modal-title")
const modalBody = document.querySelector(".body-info")
const modalFooter = document.querySelector(".footer-info")
let login = false;
let userPassword = localStorage.getItem("pass");
//Variable for login
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password")
const loginBtn = document.querySelector(".login");
const forgetPasswordBtn = document.querySelector(".forget-password");
const goBackBtn = document.querySelector(".go-back-history");
//variable for reset
const goBackToLogin = document.querySelector(".go-back");
const passwordOne = document.querySelector(".pass-0");
const passwordTwo = document.querySelector(".pass-1");
const resetBtn = document.querySelector(".reset");
//Eventlisteners for logjn
loginBtn.addEventListener("click", checkInputLogin);
emailInput.addEventListener("click", removeError);
//Eventlisteners for reset
forgetPasswordBtn.addEventListener("click", changePasswordPage);
goBackToLogin.addEventListener("click", goBackLogin);
resetBtn.addEventListener("click", checkInputReset);
goBackBtn.addEventListener("click", goback);
//functions for login
function checkInputLogin() {
    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
    }
    if (emailInput.checkValidity()) {
        checkInformation()
    }
}

function removeError() {
    emailInput.classList.remove("error")
    passwordInput.classList.remove("error")
}

//functions for reset
function checkInputReset() {
    if (passwordOne.value.length < 8 || passwordTwo.value.length < 8) {
        alert("Password must contain at least 8 characters")
        return;
    }
    if (passwordOne.value != passwordTwo.value) {
        alert("new password and confirm password are not the same. Make sure they are the same.")
        return;
    }
    changePassword()
}

function checkInformation() {
    const dashboards = `<a href="dashboard-students.html"><span class="d-block p-2 text-white bg-primary text-center">Dashboard Students and Grades</span></a> <a href="DashboardCrypto.html" class="text-decoration-color-warning"><span class="d-block p-2 text-white bg-warning text-center">Dashboard Crypto</span></a> <a href="dashboard-weer.html" class="text-decoration-color-info"><span class="d-block p-2 text-white bg-info text-decoration-color-info text-center">Dashboard Weather</span></a> <a href="cashierpage.html" class="text-decoration-color-danger"><span class="d-block p-2 text-white bg-danger text-decoration-color-danger text-center">Dashboard Cashier</span></a>`
    if (passwordInput.value == userPassword && emailInput.value == '12345678@gmail.com') {
        login = true;
        localStorage.setItem("accessgranted", login)
     
        console.log("correct")
        document.querySelector(".modal-header").classList.add("bg-dark")
        document.querySelector(".modal-title").classList.add("text-white")
        document.querySelector(".modal-title").innerHTML = `Access Granted`
        document.querySelector(".body-info").innerHTML = `Welcome back user2!!<br><br> <p class="text-center bg-dark text-white rounded">Please choose a dashboard</p>`
        document.querySelector(".modal-body").insertAdjacentHTML("beforeend", dashboards)
        document.querySelector(".modal-footer").classList.add("bg-dark")
        // document.querySelector(".footer-info").innerHTML = `Close`
        document.querySelector(".trigger-modal").click();
        // setTimeout(function() {
        //     location.href = "dashboard-students.html"
        // }, 1400) 
    } else {
        document.querySelector(".modal-title").innerHTML = `Error 401 (Unauthorized)`
        // document.querySelector(".modal-title").classList.add("text-white")
        document.querySelector(".body-info").innerHTML = `Error 401: Incorrect email or password`
        // document.querySelector(".modal-footer").classList.add("bg-info")
        document.querySelector(".footer-info").innerHTML = `Close`
        document.querySelector(".trigger-modal").click();
        emailInput.classList.add("error")
        passwordInput.classList.add("error")
    }
}


function changePassword() {
    userPassword = passwordTwo.value;
    localStorage.setItem("pass", userPassword);
    passwordOne.value = '';
    passwordTwo.value = '';
    document.querySelector(".modal-title").innerHTML = `Password reset`;
    document.querySelector(".body-info").innerHTML = `Password changed successfully.`;
    document.querySelector(".footer-info").innerHTML = `Close`;
    document.querySelector(".trigger-modal").click();
    goBackLogin()
}

function changePasswordPage() {
    document.querySelector(".display-none-login").classList.add("display-none");
    document.querySelector(".display-none-reset").classList.remove("display-none")
}

function goBackLogin() {
    document.querySelector(".display-none-login").classList.remove("display-none")
    document.querySelector(".display-none-reset").classList.add("display-none");
}

function goback() {
    history.back()
}


