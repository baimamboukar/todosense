import { FC, useState, useContext } from "react";
import { Edit, Trash, CircleDashed, CheckCircle, BadgeCheck } from "lucide-react";

import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AlertModal from "@/components/modals/alert-modal";
import ToolTipBox from "@/components/ui/tool-tip-box";
import {NoteContext} from "@/providers/note-provider";
import { Note } from "@/types";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const HOST = import.meta.env.VITE_HOST;
interface NoteitemProps {
  note: Note;
  updatetask: (note: Note) => void;
}
  const format = (dateString: string) => {
    // Convert ISO date to Date object
    const dateObject = new Date(dateString);

    // Format the date as "DD MMM YYYY"
    return dateObject.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
const Noteitem: FC<NoteitemProps> = ({ note, updatetask }) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const [open, setOpen] = useState(false);
  const { fetchNotes } = context;
  const navigate = useNavigate();
  const markAsDone = async (note: Note) => {
    try {
        const options = {
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("tokenx") || "",
      }
        };
      note.isCompleted = true;
      const response = await axios.put(`${HOST}/api/v1/notes/updatetask/${note._id}`, {...note, isCompleted: true}, options);
      const json = response.data;
      
        toast.success(json.message);
      fetchNotes();
      navigate("/");
      
      
    } catch (error) {
      console.error("Error marking note as done:", error);
      // Handle errors (e.g., show a toast message)
      toast.error("Error marking note as done");
    }
  

    
  };

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={() => deleteNote(note._id)} />

      <Card className="w-full">
        <CardHeader className="px-2 pt-2">
          <div className="flex items-center justify-between w-h-full">
            <div>
              {note.tag.split(",").map((tag, index) => (
          <Badge key={index} variant={"outline"} className="mr-2">
            {tag.trim()} 
          </Badge>
        ))}
            </div>
            <div className="flex items-center gap-1">
               <ToolTipBox tip="Mark as Done">
                <button onClick={() => markAsDone({...note, isCompleted: true})} className="cursor-pointer w-8 h-8 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <BadgeCheck/>
                </button>
                
              </ToolTipBox>
              <ToolTipBox tip="Edit Note">
                <button onClick={() => updatetask(note)} className="cursor-pointer w-8 h-8 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <Edit size={20} />
                </button>
              </ToolTipBox>
              <ToolTipBox tip="Delete Note">
                <button onClick={() => setOpen(true)} className="cursor-pointer w-8 h-8 relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <Trash size={20} />
                </button>

              </ToolTipBox>

            </div>
          </div>
        </CardHeader>
        <CardContent>
        <CardTitle className="flex items-center">
      {/* Icon and title aligned horizontally */}
      {note.isCompleted ? <CheckCircle size={18} /> : <CircleDashed size={18} />}
    {note.isCompleted ?   <span className="ml-2 line-through text-blue-400">{note.title}</span> :   <span className="ml-2 text-blue-400">{note.title}</span>}
          </CardTitle>
            <div className="mt-1 text-base break-words">
            Added at {format(note.date)}
          </div>
          <div className="mt-3 text-base break-words">
            {note.description}
          </div>
        </CardContent>
      </Card>

    </>
  );
};

export default Noteitem;
