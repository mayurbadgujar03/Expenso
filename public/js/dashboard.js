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
        class="decrement w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full text-gray-700 text-lg"
      >
        -
      </button>
      <span class="quantity text-base md:text-lg">1</span>
      <button
        class="increment w-7 h-7 md:w-8 md:h-8 bg-gray-200 rounded-full text-gray-700 text-lg"
      >
        +
      </button>
      </div>
      <div class="flex justify-between items-center mt-4">
      <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs md:text-sm">
         ₹<span class="price">${item.price}
      </span>
      </span>
      <button class="buy-btn bg-green-500 text-white px-3 py-1.5 rounded-full text-xs md:text-sm">
        Buy
      </button>
    </div>`;

      const incrementBtn = card.querySelector(".increment");
      const decrementBtn = card.querySelector(".decrement");
      const quantitySpan = card.querySelector(".quantity");
      const priceSpan = card.querySelector(".price");

      const buyButton = card.querySelector(".buy-btn");
      buyButton.addEventListener("click", () => purchaseConfirmation(card));

      let quantity = 1;
      const basePrice = item.price;

      function updateDisplay() {
        quantitySpan.textContent = quantity;
        const totalPrice = basePrice * quantity;
        priceSpan.textContent = `${totalPrice}`;
      }

      incrementBtn.addEventListener("click", () => {
        quantity++;
        updateDisplay();
      });

      decrementBtn.addEventListener("click", () => {
        if (quantity > 1) {
          quantity--;
          updateDisplay();
        }
      });

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Couldn't fetch user data");
  }

  const form = document.getElementById("addItemForm");
  const modal = document.getElementById("addItemModal");

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newItemName = document.getElementById("newItemName").value;
    const newItemPrice = document.getElementById("newItemPrice").value;
    const newItemImageURL = document.getElementById("newItemImageURL").value;

    try {
      const res = await fetch("/api/v1/user/dashboard/item/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newItemName,
          price: newItemPrice,
          image: {
            url: newItemImageURL,
            localpath: "",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.message || "Failed to add item"}`);
        return;
      }
      alert("Item added");
      form.reset();
      modal.classList.add("hidden");
      window.location.reload();
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
      console.error(err);
    }
  });

  function purchaseConfirmation(card) {
    const itemName = card.querySelector("h3").innerText;
    const itemPrice = card.querySelector(".price").innerText;
    const quantity = card.querySelector(".quantity").innerText;
    const id = card.getAttribute("id");

    const modal = document.createElement("div");
    modal.id = "confirmationModal";
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";

    // Modal inner content
    modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-8 border-t-8 border-[#007bff] space-y-6">
  <!-- Title -->
  <div>
    <h2 class="text-2xl font-bold text-purple-600 text-center">Confirm Purchase</h2>
  </div>

  <!-- Message -->
  <div class="text-center text-gray-700 text-base leading-relaxed" id="confirmationMessage">
    Are you sure you want to buy <strong class="text-gray-900">${itemName}</strong> at 
    <strong class="text-green-600">₹${itemPrice}</strong> with quantity 
    <strong class="text-blue-600">${quantity}</strong>?
  </div>

  <!-- Buttons -->
  <div class="flex justify-center gap-4 pt-2">
    <button
      id="cancelConfirmation"
      class="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium transition"
    >
      Cancel
    </button>
    <button
      id="confirmPurchaseBtn"
      class="px-6 py-2 rounded-lg bg-[#007bff] text-white font-semibold hover:bg-blue-600 transition"
    >
      Yes, Confirm
    </button>
  </div>
</div>

  `;

    document.body.appendChild(modal);

    document.getElementById("cancelConfirmation").onclick = () => {
      modal.remove();
    };

    document.getElementById("confirmPurchaseBtn").onclick = () => {
      onConfirm(quantity, id, itemPrice);
      modal.remove();
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  const onConfirm = async (quantity, id, itemPrice) => {
     const price = Number(itemPrice);
    try {
      const res = await fetch("/api/v1/user/dashboard/purchase/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          total_price: price,
          item_id: id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.message || "Purchase failed"}`);
        return;
      }

      alert("Purchased successfully!");
      window.location.href = "dashboard.html";
    } catch (err) {
      alert("❌ Something went wrong. Try again.");
      console.error(err);
    }
  };

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
