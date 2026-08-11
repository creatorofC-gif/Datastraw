import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getTickets } from '../services/ticketApi'

export default function Home(){
    const [tickets,setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [status,setStatus] = useState('');
    const [loading, setloading] = useState(true);


    useEffect(()=>{
        fetchTickets();
    },[search,status]);

    const fetchTickets = async () =>{
        setloading(true);
        try {
            const data = await getTickets({search, status});
            setTickets(data);
        } catch (err) {
            console.log(err);
        } finally {
            setloading(false);
        }
    };


    const statusLogo = ({status}) =>{
        const styles = {
            'Open': 'bg-amber-100 text-amber-800 border-amber-200',
            'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'Closed': 'bg-emrald-100 text-emrald-800 border-emrald-200'
        };

        return(
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || `bg-slate-100 text-slate-800 border-slate-200`}`} > 
                {status}
            </span>
        );
    };

    return(
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Tickets Overview
                </h1>
                {/* Search and Filtering Section*/}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" size={20} />
                        <input 
                            type="text"
                            placeholder="Search tickets..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors duration-200" size={20} />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-48 transition-all appearance-none bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/*Ticket Table*/}

            
            
        </div>
    )
}