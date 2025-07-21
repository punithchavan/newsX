import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
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


//routes declaration
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/search", searchRoutes);

export { app }