"use client";

import { useEffect } from "react";
import { profile, projects, experience, education, skills } from "@/data/content";
import { actions, useStore, getState } from "@/state/store";

export function Hud() {
  const view = useStore((s) => s.view);
  const activeFloor = useStore((s) => s.activeFloor);

  // Dev-only test seam: lets headless tests drive state transitions without
  // fragile canvas raycasts. Stripped from production builds.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      (window as unknown as { __portfolio: unknown }).__portfolio = { actions, getState };
    }
  }, []);

  // Capture wheel + touch scroll to drive the exterior camera height.
  useEffect(() => {
    let acc = useStoreScroll();
    function onWheel(e: WheelEvent) {
      if (getView() !== "exterior" || getActiveFloor() !== null) return;
      acc = Math.max(0, Math.min(1, acc + e.deltaY * 0.0012));
      actions.setScroll(acc);
    }
    let touchY = 0;
    function onTouchStart(e: TouchEvent) {
      touchY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      if (getView() !== "exterior" || getActiveFloor() !== null) return;
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      acc = Math.max(0, Math.min(1, acc + dy * 0.0025));
      actions.setScroll(acc);
    }
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="hud">
      <TopBar />
      {view === "intro" && <Intro />}
      {view === "exterior" && activeFloor !== null && <FloorPeek index={activeFloor} />}
      {view === "room" && activeFloor !== null && <Room index={activeFloor} />}
      <Footer />
    </div>
  );
}

// Access latest store values inside event listeners without re-subscribing.
function getView() {
  return getState().view;
}
function getActiveFloor() {
  return getState().activeFloor;
}
function useStoreScroll() {
  return getState().scroll;
}

function TopBar() {
  const view = useStore((s) => s.view);
  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "22px 34px",
      }}
    >
      <button
        onClick={() => actions.goToIntro()}
        style={{
          background: "none",
          border: "none",
          color: "var(--fg)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        {profile.name}
      </button>
      {view !== "intro" && <NavMenu />}
    </header>
  );
}

function NavMenu() {
  const items: { label: string; onClick: () => void }[] = [
    { label: "Projects", onClick: () => actions.focusFloor(0) },
    { label: "Experience", onClick: () => scrollToInfo("experience") },
    { label: "Education", onClick: () => scrollToInfo("education") },
    { label: "Contact", onClick: () => scrollToInfo("contact") },
  ];
  return (
    <nav style={{ display: "flex", gap: 26 }}>
      {items.map((it) => (
        <button
          key={it.label}
          onClick={it.onClick}
          className="eyebrow"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          {it.label}
        </button>
      ))}
    </nav>
  );
}

// Experience/Education/Contact live in a slide-over panel for now.
function scrollToInfo(section: string) {
  const el = document.getElementById(`info-${section}`);
  document.getElementById("info-panel")?.setAttribute("data-open", "true");
  el?.scrollIntoView({ behavior: "smooth" });
}

