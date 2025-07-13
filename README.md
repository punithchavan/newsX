# 📰 NewsX – A News-Integrated Twitter-like Platform

NewsX is a full-stack MERN application that combines the social power of a microblogging platform with real-time news fetched from public APIs. Users can post tweets with hashtags, and clicking on any hashtag reveals both related tweets and current news headlines on that topic — creating a dynamic and informative timeline.

---

## 🚀 Features

- 🧑‍💬 User registration and login (JWT authentication)
- 📝 Create tweets with hashtags (e.g., #GoldTheft)
- 🔎 Clickable hashtags that fetch:
  - Related tweets from the database
  - Live news from external APIs (e.g., NewsAPI, GNews)
- ❤️ Like, retweet, and comment functionality
- 🔐 Protected routes and secure backend
- ⚡ Fully responsive UI built with React + Tailwind

---

## 🛠️ Tech Stack

### Frontend:
- React
- React Router
- Tailwind CSS
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Bcrypt for password hashing

### APIs:
- [NewsAPI](https://newsapi.org/) *(or any other free news API)*
- Optional: ContextualWeb/GNews via RapidAPI

---