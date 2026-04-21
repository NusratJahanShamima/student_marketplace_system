
//REGISTER
const registerForm = document.getElementById('registerForm');

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

    
        if (!name || !email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (data.success) {
                alert("Registration successful");
                window.location.href = "login.html";
            } else {
                alert(data.message || "Registration failed");
            }

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    });
}


//LOGIN
const loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        
        if (!email || !password) {
            alert("All fields are required");
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (data.success) {

                
                localStorage.removeItem('user');

                localStorage.setItem('user', JSON.stringify(data.user));

                alert("Login successful");

                window.location.href = "buy_sell.html";

            } else {
                alert(data.message || "Invalid email or password");
            }

        } catch (err) {
            console.log(err);
            alert("Server error");
        }
    });
}