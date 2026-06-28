import { motion } from 'framer-motion';
import { Database, FileText, Rocket, Server, TerminalSquare } from 'lucide-react';

const architecture = [
  { name: 'React UI', detail: 'Premium frontend', icon: Rocket },
  { name: 'Go Backend', detail: 'API and workflow', icon: Server },
  { name: 'Rust Engine', detail: 'OCR and parsing', icon: TerminalSquare },
  { name: 'Analysis', detail: 'ABCDE logic', icon: FileText },
  { name: 'Storage', detail: 'Future database', icon: Database },
];

const roadmap = [
  ['Week 1', 'Frontend launch page and interactive demo'],
  ['Week 2', 'Go API skeleton and upload route'],
  ['Week 3', 'Rust text extraction module'],
  ['Week 4', 'ABCDE analysis and report output'],
];

export function AnalyticsDashboard() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2.2rem] border border-white/10 bg-white/[0.052] p-6 backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Architecture</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Future Go + Rust system map.</h2>
            </div>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">Frontend ready</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-5">
            {architecture.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="relative rounded-2xl border border-white/10 bg-night/45 p-4 text-center"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-royal/15 text-skyglow">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.detail}</p>
                  {index < architecture.length - 1 && <div className="absolute right-[-17px] top-1/2 hidden h-px w-8 bg-gradient-to-r from-skyglow/80 to-transparent sm:block" />}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-[2.2rem] border border-white/10 bg-white/[0.052] p-6 backdrop-blur-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Build Roadmap</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">From landing page to full system.</h2>
          <div className="mt-7 space-y-4">
            {roadmap.map(([week, task], index) => (
              <div key={week} className="flex gap-4 rounded-2xl border border-white/10 bg-night/45 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white text-sm font-bold text-night">{index + 1}</span>
                <div>
                  <p className="font-semibold text-white">{week}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{task}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
