import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const packages = [
  {
    name: 'Starter',
    price: '$29',
    tag: 'Landing page concept',
    benefits: ['Premium one-page UI', 'Interactive ABCDE demo', 'GitHub Pages workflow'],
  },
  {
    name: 'Professional',
    price: '$79',
    tag: 'Recommended system plan',
    highlighted: true,
    benefits: ['All Starter features', 'Advanced dashboard section', 'Lead capture with CSV export', 'Future Go + Rust architecture copy'],
  },
  {
    name: 'Enterprise',
    price: '$149',
    tag: 'Full platform direction',
    benefits: ['All Professional features', 'Backend-ready structure notes', 'Research presentation content', 'Custom business demo flow'],
  },
];

type PricingProps = {
  onSelect: (packageName: string) => void;
};

export function Pricing({ onSelect }: PricingProps) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-skyglow">Packages</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">Choose how you want to present SmartDoc AI.</h2>
        <p className="mt-5 text-lg leading-8 text-muted">These are demo business packages for the landing page. You can edit the names, pricing, and benefits later.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {packages.map((plan, index) => (
          <motion.article
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={`relative rounded-[2rem] border p-7 backdrop-blur-xl transition hover:-translate-y-2 ${
              plan.highlighted
                ? 'border-skyglow/50 bg-royal/15 shadow-glow'
                : 'border-white/10 bg-white/[0.052] hover:border-white/20'
            }`}
          >
            {plan.highlighted && <span className="absolute right-6 top-6 rounded-full bg-white px-3 py-1 text-xs font-semibold text-night">Recommended</span>}
            <p className="text-sm text-muted">{plan.tag}</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">{plan.name}</h3>
            <div className="mt-6 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-[-0.04em] text-white">{plan.price}</span>
              <span className="pb-2 text-muted">/ demo</span>
            </div>
            <ul className="mt-7 space-y-4">
              {plan.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-3 text-sm leading-6 text-muted">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-skyglow" />
                  {benefit}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSelect(plan.name)}
              className={`mt-8 w-full rounded-full px-6 py-3 text-sm font-semibold transition hover:-translate-y-1 ${
                plan.highlighted ? 'bg-white text-night shadow-glow hover:bg-skyglow' : 'border border-white/15 bg-white/8 text-white hover:bg-white/12'
              }`}
            >
              Select {plan.name}
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
