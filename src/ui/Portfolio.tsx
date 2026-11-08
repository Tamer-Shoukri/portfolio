"use client";

import { useEffect } from "react";
import { profile, projects, experience, education, skills } from "@/data/content";

export function Portfolio() {
  // Reveal-on-scroll
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Background />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function Nav() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        backdropFilter: "blur(10px)",
        background: "rgba(10,12,18,0.6)",
        borderBottom: "1px solid var(--line)",
      }}
    >
      <div
        className="wrap"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}
      >
        <a href="#top" style={{ fontWeight: 700, letterSpacing: "0.02em" }}>
          {initials(profile.name)}
        </a>
        <nav style={{ display: "flex", gap: 28 }}>
          <a href="#projects" className="eyebrow">
            Projects
          </a>
          <a href="#background" className="eyebrow">
            Background
          </a>
          <a href="#contact" className="eyebrow">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" style={{ padding: "clamp(60px, 11vw, 130px) 0 80px" }}>
      <div className="wrap">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          {/* Left: name + pitch */}
          <div style={{ flex: "1 1 520px", minWidth: 300 }}>
            <div className="eyebrow reveal">Portfolio · 2026 · Open to internships &amp; co-ops</div>
            <h1
              className="reveal"
              style={{
                fontSize: "clamp(56px, 11vw, 132px)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 0.92,
                margin: "22px 0 0",
              }}
            >
              {firstName(profile.name)}
              <br />
              {lastName(profile.name)}
            </h1>
            <p
              className="reveal"
              style={{ fontSize: "clamp(18px,2.2vw,24px)", color: "var(--fg)", marginTop: 26, fontWeight: 500 }}
            >
              {profile.title}
            </p>
            <p
              className="reveal"
              style={{ fontSize: 16, color: "var(--fg-dim)", marginTop: 16, maxWidth: 540, lineHeight: 1.7 }}
            >
              {profile.tagline} I build clean, reliable software — from polished front-end
              experiences to the logic and tooling behind them — and I&apos;m focused on shipping
              real, working products.
            </p>

            <div style={{ display: "flex", gap: 14, marginTop: 34, flexWrap: "wrap" }} className="reveal">
              <a href="#projects" className="btn btn-primary">
                View Projects
              </a>
              <a href="#contact" className="btn btn-ghost">
                Contact
              </a>
            </div>
          </div>

          {/* Right: info card */}
          <aside className="panel reveal" style={{ flex: "0 1 320px", minWidth: 280, padding: 26 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{profile.name}</div>
            <div style={{ color: "var(--fg-dim)", fontSize: 14, marginTop: 4 }}>{profile.title}</div>
            <div style={{ height: 1, background: "var(--line)", margin: "20px 0" }} />
            <InfoRow label="Studying" value="Western University" />
            <InfoRow label="Focus" value="AI / Full-Stack software" />
            <InfoRow label="Seeking" value={profile.seeking} />
          </aside>
        </div>

        {/* Tech ticker */}
        <div
          className="reveal"
          style={{
            marginTop: 70,
            paddingTop: 22,
            borderTop: "1px solid var(--line)",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px 26px",
          }}
        >
          {skills.map((s) => (
            <span key={s} style={{ fontFamily: "var(--mono)", fontSize: 12.5, color: "var(--fg-faint)" }}>
              <span style={{ color: "var(--accent)" }}>//</span> {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="eyebrow" style={{ fontSize: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 500, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" style={{ padding: "70px 0" }}>
      <div className="wrap">
        <SectionHead eyebrow="Selected Work" title="Projects" />
        <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginTop: 36 }}>
          {projects.map((p) => (
            <article key={p.id} className="panel reveal" style={{ padding: 26, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ color: p.accent }}>
                  {p.comingSoon ? "Coming Soon" : p.year ? `Project · ${p.year}` : "Project"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: p.comingSoon ? p.accent : "var(--fg-dim)",
                    border: `1px solid ${p.comingSoon ? p.accent : "var(--line)"}`,
                    borderRadius: 999,
                    padding: "3px 10px",
                  }}
                >
                  {p.comingSoon ? "Soon" : "Live"}
                </span>
              </div>
              <h3 style={{ fontSize: 23, fontWeight: 600, margin: "14px 0 6px", letterSpacing: "-0.01em" }}>{p.name}</h3>
              <p style={{ color: "var(--fg-dim)", fontSize: 14.5, lineHeight: 1.6 }}>{p.description}</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
                {p.tech.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 11.5,
                      padding: "4px 10px",
                      border: "1px solid var(--line)",
                      borderRadius: 999,
                      color: "var(--fg-dim)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {p.links.length > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  {p.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer"
                      className="btn"
                      style={{
                        padding: "9px 16px",
                        fontSize: 13,
                        background: l.label === "Play" ? p.accent : "transparent",
                        color: l.label === "Play" ? "#07080c" : "var(--fg)",
                        borderColor: l.label === "Play" ? p.accent : "var(--line-strong)",
                      }}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Background() {
  return (
    <section id="background" style={{ padding: "70px 0" }}>
      <div className="wrap">
        <SectionHead eyebrow="Experience & Education" title="Background" />
        <div style={{ display: "grid", gap: 40, gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", marginTop: 36 }}>
          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Experience
            </div>
            {experience.map((e, i) => (
              <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{e.role}</span>
                  {e.period && <span style={{ color: "var(--fg-faint)", fontSize: 13, whiteSpace: "nowrap" }}>{e.period}</span>}
                </div>
                <div style={{ color: "var(--fg-dim)", fontSize: 14, marginTop: 3 }}>{e.org}</div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: "10px 0 0 16px", color: "var(--fg-dim)", fontSize: 13.5, lineHeight: 1.6 }}>
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="reveal">
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              Education
            </div>
            {education.map((ed, i) => (
              <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--line)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>{ed.school}</span>
                  <span style={{ color: "var(--fg-faint)", fontSize: 13, whiteSpace: "nowrap" }}>{ed.period}</span>
                </div>
                <div style={{ color: "var(--fg-dim)", fontSize: 14, marginTop: 3 }}>{ed.program}</div>
              </div>
            ))}

            <div className="eyebrow" style={{ margin: "30px 0 14px" }}>
              Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
              {skills.map((s) => (
                <span
                  key={s}
                  style={{ fontSize: 12, padding: "5px 11px", border: "1px solid var(--line)", borderRadius: 999, color: "var(--fg-dim)" }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" style={{ padding: "80px 0 60px" }}>
      <div className="wrap">
        <div className="panel reveal" style={{ padding: "clamp(32px,5vw,56px)", textAlign: "center" }}>
          <div className="eyebrow">Get in touch</div>
          <h2 style={{ fontSize: "clamp(30px,5vw,46px)", fontWeight: 700, letterSpacing: "-0.02em", margin: "14px 0 10px" }}>
            Let&apos;s build something.
          </h2>
          <p style={{ color: "var(--fg-dim)", fontSize: 16, maxWidth: 520, margin: "0 auto 28px" }}>
            Open to internship and co-op opportunities. The best way to reach me right now is GitHub.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            {profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="btn btn-primary">
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="reveal">
      <div className="eyebrow">{eyebrow}</div>
      <h2 style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 700, letterSpacing: "-0.02em", marginTop: 10 }}>{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", padding: "28px 0" }}>
      <div
        className="wrap"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}
      >
        <span className="eyebrow">© {new Date().getFullYear()} {profile.name}</span>
        <span className="eyebrow" style={{ opacity: 0.6 }}>
          Clean design · Real projects · Strong execution
        </span>
      </div>
    </footer>
  );
}

// helpers
function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
function firstName(name: string) {
  return name.split(" ")[0];
}
function lastName(name: string) {
  return name.split(" ").slice(1).join(" ") || "";
}
