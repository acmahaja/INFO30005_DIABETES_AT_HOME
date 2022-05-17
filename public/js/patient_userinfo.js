// DOM Elements
const patientPasswordForm = document.querySelector("#change-pw-form");
const patientScreenNameForm = document.querySelector("#change-sname-form");

if (patientPasswordForm) {
  patientPasswordForm.addEventListener("submit", (e) => {
    // Prevent event from loading other pages
    e.preventDefault();

    // Get old password, new password, and password confirm
    const oldPassword = document.getElementById("old-pw").value;
    const newPassword = document.getElementById("new-pw").value;
    const confirmPassword = document.getElementById("confirm-pw").value;
  });
}
