'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, Clock3, ImagePlus, LogOut, MessageSquare, Pencil, Plus, Search, Sparkles, Trash2, Users, X } from 'lucide-react';
import { EventProject, VIPInquiry } from '@/types/cms';

const statuses: VIPInquiry['status'][] = ['new', 'reviewing', 'proposal_sent', 'booked', 'archived'];
const blankEvent: EventProject = { id: '', slug: '', title: '', subtitle: '', category: 'Corporate Experience', year: new Date().getFullYear().toString(), location: '', venue: '', guestCount: '', budgetTier: '', coverImage: '', galleryImages: [], description: '', deliverables: [], isFeatured: true, order: 1 };

function getStudioGreeting() {
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Africa/Lagos' }).format(new Date()));
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 22) return 'Good evening';
  return 'Good night';
}

export default function StudioDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [inquiries, setInquiries] = useState<VIPInquiry[]>([]);
  const [events, setEvents] = useState<EventProject[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventProject | null>(null);
  const [uploading, setUploading] = useState(false);
  const [greeting, setGreeting] = useState(getStudioGreeting);
  const [activeSection, setActiveSection] = useState<'events' | 'inquiries'>('events');

  const loadStudio = async () => {
    const [inquiryResponse, cmsResponse] = await Promise.all([fetch('/api/inquiries'), fetch('/api/cms')]);
    if (!inquiryResponse.ok) { setAuthenticated(false); return; }
    const inquiryJson = await inquiryResponse.json();
    const cmsJson = await cmsResponse.json();
    setInquiries(inquiryJson.inquiries || []);
    setEvents(cmsJson.data?.events || []);
    setAuthenticated(true);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadStudio(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setGreeting(getStudioGreeting()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const response = await fetch('/api/studio/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    if (response.ok) { setError(''); await loadStudio(); } else setError('That access code did not match.');
    setLoading(false);
  };

  const updateStatus = async (id: string, status: VIPInquiry['status']) => {
    const response = await fetch('/api/inquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    if (response.ok) setInquiries((items) => items.map((item) => item.id === id ? { ...item, status } : item));
  };

  const saveEvent = async (event: EventProject) => {
    const payload = { ...event, id: event.id || `event-${Date.now()}`, slug: event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), order: event.order || events.length + 1 };
    const response = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save_event', payload }) });
    if (response.ok) { const json = await response.json(); setEvents(json.data || []); setEditingEvent(null); }
  };

  const removeEvent = async (id: string) => {
    if (!window.confirm('Remove this event from the portfolio?')) return;
    const response = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'delete_event', payload: { id } }) });
    if (response.ok) { const json = await response.json(); setEvents(json.data || []); }
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length || !editingEvent) return;
    setUploading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    if (response.ok) { const json = await response.json(); setEditingEvent({ ...editingEvent, coverImage: editingEvent.coverImage || json.urls[0], galleryImages: [...editingEvent.galleryImages, ...json.urls] }); }
    setUploading(false);
  };

  const filtered = useMemo(() => inquiries.filter((item) => `${item.clientName} ${item.eventType} ${item.location}`.toLowerCase().includes(query.toLowerCase())), [inquiries, query]);
  const active = inquiries.filter((item) => item.status !== 'archived');

  if (!authenticated) return <main className="studio-gate"><div className="studio-gate-card"><div className="studio-monogram">TP</div><p className="eyebrow"><Sparkles size={14} /> Private operations</p><h1>The studio,<br /><em>behind the scenes.</em></h1><p>Owner access only. Enter your private access code to manage events and commission enquiries.</p><form onSubmit={login}><input autoFocus type="password" placeholder="Access code" value={code} onChange={(e) => setCode(e.target.value)} /><button className="button button-solid" disabled={loading}>{loading ? 'Checking…' : 'Enter'} <ArrowUpRight size={15} /></button></form>{error && <small className="studio-error">{error}</small>}<Link href="/" className="text-link">Return to public site</Link></div></main>;

      return <main className="studio-shell"><aside className="studio-sidebar"><Link href="/" className="wordmark"><span>TP</span> Tare Precious <small>STUDIO</small></Link><div className="studio-sidebar-label">PRIVATE OPERATIONS</div><a href="#events" onClick={() => setActiveSection('events')} className={`studio-side-link ${activeSection === 'events' ? 'is-active' : ''}`}><Sparkles size={16} /> Gallery folders <b>{events.length}</b></a><a href="#inquiries" onClick={() => setActiveSection('inquiries')} className={`studio-side-link ${activeSection === 'inquiries' ? 'is-active' : ''}`}><MessageSquare size={16} /> Enquiries <b>{active.length}</b></a><button className="studio-side-link studio-logout" onClick={async () => { await fetch('/api/studio/auth', { method: 'DELETE' }); setAuthenticated(false); }}><LogOut size={16} /> Exit studio</button></aside><section className="studio-main"><header className="studio-topbar"><div><span className="section-label">Private operations / {new Date().getFullYear()}</span><h1>{greeting}, Tare.</h1></div><div className="studio-avatar">TP</div></header><div className="studio-stat-grid"><div><span>Active enquiries</span><strong>{active.length}</strong><small><Users size={13} /> Live pipeline</small></div><div><span>Gallery folders</span><strong>{events.length}</strong><small><Sparkles size={13} /> Published stories</small></div><div><span>New this month</span><strong>{inquiries.filter((item) => item.status === 'new').length}</strong><small><Check size={13} /> Needs your eye</small></div><div><span>Response rhythm</span><strong>48h</strong><small><Clock3 size={13} /> Atelier standard</small></div></div><div className="studio-section-head" id="events"><div><span className="section-label">Portfolio manager</span><h2>Gallery folders</h2></div><button className="button button-solid" onClick={() => setEditingEvent({ ...blankEvent, order: events.length + 1 })}><Plus size={16} /> Add folder</button></div><div className="studio-event-list">{events.map((event) => <div className="studio-event-row" key={event.id}><div><strong>{event.title}</strong><small>{event.year} · {event.category} · {event.galleryImages.length} images in folder</small></div><div className="studio-event-actions"><button onClick={() => setEditingEvent(event)} aria-label={`Edit ${event.title} gallery folder`}><Pencil size={15} /></button><button onClick={() => removeEvent(event.id)} aria-label={`Remove ${event.title} gallery folder`}><Trash2 size={15} /></button></div></div>)}</div><div className="studio-section-head" id="inquiries"><div><span className="section-label">Commission pipeline</span><h2>Private enquiries</h2></div><label className="studio-search"><Search size={16} /><input placeholder="Search enquiries" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div><div className="inquiry-table"><div className="inquiry-table-head"><span>Client</span><span>Celebration</span><span>Timing & place</span><span>Status</span><span /></div>{filtered.length === 0 ? <div className="empty-state">No enquiries match your search.</div> : filtered.map((inquiry) => <div className="inquiry-row" key={inquiry.id}><div><strong>{inquiry.clientName}</strong><small>{inquiry.email}</small></div><div><strong>{inquiry.eventType}</strong><small>{inquiry.guestCount || 'Guest count pending'}</small></div><div><strong>{inquiry.estimatedDate || 'Date flexible'}</strong><small>{inquiry.location || 'Location pending'}</small></div><select value={inquiry.status} onChange={(e) => updateStatus(inquiry.id, e.target.value as VIPInquiry['status'])}>{statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><details><summary>View note</summary><p>{inquiry.visionNotes || 'No additional notes.'}</p></details></div>)}</div></section>{editingEvent && <EventEditor event={editingEvent} uploading={uploading} onChange={setEditingEvent} onUpload={uploadImages} onSave={saveEvent} onClose={() => setEditingEvent(null)} />}</main>;
}

