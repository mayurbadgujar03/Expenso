document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/v1/user/profile", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Not authorized");
      return;
    }

    document.getElementById("username").textContent = data.data.username;
    document.getElementById("email").textContent = data.data.email;
    document.getElementById("fullname").textContent = data.data.fullname;
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Couldn't fetch user data");
  }

  const logoutBtn = document.querySelectorAll(".logoutBtn");

  logoutBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const res = await fetch("/api/v1/users/logout", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) {
          alert(`Error: ${data.message || "Can't logout"}`);
          return;
        }

        alert("Logged out successfully!");
        window.location.href = "index.html";
      } catch (err) {
        alert("❌ Something went wrong. Try again.");
        console.error(err);
      }
    });
  });
});
