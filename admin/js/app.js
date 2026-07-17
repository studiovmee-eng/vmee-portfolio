import { login } from "../../firebase/auth.js";

const form = document.getElementById("loginForm");

if (form) {

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            await login(email, password);

            window.location.href = "dashboard.html";

        } catch (error) {

            alert(error.message);

        }

    });

}
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword?.addEventListener("click", () => {

    if(passwordInput.type === "password"){

        passwordInput.type = "text";
        togglePassword.textContent = "🙈";

    }else{

        passwordInput.type = "password";
        togglePassword.textContent = "👁";

    }

});