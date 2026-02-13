"use client";

import { useState } from "react";

/* ───────────────────────── Data ───────────────────────── */

type PersonalityKey = "sweet" | "zen" | "social" | "health";

interface Personality {
  name: string;
  coffee: string;
  tagline: string;
  emoji: string;
  color: string;
}

const personalities: Record<PersonalityKey, Personality> = {
  sweet: {
    name: "Sweet Enthusiast",
    coffee: "Caramel Latte",
    tagline: "Life's too short for bitter",
    emoji: "🍰",
    color: "#e8a0bf",
  },
  zen: {
    name: "Zen Minimalist",
    coffee: "Black Coffee, Single Origin",
    tagline: "Simple. Clean. Perfect.",
    emoji: "🧘",
    color: "#b0c4b1",
  },
  social: {
    name: "Social Butterfly",
    coffee: "Cappuccino",
    tagline: "Coffee is better with company",
    emoji: "🎉",
    color: "#f5c96a",
  },
  health: {
    name: "Health Nut",
    coffee: "Oat Milk Americano",
    tagline: "Wellness in every sip",
    emoji: "🌿",
    color: "#8cbf7f",
  },
};

interface Answer {
  emoji: string;
  text: string;
  personality: PersonalityKey;
}

interface Question {
  emoji: string;
  question: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    emoji: "🎬",
    question: "Pick a movie genre",
    answers: [
      { emoji: "🍿", text: "Rom-com / Feel-good", personality: "sweet" },
      { emoji: "🧘", text: "Documentary / Indie", personality: "zen" },
      { emoji: "🎉", text: "Comedy / Party vibes", personality: "social" },
      { emoji: "💪", text: "Action / Sports", personality: "health" },
    ],
  },
  {
    emoji: "🏖️",
    question: "Your ideal Saturday morning",
    answers: [
      { emoji: "🛋️", text: "Cozy blanket + comfort show", personality: "sweet" },
      { emoji: "🧘", text: "Quiet journaling or meditation", personality: "zen" },
      { emoji: "👯", text: "Brunch with friends", personality: "social" },
      { emoji: "🏃", text: "Morning run or yoga", personality: "health" },
    ],
  },
  {
    emoji: "🎨",
    question: "Pick a color that speaks to you",
    answers: [
      { emoji: "🌸", text: "Warm pink", personality: "sweet" },
      { emoji: "⚪", text: "Clean white", personality: "zen" },
      { emoji: "💛", text: "Sunny yellow", personality: "social" },
      { emoji: "🌿", text: "Fresh green", personality: "health" },
    ],
  },
  {
    emoji: "🍽️",
    question: "Your go-to comfort food",
    answers: [
      { emoji: "🍰", text: "Something sweet and indulgent", personality: "sweet" },
      { emoji: "🍚", text: "Simple rice bowl, perfectly made", personality: "zen" },
      { emoji: "🍕", text: "Pizza — but only if we're sharing", personality: "social" },
      { emoji: "🥑", text: "Acai bowl or smoothie", personality: "health" },
    ],
  },
  {
    emoji: "🎵",
    question: "What's your playlist vibe?",
    answers: [
      { emoji: "🎶", text: "Pop / Feel-good hits", personality: "sweet" },
      { emoji: "🎹", text: "Ambient / Lo-fi", personality: "zen" },
      { emoji: "🎤", text: "Upbeat / Sing-along anthems", personality: "social" },
      { emoji: "🌅", text: "Acoustic / Chill nature vibes", personality: "health" },
    ],
  },
  {
    emoji: "✈️",
    question: "Dream vacation",
    answers: [
      { emoji: "🏰", text: "Paris — cafes, pastries, romance", personality: "sweet" },
      { emoji: "🏔️", text: "Solo cabin retreat in the mountains", personality: "zen" },
      { emoji: "🎪", text: "Music festival with your whole crew", personality: "social" },
      { emoji: "🥾", text: "Costa Rica — hiking, surfing, fresh food", personality: "health" },
    ],
  },
];

const allKeys: PersonalityKey[] = ["sweet", "zen", "social", "health"];

