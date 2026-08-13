/**
 * This is the Schema definition of the notes section of the Ticket
 * There are two namely 
    1)ticket which will be grabbed as per the ID
    2) noteText which will have the notes
 */


const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(      
    {
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
        },

        noteText: {
            type:String,
            required: true,
            trim:true,
        },
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model("Note",noteSchema);
module.exports = Note;
