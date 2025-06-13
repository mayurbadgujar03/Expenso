document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("working")
    const username = document.getElementById("username").value;
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log({ username, fullname, email, password });
    
    try {
      const res = await fetch("/api/v1/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, fullname, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.message || "Registration failed"}`);
        return;
      }

      alert("Registered successfully!");
      window.location.href = "login.html";
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
      console.error(err);
    }
  });
});
