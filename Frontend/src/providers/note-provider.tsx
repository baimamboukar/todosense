import { FC, useState, createContext } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { Note } from "@/types";

const HOST = import.meta.env.VITE_HOST;

interface InitialDataType {
  notes: Note[] | null;
  deleteNote: (id: string) => void;
  fetchNotes: () => void;
  markNoteAsDone: (id: string) => void;
}

const notes: Note[] = [];
const initialData: InitialDataType = {
  notes,
  deleteNote: () => {},
  fetchNotes: () => {},
  markNoteAsDone: () => {}, 
};

export const NoteContext = createContext(initialData);

interface NoteProviderProps {
  children: React.ReactNode;
}

const NoteProvider: FC<NoteProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[] | null>(null);
    const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/json",
    "auth-token": localStorage.getItem("tokenx") || "",
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${HOST}/api/v1/notes/gettasks`, {
        headers,
      });
      const json = response.data;
      setNotes(json.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      // Handle errors (e.g., show a toast message)
      toast.error("Error fetching notes");
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const response = await axios.delete(`${HOST}/api/v1/notes/deletenote/${id}`, {
        headers,
      });
      const json = response.data;
      toast.success(json.message);
          fetchNotes();
          navigate("/");
    } catch (error) {
      console.error("Error deleting note:", error);
      // Handle errors (e.g., show a toast message)
      toast.error("Error deleting note");
    }
  };

  // New function to mark a note as done
    const markNoteAsDone = async (id: string) => {
      console.log(id)
    try {
      const response = await axios.patch(`${HOST}/api/v1/notes/markasdone/${id}`, {
        headers,
      });
      const json = response.data;
      if (json.success) {
        toast.success(json.message);
        fetchNotes();
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.error("Error marking note as done:", error);
      // Handle errors (e.g., show a toast message)
      toast.error("Error marking note as done");
    }
  };

  return (
    <NoteContext.Provider value={{ notes, deleteNote, fetchNotes, markNoteAsDone }}>
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;
