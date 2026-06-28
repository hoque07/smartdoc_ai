import { useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, CheckCircle2, Download, FileText, Loader2, Sparkles, UploadCloud, X, Zap } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

type StepStatus = 'idle' | 'active' | 'done';
type CategoryKey = 'A' | 'B' | 'C' | 'D' | 'E';

type AnalysisItem = {
  text: string;
  reason: string;
};

type AnalysisResult = {
  fileName: string;
  fileType: string;
  wordCount: number;
  sentenceCount: number;
  pageCount: number;
  extractedText: string;
  textWasTrimmedForAnalysis: boolean;
  summary: string[];
  keywords: string[];
  categories: Record<CategoryKey, AnalysisItem[]>;
  plannerText: string;
  createdAt: string;
};

type DocumentAnalyzerProps = {
  onSendToPlanner?: (text: string) => void;
};

const categoryInfo: Record<CategoryKey, { title: string; label: string; description: string }> = {
  A: {
    title: 'A Priority',
    label: 'Do First',
    description: 'The most important 1 to 3 actions or ideas. Start here.'
  },
  B: {
    title: 'B Priority',
    label: 'Schedule Next',
    description: 'Important support work. Plan it after A tasks.'
  },
  C: {
    title: 'C Priority',
    label: 'Keep Optional',
    description: 'Useful background or polish. Do only after A and B.'
  },
  D: {
    title: 'D Priority',
    label: 'Automate / Delegate',
    description: 'Routine work that can be automated, assigned, or handled later.'
  },
  E: {
    title: 'E Priority',
    label: 'Remove Noise',
    description: 'Repeated, broken, low-value, or irrelevant text removed from the plan.'
  }
};

const stopWords = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'into', 'were', 'been', 'have', 'has', 'had',
  'are', 'was', 'will', 'would', 'could', 'should', 'about', 'there', 'their', 'they', 'them', 'your',
  'you', 'our', 'can', 'not', 'but', 'all', 'any', 'more', 'most', 'such', 'than', 'then', 'also',
  'use', 'used', 'using', 'based', 'between', 'within', 'without', 'over', 'under', 'these', 'those',
  'each', 'other', 'only', 'very', 'both', 'may', 'many', 'much', 'make', 'made', 'page', 'figure',
  'table', 'section', 'chapter', 'paper', 'study', 'article', 'document'
]);

const actionTerms = [
  'finalize', 'build', 'create', 'implement', 'submit', 'design', 'analyze', 'evaluate', 'test', 'train',
  'deploy', 'prepare', 'write', 'extract', 'classify', 'compare', 'improve', 'validate', 'review', 'define'
];

const aTerms = [
  'critical', 'must', 'required', 'deadline', 'risk', 'urgent', 'important', 'primary', 'goal', 'objective',
  'contribution', 'result', 'finding', 'accuracy', 'security', 'cost', 'revenue', 'architecture', 'proposal',
  'submission', 'core', 'main', 'key', 'essential', 'priority', 'problem', 'solution'
];

const bTerms = [
  'recommended', 'support', 'enhance', 'benefit', 'strategy', 'implementation', 'method', 'model', 'system',
  'dataset', 'workflow', 'experiment', 'evaluation', 'baseline', 'feature', 'module', 'research', 'paper'
];

const dTerms = ['routine', 'manual', 'repeated', 'repetitive', 'admin', 'formatting', 'schedule', 'delegate', 'automate', 'csv', 'copy', 'backup'];
const eTerms = ['all rights reserved', 'references', 'appendix', 'doi:', 'www.', 'http', 'footer', 'header', 'copyright', 'acknowledgement'];

const cleanText = (text: string) => {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/[•●▪]/g, '.')
    .replace(/\s+([,.;:!?])/g, '$1')
    .replace(/\n{4,}/g, '\n\n')
    .trim();
};

