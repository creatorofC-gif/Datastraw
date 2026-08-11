import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicketForm';
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element = {<Home />} />
        <Route path = "/tickets/new" element = {<CreateTicket />} />
        <Route path='/tickets/:ticketId' element = {<TicketDetail />} />    
    </Routes>
    </BrowserRouter>
  )
}

export default App
