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

module.exports = {
    createTicket,
};      