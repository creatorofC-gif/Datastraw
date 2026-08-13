/**
 * This module generates ticket ID by generating a random number preceded by a standard convention TKT 
 */

const generateTicketId = () =>{
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `TKT-${randomNumber}`;
}

module.exports = generateTicketId;
