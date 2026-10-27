'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, Check, Clock3, ImagePlus, LogOut, MessageSquare, Pencil, Plus, Search, Sparkles, Trash2, Users, X } from 'lucide-react';
import { EventProject, Testimonial, VIPInquiry } from '@/types/cms';

const statuses: VIPInquiry['status'][] = ['new', 'reviewing', 'proposal_sent', 'booked', 'archived'];
const blankEvent: EventProject = { id: '', slug: '', title: '', subtitle: '', category: 'Corporate Experience', year: new Date().getFullYear().toString(), location: '', venue: '', guestCount: '', budgetTier: '', coverImage: '', galleryImages: [], description: '', deliverables: [], isFeatured: true, order: 1 };
const blankFeedback: Testimonial = { id: '', quote: '', clientName: '', eventTitle: '', location: '', date: '', pressOutlet: '', pressLogoUrl: '', isFeatured: true, order: 1 };

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
  const [feedbacks, setFeedbacks] = useState<Testimonial[]>([]);
  const [editingFeedback, setEditingFeedback] = useState<Testimonial | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'event' | 'feedback'; id: string; label: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'events' | 'feedbacks' | 'inquiries'>('events');

  const loadStudio = async () => {
    const [inquiryResponse, cmsResponse] = await Promise.all([fetch('/api/inquiries'), fetch('/api/cms')]);
    if (!inquiryResponse.ok) { setAuthenticated(false); return; }
    const inquiryJson = await inquiryResponse.json();
    const cmsJson = await cmsResponse.json();
    setInquiries(inquiryJson.inquiries || []);
    setEvents(cmsJson.data?.events || []);
    setFeedbacks(cmsJson.data?.testimonials || []);
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

  const removeEvent = (id: string) => {
    const event = events.find((item) => item.id === id);
    setDeleteDialog({ type: 'event', id, label: event?.title || 'this event' });
  };

  const saveFeedback = async (feedback: Testimonial) => {
    const payload = { ...feedback, id: feedback.id || `feedback-${Date.now()}`, order: feedback.order || feedbacks.length + 1 };
    const response = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save_testimonial', payload }) });
    if (response.ok) { const json = await response.json(); setFeedbacks(json.data || []); setEditingFeedback(null); }
  };

  const removeFeedback = (id: string) => {
    const feedback = feedbacks.find((item) => item.id === id);
    setDeleteDialog({ type: 'feedback', id, label: feedback?.clientName || 'this feedback' });
  };

  const confirmDeletion = async () => {
    if (!deleteDialog) return;
    const action = deleteDialog.type === 'event' ? 'delete_event' : 'delete_testimonial';
    const response = await fetch('/api/cms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, payload: { id: deleteDialog.id } }) });
    if (response.ok) {
      const json = await response.json();
      if (deleteDialog.type === 'event') setEvents(json.data || []);
      else setFeedbacks(json.data || []);
    }
    setDeleteDialog(null);
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

      return <main className="studio-shell"><aside className="studio-sidebar"><Link href="/" className="wordmark"><span>TP</span> Tare Precious <small>STUDIO</small></Link><div className="studio-sidebar-label">PRIVATE OPERATIONS</div><a href="#events" onClick={() => setActiveSection('events')} className={`studio-side-link ${activeSection === 'events' ? 'is-active' : ''}`}><Sparkles size={16} /> Gallery folders <b>{events.length}</b></a><a href="#feedbacks" onClick={() => setActiveSection('feedbacks')} className={`studio-side-link ${activeSection === 'feedbacks' ? 'is-active' : ''}`}><MessageSquare size={16} /> Feedbacks <b>{feedbacks.length}</b></a><a href="#inquiries" onClick={() => setActiveSection('inquiries')} className={`studio-side-link ${activeSection === 'inquiries' ? 'is-active' : ''}`}><MessageSquare size={16} /> Enquiries <b>{active.length}</b></a><button className="studio-side-link studio-logout" onClick={async () => { await fetch('/api/studio/auth', { method: 'DELETE' }); setAuthenticated(false); }}><LogOut size={16} /> Exit studio</button></aside><section className="studio-main"><header className="studio-topbar"><div><span className="section-label">Private operations / {new Date().getFullYear()}</span><h1>{greeting}, Tare.</h1></div><div className="studio-avatar">TP</div></header><div className="studio-stat-grid"><div><span>Active enquiries</span><strong>{active.length}</strong><small><Users size={13} /> Live pipeline</small></div><div><span>Gallery folders</span><strong>{events.length}</strong><small><Sparkles size={13} /> Published stories</small></div><div><span>Feedbacks</span><strong>{feedbacks.length}</strong><small><MessageSquare size={13} /> Public proof</small></div><div><span>Response rhythm</span><strong>48h</strong><small><Clock3 size={13} /> Atelier standard</small></div></div><div className="studio-section-head" id="events"><div><span className="section-label">Portfolio manager</span><h2>Gallery folders</h2></div><button className="button button-solid" onClick={() => setEditingEvent({ ...blankEvent, order: events.length + 1 })}><Plus size={16} /> Add folder</button></div><div className="studio-event-list">{events.map((event) => <div className="studio-event-row" key={event.id}><div><strong>{event.title}</strong><small>{event.year} · {event.category} · {event.galleryImages.length} images in folder</small></div><div className="studio-event-actions"><button onClick={() => setEditingEvent(event)} aria-label={`Edit ${event.title} gallery folder`}><Pencil size={15} /></button><button onClick={() => removeEvent(event.id)} aria-label={`Remove ${event.title} gallery folder`}><Trash2 size={15} /></button></div></div>)}</div><div className="studio-section-head" id="feedbacks"><div><span className="section-label">Public proof</span><h2>Feedbacks</h2></div><button className="button button-solid" onClick={() => setEditingFeedback({ ...blankFeedback, order: feedbacks.length + 1 })}><Plus size={16} /> Add feedback</button></div><div className="studio-event-list">{feedbacks.map((feedback) => <div className="studio-event-row" key={feedback.id}><div><strong>{feedback.clientName || 'Untitled feedback'}</strong><small>{feedback.eventTitle || 'General feedback'} · {feedback.isFeatured ? 'Visible on site' : 'Hidden from site'}</small></div><div className="studio-event-actions"><button onClick={() => setEditingFeedback(feedback)} aria-label={`Edit feedback from ${feedback.clientName}`}><Pencil size={15} /></button><button onClick={() => removeFeedback(feedback.id)} aria-label={`Remove feedback from ${feedback.clientName}`}><Trash2 size={15} /></button></div></div>)}</div><div className="studio-section-head" id="inquiries"><div><span className="section-label">Commission pipeline</span><h2>Private enquiries</h2></div><label className="studio-search"><Search size={16} /><input placeholder="Search enquiries" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div><div className="inquiry-table"><div className="inquiry-table-head"><span>Client</span><span>Celebration</span><span>Timing & place</span><span>Status</span><span /></div>{filtered.length === 0 ? <div className="empty-state">No enquiries match your search.</div> : filtered.map((inquiry) => <div className="inquiry-row" key={inquiry.id}><div><strong>{inquiry.clientName}</strong><small>{inquiry.email}</small></div><div><strong>{inquiry.eventType}</strong><small>{inquiry.guestCount || 'Guest count pending'}</small></div><div><strong>{inquiry.estimatedDate || 'Date flexible'}</strong><small>{inquiry.location || 'Location pending'}</small></div><select value={inquiry.status} onChange={(e) => updateStatus(inquiry.id, e.target.value as VIPInquiry['status'])}>{statuses.map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}</select><details><summary>View note</summary><p>{inquiry.visionNotes || 'No additional notes.'}</p></details></div>)}</div></section>{editingEvent && <EventEditor event={editingEvent} uploading={uploading} onChange={setEditingEvent} onUpload={uploadImages} onSave={saveEvent} onClose={() => setEditingEvent(null)} />}{editingFeedback && <FeedbackEditor feedback={editingFeedback} onChange={setEditingFeedback} onSave={saveFeedback} onClose={() => setEditingFeedback(null)} />}{deleteDialog && <DeleteDialog label={deleteDialog.label} type={deleteDialog.type} onConfirm={confirmDeletion} onClose={() => setDeleteDialog(null)} />}</main>;
}

function EventEditor({ event, uploading, onChange, onUpload, onSave, onClose }: { event: EventProject; uploading: boolean; onChange: (event: EventProject) => void; onUpload: (files: FileList | null) => void; onSave: (event: EventProject) => void; onClose: () => void }) {
  const set = (key: keyof EventProject, value: string | boolean) => onChange({ ...event, [key]: value });
  return <div className="event-editor-backdrop"><form className="event-editor" onSubmit={(e) => { e.preventDefault(); onSave(event); }}><button type="button" className="modal-close" onClick={onClose}><X /></button><div className="section-label">Gallery folder / portfolio event</div><h2>{event.id ? 'Edit gallery folder' : 'Create gallery folder'}</h2><div className="event-editor-grid"><label>Folder title<input required value={event.title} onChange={(e) => set('title', e.target.value)} /></label><label>Category<input value={event.category} onChange={(e) => set('category', e.target.value)} /></label><label>Year<input value={event.year} onChange={(e) => set('year', e.target.value)} /></label><label>Location<input value={event.location} onChange={(e) => set('location', e.target.value)} /></label><label>Venue<input value={event.venue} onChange={(e) => set('venue', e.target.value)} /></label><label>Guest count<input value={event.guestCount} onChange={(e) => set('guestCount', e.target.value)} /></label></div><label>Description<textarea rows={4} value={event.description} onChange={(e) => set('description', e.target.value)} /></label><label>Cover image URL<input required value={event.coverImage} onChange={(e) => set('coverImage', e.target.value)} /></label><label className="upload-box"><ImagePlus size={18} /> {uploading ? 'Uploading into this folder…' : 'Add images to this folder'}<input type="file" accept="image/*" multiple onChange={(e) => onUpload(e.target.files)} /></label>{event.galleryImages.length > 0 && <div className="uploaded-list">{event.galleryImages.map((image) => <span key={image}>{image.split('/').pop()}</span>)}</div>}<label className="editor-checkbox"><input type="checkbox" checked={event.isFeatured} onChange={(e) => onChange({ ...event, isFeatured: e.target.checked })} /> Show in selected work</label><button className="button button-solid" type="submit">Save folder <Check size={16} /></button></form></div>;
}

function FeedbackEditor({ feedback, onChange, onSave, onClose }: { feedback: Testimonial; onChange: (feedback: Testimonial) => void; onSave: (feedback: Testimonial) => void; onClose: () => void }) {
  return <div className="event-editor-backdrop"><form className="event-editor feedback-editor" onSubmit={(event) => { event.preventDefault(); onSave(feedback); }}><button type="button" className="modal-close" onClick={onClose}><X /></button><div className="section-label">Public proof / client feedback</div><h2>{feedback.id ? 'Edit feedback' : 'Add feedback'}</h2><div className="event-editor-grid"><label>Client name<input required value={feedback.clientName} onChange={(event) => onChange({ ...feedback, clientName: event.target.value })} /></label><label>Event title<input value={feedback.eventTitle} onChange={(event) => onChange({ ...feedback, eventTitle: event.target.value })} /></label><label>Location<input value={feedback.location} onChange={(event) => onChange({ ...feedback, location: event.target.value })} /></label><label>Date<input value={feedback.date} onChange={(event) => onChange({ ...feedback, date: event.target.value })} /></label></div><label>Feedback<textarea required rows={6} value={feedback.quote} onChange={(event) => onChange({ ...feedback, quote: event.target.value })} /></label><label>Press outlet / attribution<input value={feedback.pressOutlet || ''} onChange={(event) => onChange({ ...feedback, pressOutlet: event.target.value })} /></label><label className="editor-checkbox"><input type="checkbox" checked={feedback.isFeatured} onChange={(event) => onChange({ ...feedback, isFeatured: event.target.checked })} /> Display on public website</label><button className="button button-solid" type="submit">Save feedback <Check size={16} /></button></form></div>;
}

function DeleteDialog({ label, type, onConfirm, onClose }: { label: string; type: 'event' | 'feedback'; onConfirm: () => void; onClose: () => void }) {
  return <div className="studio-confirm-backdrop" role="presentation" onMouseDown={onClose}><div className="studio-confirm" role="alertdialog" aria-modal="true" aria-labelledby="delete-dialog-title" onMouseDown={(event) => event.stopPropagation()}><div className="studio-confirm-icon"><Trash2 size={18} /></div><div className="section-label">Private operations / confirmation</div><h2 id="delete-dialog-title">Remove {type === 'event' ? 'gallery folder' : 'feedback'}?</h2><p><strong>{label}</strong> will be removed from the portfolio and the public website.</p><div className="studio-confirm-actions"><button type="button" className="button button-quiet" onClick={onClose}>Keep it</button><button type="button" className="button button-danger" onClick={onConfirm}>Remove <Trash2 size={15} /></button></div></div></div>;
}
