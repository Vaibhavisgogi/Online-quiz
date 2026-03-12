import React, { useState } from 'react';
import { ArrowLeft, Save, Shield, Lock, Bell, Server, Globe, Key, Clock, Mail, Smartphone, Activity, Send, Trash2, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'QuizeHunter',
    registrationOpen: true,
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: false,
    maxQuizAttempts: 3,
    sessionTimeout: 60,
    adminKey: 'admin123'
  });
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'notifications') {
      fetchAnnouncements();
    }
  }, [activeTab]);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Failed to fetch announcements");
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    setLoading(true);
    try {
      await api.post('/announcements', newAnnouncement);
      setNewAnnouncement({ title: '', content: '' });
      fetchAnnouncements();
    } catch (error) {
      alert("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      alert("Failed to delete announcement");
    }
  };

  const handleSave = () => {
    alert(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} settings saved successfully! (Demo mode)`);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe, color: 'var(--accent-blue)' },
    { id: 'security', label: 'Security', icon: Lock, color: '#f87171' },
    { id: 'notifications', label: 'Notifications', icon: Bell, color: '#fbbf24' },
    { id: 'logs', label: 'Server Logs', icon: Server, color: '#10b981' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Site Name</label>
                <input 
                    type="text" 
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ margin: 0 }}>Public Registration</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Allow new users to create accounts</p>
                </div>
                <input type="checkbox" checked={settings.registrationOpen} onChange={(e) => setSettings({...settings, registrationOpen: e.target.checked})} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h4 style={{ margin: 0 }}>Maintenance Mode</h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Show maintenance page to all users</p>
                </div>
                <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})} />
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Key size={14} style={{ marginRight: '0.5rem' }} /> Admin Secret Key
                </label>
                <input 
                    type="password" 
                    value={settings.adminKey}
                    onChange={(e) => setSettings({...settings, adminKey: e.target.value})}
                />
            </div>
            <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Clock size={14} style={{ marginRight: '0.5rem' }} /> Session Timeout (minutes)
                </label>
                <input 
                    type="number" 
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                />
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#f87171' }}>
                  <strong>Security Note:</strong> Changing the Admin Secret Key will require all admins to use the new key for future signups.
                </p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* New Announcement Form */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Megaphone size={18} color="var(--accent-blue)" /> Create New Announcement
                </h4>
                <form onSubmit={handleCreateAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                        type="text" 
                        placeholder="Announcement Title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                    />
                    <textarea 
                        placeholder="Announcement Content..."
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                        rows={2}
                        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px', color: 'white', outline: 'none', resize: 'none' }}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary" 
                        style={{ margin: 0, padding: '0.6rem', alignSelf: 'flex-end', fontSize: '0.9rem' }}
                    >
                        {loading ? 'Sending...' : <><Send size={16} /> Post Announcement</>}
                    </button>
                </form>
            </div>

            {/* Existing Announcements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ margin: 0 }}>Active Announcements</h4>
                {announcements.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>No active announcements</p>
                ) : (
                    announcements.map((announce) => (
                        <div key={announce._id} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <h5 style={{ margin: 0, color: 'var(--accent-blue)' }}>{announce.title}</h5>
                                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{announce.content}</p>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem', display: 'block' }}>
                                    Posted on: {new Date(announce.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <button 
                                onClick={() => handleDeleteAnnouncement(announce._id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer', opacity: 0.6 }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
          </div>
        );
      case 'logs':
        const logs = [
          { time: '10:45 PM', event: 'Admin Login', user: 'Vaibhavi S', status: 'success' },
          { time: '09:12 PM', event: 'Quiz Created', user: 'Admin', status: 'success' },
          { time: '08:30 PM', event: 'New User Signup', user: 'Rahul Sharma', status: 'success' },
          { time: '07:15 PM', event: 'Failed Admin Login', user: 'Unknown', status: 'error' },
        ];
        return (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--accent-green)" /> Recent System Events
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {logs.map((log, i) => (
                    <div key={i} style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{log.time}</span>
                            <span style={{ fontWeight: '500' }}>{log.event}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{log.user}</div>
                            <div style={{ fontSize: '0.7rem', color: log.status === 'success' ? '#10b981' : '#f87171', fontWeight: 'bold' }}>{log.status.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--glass-border)', marginTop: '1rem', fontSize: '0.85rem' }}>Download Full Logs (.csv)</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/admin" state={{ fromButton: true }} style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-underline">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>System Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2.5fr', gap: '2rem' }}>
        {/* Navigation Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tabs.map(tab => (
              <div 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  padding: '1rem', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: activeTab === tab.id ? tab.color : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal'
                }}
                className="hover-glow"
              >
                <tab.icon size={20} /> {tab.label}
              </div>
            ))}
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '1rem', textAlign: 'center' }}>
              <Shield size={32} color="var(--accent-green)" style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  QuizeHunter v2.4.0<br />
                  Internal Server: Secured
              </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass-panel" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'var(--gradient-primary)', filter: 'blur(80px)', opacity: 0.1, zIndex: 0 }}></div>
          
          <div style={{ position: 'relative', zIndex: 1, minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {renderContent()}

            {activeTab !== 'logs' && (
              <div style={{ marginTop: '3rem', borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSave} className="btn-primary" style={{ margin: 0, padding: '0.8rem 2.5rem' }}>
                      <Save size={18} /> Save {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
