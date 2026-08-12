const ticketService = require("../services/ticket.service");

const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket(req.body);

        res.status(201).json({
            ticket_Id: ticket.ticketId,
            created_at: ticket.createdAt,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create ticket",
            error: error.message,
        });
    }
};

const getTicket  = async (req,res) =>{
try{
    const {status, search} = req.query;

    const tickets = await ticketService.getTicket({
        status,
        search
    });

    const formatTicket = tickets.map((ticket)=>({
        ticket_id: ticket.ticketId,
        customer_name: ticket.customerName,
        subject: ticket.subject,
        status: ticket.status,
        created_at: ticket.createdAt,
    }));
    res.status(200).json(formatTicket);
} catch(error){
    res.status(500).json({
        message: "Failed to fetch tickets",
        error: error.message
    });
}
}


const getTicketbyID = async (req,res)=>{
    try{
       const {ticketId} = req.params;
       const {ticket,notes} = await ticketService.getTicketbyID(ticketId)
       
       res.status(200).json({
        ticket_id: ticket.ticketId,
        customer_name: ticket.customerName,
        customer_email: ticket.customerEmail,
        subject: ticket.subject,
        description: ticket.description,
        order_id: ticket.orderId,
        status: ticket.status,
        created_at: ticket.createdAt,
        updated_at: ticket.updated_at,
        notes: notes.map((note)=>({
            id: note._id,
            note_content: note.noteText,
            note_created_at: note.createdAt,
        }))
    })

    } catch (error) {
        res.status(error.statusCode || 500).json({
            message: error.message || "Failed to fetch ticket"
        })
    }
}   

const updateTicket = async (req,res) => {
    try{
       const {ticketId} = req.params;
       const updatedTicket = await ticketService.updateTicket(
        ticketId,
        req.body
       ) ;

       res.status(200).json({
        success: true,
        message: "Ticket updated successfully",
        updated_at: updatedTicket.updatedAt
       });
    
    } catch (error){
        res.status(error.statusCode || 500).json({
            message: error.message || "Failed to update ticket"
        })  
    }
}
// Export the controller function for use in routes
module.exports = {  
    createTicket,
    getTicket,
    getTicketbyID,
    updateTicket,
}