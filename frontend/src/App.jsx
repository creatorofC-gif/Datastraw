import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Home from './components/pages/Home';
import CreateTicket from './components/pages/CreateTicketForm';
import TicketDetail from './components/pages/TicketDetail';
import Login from './components/pages/Login';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const TopbarLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      navigate(`/?search=${encodeURIComponent(val)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

      {/* ===== TOP NAVIGATION BAR ===== */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{
          maxWidth: '1280px', margin: '0 auto',
          padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px'
        }}>
          {/* Left: Logo only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/image.png"
              alt="Datastraw"
              style={{ height: '44px', width: 'auto', objectFit: 'contain', display: 'block', flexShrink: 0 }}
              onError={e => { e.target.style.display = 'none'; }}
            />

            {/* Nav Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px' }}>
              <Link to="/" style={{
                padding: '6px 12px', borderRadius: '7px', textDecoration: 'none',
                fontSize: '13px', fontWeight: 500,
                background: location.pathname === '/' ? '#eff6ff' : 'transparent',
                color: location.pathname === '/' ? '#2563eb' : '#64748b',
                transition: 'all 0.15s'
              }}>
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right: Search + New Ticket + Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '240px', minWidth: '150px' }}>
              <span className="material-symbols-outlined" style={{
                position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                color: '#94a3b8', fontSize: '18px', pointerEvents: 'none'
              }}>search</span>
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{
                  width: '100%', paddingLeft: '34px', paddingRight: '12px',
                  paddingTop: '7px', paddingBottom: '7px',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  fontSize: '13px', color: '#1e293b', background: '#f8fafc',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
            
            <Link to="/tickets/new" style={{
              background: '#2563eb', color: '#fff',
              padding: '7px 14px', borderRadius: '8px',
              fontWeight: 600, fontSize: '13px', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '4px',
              boxShadow: '0 1px 3px rgba(37,99,235,0.35)',
              whiteSpace: 'nowrap'
            }}>
              <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span>
              New Ticket
            </Link>

            <button
              onClick={handleLogout}
              title="Logout"
              style={{
                border: '1px solid #e2e8f0', background: '#fff',
                padding: '6px 12px', borderRadius: '8px',
                cursor: 'pointer', color: '#64748b',
                fontSize: '13px', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ===== PAGE CONTENT ===== */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><TopbarLayout><Home /></TopbarLayout></ProtectedRoute>} />
        <Route path="/tickets/new" element={<ProtectedRoute><TopbarLayout><CreateTicket /></TopbarLayout></ProtectedRoute>} />
        <Route path="/tickets/:ticketId" element={<ProtectedRoute><TopbarLayout><TicketDetail /></TopbarLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
