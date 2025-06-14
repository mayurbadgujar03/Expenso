document.addEventListener("DOMContentLoaded", async () => {
  try {
    const dailyTotal = document.getElementById("dailyTotal");
    const monthlyTotal = document.getElementById("monthlyTotal");
    const container = document.getElementById("itemsContainer");

    const res = await fetch("/api/v1/user/dashboard", {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Not authorized");
      return;
    }
    const items = data.data.items;

    dailyTotal.textContent = `₹${data.data.dailyTotal}`;
    monthlyTotal.textContent = `₹${data.data.monthlyTotal}`;

    items.forEach((item) => {
      const card = document.createElement("div");

      card.className =
        "bg-white rounded-2xl p-3 md:p-4 shadow-md border border-gray-100 flex flex-col";
      card.setAttribute("id", item._id);

      card.innerHTML = `
    <h3 class="text-sm md:text-base font-semibold text-gray-800 mb-2">
      ${item.name}
    </h3>
    <div class="bg-gray-100 rounded-xl h-28 md:h-36 flex items-center justify-center">
      <img
        src="${item.image.url}"
        alt="${item.name}"
        class="h-16 object-contain"
      />
    </div>
    <div class="flex justify-center items-center gap-3 mt-4">
      <button
        class="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full text-gray-700 text-lg"
      >
        -
      </button>
      <span class="text-base md:text-lg">1</span>
      <button
        class="w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full text-gray-700 text-lg"
      >
        +
      </button>
    </div>
    <div class="flex justify-between items-center mt-4">
      <span
        class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm"
      >
        ₹${item.price}
      </span>
      <button
        class="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs md:text-sm"
      >
        Buy
      </button>
    </div>
  `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Couldn't fetch user data");
  }
});
