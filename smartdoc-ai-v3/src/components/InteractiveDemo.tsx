import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BrainCircuit, RefreshCcw } from 'lucide-react';

type Category = 'A' | 'B' | 'C' | 'D' | 'E';

type Result = {
  sentence: string;
  category: Category;
  reason: string;
};

type InteractiveDemoProps = {
  incomingText?: string;
};

const sampleText = `Finalize the research proposal and define the core system architecture. Review supporting papers about OCR and document AI. Try optional UI animations if extra time is available. Delegate repeated CSV formatting. Remove duplicate notes and unrelated screenshots.`;

const categoryMeta: Record<Category, { title: string; color: string; meaning: string }> = {
  A: { title: 'Do First', color: 'text-skyglow', meaning: 'Highest impact task' },
  B: { title: 'Schedule Next', color: 'text-blue-200', meaning: 'Important support work' },
  C: { title: 'Optional', color: 'text-white', meaning: 'Useful but not urgent' },
  D: { title: 'Automate / Delegate', color: 'text-gold', meaning: 'Routine work' },
  E: { title: 'Remove', color: 'text-red-300', meaning: 'Noise or low value' },
};

function shorten(sentence: string) {
  const clean = sentence.replace(/^[-–—\s]+/, '').replace(/\s+/g, ' ').trim();
  if (clean.length <= 150) return clean;
  return `${clean.slice(0, 145).trim()}...`;
}

function classifySentence(sentence: string): Result {
  const clean = shorten(sentence);
  const lower = clean.toLowerCase();

  if (/^(a\s*do first|do first|a priority)/.test(lower) || /(finalize|deadline|core|critical|must|submit|architecture|proposal|priority|main focus|essential)/.test(lower)) {
    return { sentence: clean, category: 'A', reason: 'This is the most direct high-impact work.' };
  }

  if (/^(b\s*schedule|schedule next|b priority)/.test(lower) || /(review|support|supporting|papers|improve|prepare|important|research|dataset|method|model|workflow)/.test(lower)) {
    return { sentence: clean, category: 'B', reason: 'This supports the main result and should be scheduled.' };
  }

  if (/^(c\s*optional|optional|c priority)/.test(lower) || /(optional|try|extra|nice|minor|animation|visual|polish|background)/.test(lower)) {
    return { sentence: clean, category: 'C', reason: 'This is useful, but it can wait.' };
  }

  if (/^(d\s*automate|automate|delegate|d priority)/.test(lower) || /(delegate|assign|handover|outsource|automate|csv|formatting|repeated|routine)/.test(lower)) {
    return { sentence: clean, category: 'D', reason: 'This can be automated, assigned, or handled later.' };
  }

  if (/^(e\s*remove|remove|eliminate|e priority)/.test(lower) || /(remove|delete|duplicate|unrelated|noise|useless|discard|broken|references|page marks)/.test(lower)) {
    return { sentence: clean, category: 'E', reason: 'This is low-value or noisy content.' };
  }

  return { sentence: clean, category: 'C', reason: 'This is general information, so it stays optional.' };
}

function analyze(text: string): Result[] {
  const lines = text
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item) => !/^[abcde]\s*(priority|do first|schedule next|optional|automate|remove)?:?$/i.test(item));

  const sentenceParts = lines.flatMap((line) =>
    line.includes('- ')
      ? line.split(/\s*-\s+/).map((item) => item.trim()).filter(Boolean)
      : line.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean)
  );

  return sentenceParts.slice(0, 12).map(classifySentence);
}

export function InteractiveDemo({ incomingText }: InteractiveDemoProps) {
  const [text, setText] = useState(sampleText);
  const [submittedText, setSubmittedText] = useState(sampleText);
  const [fromAnalyzer, setFromAnalyzer] = useState(false);

  useEffect(() => {
    if (!incomingText?.trim()) return;
    setText(incomingText);
    setSubmittedText(incomingText);
    setFromAnalyzer(true);
  }, [incomingText]);

  const results = useMemo(() => analyze(submittedText), [submittedText]);
  const counts = useMemo(() => {
    return results.reduce<Record<Category, number>>(
      (acc, item) => {
        acc[item.category] += 1;
        return acc;
      },
      { A: 0, B: 0, C: 0, D: 0, E: 0 },
    );
  }, [results]);

  return (
    <section id="demo" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="rounded-[2.4rem] border border-white/10 bg-white/[0.055] p-5 shadow-glow backdrop-blur-2xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-skyglow">
              <BrainCircuit className="h-4 w-4" />
              Interactive ABCDE Lab
            </div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Test the planning logic in 5 seconds.</h2>
            <p className="mt-5 leading-8 text-muted">
              This section is now linked with the PDF analyzer. After uploading a document, press “Analyze in 5-sec planner” from the smart summary, and this panel will instantly test the generated task plan.
            </p>

            {fromAnalyzer && (
              <div className="mt-5 rounded-2xl border border-skyglow/20 bg-skyglow/10 p-4 text-sm leading-6 text-sky-50">
                PDF summary loaded from the document analyzer. You can edit it below and run the planner again.
              </div>
            )}

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="mt-7 h-56 w-full resize-none rounded-[1.5rem] border border-white/10 bg-night/60 p-5 text-sm leading-7 text-white outline-none transition placeholder:text-muted focus:border-skyglow/60 focus:shadow-glow"
              placeholder="Paste document notes, meeting text, or project tasks here..."
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  setSubmittedText(text);
                  setFromAnalyzer(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal to-skyglow px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
              >
                Analyze priority
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setText(sampleText);
                  setSubmittedText(sampleText);
                  setFromAnalyzer(false);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-white/12"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset sample
              </button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-night/45 p-5">
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(counts) as Category[]).map((category) => (
                <div key={category} className="rounded-2xl border border-white/10 bg-white/[0.055] p-3 text-center">
                  <p className={`text-2xl font-semibold ${categoryMeta[category].color}`}>{category}</p>
                  <p className="mt-1 text-xs text-muted">{counts[category]} items</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {results.map((item, index) => (
                <motion.div
                  key={`${item.category}-${item.sentence}-${index}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/8 font-semibold text-skyglow">{item.category}</span>
                    <div>
                      <p className="font-semibold text-white">{categoryMeta[item.category].title}</p>
                      <p className="text-xs text-muted">{categoryMeta[item.category].meaning}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/90">{item.sentence}</p>
                  <p className="mt-2 text-xs leading-5 text-muted">{item.reason}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
