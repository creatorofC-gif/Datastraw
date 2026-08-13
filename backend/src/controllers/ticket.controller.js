const ticketService = require("../services/ticket.service");
// Creates a new ticket after validating required fields.

const createTicket = async (req, res) => {

    try {
        const payload = {
            customerName: req.body.customerName || req.body.customer_name,
            customerEmail: req.body.customerEmail || req.body.customer_email,
            subject: req.body.subject,
            description: req.body.description,
            orderId: req.body.orderId || req.body.order_id || null,
        };

        if (!payload.customerName || !payload.customerEmail || !payload.subject || !payload.description) {
            return res.status(400).json({
                message: "Missing required fields. 'customerName', 'customerEmail', 'subject', and 'description' are required."
            });
        }

        const ticket = await ticketService.createTicket(payload);

        res.status(201).json({
            ticket_Id: ticket.ticketId,
            created_at: ticket.createdAt,
        });
    } catch (error) {
        console.error("Create ticket error:", error);
        res.status(500).json({
            message: "Failed to create ticket",
            error: error.message,
        });
    }
};

// Fetches tickets, optionally filtering by status and search query.

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

// Fetches a ticket and its associated notes by ID.

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

// Updates a ticket based on its ID and request body.

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
