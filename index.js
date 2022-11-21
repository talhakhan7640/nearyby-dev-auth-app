import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import UserRouter from './routes/userRoute.js';
import authenticateUser from './auth.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (request, response) => {
 response.send("You are trying to access backend of nearby developer!!") 
})

// User Routes
app.use("/users", UserRouter);

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", authenticateUser, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

// Handling CORS Errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
     "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

try {
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      app.listen(process.env.PORT, () => console.log(`Connected to database on port ${process.env.PORT}!`))
    )
    .catch((error) => {
        console.log("Something went wrong, Could not connect with database!")
    });
} catch (e) {
  console.log("Could not connect, Something went wrong");
}
