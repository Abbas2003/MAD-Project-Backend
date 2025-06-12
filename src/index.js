import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import setupSwagger from "./swagger.js";

import UserRoutes from "./routes/User.routes.js";
import authRoutes from "./routes/Auth.routes.js";


dotenv.config();

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());

// Setup Swagger
setupSwagger(app);

app.get("/", (req, res) => {
    res.send("MAD Project Backend!");
})

// Routes
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/auth", authRoutes);

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
    console.log(`Press Ctrl+C to stop the server`);
    await connectDB();
})

const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        }).catch((err) => {
            console.error("Error connecting to MongoDB", err);
            process.exit(1);
        })
}