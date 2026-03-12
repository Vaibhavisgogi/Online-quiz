import React, { useEffect, useState } from 'react';
import { ArrowLeft, Users, Search, Mail, Shield, Trash2, MoreVertical, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? All their data will be removed forever.")) {
      try {
        await api.delete(`/admin/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        console.error(err);
        alert("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin" state={{ fromButton: true }} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>User Management</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Review and manage all registered members of QuizeHunter.</p>
          </div>
          <div className="glass-panel" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '350px' }}>
              <Search size={20} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search by name or email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', padding: '0.5rem 0', width: '100%' }}
              />
          </div>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      <th style={{ padding: '1.5rem 2rem' }}>Name & Email</th>
                      <th style={{ padding: '1.5rem 2rem' }}>Role</th>
                      <th style={{ padding: '1.5rem 2rem' }}>Coins</th>
                      <th style={{ padding: '1.5rem 2rem' }}>Status</th>
                      <th style={{ padding: '1.5rem 2rem' }}>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                    <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner"></div></td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No users found matching your search.</td></tr>
                  ) : filteredUsers.map((u, index) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                          <td style={{ padding: '1.5rem 2rem' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.2rem' }}>{u.name}</div>
                              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  <Mail size={12} /> {u.email}
                              </div>
                          </td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                              <span style={{ 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '0.4rem',
                                color: u.role === 'admin' ? 'var(--accent-green)' : 'var(--accent-blue)',
                                background: u.role === 'admin' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '99px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                              }}>
                                  {u.role === 'admin' ? <Shield size={12} /> : <Users size={12} />}
                                  {u.role.toUpperCase()}
                              </span>
                          </td>
                          <td style={{ padding: '1.5rem 2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                              {u.coins} 🪙
                          </td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: u.status === 'active' ? '#10b981' : '#f87171', fontSize: '0.9rem' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: u.status === 'active' ? '#10b981' : '#f87171' }}></div>
                                  {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                              </div>
                          </td>
                          <td style={{ padding: '1.5rem 2rem' }}>
                              <div style={{ display: 'flex', gap: '1rem' }}>
                                  <Link to={`/admin/user-report/${u._id}`} state={{ fromButton: true }} title="View Performance Report" style={{ color: 'var(--accent-purple)' }}>
                                      <BookOpen size={18} />
                                  </Link>
                                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><CheckCircle2 size={18} /></button>
                                  <button onClick={() => handleDeleteUser(u._id)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete"><Trash2 size={18} /></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
    </div>
  );
}
