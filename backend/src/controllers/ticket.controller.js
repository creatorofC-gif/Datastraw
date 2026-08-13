const ticketService = require("../services/ticket.service");
/**
 *  This defines the payload for creating a ticket, extracting necessary fields from the request body. 
 * It also includes validation to ensure that all required fields are present before proceeding to create the ticket using the ticketService. 
 * If any required fields are missing, it responds with a 400 status code and an error message. 
 * If the ticket creation is successful, it responds with a 201 status code and the ticket ID along with the creation timestamp. 
 * In case of any errors during the process, it logs the error and responds with a 500 status code and an error message. 
 */

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

// This function fetches all tickets based on optional status and search parameters.

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

// This function fetches a ticket by its ID and includes associated notes.

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

//This function updates a ticket based on the provided ticket ID and request body

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
