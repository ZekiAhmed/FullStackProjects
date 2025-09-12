import express from "express";
import { addNewTask, getAllTasks, deleteTask, updateTask } from "../controllers/task-controller.js";

const taskRouter = express.Router();


taskRouter.post("/add-new-task", addNewTask);
taskRouter.get("/get-all-tasks-by-userid/:id", getAllTasks);
taskRouter.delete("/delete-task/:id", deleteTask);
taskRouter.put("/update-task", updateTask);

export default taskRouter;
