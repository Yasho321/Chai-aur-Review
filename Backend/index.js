import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import db from './utils/db.js';
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import "./utils/passport.config.js"
import authRouter from './routes/auth.routes.js';
import courseRouter from './routes/courses.routes.js';

dotenv.config()

const app = express();

const port= process.env.PORT || 8080;

app.use(cors({
    origin: [ process.env.FRONTEND_URL , "http://localhost:3000"],
    credentials: true,

}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db();

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions", 
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/api/auth",authRouter);
app.use("/api/course",courseRouter)



app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get("/api/v1/healthcheck",(req,res)=>{
    res.send("Server is running")
})
