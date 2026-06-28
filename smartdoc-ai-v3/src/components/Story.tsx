import { motion } from 'framer-motion';
import { Layers, ScanText, Trophy } from 'lucide-react';

const stages = [
  {
    title: 'Raw Idea',
    text: 'A user starts with messy PDFs, images, study notes, meeting files, or research documents. The first problem is not analysis. The first problem is turning scattered content into usable text.',
    icon: ScanText,
  },
  {
    title: 'Refined Experience',
    text: 'The planned Go workflow controls the full journey while the Rust engine handles fast extraction, cleaning, and document processing. The interface visualizes each step clearly.',
    icon: Layers,
  },
  {
    title: 'Premium Result',
    text: 'The final output becomes a structured ABCDE plan with critical insights, supporting points, optional items, delegated tasks, and eliminated noise.',
    icon: Trophy,
  },
];

export function Story() {
  return (
    <section id="story" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Transformation</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">From document chaos to premium planning clarity.</h2>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <motion.article
              key={stage.title}
              initial={{ opacity: 0, y: 38 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: index * 0.12 }}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-xl transition hover:-translate-y-2 hover:border-skyglow/40 hover:bg-white/[0.075]"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/12 bg-royal/15 text-skyglow shadow-glow">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-5xl font-semibold text-white/10">0{index + 1}</span>
              </div>
              <h3 className="text-2xl font-semibold text-white">{stage.title}</h3>
              <p className="mt-4 leading-7 text-muted">{stage.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
