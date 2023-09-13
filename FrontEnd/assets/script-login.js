document.addEventListener('DOMContentLoaded', function() {

//login page
const form = document.getElementById('login-form');
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        const userId = result.userId;
        const token = result.token;

        //stocker l'id et le token en local pour reseter identifié
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);

        console.log("User:", result);

        if (userId === 1) {
            window.location.href = '/';
        } else {
            const sectionLogin = document.querySelector("#login-form");
            const errorMsg = document.createElement("p");
            errorMsg.textContent = "Identifiant ou mot de passe incorrecte";
            sectionLogin.appendChild(errorMsg);
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
})