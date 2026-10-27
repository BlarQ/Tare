'use client';

import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, Mail, MapPin, Menu, Phone, X } from 'lucide-react';
import { FormEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { CmsDatabase, EventProject } from '@/types/cms';

function AnimatedStat({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const statRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = statRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasAnimated.current) return;
      hasAnimated.current = true;
      const startedAt = performance.now();
      const duration = 1200;
      const animate = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        setDisplayValue(Math.round(value * easedProgress));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={statRef}><strong>{displayValue.toLocaleString()}{suffix}</strong><span>{label}</span></div>;
}

function ScrollReveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={revealRef} className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`}>{children}</div>;
}

function ScrollWordReveal({ lines, tag = 'h2', className = '' }: { lines: { text: string; italic?: boolean }[]; tag?: 'h2' | 'p'; className?: string }) {
  const [progress, setProgress] = useState(0);
  const revealRef = useRef<HTMLDivElement>(null);
  const words = lines.flatMap((line) => line.text.split(' '));

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.86;
      const end = window.innerHeight * 0.22;
      setProgress(Math.min(Math.max((start - rect.top) / (start - end), 0), 1));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  let wordIndex = 0;
  const Tag = tag;
  const wordStagger = 0.88 / words.length;
  return <div ref={revealRef} className="scroll-word-reveal"><Tag className={className} aria-label={lines.map((line) => line.text).join(' ')}>{lines.map((line) => <span className={`scroll-word-line${line.italic ? ' is-italic' : ''}`} key={line.text}>{line.text.split(' ').map((word) => { const index = wordIndex; wordIndex += 1; const wordProgress = Math.min(Math.max((progress - index * wordStagger) * words.length * 1.5, 0), 1); return <span className="scroll-word" key={`${word}-${index}`} style={{ opacity: 0.12 + wordProgress * 0.88, transform: `translateY(${(1 - wordProgress) * 18}px)` }}>{word}</span>; })}</span>)}</Tag></div>;
}

function latestEventYear(year: string): number {
  const years = year.match(/\d{4}/g)?.map(Number) || [];
  return years.length ? Math.max(...years) : 0;
}

export default function PortfolioSite({ data }: { data: CmsDatabase }) {
  const { settings, events, services, testimonials } = data;
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventProject | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ image: string; title: string; index: number } | null>(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeFeedback, setActiveFeedback] = useState(0);
  const [formState, setFormState] = useState({ clientName: '', email: '', phone: '', eventType: '', estimatedDate: '', location: '', guestCount: '', budgetRange: '', visionNotes: '' });
  const featured = [...events]
    .sort((a, b) => latestEventYear(b.year) - latestEventYear(a.year) || b.order - a.order)
    .slice(0, 2);
  const visibleFeedbacks = testimonials.filter((item) => item.isFeatured).length > 0 ? testimonials.filter((item) => item.isFeatured) : testimonials;
  const galleryImages = events.flatMap((event) => event.galleryImages.map((image, index) => ({ image, title: event.title, index })));

  const moveLightbox = (direction: -1 | 1) => {
    if (!selectedImage || galleryImages.length < 2) return;
    const currentIndex = galleryImages.findIndex((item) => item.image === selectedImage.image && item.title === selectedImage.title);
    const nextIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const updateField = (key: keyof typeof formState, value: string) => setFormState((current) => ({ ...current, [key]: value }));
  const openWhatsAppRequest = () => {
    const adminPhone = settings.contactPhone.replace(/\D/g, '');
    const message = [
      'Hello Tare Precious, I would like to discuss planning an event.',
      '',
      `Name: ${formState.clientName}`,
      `Email: ${formState.email || 'Not provided'}`,
      `Phone: ${formState.phone || 'Not provided'}`,
      `Event type: ${formState.eventType}`,
      `Preferred date: ${formState.estimatedDate || 'Flexible'}`,
      `Location: ${formState.location || 'Not decided'}`,
      `Guest count: ${formState.guestCount || 'Not decided'}`,
      `Budget range: ${formState.budgetRange || 'Not decided'}`,
      '',
      `Vision: ${formState.visionNotes || 'Not provided'}`,
    ].join('\n');
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setShowWhatsAppModal(false);
  };
  useEffect(() => {
    if (visibleFeedbacks.length < 2) return;
    const timer = window.setInterval(() => setActiveFeedback((current) => (current + 1) % visibleFeedbacks.length), 6500);
    return () => window.clearInterval(timer);
  }, [visibleFeedbacks.length]);
  const submitInquiry = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError('');
    const response = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formState) });
    const result = await response.json().catch(() => ({}));
    if (response.ok) {
      setSubmitted(true);
      setFormState({ clientName: '', email: '', phone: '', eventType: '', estimatedDate: '', location: '', guestCount: '', budgetRange: '', visionNotes: '' });
    } else {
      setSubmitError(result.error || 'We could not deliver your enquiry. Please try again or contact us directly.');
    }
  };

  return (
    <main className="portfolio-shell">
      <header className="portfolio-header">
        <a href="#top" className="wordmark" onClick={() => setMenuOpen(false)}><span>{settings.monogram}</span> {settings.brandName} <small>ATELIER</small></a>
        <nav className={menuOpen ? 'portfolio-nav is-open' : 'portfolio-nav'}>
          <a href="#approach" onClick={() => setMenuOpen(false)}>Approach</a>
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="/studio" onClick={() => setMenuOpen(false)}>Owner login</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="nav-cta">Start a commission <ArrowUpRight size={14} /></a>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="portfolio-hero" id="top">
        <div className="hero-grain" />
        <div className="hero-copy">
          <p className="eyebrow"><MapPin size={14} /> Private event architecture / Lagos, Nigeria</p>
          <h1>Events elevated.<br /><em>Experiences delivered.</em></h1>
          <p className="hero-intro">{settings.shortBio}</p>
          <div className="hero-actions"><a className="button button-solid" href="#work">Explore the work <ArrowDown size={15} /></a><button className="text-link" type="button" onClick={() => setShowWhatsAppModal(true)}>Plan something unforgettable <ArrowUpRight size={15} /></button></div>
        </div>
        <div className="hero-image-wrap"><Image src="/Tare.jpeg" alt="Tare Precious James at an event" fill priority sizes="(max-width: 800px) 90vw, 47vw" className="hero-image" /><div className="hero-image-caption">01 / The architect<br /><strong>{settings.planner.fullName}</strong></div></div>
        <div className="hero-scroll"><span>Scroll to explore</span><span className="scroll-line" /></div>
      </section>

      <section className="statement-section" id="approach">
        <ScrollReveal className="section-label">01 / The point of view</ScrollReveal>
        <div className="statement-grid"><ScrollWordReveal lines={[{ text: 'From brief' }, { text: 'to live experience.', italic: true }]} /><ScrollReveal className="statement-copy-reveal"><div><ScrollWordReveal tag="p" className="large-copy" lines={[{ text: settings.planner.philosophyStatement }]} /><ScrollWordReveal tag="p" className="muted-copy" lines={[{ text: settings.planner.curatorBio }]} /><button className="text-link" type="button" onClick={() => setShowWhatsAppModal(true)}>Start a project <ArrowUpRight size={15} /></button></div></ScrollReveal></div>
        <div className="stat-strip"><AnimatedStat value={settings.planner.experienceYears} label="Years of experience" suffix="+" /><AnimatedStat value={20000} label="Largest audience" suffix="+" /><AnimatedStat value={settings.planner.eventsOrganized} label="Events delivered" suffix="+" /><AnimatedStat value={85} label="International delegates" suffix="+" /></div>
      </section>

      <section className="work-section" id="work"><div className="section-heading"><div><div className="section-label">02 / Selected work</div><h2>Recent <em>masterpieces</em></h2></div><p>Every commission begins with a blank page and ends in a memory that feels impossible to repeat.</p></div><div className="work-grid">{featured.map((project, index) => <button className={`work-card work-card-${index + 1}`} key={project.id} onClick={() => setSelectedEvent(project)}><div className="work-image"><Image src={project.coverImage} alt={project.title} fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="work-meta"><span>{project.year} / {project.category}</span><ArrowUpRight size={17} /></div><h3>{project.title}</h3><p>{project.location}</p></button>)}</div></section>

      <section className="gallery-section" id="gallery"><div className="section-label">03 / Gallery archive</div><div className="gallery-heading"><h2>Work in <em>motion.</em></h2><p>Open a folder to step inside each event, then click any image for a full-resolution view.</p></div><div className="gallery-folders">{events.filter((event) => event.galleryImages.length > 0).map((event, folderIndex) => <details className="gallery-folder" key={event.id} open={folderIndex === 0}><summary><span className="gallery-folder-number">0{folderIndex + 1}</span><span className="gallery-folder-title">{event.title}</span><span className="gallery-folder-meta">{event.year} · {event.galleryImages.length} images</span><ChevronDown className="gallery-folder-icon" size={18} /></summary><div className="gallery-folder-content"><div className="gallery-grid">{event.galleryImages.map((image, imageIndex) => <button className="gallery-tile" key={image} type="button" onClick={() => setSelectedImage({ image, title: event.title, index: imageIndex })} aria-label={`View ${event.title} image ${imageIndex + 1}`}><Image src={image} alt={`${event.title} gallery image ${imageIndex + 1}`} fill sizes="(max-width: 800px) 50vw, 20vw" quality={100} unoptimized /></button>)}</div></div></details>)}</div></section>

      <section className="services-section" id="services"><div className="section-label">04 / The atelier</div><div className="services-intro"><h2>From first sketch<br />to <em>final toast.</em></h2><p>We build the feeling and the framework behind extraordinary celebrations: creative direction, production discipline, and a calm hand at every detail.</p></div><div className="service-list">{services.slice(0, 4).map((service, index) => <div className="service-row" key={service.id}><span className="service-number">0{index + 1}</span><div><h3>{service.title}</h3><p>{service.description}</p></div><span className="service-tag">{service.timeline}</span><ArrowUpRight size={18} /></div>)}</div></section>

      <section className="quote-section"><div className="quote-mark">“</div><div className="feedback-carousel" aria-live="polite"><blockquote>{visibleFeedbacks[activeFeedback]?.quote || 'The most memorable celebrations are not decorated. They are authored.'}</blockquote><p>— {visibleFeedbacks[activeFeedback]?.clientName || 'Private client, Lagos'}</p>{visibleFeedbacks.length > 1 && <div className="feedback-controls"><button type="button" onClick={() => setActiveFeedback((activeFeedback - 1 + visibleFeedbacks.length) % visibleFeedbacks.length)} aria-label="Previous feedback"><ChevronLeft size={17} /></button><span>{String(activeFeedback + 1).padStart(2, '0')} / {String(visibleFeedbacks.length).padStart(2, '0')}</span><button type="button" onClick={() => setActiveFeedback((activeFeedback + 1) % visibleFeedbacks.length)} aria-label="Next feedback"><ChevronRight size={17} /></button></div>}</div></section>

      <section className="contact-section" id="contact"><div className="contact-intro"><div className="section-label">04 / Private commissions</div><h2>Tell us what<br /><em>you’re imagining.</em></h2><p>For dates, availability, and a considered first conversation, share a little about your celebration. Every enquiry is read personally.</p><div className="contact-details"><span>{settings.planner.fullName}</span><a href={`mailto:${settings.contactEmail}`}><Mail size={16} /> {settings.contactEmail}</a><a href={`tel:${settings.contactPhone.replace(/\s/g, '')}`}><Phone size={16} /> {settings.contactPhone}</a><span>{settings.location}</span></div></div><form className="inquiry-form" onSubmit={submitInquiry}>{submitted ? <div className="form-success"><Check size={28} /><h3>Your note is with the atelier.</h3><p>We’ll be in touch within two working days.</p><button type="button" className="text-link" onClick={() => setSubmitted(false)}>Send another enquiry</button></div> : <><div className="form-row"><label>Your name<input required value={formState.clientName} onChange={(e) => updateField('clientName', e.target.value)} /></label><label>Email address<input required type="email" value={formState.email} onChange={(e) => updateField('email', e.target.value)} /></label></div><div className="form-row"><label>Celebration type<select required value={formState.eventType} onChange={(e) => updateField('eventType', e.target.value)}><option value="">Select one</option><option>Wedding</option><option>Private celebration</option><option>Gala / corporate</option><option>Destination event</option></select></label><label>Preferred date<input type="text" placeholder="Month / year" value={formState.estimatedDate} onChange={(e) => updateField('estimatedDate', e.target.value)} /></label></div><div className="form-row"><label>Location<input value={formState.location} onChange={(e) => updateField('location', e.target.value)} /></label><label>Guest count<input value={formState.guestCount} onChange={(e) => updateField('guestCount', e.target.value)} /></label></div><label>Tell us about the feeling you want to create<textarea rows={4} value={formState.visionNotes} onChange={(e) => updateField('visionNotes', e.target.value)} /></label>{submitError && <p className="form-error" role="alert">{submitError}</p>}<button className="button button-solid" type="submit">Begin the conversation <ArrowUpRight size={16} /></button></>}</form></section>

      <footer className="portfolio-footer"><a href="#top" className="wordmark"><span>{settings.monogram}</span> {settings.brandName} <small>ATELIER</small></a><p>{settings.footerCopyright}</p><div className="footer-socials"><a href={settings.socialLinks.instagram || '#'} aria-label="Instagram">IG</a><a href={settings.socialLinks.linkedin || '#'} aria-label="LinkedIn">LI</a></div></footer>

      {selectedEvent && <div className="case-study-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedEvent(null)}><article className="case-study-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedEvent(null)} aria-label="Close"><X /></button><div className="case-study-image"><Image src={selectedEvent.coverImage} alt={selectedEvent.title} fill sizes="(max-width: 800px) 100vw, 48vw" /></div><div className="case-study-copy"><span className="section-label">{selectedEvent.year} / {selectedEvent.category}</span><h2>{selectedEvent.title}</h2><p className="large-copy">{selectedEvent.description}</p><div className="case-study-facts"><span>{selectedEvent.location}</span><span>{selectedEvent.guestCount}</span><span>{selectedEvent.budgetTier}</span></div><ul>{selectedEvent.deliverables.slice(0, 4).map((item) => <li key={item}><Check size={14} /> {item}</li>)}</ul></div></article></div>}
      {selectedImage && <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${selectedImage.title} image viewer`} onClick={() => setSelectedImage(null)}><button className="lightbox-close" type="button" onClick={() => setSelectedImage(null)} aria-label="Close image viewer"><X /></button><button className="lightbox-nav lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(-1); }} aria-label="Previous image">‹</button><div className="lightbox-frame" onClick={(event) => event.stopPropagation()}><Image src={selectedImage.image} alt={`${selectedImage.title} full-size image ${selectedImage.index + 1}`} fill sizes="100vw" quality={100} unoptimized className="lightbox-image" /><div className="lightbox-caption">{selectedImage.title} · image {selectedImage.index + 1}</div></div><button className="lightbox-nav lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); moveLightbox(1); }} aria-label="Next image">›</button></div>}
      {showWhatsAppModal && <div className="whatsapp-request-backdrop" role="dialog" aria-modal="true" aria-labelledby="whatsapp-request-title" onMouseDown={() => setShowWhatsAppModal(false)}><form className="whatsapp-request-modal" onSubmit={(event) => { event.preventDefault(); openWhatsAppRequest(); }} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowWhatsAppModal(false)} aria-label="Close event request form"><X /></button><div className="section-label">Private commissions / WhatsApp</div><h2 id="whatsapp-request-title">Tell us about<br /><em>your event.</em></h2><p className="whatsapp-request-intro">Share a few details and we’ll take you straight to Tare Precious on WhatsApp with your message ready to send.</p><div className="whatsapp-request-grid"><label>Your name<input required value={formState.clientName} onChange={(event) => updateField('clientName', event.target.value)} /></label><label>Email address<input type="email" value={formState.email} onChange={(event) => updateField('email', event.target.value)} /></label><label>Phone number<input required value={formState.phone} onChange={(event) => updateField('phone', event.target.value)} /></label><label>Event type<select required value={formState.eventType} onChange={(event) => updateField('eventType', event.target.value)}><option value="">Select one</option><option>Wedding</option><option>Private celebration</option><option>Gala / corporate</option><option>Destination event</option></select></label><label>Preferred date<input value={formState.estimatedDate} onChange={(event) => updateField('estimatedDate', event.target.value)} placeholder="Month / year" /></label><label>Guest count<input value={formState.guestCount} onChange={(event) => updateField('guestCount', event.target.value)} /></label><label>Location<input value={formState.location} onChange={(event) => updateField('location', event.target.value)} /></label><label>Budget range<input value={formState.budgetRange} onChange={(event) => updateField('budgetRange', event.target.value)} placeholder="Optional" /></label></div><label>Tell us about the feeling you want to create<textarea rows={4} value={formState.visionNotes} onChange={(event) => updateField('visionNotes', event.target.value)} /></label><button className="button button-solid whatsapp-submit" type="submit">Continue to WhatsApp <ArrowUpRight size={16} /></button></form></div>}
    </main>
  );
}
