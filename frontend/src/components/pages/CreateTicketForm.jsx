import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { createTicket } from "../../services/ticketApi";

export default function CreateTicket() {
    const navigate = useNavigate();
    const [loading, setloading] = useState(false);
    const [formdata, setformdata] = useState({
        customerName: '',
        customerEmail: '',
        orderId: '',
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
            const msg = error.response?.data?.message || "Failed to create ticket.";
            alert(msg);
        } finally {
            setloading(false);
        }
    };

    const handleChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">Create New Ticket</h2>
                    <p className="font-body-md text-body-md text-secondary">Fill in the details below to log a new customer support request.</p>
                </div>
                <Link to="/" className="text-secondary hover:text-primary transition-colors flex items-center">
                    <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
                    Back
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">Customer Name</label>
                        <input
                            required
                            type="text"
                            name="customerName"
                            value={formdata.customerName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md"
                            placeholder="Full Name"
                        />
                    </div>

                    {/* Customer Email */}
                    <div>
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">Customer Email</label>
                        <input
                            required
                            type="email"
                            name="customerEmail"
                            value={formdata.customerEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md"
                            placeholder="Email Address"
                        />
                    </div>

                    {/* Order ID */}
                    <div className="md:col-span-2">
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">Order ID (Optional)</label>
                        <input
                            type="text"
                            name="orderId"
                            value={formdata.orderId}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md"
                            placeholder="e.g. ORD-12345"
                        />
                    </div>

                    {/* Subject */}
                    <div className="md:col-span-2">
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">Subject</label>
                        <input
                            required
                            type="text"
                            name="subject"
                            value={formdata.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md"
                            placeholder="Brief summary of the issue"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block font-label-sm text-label-sm text-on-surface mb-2">Description</label>
                        <textarea
                            required
                            name="description"
                            value={formdata.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-body-md text-body-md resize-y"
                            placeholder="Provide detailed information about the customer's issue..."
                            rows="6"
                        ></textarea>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-outline-variant/30">
                    <Link to="/" className="px-6 py-2 border border-outline-variant text-secondary rounded-lg font-label-sm text-label-sm hover:bg-surface-container-low transition-colors">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg font-label-sm text-label-sm transition-colors shadow-sm ${loading ? 'bg-outline-variant text-white cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-container'}`}
                    >
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </div>
            </form>
        </div>
    );
}