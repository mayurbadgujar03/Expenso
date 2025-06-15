document.addEventListener("DOMContentLoaded", async () => {
  try {
    const listContainer = document.getElementById("listContainer");

    const res = await fetch("/api/v1/user/history", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      alert(data.message || "Not authorized");
      return;
    }

  } catch (error) {
    console.error("Fetch error:", error);
    alert("Couldn't fetch user data");
  }
});
