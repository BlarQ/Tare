import nodemailer from 'nodemailer';
import { VIPInquiry } from '@/types/cms';

const recipient = process.env.INQUIRY_NOTIFICATION_EMAIL || 'tareprecious5122@gmail.com';

function escapeHtml(value: string | null | undefined): string {
  return String(value || '—')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function field(label: string, value: string | null | undefined): string {
  return `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8e3d8;color:#68786d;font-size:12px;text-transform:uppercase;letter-spacing:.08em">${label}</td><td style="padding:8px 12px;border-bottom:1px solid #e8e3d8;color:#17241f">${escapeHtml(value)}</td></tr>`;
}

export async function sendInquiryNotification(inquiry: VIPInquiry): Promise<{ sent: boolean; reason?: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !password || !from) {
    console.warn('Inquiry email not sent: SMTP_HOST, SMTP_USER, SMTP_PASSWORD, and SMTP_FROM are required.');
    return { sent: false, reason: 'SMTP mail delivery is not configured.' };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === 'true' || port === 465,
    auth: { user, pass: password },
  });

  const subject = `New commission enquiry from ${inquiry.clientName}`;
  const text = [
    'New commission enquiry for Tare Precious', '',
    `Name: ${inquiry.clientName}`,
    `Email: ${inquiry.email}`,
    `Phone: ${inquiry.phone || '—'}`,
    `Celebration type: ${inquiry.eventType}`,
    `Preferred date: ${inquiry.estimatedDate || '—'}`,
    `Location: ${inquiry.location || '—'}`,
    `Guest count: ${inquiry.guestCount || '—'}`,
    `Budget range: ${inquiry.budgetRange || '—'}`, '',
    'Vision / feeling:', inquiry.visionNotes || '—',
  ].join('\n');
  const html = `<div style="font-family:Arial,sans-serif;max-width:680px;color:#17241f"><p style="color:#68786d;text-transform:uppercase;letter-spacing:.12em;font-size:12px">Tare Precious / New private enquiry</p><h1 style="font-family:Georgia,serif;font-weight:400;font-size:32px">${escapeHtml(inquiry.clientName)} wants to start a conversation.</h1><table style="width:100%;border-collapse:collapse;margin:24px 0">${field('Name', inquiry.clientName)}${field('Email', inquiry.email)}${field('Phone', inquiry.phone)}${field('Celebration type', inquiry.eventType)}${field('Preferred date', inquiry.estimatedDate)}${field('Location', inquiry.location)}${field('Guest count', inquiry.guestCount)}${field('Budget range', inquiry.budgetRange)}</table><h2 style="font-size:14px;text-transform:uppercase;letter-spacing:.08em">Vision / feeling</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(inquiry.visionNotes)}</p></div>`;

  try {
    await transporter.sendMail({
      from,
      to: recipient,
      replyTo: inquiry.email,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (error) {
    console.error('Could not send enquiry notification through SMTP:', error);
    return { sent: false, reason: 'SMTP rejected or could not deliver the email.' };
  }
}
