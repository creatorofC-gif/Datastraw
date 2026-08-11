const express = require('express');
const router = express.Router();
const ticketController = require("../controllers/ticket.controller")
router.post("/",ticketController.createTicket);
router.get("/",ticketController.getTicket);
router.get("/:ticketId",ticketController.getTicketbyID);
router.put("/:ticketId",ticketController.updateTicket);

module.exports = router;