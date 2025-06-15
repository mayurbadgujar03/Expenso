document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.message || "Registration failed"}`);
        return;
      }
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      alert("Logged in successfully!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
      console.error(err);
    }
  });
});
