import axios from "axios";
const API_URL = "http://localhost:5000/api/tickets";

export const createTicket = async (ticketData) => {
    const response = await axios.post(API_URL, ticketData);
    return response.data;
};

export const getTickets = async ({status, search} = {}) =>{
    const params = {}

    if(status){
        params.status = status;
    }
    if(search){
        params.search = search;
    }

    const response = await axios.get(API_URL,{
        params,
    });

    return response.data;
};

export const getTicketById = async (ticketId) =>{
    const response = await axios.get(`${API_URL}/${ticketId}`);
    return response.data;
}

export const updateTicket = async(ticketId, updateData) =>{
    const response = await axios.put(`${API_URL}/${ticketId}`, updateData);
    return response.data;
};

export const deleteTicket = async(ticketId) =>{
    await axios.delete(`${API_URL}/${ticketId}`);
};