const shortText = (text: string, limit = 165) => {
  const cleaned = text
    .replace(/\[[0-9,\s-]+\]/g, '')
    .replace(/\([0-9]{4}\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= limit) return cleaned;
  const sliced = cleaned.slice(0, limit);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${sliced.slice(0, lastSpace > 80 ? lastSpace : limit).trim()}...`;
};

const splitSentences = (text: string) => {
  return text
    .replace(/\n+/g, '. ')
    .split(/(?<=[.!?])\s+|;\s+/)
    .map((sentence) => sentence.replace(/^[-–—\d.)\s]+/, '').trim())
    .filter((sentence) => sentence.length > 28 && sentence.length < 520);
};

const uniqueLimit = <T,>(items: T[], limit: number, keyGetter: (item: T) => string) => {
  const seen = new Set<string>();
  const output: T[] = [];

  for (const item of items) {
    const key = keyGetter(item).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
    if (output.length >= limit) break;
  }

  return output;
};

const getKeywords = (text: string) => {
  const counts = new Map<string, number>();
  const words = text.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) ?? [];

  words.forEach((word) => {
    const clean = word.replace(/^[^a-z0-9]+|[^a-z0-9+#.-]+$/g, '');
    if (clean.length < 3 || stopWords.has(clean) || /^\d+$/.test(clean)) return;
    counts.set(clean, (counts.get(clean) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
};

const termScore = (lower: string, terms: string[], weight: number) => {
  return terms.reduce((score, term) => score + (lower.includes(term) ? weight : 0), 0);
};

const rankSentence = (sentence: string, keywords: string[], index: number) => {
  const lower = sentence.toLowerCase();
  const keywordScore = keywords.reduce((score, keyword) => score + (lower.includes(keyword) ? 1.2 : 0), 0);
  const actionScore = termScore(lower, actionTerms, 1.5);
  const importantScore = termScore(lower, aTerms, 2);
  const supportScore = termScore(lower, bTerms, 1.2);
  const delegateScore = termScore(lower, dTerms, 2.5);
  const noiseScore = termScore(lower, eTerms, 3) + (sentence.length < 45 ? 1 : 0);
  const positionScore = index < 4 ? 1.2 : index < 12 ? 0.5 : 0;
  const lengthPenalty = sentence.length > 300 ? 1.4 : 0;

  return {
    actionScore,
    importantScore,
    supportScore,
    delegateScore,
    noiseScore,
    total: keywordScore + actionScore + importantScore + supportScore + positionScore - lengthPenalty
  };
};

const buildItem = (text: string, reason: string): AnalysisItem => ({ text: shortText(text), reason });

const analyzeText = (text: string, fileName: string, fileType: string, pageCount = 0): AnalysisResult => {
  const cleaned = cleanText(text);
  const words = cleaned ? cleaned.split(/\s+/).filter(Boolean) : [];
  const textWasTrimmedForAnalysis = cleaned.length > 140000;
  const analysisText = textWasTrimmedForAnalysis ? cleaned.slice(0, 140000) : cleaned;
  const sentences = splitSentences(analysisText);
  const keywords = getKeywords(analysisText);

  const ranked = sentences
    .map((sentence, index) => ({ sentence, index, score: rankSentence(sentence, keywords, index) }))
    .filter((item) => item.score.noiseScore < 4)
    .sort((a, b) => b.score.total - a.score.total);

  const noiseCount = sentences.filter((sentence, index) => rankSentence(sentence, keywords, index).noiseScore >= 4).length;

  const aItems = uniqueLimit(
    ranked.filter((item) => item.score.importantScore >= 2.5 || item.score.actionScore >= 1.5).slice(0, 10),
    3,
    (item) => item.sentence
  ).map((item) => buildItem(item.sentence, 'High-impact sentence with action words, priority words, or main document terms.'));

  const bItems = uniqueLimit(
    ranked.filter((item) => !aItems.some((a) => item.sentence.includes(a.text.replace('...', ''))) && item.score.supportScore >= 1.2).slice(0, 12),
    3,
    (item) => item.sentence
  ).map((item) => buildItem(item.sentence, 'Important supporting detail for method, dataset, workflow, or implementation.'));

  const cItems = uniqueLimit(
    ranked.filter((item) => item.score.supportScore < 1.2 && item.score.importantScore < 2.5).slice(0, 10),
    2,
    (item) => item.sentence
  ).map((item) => buildItem(item.sentence, 'Useful context, but not the first task to act on.'));

  const dItems = uniqueLimit(
    sentences
      .map((sentence, index) => ({ sentence, score: rankSentence(sentence, keywords, index) }))
      .filter((item) => item.score.delegateScore >= 2.5),
    2,
    (item) => item.sentence
  ).map((item) => buildItem(item.sentence, 'Routine or repeatable work. Better to automate, assign, or do later.'));

  const eItems: AnalysisItem[] = [
    buildItem(
      `${noiseCount} noisy or low-value fragments were ignored during planning. Examples include repeated headers, references, links, page marks, or broken text.`,
      'Keeping removed text as a count makes the report cleaner and less confusing.'
    )
  ];

  const fallback = uniqueLimit(ranked.slice(0, 3), 3, (item) => item.sentence).map((item) =>
    buildItem(item.sentence, 'Selected as a main sentence because it contains frequent document terms.')
  );

  const finalA = aItems.length ? aItems : fallback.slice(0, 2);
  const finalB = bItems.length ? bItems : fallback.slice(finalA.length, finalA.length + 2);

  const summary = [
    finalA[0] ? `Main focus: ${finalA[0].text}` : 'Main focus: The document was processed, but no strong action sentence was found.',
    finalB[0] ? `Support work: ${finalB[0].text}` : 'Support work: Review the extracted text and refine the task list manually.',
    keywords.length ? `Key terms: ${keywords.slice(0, 5).join(', ')}` : 'Key terms: No strong keywords found.'
  ];

  const plannerText = [
    'A Do First:',
    ...finalA.map((item) => `- ${item.text}`),
    '',
    'B Schedule Next:',
    ...finalB.map((item) => `- ${item.text}`),
    '',
    'C Optional:',
    ...(cItems.length ? cItems : [buildItem('Polish the output only after the main work is complete.', 'Default optional task.')]).map((item) => `- ${item.text}`),
    '',
    'D Automate or Delegate:',
    ...(dItems.length ? dItems : [buildItem('Move repeated formatting, file cleanup, or CSV export work to automation.', 'Default delegation task.')]).map((item) => `- ${item.text}`),
    '',
    'E Remove:',
    '- Remove duplicate notes, broken lines, references, and page noise.'
  ].join('\n');

  return {
    fileName,
    fileType,
    wordCount: words.length,
    sentenceCount: sentences.length,
    pageCount,
    extractedText: cleaned,
    textWasTrimmedForAnalysis,
    summary,
    keywords,
    categories: {
      A: finalA,
      B: finalB,
      C: cItems,
      D: dItems.length ? dItems : [buildItem('Repeated formatting, file cleanup, and export tasks should be automated where possible.', 'Default system recommendation.')],
      E: eItems
    },
    plannerText,
    createdAt: new Date().toISOString()
  };
};

const extractPdfText = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) pages.push(`Page ${pageNumber}\n${pageText}`);
  }

  return { text: pages.join('\n\n'), pageCount: pdf.numPages };
};

const downloadTextFile = (name: string, content: string, type = 'text/plain') => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
};

const resultToCsv = (result: AnalysisResult) => {
  const rows = [
    ['Category', 'Label', 'Task', 'Reason'],
    ...(['A', 'B', 'C', 'D', 'E'] as CategoryKey[]).flatMap((key) =>
      result.categories[key].map((item) => [key, categoryInfo[key].label, item.text, item.reason])
    )
  ];

  return rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
};

export function DocumentAnalyzer({ onSendToPlanner }: DocumentAnalyzerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const steps = useMemo(() => {
    const uploadStatus: StepStatus = result || isProcessing ? 'done' : 'idle';
    const processStatus: StepStatus = isProcessing ? 'active' : result ? 'done' : 'idle';
    const reportStatus: StepStatus = result ? 'done' : 'idle';

    return [
      { title: 'Upload', status: uploadStatus },
      { title: 'Extract Full Text', status: processStatus },
      { title: 'Smart Short Plan', status: processStatus },
      { title: 'Report Ready', status: reportStatus }
    ];
  }, [isProcessing, result]);

  const processFile = async (file?: File) => {
    if (!file) return;
    setError('');
    setIsProcessing(true);
    setResult(null);

    try {
      let text = '';
      let pageCount = 0;
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (file.type === 'application/pdf' || extension === 'pdf') {
        const extracted = await extractPdfText(file);
        text = extracted.text;
        pageCount = extracted.pageCount;
      } else if (file.type.startsWith('text/') || ['txt', 'md', 'csv'].includes(extension ?? '')) {
        text = await file.text();
      } else {
        throw new Error('This frontend version supports PDF, TXT, MD, and CSV files. Scanned image PDF needs the future Go + Rust OCR backend.');
      }

      if (!text.trim()) {
        throw new Error('No readable text was found. This may be a scanned image PDF. Text-based PDFs work now. Scanned PDFs need OCR support.');
      }

      await new Promise((resolve) => setTimeout(resolve, 450));
      const analyzed = analyzeText(text, file.name, file.type || extension || 'unknown', pageCount);
      setResult(analyzed);
      localStorage.setItem('smartdoc_ai_last_analysis', JSON.stringify(analyzed));
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Could not process this file. Try another PDF or text file.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    void processFile(event.dataTransfer.files[0]);
  };

  return (
    <section id="analyzer" className="px-6 py-24 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mb-10 max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100">
            <Sparkles size={14} /> Live PDF Workspace
          </span>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Upload a PDF and get a short task-ready ABCDE plan.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-300">
            The updated analyzer extracts full PDF text, but keeps the final output short. Instead of showing many confusing sentences, it creates a focused plan: Do First, Schedule Next, Optional, Automate, and Remove Noise.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-sky-950/30 backdrop-blur-xl"
          >
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed p-8 text-center transition duration-300 ${
                isDragging ? 'border-sky-300 bg-sky-300/10 shadow-[0_0_40px_rgba(56,189,248,0.22)]' : 'border-white/15 bg-black/20'
              }`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_58%)]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-sky-200/20 bg-sky-300/10 text-sky-100 shadow-[0_0_34px_rgba(56,189,248,0.25)]">
                  {isProcessing ? <Loader2 className="animate-spin" size={34} /> : <UploadCloud size={36} />}
                </div>
                <h3 className="text-2xl font-semibold text-white">Drop your PDF here</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
                  Supports PDF, TXT, MD, and CSV. Long PDFs are supported for extraction. The plan stays short for faster decision making.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md,.csv,application/pdf,text/*"
                  className="hidden"
                  onChange={(event) => void processFile(event.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="mt-7 rounded-full bg-gradient-to-r from-sky-300 via-blue-500 to-white px-7 py-3 text-sm font-bold text-slate-950 shadow-[0_0_34px_rgba(56,189,248,0.35)] transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isProcessing ? 'Processing...' : 'Choose PDF File'}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {steps.map((step) => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center gap-2 text-slate-300">
                    {step.status === 'done' && <CheckCircle2 className="text-emerald-300" size={17} />}
                    {step.status === 'active' && <Loader2 className="animate-spin text-sky-200" size={17} />}
                    {step.status === 'idle' && <span className="h-[17px] w-[17px] rounded-full border border-white/20" />}
                    <span className="text-xs font-semibold uppercase tracking-[0.18em]">{step.status}</span>
                  </div>
                  <p className="text-sm font-medium text-white">{step.title}</p>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-5 flex gap-3 rounded-2xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
                <AlertCircle className="mt-1 shrink-0" size={18} />
                <p>{error}</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl"
          >
            {!result ? (
              <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[1.5rem] border border-white/10 bg-black/20 p-8 text-center">
                <FileText size={48} className="text-sky-100" />
                <h3 className="mt-6 text-2xl font-semibold text-white">No document processed yet</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                  Upload a text-based PDF from the left panel. The smart summary and short ABCDE task plan will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-[1.5rem] border border-sky-200/15 bg-sky-300/10 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-100">Processed Document</p>
                      <h3 className="mt-2 break-words text-2xl font-semibold text-white">{result.fileName}</h3>
                      <p className="mt-2 text-sm text-slate-300">
                        {result.wordCount.toLocaleString()} words · {result.sentenceCount.toLocaleString()} usable sentences
                        {result.pageCount ? ` · ${result.pageCount} pages` : ''}
                      </p>
                      {result.textWasTrimmedForAnalysis && (
                        <p className="mt-2 text-xs leading-5 text-amber-100">
                          Full text was extracted. For speed, the planning algorithm analyzed the first large section and kept the output short.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => downloadTextFile('smartdoc-task-plan.csv', resultToCsv(result), 'text/csv')}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        <Download size={16} /> CSV
                      </button>
                      <button
                        type="button"
                        onClick={() => downloadTextFile('smartdoc-full-extracted-text.txt', result.extractedText)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        <Download size={16} /> Full Text
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Words</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{result.wordCount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pages</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{result.pageCount || 'N/A'}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Do First</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{result.categories.A.length}</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sky-100">
                      <BarChart3 size={18} />
                      <h4 className="font-semibold text-white">Smart Short Summary</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSendToPlanner?.(result.plannerText)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-300 to-blue-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.25)] transition hover:-translate-y-0.5"
                    >
                      <Zap size={14} /> Analyze in 5-sec planner
                    </button>
                  </div>
                  <ul className="space-y-3 text-sm leading-6 text-slate-200">
                    {result.summary.map((item) => (
                      <li key={item} className="rounded-2xl bg-white/[0.04] p-3">{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <h4 className="font-semibold text-white">Detected Keywords</h4>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.keywords.map((keyword) => (
                      <span key={keyword} className="rounded-full border border-sky-200/15 bg-sky-300/10 px-3 py-1 text-xs font-semibold text-sky-50">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-6 grid gap-4 lg:grid-cols-5"
          >
            {(['A', 'B', 'C', 'D', 'E'] as CategoryKey[]).map((key) => (
              <div key={key} className="rounded-[1.5rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-sky-200/25 hover:bg-white/[0.07]">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100">{categoryInfo[key].title}</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{categoryInfo[key].label}</h4>
                  </div>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">{key}</span>
                </div>
                <p className="mb-4 text-xs leading-5 text-slate-400">{categoryInfo[key].description}</p>
                <div className="space-y-3">
                  {result.categories[key].map((item) => (
                    <div key={`${key}-${item.text}`} className="rounded-2xl border border-white/10 bg-black/20 p-3">
                      <p className="text-sm leading-6 text-slate-100">{item.text}</p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {result && (
          <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h4 className="font-semibold text-white">Extracted Text Preview</h4>
              <button type="button" onClick={() => setResult(null)} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10">
                <X size={14} /> Clear
              </button>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950/70 p-4 text-sm leading-7 text-slate-300">
              {result.extractedText.slice(0, 15000)}{result.extractedText.length > 15000 ? '\n\n... Preview limited for browser speed. Click Full Text to download the complete extracted text.' : ''}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
