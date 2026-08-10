const { message } = require("statuses");
const ticketService = require("../services/ticket.service");

const createTicket  = async (req,res) => {    // Create Ticket function with error handling
    try {
        const ticket = await ticketService.createTicket(req.body);

        res.status(201).json({
            ticket_Id: ticket.ticketId,
            created_at: ticket.createdAt,
        });
    } catch (error){
        res.status(500).json({
            message: "Failed to create ticket",
            error:error.message,
        });
    }
};

// Export the controller function for use in routes
module.exports = {  
    createTicket,
}