function Intro() {
  return (
    <div
      className="fade-in"
      style={{
        position: "absolute",
        left: "7vw",
        top: "46%",
        transform: "translateY(-50%)",
        maxWidth: 620,
        textAlign: "left",
      }}
    >
      <div className="eyebrow" style={{ marginBottom: 20 }}>
        {profile.seeking}
      </div>
      <h1
        style={{
          fontSize: "clamp(44px, 7.5vw, 108px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          margin: 0,
        }}
      >
        {profile.name}
      </h1>
      <p style={{ color: "var(--fg-dim)", marginTop: 20, fontSize: "clamp(16px,1.6vw,21px)", maxWidth: 460, lineHeight: 1.5 }}>
        {profile.title} — {profile.tagline}
      </p>
      <button
        onClick={() => actions.enterBuilding()}
        style={{
          marginTop: 38,
          padding: "14px 32px",
          background: "var(--fg)",
          color: "#111",
          border: "none",
          borderRadius: 2,
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        Explore the Building →
      </button>
      <div className="eyebrow" style={{ marginTop: 26, opacity: 0.6 }}>
        Scroll to rise · Drag to orbit · Click a floor
      </div>
    </div>
  );
}

function FloorPeek({ index }: { index: number }) {
  const p = projects[index];
  return (
    <div
      className="fade-in"
      style={{ position: "absolute", left: 40, bottom: 48, maxWidth: 360 }}
    >
      <div className="eyebrow" style={{ color: p.accent }}>
        Floor {String(index + 1).padStart(2, "0")}
        {p.year ? ` · ${p.year}` : p.isPrivate ? " · Private" : ""}
      </div>
      <h2 style={{ fontSize: 34, fontWeight: 600, margin: "8px 0 6px", letterSpacing: "-0.01em" }}>
        {p.name}
      </h2>
      <p style={{ color: "var(--fg-dim)", fontSize: 15, lineHeight: 1.5 }}>{p.tagline}</p>
      <div style={{ display: "flex", gap: 14, marginTop: 18, alignItems: "center" }}>
        <span className="eyebrow">Click the door to enter</span>
      </div>
      <button
        onClick={() => actions.clearFloor()}
        className="eyebrow"
        style={{ marginTop: 20, background: "none", border: "1px solid var(--line)", padding: "8px 16px", borderRadius: 2, cursor: "pointer" }}
      >
        ← Back to building
      </button>
    </div>
  );
}

function Room({ index }: { index: number }) {
  const p = projects[index];
  return (
    <div
      className="fade-in"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 6vw",
      }}
    >
      <div
        style={{
          width: "min(520px, 46vw)",
          background: "rgba(14,15,18,0.82)",
          backdropFilter: "blur(10px)",
          border: "1px solid var(--line)",
          borderRadius: 4,
          padding: "40px 42px",
        }}
      >
        <div className="eyebrow" style={{ color: p.accent }}>
          {p.isPrivate ? "Private Project" : "Project"}
          {p.year ? ` · ${p.year}` : ""}
        </div>
        <h2 style={{ fontSize: 40, fontWeight: 600, margin: "10px 0 4px", letterSpacing: "-0.02em" }}>
          {p.name}
        </h2>
        <p style={{ color: "var(--fg-dim)", fontSize: 16, marginBottom: 20 }}>{p.tagline}</p>
        <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--fg)" }}>{p.description}</p>

        {p.highlight && (
          <p style={{ marginTop: 16, fontSize: 14, color: p.accent, lineHeight: 1.5 }}>★ {p.highlight}</p>
        )}

        <div style={{ margin: "22px 0 6px" }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            Role
          </div>
          <div style={{ fontSize: 14, color: "var(--fg-dim)" }}>{p.role}</div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {p.tech.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 12,
                padding: "5px 11px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg-dim)",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {p.links.length > 0 ? (
          <div style={{ display: "flex", gap: 12, marginTop: 26 }}>
            {p.links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "11px 22px",
                  background: l.label === "Play" ? p.accent : "transparent",
                  color: l.label === "Play" ? "#111" : "var(--fg)",
                  border: `1px solid ${l.label === "Play" ? p.accent : "var(--line)"}`,
                  borderRadius: 2,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                }}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        ) : p.isPrivate ? (
          <div className="eyebrow" style={{ marginTop: 26, opacity: 0.7 }}>
            Repository kept private
          </div>
        ) : null}

        <button
          onClick={() => actions.exitRoom()}
          className="eyebrow"
          style={{
            marginTop: 30,
            background: "none",
            border: "1px solid var(--line)",
            padding: "10px 18px",
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          ← Exit room
        </button>
      </div>
    </div>
  );
}

function Footer() {
  const view = useStore((s) => s.view);
  return (
    <>
      <InfoPanel />
      {view !== "intro" && (
        <div
          className="eyebrow"
          style={{ position: "absolute", left: 34, bottom: 20, opacity: 0.5 }}
        >
          © {new Date().getFullYear()} {profile.name}
        </div>
      )}
    </>
  );
}

/** Slide-over panel holding Experience / Education / Contact. */
function InfoPanel() {
  return (
    <aside
      id="info-panel"
      data-open="false"
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: "min(440px, 92vw)",
        background: "rgba(16,18,22,0.96)",
        borderLeft: "1px solid var(--line)",
        transform: "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(.2,.8,.2,1)",
        overflowY: "auto",
        padding: "28px 34px 60px",
      }}
      ref={(el) => {
        if (!el) return;
        const obs = new MutationObserver(() => {
          el.style.transform = el.getAttribute("data-open") === "true" ? "translateX(0)" : "translateX(100%)";
        });
        obs.observe(el, { attributes: true, attributeFilter: ["data-open"] });
      }}
    >
      <button
        onClick={() => document.getElementById("info-panel")?.setAttribute("data-open", "false")}
        style={{ background: "none", border: "none", color: "var(--fg-dim)", cursor: "pointer", fontSize: 22, float: "right" }}
        aria-label="Close"
      >
        ×
      </button>

      <section id="info-experience" style={{ marginTop: 20 }}>
        <div className="eyebrow">Experience</div>
        {experience.map((e, i) => (
          <div key={i} style={{ marginTop: 18, paddingBottom: 18, borderBottom: "1px solid var(--line)" }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{e.role}</div>
            <div style={{ fontSize: 13, color: "var(--fg-dim)", margin: "3px 0 0" }}>
              {e.org}
              {e.period ? ` · ${e.period}` : ""}
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ paddingLeft: 16, marginTop: 10, color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.6 }}>
                {e.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section id="info-education" style={{ marginTop: 34 }}>
        <div className="eyebrow">Education</div>
        {education.map((ed, i) => (
          <div key={i} style={{ marginTop: 18 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{ed.school}</div>
            <div style={{ fontSize: 13, color: "var(--fg-dim)", margin: "3px 0 0" }}>
              {ed.program} · {ed.period}
            </div>
            {ed.details.length > 0 && (
              <ul style={{ paddingLeft: 16, marginTop: 10, color: "var(--fg-dim)", fontSize: 13, lineHeight: 1.6 }}>
                {ed.details.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section id="info-skills" style={{ marginTop: 34 }}>
        <div className="eyebrow">Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
          {skills.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                padding: "5px 11px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg-dim)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </section>

      <section id="info-contact" style={{ marginTop: 34 }}>
        <div className="eyebrow">Contact</div>
        {profile.email && (
          <a href={`mailto:${profile.email}`} style={{ display: "block", marginTop: 14, fontSize: 16, color: "var(--accent)" }}>
            {profile.email}
          </a>
        )}
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="eyebrow" style={{ color: "var(--fg)" }}>
              {s.label} ↗
            </a>
          ))}
        </div>
      </section>
    </aside>
  );
}
