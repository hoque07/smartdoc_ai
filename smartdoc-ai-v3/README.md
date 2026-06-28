# SmartDoc AI

SmartDoc AI is a premium dark blue-white landing page and browser-based document planning demo. It accepts text-based PDF, TXT, MD, and CSV files, extracts text locally in the browser, and creates a short ABCDE task plan inspired by Brian Tracy’s prioritization method.

## Features

- React + Vite + TypeScript
- Tailwind CSS premium dark blue-white theme
- Framer Motion animations
- PDF.js text extraction for normal text-based PDFs
- Short smart summary
- ABCDE task cards: Do First, Schedule Next, Optional, Automate, Remove
- Link from document summary to the 5-second interactive planner
- CSV export and full extracted text export
- GitHub Pages workflow included

## Local Run

```bash
npm install
npm run dev
```

## Important Note

This frontend version can process text-based PDFs. Scanned image PDFs need OCR. OCR should be added later through the planned Go + Rust backend module.
