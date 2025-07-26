document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const errorBox = document.getElementById("form-error-box");
    const errorList = document.getElementById("error-list");

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
      
      errorBox.classList.add("hidden");
      errorList.innerHTML = "";

      if (!res.ok) {
        if (res.status === 422 && Array.isArray(data.errors)) {
          const message = data.errors;
          const errorMessages = message.map((msg) => Object.values(msg)[0]);

          errorMessages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = msg;
            errorList.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.textContent = data.message || "Registration failed";
          errorList.appendChild(li);
        }
        errorBox.classList.remove("hidden");
        return;
      }
      document.getElementById("username").value = "";
      document.getElementById("fullname").value = "";
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";

      errorBox.classList.add("hidden");
      alert("Registered successfully!");
      window.location.href = "login.html";
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });
});
