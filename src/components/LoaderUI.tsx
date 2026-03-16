function LoaderUI() {
  return (
    <div className="h-[calc(100vh-4rem-1px)] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-10 h-10 border border-foreground/20 animate-spin" style={{ animationDuration: '1.5s' }} />
        <div className="absolute inset-0 w-10 h-10 border-t border-foreground animate-spin" style={{ animationDuration: '1.5s' }} />
      </div>
      <span
        className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
        style={{ fontFamily: "var(--font-space-mono, 'Space Mono', monospace)" }}
      >
        Loading
      </span>
    </div>
  );
}
export default LoaderUI;
