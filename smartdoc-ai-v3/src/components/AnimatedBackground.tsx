export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,123,255,0.28),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(117,215,255,0.18),transparent_28%),linear-gradient(135deg,#05070D_0%,#0B1020_45%,#07111f_100%)]" />
      <div className="aurora-orb left-[8%] top-[14%] h-72 w-72 bg-royal/25" />
      <div className="aurora-orb right-[10%] top-[28%] h-80 w-80 bg-skyglow/20 animation-delay-2" />
      <div className="aurora-orb bottom-[8%] left-[34%] h-64 w-64 bg-gold/10 animation-delay-4" />
      <div className="absolute inset-0 opacity-[0.12] grid-overlay" />
      <div className="absolute inset-0 particles" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,13,0.15),rgba(5,7,13,0.88))]" />
    </div>
  );
}
