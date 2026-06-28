import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

type Lead = {
  name: string;
  contact: string;
  packageName: string;
  message: string;
  createdAt: string;
};

type OrderModalProps = {
  isOpen: boolean;
  selectedPackage: string;
  onClose: () => void;
};

const storageKey = 'smartdoc_ai_leads';

function getLeads(): Lead[] {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]') as Lead[];
  } catch {
    return [];
  }
}

function exportCsv() {
  const leads = getLeads();
  const headers = ['Name', 'Contact', 'Package', 'Message', 'Created At'];
  const rows = leads.map((lead) => [lead.name, lead.contact, lead.packageName, lead.message, lead.createdAt]);
  const csv = [headers, ...rows]
    .map((row) => row.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'smartdoc-ai-leads.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function OrderModal({ isOpen, selectedPackage, onClose }: OrderModalProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [packageName, setPackageName] = useState(selectedPackage);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setPackageName(selectedPackage);
  }, [selectedPackage]);

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }

    if (contact.trim().length < 5 || !/[0-9@.]/.test(contact)) {
      setError('Please enter a valid email or phone number.');
      return;
    }

    const lead: Lead = {
      name: name.trim(),
      contact: contact.trim(),
      packageName,
      message: message.trim(),
      createdAt: new Date().toLocaleString(),
    };

    const updated = [lead, ...getLeads()];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSuccess('Request saved successfully. You can export it as CSV.');
    setError('');
    setName('');
    setContact('');
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] grid place-items-center bg-night/80 px-4 py-8 backdrop-blur-xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-charcoal/95 p-6 shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-skyglow">Lead Capture</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Request SmartDoc AI</h2>
                <p className="mt-2 text-sm leading-6 text-muted">This form stores demo leads in your browser localStorage. No backend is needed.</p>
              </div>
              <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/8 p-2 text-white transition hover:bg-white/12" aria-label="Close modal">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={submit} className="mt-7 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-white">
                  Name
                  <input value={name} onChange={(event) => setName(event.target.value)} className="rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-white outline-none focus:border-skyglow/60" placeholder="Your name" />
                </label>
                <label className="grid gap-2 text-sm text-white">
                  Email or phone
                  <input value={contact} onChange={(event) => setContact(event.target.value)} className="rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-white outline-none focus:border-skyglow/60" placeholder="email or phone" />
                </label>
              </div>

              <label className="grid gap-2 text-sm text-white">
                Selected package
                <select value={packageName} onChange={(event) => setPackageName(event.target.value)} className="rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-white outline-none focus:border-skyglow/60">
                  <option>Starter</option>
                  <option>Professional</option>
                  <option>Enterprise</option>
                  <option>Launch Access</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm text-white">
                Message
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} className="h-28 resize-none rounded-2xl border border-white/10 bg-night/70 px-4 py-3 text-white outline-none focus:border-skyglow/60" placeholder="Tell us what you want to build..." />
              </label>

              {error && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
              {success && <p className="rounded-2xl border border-skyglow/25 bg-skyglow/10 px-4 py-3 text-sm text-skyglow">{success}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" className="rounded-full bg-gradient-to-r from-royal to-skyglow px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1">
                  Save request
                </button>
                <button type="button" onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/12">
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
