// Service functions for ticket CRUD operations.

const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const generateTicketId = require("../utils/generateTicketId");

const createTicket = async(ticketData) =>{      
    let ticketId;
    let ticketExists;

    do {
        ticketId = generateTicketId();
        ticketExists = await Ticket.findOne({
            ticketId,
        });
    } while(ticketExists);

    const ticket = await Ticket.create({
        ...ticketData,
        ticketId,
    });
    return ticket;
};

const getTicket = async({status,search})=>{     
    const filter = {};

    if(status){                 
        filter.status = status;
    }

    if(search){
        filter.$or = [
            {ticketId: {$regex:search, $options: "i"}},
            {customerName: {$regex:search, $options: "i"}},
            {customerEmail: {$regex: search, $options: "i"}},
            {subject: {$regex:search, $options: "i"}},
            {description:{$regex:search, $options:"i"}},
        ];
    }

    const tickets = await Ticket.find(filter).sort({
        createdAt: -1
    });
    
    return tickets
}

const getTicketbyID = async(ticketId) =>{      
    
    const ticket = await Ticket.findOne({ticketId});

    if(!ticket){
        const error = new Error("Ticket not found");
        error.statusCode = 404; 
        throw error;
    }

    const notes = await Note.find({ticket: ticket._id}).sort({createdAt: 1})

    return {ticket,notes};
}

const updateTicket = async(ticketId, updatedData = {}) => {    
    const {status, notes} = updatedData;
    const ticket = await Ticket.findOne({ticketId});

    if(!ticket){
        const error = new Error("Ticekt not found");
        error.statusCode = 404
        throw error
    }
    if(status !== undefined){
       const statuses = ["Open","Closed","In Progress"]
       
       if(!statuses.includes(status)){
        const error  = new Error("Invalid Status");
        error.statusCode = 400;
        throw error;
       }
       ticket.status = status;
    }

    ticket.updatedAt = Date.now();
    await ticket.save();
    if(notes && notes.trim()){
        await Note.create({
            ticket: ticket._id,
            noteText: notes.trim(),
        });
    }
    return ticket;
}

module.exports = {
    createTicket,
    getTicket,
    getTicketbyID,
    updateTicket,
};   
