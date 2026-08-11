import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from "../services/ticketApi";
import { Send, ArrowLeft, User, Mail, Tag, FileText } from 'lucide-react';

export default function CreateTicket() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [formdata, setformdata] = useState({
        customerName: '',
        customerEmail: '',
        subject: '',
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloading(true);

        try {
            await createTicket(formdata);
            navigate('/');
        } catch (error) {
            console.error("Error creating ticket", error);
            alert("Failed to create ticket")
        }
        finally {
            setloading(false);
        }
    };

    const handleChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value })
    };

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:Text-indigo-600 mb-6 transition-colors text-sm font-medium">
                <ArrowLeft size={16} /> Back to list
            </Link>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow hidden">
                <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-200">
                    <h1 className="text-xl font-semibold text-slate-800">Create New Ticket</h1>
                    <p className="text-sm text-slate-500">Please fill in the details below to create a new ticket.</p>
                </div>

                {/*Ticket Form*/}

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                        {/*Customer Name*/}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <User size={16} />
                                Customer Name
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="customerName"
                                onChange={handleChange}
                                placeholder="Customer Name"
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>

                        {/*Customer Email*/}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Mail size={16} />
                                Customer Email
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="email"
                                name="customerEmail"
                                placeholder="Customer Email"
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>

                        {/*Subject of the Issue*/}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <Tag size={16} />
                                Subject
                                <span className="text-rose-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="subject"
                                placeholder="A brief about the issue"
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>

                        {/*Descritpion of the issue*/}

                        <div className="space-y-2 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                <FileText size={16} />
                                Description
                                <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                required
                                name="description"
                                placeholder="Detailed description of the issue"
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>


                    {/*Buttons*/}


                    <div className="flex justify-end gap-3 pt-4">
                        <Link to="/" className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 border border-slate-300 rounded-lg transition-all">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'}`}>
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Send size={16} />
                                    Submit Ticket
                                </>
                            )}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    )
}