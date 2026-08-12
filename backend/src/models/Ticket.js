const mongoose = require('mongoose');    
const ticketSchema = new mongoose.Schema(     //Ticket Database Schema
    {
        ticketId: {
            type: String,   
            required: true,
            unique: true
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
        },

        customerEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        subject: {
            type: String,
            required: true,
            trim: true,
        },

        description:{
            type: String,
            required:true,
            trim: true,
        },

        orderId: {
            type: String,
            trim: true,
            default: null
        },
        
        status: {
            type:String,
            enum: ["Open", "In Progress", "Closed"],
            default: "Open",
        },
    },
    {
        timestamps: true,
    }
);

//Export the ticket model for use in routes
const Ticket  = mongoose.model("Ticket",ticketSchema);
module.exports = Ticket;
