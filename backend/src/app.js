import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173" ,
    credentials: true,
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"));

app.use(cookieParser());

//import routes
import newsRoutes from "./routes/news.routes.js";
import searchRoutes from "./routes/search.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comments.routes.js";
import likeRoutes from "./routes/like.routes.js";


//routes declaration
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);

export { app }