/* ───────────────────────── Component ───────────────────────── */

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "quiz" | "results">("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<PersonalityKey[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [transition, setTransition] = useState<"visible" | "fade-out" | "fade-in">("visible");
  const [copied, setCopied] = useState(false);

  /* ── handlers ── */

  function startQuiz() {
    setAnswers([]);
    setCurrentQ(0);
    setSelected(null);
    setTransition("visible");
    setScreen("quiz");
  }

  function pickAnswer(index: number, personality: PersonalityKey) {
    if (selected !== null) return;
    setSelected(index);

    // Step 1: brief pause to show selection highlight
    setTimeout(() => {
      // Step 2: fade out current question
      setTransition("fade-out");

      setTimeout(() => {
        // Step 3: swap content while invisible
        const next = [...answers, personality];
        setAnswers(next);
        if (currentQ + 1 < questions.length) {
          setCurrentQ(currentQ + 1);
          setSelected(null);
          // Step 4: set starting position for fade-in (off-screen right)
          setTransition("fade-in");

          // Step 5: trigger fade-in on next frame
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTransition("visible");
            });
          });
        } else {
          setScreen("results");
        }
      }, 400);
    }, 350);
  }

  /* ── results calc ── */

  function getResults(): { key: PersonalityKey; pct: number }[] {
    const counts: Record<PersonalityKey, number> = { sweet: 0, zen: 0, social: 0, health: 0 };
    answers.forEach((a) => (counts[a] += 1));
    const total = answers.length || 1;
    return allKeys
      .map((key) => ({ key, pct: Math.round((counts[key] / total) * 100) }))
      .sort((a, b) => b.pct - a.pct);
  }

  /* ── screens ── */

  if (screen === "welcome") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="w-full max-w-md text-center"
          style={{
            background: "var(--card-bg)",
            borderRadius: "1.5rem",
            padding: "3rem 2rem",
            boxShadow: "0 4px 24px rgba(107,76,59,0.10)",
          }}
        >
          <p className="mb-2 text-5xl">☕</p>
          <h1
            className="mb-3 text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif", color: "var(--warm-brown)" }}
          >
            What&rsquo;s Your Coffee Personality?
          </h1>
          <p className="mb-6 text-lg" style={{ color: "var(--muted)" }}>
            Answer 6 fun questions and discover which coffee matches your vibe.
            <br />
            <span className="text-sm">A Basecamp Coffee experience</span>
          </p>
          <button
            onClick={startQuiz}
            className="cursor-pointer text-lg font-semibold text-white transition-colors"
            style={{
              background: "var(--accent)",
              borderRadius: "9999px",
              padding: "0.85rem 2.5rem",
              border: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
          >
            Start Quiz ☕
          </button>
        </div>
      </div>
    );
  }

  if (screen === "quiz") {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;

    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div
          className="w-full max-w-lg"
          style={{
            background: "var(--card-bg)",
            borderRadius: "1.5rem",
            padding: "2.5rem 2rem",
            boxShadow: "0 4px 24px rgba(107,76,59,0.10)",
          }}
        >
          {/* progress bar */}
          <div className="mb-1 flex items-center justify-between text-sm" style={{ color: "var(--muted)" }}>
            <span>Question {currentQ + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="mb-6 overflow-hidden"
            style={{ background: "var(--beige)", borderRadius: "9999px", height: "8px" }}
          >
            <div
              style={{
                width: `${progress}%`,
                background: "var(--accent)",
                height: "100%",
                borderRadius: "9999px",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          {/* question */}
          <div
            style={{
              opacity: transition === "visible" ? 1 : 0,
              transform:
                transition === "fade-out"
                  ? "translateX(-30px)"
                  : transition === "fade-in"
                    ? "translateX(30px)"
                    : "translateX(0)",
              transition:
                transition === "fade-in"
                  ? "none"
                  : "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <h2
              className="mb-6 text-center text-2xl font-semibold"
              style={{ fontFamily: "var(--font-playfair), serif", color: "var(--warm-brown)" }}
            >
              {q.emoji} {q.question}
            </h2>

            <div className="flex flex-col gap-3">
              {q.answers.map((a, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => pickAnswer(i, a.personality)}
                    className="cursor-pointer text-left text-base font-medium transition-all"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "1rem 1.25rem",
                      borderRadius: "1rem",
                      border: isSelected
                        ? "2px solid var(--accent)"
                        : "2px solid var(--beige)",
                      background: isSelected ? "var(--highlight)" : "var(--card-bg)",
                      color: "var(--foreground)",
                      transform: isSelected ? "scale(1.02)" : "scale(1)",
                      boxShadow: isSelected ? "0 2px 12px rgba(200,149,108,0.2)" : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (selected === null) {
                        e.currentTarget.style.borderColor = "var(--light-brown)";
                        e.currentTarget.style.background = "var(--highlight)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = "var(--beige)";
                        e.currentTarget.style.background = "var(--card-bg)";
                      }
                    }}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    <span>{a.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── results screen ── */
  const results = getResults();
  const topKey = results[0].key;
  const top = personalities[topKey];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-lg"
        style={{
          background: "var(--card-bg)",
          borderRadius: "1.5rem",
          padding: "2.5rem 2rem",
          boxShadow: "0 4px 24px rgba(107,76,59,0.10)",
        }}
      >
        {/* top result */}
        <div className="mb-8 text-center">
          <p className="mb-1 text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            Your coffee personality is...
          </p>
          <p className="mb-2 text-5xl">{top.emoji}</p>
          <h2
            className="mb-1 text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair), serif", color: "var(--warm-brown)" }}
          >
            {top.name}
          </h2>
          <p className="mb-2 text-lg italic" style={{ color: "var(--muted)" }}>
            &ldquo;{top.tagline}&rdquo;
          </p>
          <p
            className="inline-block rounded-full px-4 py-1 text-sm font-semibold"
            style={{ background: "var(--highlight)", color: "var(--warm-brown)" }}
          >
            ☕ Your drink: {top.coffee}
          </p>
        </div>

        {/* percentage breakdown */}
        <h3
          className="mb-4 text-center text-lg font-semibold"
          style={{ fontFamily: "var(--font-playfair), serif", color: "var(--warm-brown)" }}
        >
          Your Full Breakdown
        </h3>

        <div className="flex flex-col gap-3">
          {results.map(({ key, pct }) => {
            const p = personalities[key];
            const isTop = key === topKey;
            return (
              <div
                key={key}
                style={{
                  borderRadius: "1rem",
                  padding: "1rem 1.25rem",
                  border: isTop ? "2px solid var(--accent)" : "2px solid var(--beige)",
                  background: isTop ? "var(--highlight)" : "var(--card-bg)",
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="text-xl">{p.emoji}</span>
                    {p.name}
                    {isTop && (
                      <span
                        className="ml-1 rounded-full px-2 py-0.5 text-xs font-bold text-white"
                        style={{ background: "var(--accent)" }}
                      >
                        TOP
                      </span>
                    )}
                  </span>
                  <span className="font-bold" style={{ color: "var(--warm-brown)" }}>
                    {pct}%
                  </span>
                </div>

                {/* bar */}
                <div
                  className="mb-2 overflow-hidden"
                  style={{ background: "var(--beige)", borderRadius: "9999px", height: "8px" }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      background: isTop ? "var(--accent)" : "var(--light-brown)",
                      height: "100%",
                      borderRadius: "9999px",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>

                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  ☕ {p.coffee} — &ldquo;{p.tagline}&rdquo;
                </p>
              </div>
            );
          })}
        </div>

        {/* actions */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex gap-3">
            <button
              onClick={() => {
                const breakdown = results
                  .filter(({ pct }) => pct > 0)
                  .map(({ key, pct }) => `${personalities[key].emoji} ${personalities[key].name}: ${pct}%`)
                  .join("\n");
                const text = `☕ My Coffee Personality: ${top.emoji} ${top.name}!\n"${top.tagline}"\n\nMy drink: ${top.coffee}\n\n${breakdown}\n\nFind yours at Basecamp Coffee!`;

                if (navigator.share) {
                  navigator.share({ title: "My Coffee Personality", text });
                } else {
                  navigator.clipboard.writeText(text).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }
              }}
              className="cursor-pointer text-base font-semibold transition-colors"
              style={{
                background: "var(--warm-brown)",
                color: "white",
                borderRadius: "9999px",
                padding: "0.75rem 2rem",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--light-brown)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--warm-brown)")}
            >
              {copied ? "Copied! ✓" : "Share Result 📤"}
            </button>
            <button
              onClick={startQuiz}
              className="cursor-pointer text-base font-semibold transition-colors"
              style={{
                background: "var(--accent)",
                color: "white",
                borderRadius: "9999px",
                padding: "0.75rem 2rem",
                border: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
            >
              Retake Quiz 🔄
            </button>
          </div>
          <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
            A Basecamp Coffee experience
          </p>
        </div>
      </div>
    </div>
  );
}
