// Mongoose schema for ticket notes.


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
