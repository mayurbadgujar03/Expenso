# 💸 Expenso

> A personal daily & monthly expense tracker built for simplicity, speed, and insight.

---

## 🚀 Summary

**Expenso** is a lightweight expense management platform designed to help users log, view, and analyze their spending habits. It enables item tracking, purchase confirmations, and dynamic daily/monthly summaries — all via a clean and efficient API.

---

## 📛 Badges

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-blue?style=flat-square)

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Auth:** JWT + Cookies
- **Others:** dotenv, CORS, Morgan, Bcrypt

---

## ✨ Features

- ✅ User Authentication (Register/Login/Logout)
- ✅ Create & Manage Expense Items
- ✅ Confirm Purchases with Price Validation
- ✅ Daily and Monthly Stats Calculation
- ✅ History Log with Item Details (Populated)
- ✅ Input Validations & Error Handling
- ✅ Modular Folder Structure (MVC)

---

## ⚙️ Installation

```bash
# Clone the repo
git clone https://github.com/mayurbadgujar03/Expenso.git

# Navigate into project directory
cd expenso

# Install dependencies
npm install

# Run the server (development)
npm run dev
```

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the root directory and add:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

# 📡 API Endpoints

| Method | Endpoint                                      | Description                         |
|--------|-----------------------------------------------|-------------------------------------|
| POST   | /api/v1/user/register                         | Register a new user                 |
| POST   | /api/v1/user/login                            | Log in user and set cookie token    |
| GET    | /api/v1/user/profile                          | Get user profile                    |
| POST   | /api/v1/user/logout                           | Logout and clear token              |
| POST   | /api/v1/user/item/create                      | Create an expense item              |
| GET    | /api/v1/user/dashboard                        | Get items + daily/monthly stats     |
| POST   | /api/v1/user/dashboard/purchase/confirm       | Confirm a new purchase              |
| GET    | /api/v1/user/dashboard/purchase/history       | Get full purchase history           |

---

# 🗂 Folder Structure

```
expenso/
├── .gitignore
├── .prettierignore
├── .prettierrc
├── package-lock.json
├── package.json
├── public/
│   └── images/
│       └── .gitkeep
└── src/
    ├── app.js
    ├── index.js
    ├── controllers/
    │   ├── auth.controllers.js
    │   ├── dashboard.controllers.js
    │   ├── history.controllers.js
    │   └── profile.controllers.js
    ├── db/
    │   └── index.js
    ├── middlewares/
    │   └── auth.middleware.js
    ├── models/
    │   ├── Items.models.js
    │   ├── Purchases.models.js
    │   └── Users.models.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── dashboard.routes.js
    │   ├── history.routes.js
    │   └── profile.routes.js
    └── utils/
        ├── api-error.js
        └── api-response.js

```

---

# 🤝 Contributing

Pull requests are welcome! If you’d like to contribute:

- Fork the repo  
- Create a new branch: `git checkout -b feature/your-feature`  
- Commit your changes  
- Push to the branch  
- Open a Pull Request 🚀  

---

# 👨‍💻 Author

**Mayur Badgujar**  
📧 <mayurbadgujar873@gmail.com> 
🐦 [@mayurbadgujar36](https://x.com/mayurbadgujar36)
📎 [linkedin.com/mayur-badgujar](https://www.linkedin.com/in/mayur-badgujar-060a7927b/)  

---

💡 _Built with coffe and code. Powered by curiosity._
