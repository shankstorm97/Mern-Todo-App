import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid noteId ");
    }
    const Note = await NoteModel.findById(noteId).exec();
    if (!Note) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(Note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    if (!title) {
      throw createHttpError(404, "Note must have a title");
    }
    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteParams {
  noteId: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid noteId ");
    }
    if (!newTitle) {
      throw createHttpError(404, "Note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();
    res.status(200).json(updateNote);
    // Another method to update the note is by using noteModel.findByIdAndUpdate() function of mongoose
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;

  try {
    // if (!mongoose.isValidObjectId(noteId)) {
    //   throw createHttpError(400, "Invalid noteId ");
    // }
    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(400, "Note not found");
    }

    // await note.deleteOne();
    await NoteModel.findByIdAndDelete(note);

    // res.status(200).json(`${noteId} deleted succesfully`);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