function EventEditor({ event, uploading, onChange, onUpload, onSave, onClose }: { event: EventProject; uploading: boolean; onChange: (event: EventProject) => void; onUpload: (files: FileList | null) => void; onSave: (event: EventProject) => void; onClose: () => void }) {
  const set = (key: keyof EventProject, value: string | boolean) => onChange({ ...event, [key]: value });
  return <div className="event-editor-backdrop"><form className="event-editor" onSubmit={(e) => { e.preventDefault(); onSave(event); }}><button type="button" className="modal-close" onClick={onClose}><X /></button><div className="section-label">Gallery folder / portfolio event</div><h2>{event.id ? 'Edit gallery folder' : 'Create gallery folder'}</h2><div className="event-editor-grid"><label>Folder title<input required value={event.title} onChange={(e) => set('title', e.target.value)} /></label><label>Category<input value={event.category} onChange={(e) => set('category', e.target.value)} /></label><label>Year<input value={event.year} onChange={(e) => set('year', e.target.value)} /></label><label>Location<input value={event.location} onChange={(e) => set('location', e.target.value)} /></label><label>Venue<input value={event.venue} onChange={(e) => set('venue', e.target.value)} /></label><label>Guest count<input value={event.guestCount} onChange={(e) => set('guestCount', e.target.value)} /></label></div><label>Description<textarea rows={4} value={event.description} onChange={(e) => set('description', e.target.value)} /></label><label>Cover image URL<input required value={event.coverImage} onChange={(e) => set('coverImage', e.target.value)} /></label><label className="upload-box"><ImagePlus size={18} /> {uploading ? 'Uploading into this folder…' : 'Add images to this folder'}<input type="file" accept="image/*" multiple onChange={(e) => onUpload(e.target.files)} /></label>{event.galleryImages.length > 0 && <div className="uploaded-list">{event.galleryImages.map((image) => <span key={image}>{image.split('/').pop()}</span>)}</div>}<label className="editor-checkbox"><input type="checkbox" checked={event.isFeatured} onChange={(e) => onChange({ ...event, isFeatured: e.target.checked })} /> Show in selected work</label><button className="button button-solid" type="submit">Save folder <Check size={16} /></button></form></div>;
}
