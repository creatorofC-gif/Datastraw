import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicketById, updateTicket } from '../services/ticketApi';
import { ArrowLeft, User, Mail, Calendar, Clock, MessageSquarePlus, RefreshCw } from 'lucide-react';

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteLoading, setNoteLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(id);
      setTicket(data);
    } catch (error) {
      console.error("Failed to fetch ticket details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      await updateTicket(id, { status: newStatus });
      fetchTicket(); // refresh data
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
      await updateTicket(id, { notes: noteText });
      setNoteText('');
      fetchTicket(); // refresh data
    } catch (error) {
      console.error("Failed to add note", error);
    } finally {
      setNoteLoading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
    </div>
  );
  
  if (!ticket) return <div className="text-center py-20 text-slate-500">Ticket not found</div>;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Details*/}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  #{ticket.ticket_id}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  ticket.status === 'Open' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-emerald-100 text-emerald-800 border-emerald-200'
                }`}>
                  {ticket.status}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-6">{ticket.subject}</h1>
              
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-2">Description</p>
                <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div className="p-6 sm:p-8 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Internal Notes</h3>
              
              <div className="space-y-4 mb-6">
                {ticket.notes && ticket.notes.length > 0 ? (
                  ticket.notes.map((note) => (
                    <div key={note.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                      <p className="text-sm text-slate-700 mb-2">{note.note_content}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock size={12} />
                        {new Date(note.note_created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No notes added yet.</p>
                )}
              </div>

              <form onSubmit={handleAddNote} className="mt-4">
                <div className="relative">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add an internal note..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none shadow-sm pb-12"
                    rows="3"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={noteLoading || !noteText.trim()}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {noteLoading ? <RefreshCw size={14} className="animate-spin" /> : <MessageSquarePlus size={14} />}
                    Post Note
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/*Details and info*/}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Update Status</h3>
            <div className="space-y-2">
              {['Open', 'In Progress', 'Closed'].map((s) => (
                <button
                  key={s}
                  disabled={statusLoading}
                  onClick={() => handleStatusChange(s)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                    ticket.status === s 
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  {s}
                  {ticket.status === s && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <User size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Name</p>
                  <p className="text-sm font-medium text-slate-800">{ticket.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Mail size={16} className="text-slate-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <a href={`mailto:${ticket.customer_email}`} className="text-sm font-medium text-indigo-600 hover:underline truncate block">
                    {ticket.customer_email || 'No email provided'}
                  </a>
                </div>
              </div>
            </div>
            
            <hr className="my-5 border-slate-100" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Created</p>
                  <p className="text-sm font-medium text-slate-800">{new Date(ticket.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
