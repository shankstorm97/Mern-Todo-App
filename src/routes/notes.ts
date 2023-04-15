import express from "express";
import * as notesController from "../controllers/notes";

const router = express.Router();

router.get("/", notesController.getNotes);
router.post("/", notesController.createNote);
router.patch("/:noteId", notesController.updateNote);
router.get("/:noteId", notesController.getNote);
router.delete("/:noteId", notesController.deleteNote);

export default router;
