import express from "express";
const router = express.Router();
import Notes from "../models/Notes.js";
import fetchuser from "../middleware/fetchuser.js";
import { body, validationResult } from "express-validator";

// ROUTE 1: Get all the notes of user using :  GET -> "/api/v1/notes/fetchallnotes" . Note: ' Login Required'.
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  // Put everything inside the try block so that if any error occur then,
  // we can handle in the catch block
  try {
    // get all the notes using the user id
    const notes = await Notes.find({ user: req.user.id });
    console.log(notes);
    // return success status 200 with notes message
    return res
      .status(200)
      .json({ message: "All Notes Fetched Successfully", notes });
  } catch (error) {
    // If any error occured then return status 500 with message Internal Server error
    return res.status(500).json({
      message: "Internal Server Error",
      errors: error,
    });
  }
});

// ROUTE 2: Add new notes for loggedIn user using :  POST -> "/api/v1/notes/addnotes" . Note: ' Login Required'.
router.post(
  "/addnote",
  fetchuser,
  [
    // body("user").exists(),
    body("title", "Title shouls be more than 2 characters").isLength({
      min: 3,
    }),
    body("description", "Description must be  10 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const { title, description, tag } = req.body;
    const errors = validationResult(req);
    //  If there is any error return error 400 status with the error
    if (!errors.isEmpty()) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: errors,
      });
    }
    // Put everything inside the try block so that if any error occur then,
    // we can handle in the catch block
    try {
      // Get all  the notes data enetred by user using destructuring
      const note = new Notes({
        title,
        description,
        tag,
        date: new Date().toISOString(),
        user: req.user.id,
      });
      // Save the notes into the database
      const savenotes = await note.save();
      // return success status 200 with the note message
      return res.status(200).json({
        message: "Note added successfully",
        note: savenotes,
      });
    } catch (error) {
      // If any error occured then return status 500 with message Internal Server error
      return res.status(500).json({
        message: "Internal Server Error",
        error: error,
      });
    }
  }
);
// ROUTE 3: Update any existing note for loggedIn user using :  PUT -> "/api/v1/notes/updatenote/:id" . Note: ' Login Required'.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  // Get all the notes data entered by the user using destructuring
  const { title, description, tag, date, isCompleted } = req.body;
  const errors = validationResult(req);
  //  If there is any error, return error 400 status with the error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Internal Server Error",
      error: errors,
    });
  }

  // Put everything inside the try block so that if any error occurs then,
  // we can handle it in the catch block
  try {
    // Create a new object to store the user's notes data
    let newnote = {
      title,
      description,
      tag,
      date,
      isCompleted,
    };

    // Find the note to be updated using id given in the parameter
    let note = await Notes.findById(req.params.id);
    // If not found, return not found error
    if (!note) {
      return res.status(404).json({ message: "Not Found" });
    }
    // Check if the note belongs to the logged-in user; if not, return unauthorized error
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Not Allowed" });
    }

    // Update the note with the new data
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );

    // Return success status 200 with the note message
    return res.status(200).json({
      message: "Note Updated Successfully",
      note: note,
    });
  } catch (error) {
    // If any error occurs, return status 500 with message Internal Server error
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

// ROUTE 4: Delete any note for loggedIn user using :  DELETE -> "/api/v1/notes/deletenote/:id" . Note: ' Login Required'.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  //  If there is any error return error 400 status with the error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Internal Server Error",
      error: errors,
    });
  }
  // Put everything inside the try block so that if any error occur then,
  // we can handle in the catch block
  try {
    // Find the note to be deleted using id given in parameter
    let note = await Notes.findById(req.params.id);
    // If not found return not found error
    if (!note) {
      return res.status(404).json({ message: "Not Found" });
    }
    // Check if the note belongs to the logged in user if not return unauthorised error
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorised: Not Allowed" });
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    // return success status 200 with the note message

    return res
      .status(200)
      .json({ message: "Note deleted Successfully", note: note });
  } catch (error) {
    // If any error occured then return status 500 with message Internal Server error
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

// ROUTE 5: Mark a note as read for loggedIn user using: PUT -> "/api/v1/notes/markasread/:id" . Note: 'Login Required'.
router.patch("/markasdone/:id", fetchuser, async (req, res) => {
  const errors = validationResult(req);
  let id = re.params.id;
  console.log(req);
  // If there is any error, return a 400 status with the error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Bad Request",
      error: errors.array(),
    });
  }

  try {
    // Find the note to be marked as read using id given in parameter
    let note = await Notes.findById(req.params.id);
    console.log(note);

    // // If not found, return a not found error
    // if (!note) {
    //   return res.status(404).json({ message: "Not Found" });
    // }

    // Update the note's read status to true
    note.isRead = true;

    // Save the updated note
    await note.save();

    // Return success status 200 with the updated note
    return res
      .status(200)
      .json({ message: "Note marked as read successfully", note });
  } catch (error) {
    // If any error occurred, return a status 500 with an internal server error message
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

export default router;
