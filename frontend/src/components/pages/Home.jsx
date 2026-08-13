/**
 * Dashboard and main page
 * This page is used to display the tickets in a list format.
 */


import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getTickets } from '../../services/ticketApi';

export default function Home() {
    const [tickets, setTickets] = useState([]);
    const [loading, setloading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const searchQuery = searchParams.get('search') || '';

    useEffect(() => {
        fetchTickets();
    }, [searchQuery, statusFilter]);

    const fetchTickets = async () => {
        setloading(true);
        try {
            const data = await getTickets({ search: searchQuery, status: statusFilter });
            setTickets(data);
        } catch (err) {
            console.log(err);
        } finally {
            setloading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            'Open': { background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe' },
            'In Progress': { background: '#fefce8', color: '#eab308', border: '1px solid #fef08a' },
            'Closed': { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
        };
        const s = styles[status] || styles['Open'];
        return (
            <span style={{
                ...s, padding: '3px 10px', borderRadius: '999px',
                fontSize: '12px', fontWeight: 600, display: 'inline-block'
            }}>
                {status}
            </span>
        );
    };

    const openCount = tickets.filter(t => t.status !== 'Closed').length;
    const resolvedCount = tickets.filter(t => t.status === 'Closed').length;

    const handleExportCSV = () => {
        if (!tickets || tickets.length === 0) return;
        const headers = ["Ticket ID", "Customer Name", "Subject", "Status", "Created Date"];
        const rows = tickets.map(t => [
            `"${t.ticket_id}"`,
            `"${t.customer_name ? t.customer_name.replace(/"/g, '""') : ''}"`,
            `"${t.subject ? t.subject.replace(/"/g, '""') : ''}"`,
            `"${t.status}"`,
            `"${new Date(t.created_at).toLocaleDateString()}"`
        ]);
        const csvString = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `datastraw_tickets_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#1e293b' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Hanken Grotesk, sans-serif' }}>
                        Ticket Overview
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '20px', margin: '4px 0 0 0' }}>
                        My Tickets
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={handleExportCSV} title="Export to CSV" style={{
                        border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer',
                        color: '#334155', display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: 500
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981' }}>download</span>
                        Download Ticket List
                    </button>

                    <button onClick={fetchTickets} title="Refresh" style={{
                        border: 'none', background: 'none', cursor: 'pointer',
                        color: '#2563eb', display: 'flex', alignItems: 'center', padding: '4px'
                    }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* Total */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf8', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#2563eb' }}>inbox</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Total Tickets</div>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', lineHeight: 1, fontFamily: 'Hanken Grotesk, sans-serif' }}>{tickets.length}</div>
                </div>

                {/* Open */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf8', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#f97316' }}>warning</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Open Tickets</div>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', lineHeight: 1, fontFamily: 'Hanken Grotesk, sans-serif' }}>{openCount}</div>
                </div>

                {/* Resolved */}
                <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf8', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>check_circle</span>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Resolved</div>
                    <div style={{ fontSize: '36px', fontWeight: 700, color: '#0f172a', lineHeight: 1, fontFamily: 'Hanken Grotesk, sans-serif' }}>{resolvedCount}</div>
                </div>
            </div>

            {/* Tickets Table Wrapper */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8ecf8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                {/* Table Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Recent Tickets</h3>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '6px 12px',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#334155',
                            outline: 'none',
                            background: '#f8fafc',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <div style={{ minWidth: '600px' }}>
                        {/* Column Headers */}
                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 130px 120px', padding: '10px 20px', background: '#f8faff', borderBottom: '1px solid #f1f5f9' }}>
                            {['TICKET ID', 'SUBJECT', 'STATUS', 'DATE'].map(col => (
                                <div key={col} style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.06em' }}>{col}</div>
                            ))}
                        </div>

                {/* Rows */}
                {loading ? (
                    <div style={{ padding: '64px', textAlign: 'center' }}>
                        <style>{`@keyframes ds-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.9)} }`}</style>
                        <img
                            src="/image.png"
                            alt="Loading..."
                            style={{ height: '56px', width: 'auto', animation: 'ds-pulse 1.2s ease-in-out infinite', display: 'inline-block' }}
                        />
                        <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>Loading tickets...</div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '14px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>inbox</span>
                        No tickets found
                    </div>
                ) : (
                    tickets.map((ticket, i) => (
                        <div
                            key={ticket.ticket_id}
                            onClick={() => navigate(`/tickets/${ticket.ticket_id}`)}
                            style={{
                                display: 'grid', gridTemplateColumns: '180px 1fr 130px 120px',
                                padding: '14px 20px', cursor: 'pointer', alignItems: 'center',
                                borderBottom: i < tickets.length - 1 ? '1px solid #f8fafc' : 'none',
                                transition: 'background 0.12s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>
                                #{ticket.ticket_id}
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{ticket.subject}</div>
                                <div style={{ fontSize: '12px', color: '#f97316', marginTop: '2px' }}>{ticket.customer_name}</div>
                            </div>
                            <div><StatusBadge status={ticket.status} /></div>
                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                {new Date(ticket.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    ))
                )}
                    </div>
                </div>
            </div>
        </div>
    );
}