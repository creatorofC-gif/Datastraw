import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, AlertCircle } from "lucide-react";
import { getTickets } from '../services/ticketApi'

export default function Home() {
    const [tickets, setTickets] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setloading] = useState(true);


    useEffect(() => {
        fetchTickets();
    }, [search, status]);

    const fetchTickets = async () => {
        setloading(true);
        try {
            const data = await getTickets({ search, status });
            setTickets(data);
        } catch (err) {
            console.log(err);
        } finally {
            setloading(false);
        }
    };


    const StatusLogo = ({ status }) => {
        const styles = {
            'Open': 'bg-amber-100 text-amber-800 border-amber-200',
            'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
            'Closed': 'bg-emrald-100 text-emrald-800 border-emrald-200'
        };

        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || `bg-slate-100 text-slate-800 border-slate-200`}`} >
                {status}
            </span>
        );
    };

    return (
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
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                        Loading Tickets...
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                        <AlertCircle size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-700">No tickets found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>

                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-medium text-slate-700 w-64">Ticket</th>
                                    <th className="px-6 py-4 font-medium text-s late-700 w-40">Requester</th>
                                    <th className="px-6 py-4 font-medium text-slate-700 w-32">Created</th>
                                    <th className="px-6 py-4 font-medium text-slate-700 w-32">Status</th>
                                    <th className="px-6 py-4 font-medium text-slate-700 w-32">Priority</th>
                                    <th className="px-6 py-4 font-medium text-slate-700 w-32 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {tickets.map((ticket) => (
                                    <tr key={ticket.ticket_id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                #{ticket.ticket_id}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {ticket.subject}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-600 text-sm">
                                            {ticket.customer_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusLogo status={ticket.status} />
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm flex items-center gap-1.5 h-full mt-3">
                                            <Clock size={14} />
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/tickets/${ticket.ticket_id}`} className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


        </div>
    )
}