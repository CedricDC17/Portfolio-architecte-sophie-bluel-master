document.addEventListener('DOMContentLoaded', function () {

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
        if (userId === 1) {
            window.location.href = '/';
        } else {
            const imageError = document.getElementById('imageError');
            imageError.style.display = 'block';
        }


    

    });
})