import { motion } from 'framer-motion';
import { Bot, Cpu, FileSearch, Gauge, GitBranch, LockKeyhole } from 'lucide-react';

const features = [
  {
    icon: FileSearch,
    title: 'Document Intake',
    text: 'Designed for PDF, image, and text workflows. The frontend shows upload states and prepares the future backend processing journey.',
  },
  {
    icon: Cpu,
    title: 'Rust Processing Core',
    text: 'The concept supports high-speed text extraction, OCR preprocessing, cleaning, and memory-safe heavy document operations.',
  },
  {
    icon: GitBranch,
    title: 'Go Workflow API',
    text: 'Go can manage routing, services, request states, result storage, and communication between frontend and processing modules.',
  },
  {
    icon: Bot,
    title: 'ABCDE Intelligence',
    text: 'Content can be grouped into A, B, C, D, and E priorities following Brian Tracy style task classification logic.',
  },
  {
    icon: Gauge,
    title: 'Live Status Experience',
    text: 'Animations are mapped to upload, extraction, analysis, and report generation steps so the product feels alive and clear.',
  },
  {
    icon: LockKeyhole,
    title: 'Business-Ready UX',
    text: 'Lead capture, pricing plans, CSV export, responsive layout, and GitHub Pages deployment are included for public presentation.',
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Core Features</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">A premium interface for a serious document intelligence platform.</h2>
        <p className="mt-5 text-lg leading-8 text-muted">This frontend presents your Go + Rust idea like a real startup product, with clean sections, modern interactions, and polished motion.</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="group rounded-[1.8rem] border border-white/10 bg-white/[0.052] p-6 backdrop-blur-xl transition hover:-translate-y-2 hover:border-royal/60 hover:shadow-glow"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/12 bg-white/8 text-skyglow transition group-hover:bg-royal/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-muted">{feature.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
