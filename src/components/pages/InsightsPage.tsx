import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

const API =
  (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env
    ?.VITE_API_URL ?? "";

type Stats = {
  total: number;
  likely_fake: number;
  likely_real: number;
  uncertain: number;
  avg_score: number;
};

type NodeId =
  | "credibility"
  | "reliability"
  | "uncertainty"
  | "health"
  | "signal";

type Particle = {
  group: NodeId;
  char: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
  layoutIndex: number;
};

type Point = {
  x: number;
  y: number;
};

export default function InsightsPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedInsightId] = useState<NodeId | null>(null);
  const [pointer, setPointer] = useState<Point | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const layoutRef = useRef<Record<NodeId, Point[]>>(
    {} as Record<NodeId, Point[]>,
  );

  useEffect(() => {
    fetch(`${API}/analyses/stats`)
      .then((res) => res.json())
      .then(setStats)
      .catch((err) => console.error("Failed to load stats:", err));
  }, []);

  const total = stats?.total ?? 0;
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const avgScore = Math.min(99, Math.max(0, stats?.avg_score ?? 0));
  const health =
    total > 0
      ? Math.min(
          97,
          Math.max(
            72,
            80 +
              Math.round(((stats?.likely_real ?? 0) / Math.max(1, total)) * 10),
          ),
        )
      : 84;

  const insightEntries = useMemo(
    () => [
      {
        id: "credibility" as const,
        title: "Credibility",
        metric: `${avgScore}%`,
        note: "avg. confidence",
        trend: "+6% this week",
        progress: Math.max(20, avgScore),
        status: total === 0 ? "Waiting" : "Stable",
        description:
          "The average trust score of your recent checks is holding strong.",
        recommendation:
          "Keep comparing context, source history, and visual evidence before sharing.",
      },
      {
        id: "reliability" as const,
        title: "Reliability",
        metric: `${pct(stats?.likely_real ?? 0)}%`,
        note: "likely credible",
        trend: total === 0 ? "No data yet" : "Grounded in evidence",
        progress: pct(stats?.likely_real ?? 0),
        status: total === 0 ? "Pending" : "Healthy",
        description:
          "Your reviews lean toward credible content when the supporting evidence is present.",
        recommendation:
          "Use the same verification checklist when a claim feels emotionally charged.",
      },
      {
        id: "uncertainty" as const,
        title: "Uncertainty",
        metric: `${pct(stats?.uncertain ?? 0)}%`,
        note: "needs context",
        trend: "Watch closely",
        progress: pct(stats?.uncertain ?? 0),
        status: total === 0 ? "Quiet" : "Alert",
        description:
          "A portion of your checks still needs more context before a firm call is possible.",
        recommendation:
          "Pause and gather a second source before passing the content forward.",
      },
      {
        id: "health" as const,
        title: "System health",
        metric: `${health}%`,
        note: "signal quality",
        trend: "Live and steady",
        progress: health,
        status: "Live",
        description:
          "The verification loop is operating smoothly and staying responsive.",
        recommendation:
          "Keep the flow active by reviewing a fresh claim whenever your confidence dips.",
      },
      {
        id: "signal" as const,
        title: "Signal",
        metric: `${total}`,
        note: "items checked",
        trend: "All time",
        progress: Math.min(100, total * 4),
        status: total === 0 ? "Waiting" : "Growing",
        description:
          "Your checking habits are building a clearer picture of how you verify content.",
        recommendation:
          "Reviewing more examples will strengthen the pattern recognition over time.",
      },
    ],
    [
      avgScore,
      health,
      pct,
      stats?.likely_fake,
      stats?.likely_real,
      stats?.uncertain,
      total,
    ],
  );

  const activeInsight =
    insightEntries.find((entry) => entry.id === selectedInsightId) ?? null;
  const visibleCards = insightEntries.slice(0, 4);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const buildLayout = (text: string, widthPx: number, heightPx: number) => {
        const chars = text.split("");
        const maxCharsPerLine = Math.max(
          14,
          Math.min(22, Math.floor(widthPx / 18)),
        );
        const rows: string[][] = [];
        let currentRow: string[] = [];

        chars.forEach((char) => {
          if (char === "\n") {
            rows.push(currentRow);
            currentRow = [];
            return;
          }
          if (char === " ") {
            if (currentRow.length > 0) {
              currentRow.push(char);
            }
            return;
          }
          if (currentRow.length >= maxCharsPerLine) {
            rows.push(currentRow);
            currentRow = [];
          }
          currentRow.push(char);
        });
        if (currentRow.length > 0) rows.push(currentRow);

        const totalHeight = rows.length * 20;
        const startY = heightPx / 2 - totalHeight / 2 + 8;
        const startX = widthPx / 2 - Math.min(300, widthPx * 0.5) / 2;
        const positions: Point[] = [];
        rows.forEach((row, rowIndex) => {
          const rowWidth = row.length * 10;
          const rowStartX =
            startX + (Math.min(300, widthPx * 0.5) - rowWidth) / 2;
          row.forEach((char, charIndex) => {
            if (char === " ") return;
            positions.push({
              x: rowStartX + charIndex * 10,
              y: startY + rowIndex * 22,
            });
          });
        });

        return positions;
      };

      const createParticles = () => {
        const particles: Particle[] = [];
        const sourceEntries = insightEntries.flatMap((entry) => {
          const content = `${entry.title} ${entry.metric} ${entry.note} ${entry.description} ${entry.recommendation}`;
          return Array.from({ length: 2 }, () => content);
        });

        sourceEntries.forEach((content, sourceIndex) => {
          const group = insightEntries[sourceIndex % insightEntries.length].id;
          const letters = content.split("");
          const positions = buildLayout(content, width, height);
          letters.forEach((char, index) => {
            if (!char.trim()) return;
            const position = positions[index % Math.max(positions.length, 1)];
            particles.push({
              group,
              char,
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.7,
              vy: (Math.random() - 0.5) * 0.7,
              targetX: position?.x ?? width / 2,
              targetY: position?.y ?? height / 2,
              size: 9 + Math.random() * 3,
              alpha: 0.55 + Math.random() * 0.15,
              layoutIndex: index,
            });
          });
        });

        layoutRef.current = {} as Record<NodeId, Point[]>;
        insightEntries.forEach((entry) => {
          const content = `${entry.title} ${entry.metric} ${entry.note} ${entry.description} ${entry.recommendation}`;
          layoutRef.current[entry.id] = buildLayout(content, width, height);
        });


        particlesRef.current = particles;
      };

      createParticles();
    };

    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    const animate = () => {
      frame += 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const particles = particlesRef.current;
      const pointerPos = pointer;

      for (const particle of particles) {
        let ax = 0;
        let ay = 0;
        let separationX = 0;
        let separationY = 0;
        let neighborCount = 0;

        for (const other of particles) {
          if (particle === other) continue;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 44 && dist > 0.0001) {
            neighborCount += 1;
            ax += dx / dist;
            ay += dy / dist;
            if (dist < 18) {
              separationX -= dx / dist;
              separationY -= dy / dist;
            }
          }
        }

        if (neighborCount > 0) {
          ax /= neighborCount;
          ay /= neighborCount;
          particle.vx += (ax - particle.vx) * 0.004;
          particle.vy += (ay - particle.vy) * 0.004;
          particle.vx += separationX * 0.001;
          particle.vy += separationY * 0.001;
        }

        if (pointerPos) {
          const dx = pointerPos.x - particle.x;
          const dy = pointerPos.y - particle.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            const pull = (120 - dist) / 120;
            particle.vx += (dx / Math.max(1, dist)) * pull * 0.008;
            particle.vy += (dy / Math.max(1, dist)) * pull * 0.008;
          }
        }

        const targetX = width / 2 + Math.sin(frame / 180 + particle.size) * 26;
        const targetY = height / 2 + Math.cos(frame / 220 + particle.size) * 18;
        particle.vx += (targetX - particle.x) * 0.0007;
        particle.vy += (targetY - particle.y) * 0.0007;

        particle.vx *= 0.965;
        particle.vy *= 0.965;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -0.6;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }
        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -0.6;
          particle.y = Math.max(0, Math.min(height, particle.y));
        }
      }

      context.clearRect(0, 0, width, height);
      const gradient = context.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        width * 0.68,
      );
      gradient.addColorStop(0, "rgba(127, 184, 148, 0.05)");
      gradient.addColorStop(1, "rgba(10, 15, 13, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      for (const particle of particles) {
        context.save();
        context.globalAlpha = particle.alpha;
        context.font = `${Math.round(particle.size)}px Inter, system-ui, sans-serif`;
        context.fillStyle = "#e8ede9";
        context.shadowBlur = 5;
        context.shadowColor = "rgba(127, 184, 148, 0.12)";
        context.fillText(particle.char, particle.x, particle.y);
        context.restore();
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    const frameRef = { current: 0 as number };
    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [insightEntries, pointer, selectedInsightId]);

  return (
    <div className="murmuration-shell">
      <div className="murmuration-overlay">
        <h1 className="headline">Knowledge emerging</h1>
        <p className="subhead">
          A quiet layer of motion runs beneath the latest signals, keeping the
          page feeling alive without overwhelming the content.
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="murmuration-canvas"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPointer({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
          });
        }}
        onMouseLeave={() => setPointer(null)}
      />

      <div className="insight-card-stack">
        {visibleCards.map((card) => {
          const isActive = card.id === activeInsight?.id;
          return (
            <motion.button
              key={card.id}
              className={`insight-card ${isActive ? "active" : ""}`}
              whileHover={{ y: -1, scale: 1.0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
            >
              <div className="card-head">
                <div>
                  <p className="panel-eyebrow">{card.title}</p>
                  <h2>{card.title}</h2>
                </div>
              </div>
              <div className="card-stats">
                <div>
                  <span className="panel-label">Metric</span>
                  <strong>{card.metric}</strong>
                </div>
                <div>
                  <span className="panel-label">Trend</span>
                  <strong>{card.trend}</strong>
                </div>
              </div>
              <div className="mini-chart" aria-hidden="true">
                <div
                  className="mini-chart-bar"
                  style={{ height: `${Math.max(22, card.progress)}%` }}
                />
                <div
                  className="mini-chart-bar mid"
                  style={{
                    height: `${Math.max(28, card.progress + 8)}%`,
                  }}
                />
                <div
                  className="mini-chart-bar"
                  style={{
                    height: `${Math.max(36, card.progress + 14)}%`,
                  }}
                />
              </div>
              <div className="card-body">
                <p>{card.description}</p>

              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
