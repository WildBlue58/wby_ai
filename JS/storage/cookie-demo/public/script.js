// console.log("智能前端，智能后端，笑傲秋招");
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (event) => { 
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    // console.log(username, password);
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password
            }),
        });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error("Login failed:", err);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    // 登录吗
    try {
        const response = await fetch("/check-login",);
        const data = await response.json();
        console.log(data);
        if (data.loggedIn) {
            loginSection.style.display = "none";
            welcomeSection.style.display = "block";
            userDisplay.textContent = data.username;
        }
    } catch (err) {
        console.error("Check login failed:", err);
    }
});