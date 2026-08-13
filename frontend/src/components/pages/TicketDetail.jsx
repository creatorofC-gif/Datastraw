import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, updateTicket } from '../../services/ticketApi';

export default function TicketDetail() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      await updateTicket(ticketId, { status: newStatus });
      fetchTicket();
    } catch (error) {
      console.error("Failed to update status", error);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setNoteLoading(true);
    try {
      await updateTicket(ticketId, { notes: noteText });
      setNoteText('');
      fetchTicket();
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-full" style={{ padding: '80px', textAlign: 'center' }}>
      <div>
        <style>{`@keyframes ds-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.9)} }`}</style>
        <img
          src="/image.png"
          alt="Loading..."
          style={{ height: '56px', width: 'auto', animation: 'ds-pulse 1.2s ease-in-out infinite', display: 'inline-block' }}
        />
        <div style={{ marginTop: '12px', color: '#94a3b8', fontSize: '13px', fontWeight: 500 }}>Fetching ticket...</div>
      </div>
    </div>
  );

  if (!ticket) return <div className="text-center py-20 text-secondary font-body-lg">Ticket not found</div>;

  const StatusPill = ({ status }) => {
    if (status === 'Closed') {
      return (
        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 border border-emerald-200">
          Closed
        </span>
      );
    }
    if (status === 'In Progress') {
      return (
        <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 border border-yellow-200">
          In Progress
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold flex items-center gap-1 border border-blue-200">
        {status || 'Open'}
      </span>
    );
  };

  const customerInitials = ticket.customer_name ? ticket.customer_name.substring(0, 2).toUpperCase() : 'CU';

  return (
    <div className="flex flex-col h-full bg-surface animate-in fade-in duration-500">

      {/* Ticket Header Area */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link to="/" className="text-secondary hover:text-primary transition-colors flex items-center mr-2">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            </Link>
            <span className="font-label-sm text-label-sm text-outline">#{ticket.ticket_id}</span>
            <StatusPill status={ticket.status} />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">{ticket.subject}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            title="Print Ticket PDF"
            className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container transition-colors text-sm font-medium shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">print</span>
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Split Pane Layout */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0 pb-6">

        {/* Left Pane: Conversation Thread */}
        <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">

          {/* Scrollable Thread */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-surface-container/10">

            {/* Customer Message (Original Description) */}
            <div className="flex gap-4">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold">
                  {customerInitials}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-label-sm text-label-sm font-bold text-on-background">{ticket.customer_name}</span>
                  <span className="font-label-sm text-label-sm text-outline">{new Date(ticket.created_at).toLocaleString()}</span>
                </div>
                <div className="font-body-md text-body-md text-on-surface-variant bg-surface-container-lowest p-4 rounded-xl rounded-tl-none border border-outline-variant/50 shadow-sm whitespace-pre-wrap">
                  {ticket.description}
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            {ticket.notes && ticket.notes.map((note) => (
              <div key={note.id} className="flex gap-4 relative before:absolute before:left-5 before:top-12 before:bottom-[-24px] before:w-px before:bg-outline-variant/30">
                <div className="shrink-0 mt-1 z-10 bg-transparent py-1">
                  <span className="material-symbols-outlined text-outline bg-surface-container-lowest rounded-full p-1 border border-outline-variant/50">edit_note</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-label-sm text-label-sm font-bold text-secondary">System Note</span>
                    <span className="font-label-sm text-label-sm text-outline">{new Date(note.note_created_at).toLocaleString()}</span>
                  </div>
                  <div className="font-body-md text-body-md text-secondary bg-surface-container-high/30 p-3 rounded-lg border border-outline-variant/30 text-sm whitespace-pre-wrap">
                    {note.note_content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Area */}
          <div className="border-t border-outline-variant bg-surface-container-lowest p-4 shrink-0">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container/20 transition-all shadow-sm">
              <form onSubmit={handleAddNote}>
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-4 font-body-md text-body-md text-on-background resize-none focus:outline-none bg-transparent"
                  placeholder="Type your internal note here..."
                  rows="3"
                ></textarea>
                <div className="flex justify-between items-center p-3 border-t border-outline-variant/50 bg-surface-container-lowest">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked disabled className="rounded border-outline-variant text-primary-container focus:ring-primary-container" />
                    <span className="font-label-sm text-label-sm text-secondary">Internal note</span>
                  </label>
                  <button
                    type="submit"
                    disabled={noteLoading || !noteText.trim()}
                    className={`font-label-sm text-label-sm px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2 ${noteLoading || !noteText.trim() ? 'bg-outline-variant text-white cursor-not-allowed' : 'bg-primary-container text-on-primary hover:bg-primary'}`}
                  >
                    {noteLoading ? 'Saving...' : 'Save Note'} <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Pane: Sidebar Context */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col gap-6 overflow-y-auto pr-1">

          {/* Customer Profile Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5">
            <h3 className="font-headline-md text-headline-md font-semibold mb-4 text-on-background">Customer Details</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-headline-md text-headline-md font-bold">
                {customerInitials}
              </div>
              <div>
                <div className="font-label-sm text-label-sm font-bold text-on-background">{ticket.customer_name}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
                <span className="material-symbols-outlined text-outline text-[18px]">mail</span>
                <a href={`mailto:${ticket.customer_email}`} className="text-primary-container hover:underline">{ticket.customer_email || 'No email provided'}</a>
              </div>
              {ticket.order_id && (
                <div className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
                  <span className="material-symbols-outlined text-outline text-[18px]">shopping_bag</span>
                  <span>Order: {ticket.order_id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Properties Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-headline-md font-semibold text-on-background">Properties</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="font-label-sm text-label-sm text-secondary block mb-1">Status</label>
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  disabled={statusLoading}
                  className="w-full border border-outline-variant rounded-lg p-2 bg-surface-container-lowest font-body-md text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container/20 outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Timeline & Audit Trail Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-[20px]">history</span>
              <h3 className="font-headline-md text-headline-md font-semibold text-on-background">Activity Audit Trail</h3>
            </div>
            <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/40">
              {(() => {
                const events = [
                  {
                    id: 'created',
                    title: 'Ticket Created',
                    desc: `By ${ticket.customer_name}`,
                    time: ticket.created_at,
                    icon: 'add_circle',
                    color: 'text-blue-500'
                  },
                  ...(ticket.notes || []).map(n => ({
                    id: n.id,
                    title: 'Note Added',
                    desc: n.note_content.length > 30 ? n.note_content.substring(0, 30) + '...' : n.note_content,
                    time: n.note_created_at,
                    icon: 'chat_bubble',
                    color: 'text-emerald-500'
                  }))
                ];
                if (ticket.updated_at && new Date(ticket.updated_at).getTime() - new Date(ticket.created_at).getTime() > 1000) {
                  events.push({
                    id: 'updated',
                    title: 'Status Updated',
                    desc: `Set to ${ticket.status}`,
                    time: ticket.updated_at,
                    icon: 'sync',
                    color: 'text-amber-500'
                  });
                }
                events.sort((a, b) => new Date(a.time) - new Date(b.time));

                return events.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-3 text-xs">
                    <div className={`-ml-6 shrink-0 flex items-center justify-center bg-white z-10 ${item.color}`}>
                      <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-on-surface">{item.title}</div>
                      <div className="text-secondary truncate">{item.desc}</div>
                      <div className="text-[10px] text-outline mt-0.5">{new Date(item.time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

        </div>
      </div>

      {/* Custom PDF Template*/}
      <div id="printable-ticket" className="hidden print:block p-8 bg-white text-slate-800 font-sans min-h-screen relative flex flex-col justify-between" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div>
          {/* Top Header Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <img src="/image.png" alt="Datastraw" style={{ height: '48px', objectFit: 'contain' }} />
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Hanken Grotesk, sans-serif', color: '#0f172a', margin: 0 }}>
              Ticket Details
            </h1>
          </div>

          <hr style={{ border: 'none', borderTop: '2px solid #0f172a', marginBottom: '28px' }} />

          {/* Ticket Main Info Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Ticket ID</span>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>#{ticket.ticket_id}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Status</span>
                <div style={{ fontSize: '15px', fontWeight: 700, color: ticket.status === 'Closed' ? '#16a34a' : ticket.status === 'In Progress' ? '#d97706' : '#2563eb' }}>{ticket.status}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Created Date</span>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>{new Date(ticket.created_at).toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Customer Name</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{ticket.customer_name}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Email</span>
                <div style={{ fontSize: '14px', color: '#334155' }}>{ticket.customer_email || 'N/A'}</div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Order ID</span>
                <div style={{ fontSize: '14px', color: '#334155' }}>{ticket.order_id || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Subject & Description */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              Subject: {ticket.subject}
            </h3>
            <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '16px', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: '#334155' }}>
              {ticket.description}
            </div>
          </div>

          {/* Notes Section */}
          {ticket.notes && ticket.notes.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', borderBottom: '1px solid #cbd5e1', paddingBottom: '6px' }}>
                Activity & Internal Notes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ticket.notes.map((n, i) => (
                  <div key={i} style={{ background: '#f1f5f9', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#64748b', fontWeight: 600 }}>
                      <span>System Note #{i + 1}</span>
                      <span>{new Date(n.note_created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ color: '#1e293b' }}>{n.note_content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Dark Navy Accent Bar */}
        <div style={{ marginTop: '40px', background: '#1e293b', height: '48px', marginInline: '-32px', marginBottom: '-32px' }} />
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-ticket, #printable-ticket * {
            visibility: visible !important;
          }
          #printable-ticket {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}
