import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import db from './utils/db.js';

dotenv.config()

const app = express();

const port= process.env.PORT || 8080;

app.use(cors({
    origin: ['*'],

}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db();


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get("/api/v1/healthcheck",(req,res)=>{
    res.send("Server is running")
})
