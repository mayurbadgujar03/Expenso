document.addEventListener("DOMContentLoaded", async () => {
  try {
    const listContainer = document.getElementById("listContainer");

    const res = await fetch("/api/v1/user/history", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || "Not authorized");
      return;
    }
    listContainer.innerHTML = "";

    const sortedHistory = data.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    sortedHistory.forEach((entry) => {
      const item = entry.item;
      const formattedDate = new Date(entry.createdAt).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        },
      );

      const html = `
        <div class="flex items-center bg-white p-4 rounded-2xl shadow-md hover:shadow-lg transition justify-between border border-gray-100">
          <div class="flex items-center gap-4">
            <div class="bg-gray-100 p-3 rounded-xl">
              <img src="${item.image?.url || ""}" alt="${item.name}" class="w-10 h-10 object-contain" />
            </div>
            <div>
              <h2 class="text-base font-medium text-gray-900">${item.name}</h2>
              <p class="text-sm text-gray-400">${formattedDate}</p>
              <div class="flex gap-2 mt-1">
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">
                  ₹${item.price}
                </span>
                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-700">
                  Qty: ${entry.quantity}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <p class="text-base font-semibold text-gray-800">₹${entry.total_price}</p>
          </div>
        </div>
      `;

      listContainer.insertAdjacentHTML("beforeend", html);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Couldn't fetch user data");
  }
});
