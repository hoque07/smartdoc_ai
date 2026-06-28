import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, FileText, ShieldCheck, Zap } from 'lucide-react';

type HeroProps = {
  onOpen: () => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export function Hero({ onOpen }: HeroProps) {
  return (
    <section id="top" className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-24">
      <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
        <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-skyglow backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-skyglow shadow-[0_0_16px_rgba(117,215,255,0.8)]" />
          Premium document intelligence for Go + Rust systems
        </motion.div>

        <motion.h1 variants={fadeUp} className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-pearl sm:text-6xl lg:text-7xl">
          Turn raw documents into clear priority plans.
        </motion.h1>

        <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
          SmartDoc AI is a cinematic document intelligence interface that can upload a PDF, extract readable text in the browser, and organize insights using Brian Tracy's ABCDE priority method.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-4 sm:flex-row">
          <a href="#analyzer" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal to-skyglow px-7 py-4 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1">
            Upload PDF
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <button onClick={onOpen} className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/12">
            Request project access
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Rust OCR', Zap],
            ['Go API', ShieldCheck],
            ['ABCDE', BrainCircuit],
            ['Reports', FileText],
          ].map(([label, Icon]) => {
            const IconComponent = Icon as typeof Zap;
            return (
              <div key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-muted backdrop-blur">
                <IconComponent className="mb-2 h-5 w-5 text-skyglow" />
                {label as string}
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.94, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.85, ease: 'easeOut' }} className="relative">
        <div className="absolute -inset-8 rounded-[3rem] bg-royal/20 blur-3xl" />
        <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="relative overflow-hidden rounded-[2.4rem] border border-white/12 bg-white/[0.065] p-5 shadow-2xl backdrop-blur-2xl">
          <div className="rounded-[1.8rem] border border-white/10 bg-charcoal/80 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">Processing Pipeline</p>
                <h3 className="mt-1 text-xl font-semibold">SmartDoc AI Core</h3>
              </div>
              <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs text-gold">Live Concept</span>
            </div>

            <div className="grid gap-3">
              {[
                ['Upload', 'PDF and text files', '100%'],
                ['PDF Engine', 'Extract readable content', '88%'],
                ['Go Workflow', 'Route, analyze, store', '76%'],
                ['ABCDE Planner', 'Rank priority insights', '92%'],
              ].map(([name, detail, score], index) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.13 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.045] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-white">{name}</p>
                      <p className="text-sm text-muted">{detail}</p>
                    </div>
                    <span className="text-sm font-semibold text-skyglow">{score}</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: '8%' }}
                      animate={{ width: score }}
                      transition={{ duration: 1.1, delay: 0.55 + index * 0.15 }}
                      className="h-full rounded-full bg-gradient-to-r from-royal to-skyglow"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
