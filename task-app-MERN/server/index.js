import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import database from './database/index.js';


database();
const app = express();

app.use("/api", (req, res) => {
  res.status(200).json({ message: "Hello Express" });
});

app.listen(5000, () => console.log(`App is now running at port 5000...`));