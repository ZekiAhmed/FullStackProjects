import express from "express";
import { test } from "../controller/user.controller.js";

const router = express.Router();

router.post("/create", (req, res) => {
    const userInformation = req.body;

    console.log(userInformation);
    res.status(201).json("user created");
});

router.get("/test", test);


export default router;