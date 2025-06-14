document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("click")

    const username = document.getElementById("username").value.trim();
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

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
      document.getElementById("username").value = "";
      document.getElementById("fullname").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      alert("Registered successfully!");
      window.location.href = "login.html";
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
});
