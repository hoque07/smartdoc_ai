import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type CTAProps = {
  onOpen: () => void;
};

export function CTA({ onOpen }: CTAProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.06] px-6 py-16 text-center shadow-glow backdrop-blur-xl sm:px-12"
      >
        <div className="absolute inset-x-0 top-0 mx-auto h-32 w-2/3 bg-gradient-to-r from-transparent via-skyglow/25 to-transparent blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Final Call</p>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-6xl">Build the first impression before building the full AI system.</h2>
          <p className="mt-6 text-lg leading-8 text-muted">This frontend is ready for local testing, GitHub push, and public deployment. Later you can connect the Go backend and Rust engine.</p>
          <button onClick={onOpen} className="mt-9 inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-night shadow-glow transition hover:-translate-y-1 hover:bg-skyglow">
            Book the build
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
