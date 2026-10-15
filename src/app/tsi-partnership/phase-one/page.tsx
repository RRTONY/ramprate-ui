import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "TSI Phase One Scope",
  robots: { index: false, follow: false, nocache: true },
};

const pieces = [
  ["translate(34 42) rotate(18) scale(.88 .86)", false],
  ["translate(54 28) rotate(-24) scale(1 .84)", true],
  ["translate(77 40) rotate(52) scale(.84 .96)", false],
  ["translate(98 26) rotate(-16) scale(.92 .88)", false],
  ["translate(120 40) rotate(34) scale(.86 1)", true],
  ["translate(143 28) rotate(-34) scale(1 .8)", false],
  ["translate(166 42) rotate(24) scale(.82 .92)", false],
] as const;

function Motif({
  className = "",
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 82"
      aria-hidden="true"
      role="presentation"
    >
      {pieces.map(([transform, sage], index) => (
        <path
          key={index}
          d="M -8 -4 C -8 -10 -1 -12 6 -7 C 12 -3 10 4 4 8 C -2 12 -11 7 -8 -4 Z"
          transform={transform}
          className={light ? "piece-light" : sage ? "piece-sage" : "piece"}
        />
      ))}
    </svg>
  );
}

function CardMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 112 112"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M -8 -4 C -8 -10 -1 -12 6 -7 C 12 -3 10 4 4 8 C -2 12 -11 7 -8 -4 Z"
        transform="translate(42 30) rotate(24) scale(.95 .88)"
        className="piece"
      />
      <path
        d="M -8 -4 C -8 -10 -1 -12 6 -7 C 12 -3 10 4 4 8 C -2 12 -11 7 -8 -4 Z"
        transform="translate(60 46) rotate(-26) scale(.95 .95)"
        className="piece-sage"
      />
      <path
        d="M -8 -4 C -8 -10 -1 -12 6 -7 C 12 -3 10 4 4 8 C -2 12 -11 7 -8 -4 Z"
        transform="translate(48 64) rotate(48) scale(.84 .96)"
        className="piece"
      />
    </svg>
  );
}

const styles = `
.tsi-scope{
  --bg:#FAF5EE;--surface:#F1E8D9;--surface-2:#F7EFE5;--ink:#231C2A;--ink-soft:#5E5668;
  --accent:#6B3F78;--accent-soft:#8C5C98;--sage:#69795A;--line:#DED0BB;--white:#FFFDFC;
  min-height:100vh;background:var(--bg);color:var(--ink);color-scheme:light;
  font-family:var(--font-public-sans),system-ui,-apple-system,"Segoe UI",sans-serif;
}
.tsi-scope *{box-sizing:border-box}
.tsi-scope .shell{max-width:1120px;margin-inline:auto;padding-inline:20px}
.tsi-scope h1,.tsi-scope h2,.tsi-scope h3{font-family:var(--font-fraunces),"Iowan Old Style",Georgia,serif;font-weight:560;text-wrap:balance;margin:0}
.tsi-scope p,.tsi-scope li{text-wrap:pretty}
.tsi-scope p{color:var(--ink-soft);line-height:1.65;margin:0}
.tsi-scope .eyebrow{font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600;margin:0 0 .6rem}
.tsi-scope .brand-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-block:16px;border-bottom:1px solid var(--line)}
.tsi-scope .brand-left{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.tsi-scope .bcorp{display:block;width:130px;height:auto}
.tsi-scope .note{font-size:.8rem;max-width:38ch;line-height:1.5}
.tsi-scope nav{position:sticky;top:0;z-index:5;background:var(--bg);border-bottom:1px solid var(--line)}
.tsi-scope .toc{display:flex;gap:20px;overflow-x:auto;padding-block:12px;scrollbar-width:none}
.tsi-scope .toc::-webkit-scrollbar{display:none}
.tsi-scope .toc a{color:var(--ink-soft);text-decoration:none;font-size:.78rem;white-space:nowrap;letter-spacing:.02em;font-weight:500}
.tsi-scope .toc a:hover{color:var(--accent)}
.tsi-scope .scope-note{position:relative;margin-top:28px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:22px 24px 22px 26px;overflow:hidden}
.tsi-scope .scope-note::before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent)}
.tsi-scope .scope-note p{max-width:82ch;font-size:.94rem}
.tsi-scope .scope-note strong{color:var(--ink);font-weight:600}
.tsi-scope .hero{display:grid;grid-template-columns:1.08fr .92fr;gap:42px;align-items:center;padding-block:40px 54px}
.tsi-scope .hero h1{font-size:clamp(2.35rem,4.8vw,3.6rem);line-height:1.02;max-width:13ch}
.tsi-scope .tagline{font-family:var(--font-fraunces),Georgia,serif;font-style:italic;color:var(--accent-soft)!important;font-size:1.25rem;line-height:1.35!important;margin-top:16px!important;max-width:31ch}
.tsi-scope .hero-copy{font-size:.98rem;max-width:50ch;margin-top:14px!important}
.tsi-scope .hero-card{position:relative;background:var(--surface);border-radius:24px;padding:28px;border:1px solid rgba(107,63,120,.08);overflow:hidden;min-height:390px}
.tsi-scope .hero-motif{position:absolute;right:-34px;top:12px;width:250px;height:auto;opacity:.16}
.tsi-scope .hero-steps{display:grid;gap:18px;position:relative;z-index:1}
.tsi-scope .step{display:grid;grid-template-columns:40px 1fr;gap:14px;align-items:start}
.tsi-scope .step-num{width:40px;height:40px;border-radius:50%;background:var(--bg);border:1px solid var(--line);display:grid;place-items:center;color:var(--accent);font-family:var(--font-fraunces),Georgia,serif}
.tsi-scope .step strong{display:block;font-family:var(--font-fraunces),Georgia,serif;font-weight:560;margin-top:2px}
.tsi-scope .step span{display:block;color:var(--ink-soft);font-size:.84rem;line-height:1.48;margin-top:3px}
.tsi-scope .section{padding-block:50px 54px;border-top:1px solid var(--line)}
.tsi-scope .relationship-section{padding-block:50px 54px;border-top:1px solid var(--line)}
.tsi-scope .relationship-head{display:grid;grid-template-columns:.92fr 1.08fr;gap:36px;align-items:start}
.tsi-scope .relationship-head h2{font-size:clamp(1.6rem,3.2vw,2.15rem);line-height:1.08;max-width:22ch}
.tsi-scope .relationship-lead{font-size:1rem;max-width:64ch}
.tsi-scope .relationship-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:28px}
.tsi-scope .relationship-card{position:relative;background:var(--white);border:1px solid var(--line);border-radius:18px;padding:24px;overflow:hidden}
.tsi-scope .relationship-card h3{font-size:1.08rem;color:var(--accent);margin-bottom:10px}
.tsi-scope .relationship-card p{font-size:.9rem}
.tsi-scope .relationship-card strong{color:var(--ink);font-weight:600}
.tsi-scope .relationship-note{margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.tsi-scope .relationship-note .card{background:var(--surface)}
.tsi-scope .relationship-note .card:last-child{background:rgba(105,121,90,.08)}
.tsi-scope .intro-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:36px;align-items:end}
.tsi-scope .section h2{font-size:clamp(1.45rem,3vw,1.95rem);line-height:1.08;max-width:23ch}
.tsi-scope .flow{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:28px}
.tsi-scope .flow-card{position:relative;background:var(--surface-2);border:1px solid var(--line);border-radius:16px;padding:18px;min-height:134px;overflow:hidden}
.tsi-scope .flow-card b{display:block;font-family:var(--font-fraunces),Georgia,serif;font-weight:560;margin-bottom:8px;position:relative;z-index:1}
.tsi-scope .flow-card span{display:block;color:var(--ink-soft);font-size:.8rem;line-height:1.46;position:relative;z-index:1}
.tsi-scope .card-motif{position:absolute;right:-10px;bottom:-12px;width:90px;height:90px;opacity:.12}
.tsi-scope .deliverable{display:grid;grid-template-columns:104px 1fr;gap:34px;padding-block:52px;border-top:1px solid var(--line)}
.tsi-scope .num{width:88px;height:88px;border-radius:50%;background:var(--surface);border:1px solid rgba(107,63,120,.1);display:grid;place-items:center;color:var(--accent);font-family:var(--font-fraunces),Georgia,serif;font-size:1.85rem}
.tsi-scope .deliverable-head{position:relative;padding-right:240px;min-height:82px}
.tsi-scope .deliverable-head .motif{position:absolute;right:0;top:0;width:220px;height:82px;opacity:.28}
.tsi-scope .lede{margin-top:14px!important;max-width:72ch}
.tsi-scope .two-col{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:26px}
.tsi-scope .card{position:relative;background:var(--white);border:1px solid var(--line);border-radius:18px;padding:24px;overflow:hidden}
.tsi-scope .card.sage{background:rgba(105,121,90,.08)}
.tsi-scope .card h3{font-size:1.08rem;color:var(--accent);margin-bottom:10px}
.tsi-scope .card.sage h3{color:var(--sage)}
.tsi-scope .card ul{margin:10px 0 0;padding-left:18px}
.tsi-scope .card li{color:var(--ink-soft);font-size:.9rem;line-height:1.5;margin:7px 0}
.tsi-scope .pills{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}
.tsi-scope .pill{border:1px solid var(--line);border-radius:999px;padding:8px 11px;font-size:.79rem;color:var(--ink-soft);background:var(--bg)}
.tsi-scope .carry{margin-top:20px;padding-top:16px;border-top:1px solid var(--line);font-size:.86rem;color:var(--sage);font-weight:600}
.tsi-scope .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px}
.tsi-scope .metric{position:relative;background:var(--white);border:1px solid var(--line);border-radius:18px;padding:22px;overflow:hidden}
.tsi-scope .metric small{font-size:.72rem;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);font-weight:700}
.tsi-scope .metric strong{display:block;font-family:var(--font-fraunces),Georgia,serif;font-size:1.35rem;font-weight:560;margin-top:6px}
.tsi-scope .metric p{font-size:.84rem;margin-top:7px}
.tsi-scope .checklist{display:grid;gap:10px;margin-top:12px}
.tsi-scope .check{display:grid;grid-template-columns:18px 1fr;gap:10px;color:var(--ink-soft);font-size:.9rem;line-height:1.5}
.tsi-scope .check::before{content:"✓";color:var(--sage);font-weight:800}
.tsi-scope .team-section{padding-block:52px 54px;border-top:1px solid var(--line)}
.tsi-scope .team-head{display:grid;grid-template-columns:.92fr 1.08fr;gap:36px;align-items:start}
.tsi-scope .team-head h2{font-size:clamp(1.6rem,3.2vw,2.15rem);line-height:1.08;max-width:20ch}
.tsi-scope .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:28px}
.tsi-scope .team-card{position:relative;background:var(--white);border:1px solid var(--line);border-radius:18px;padding:24px;overflow:hidden}
.tsi-scope .team-card h3{font-size:1.12rem;color:var(--accent);margin-bottom:4px}
.tsi-scope .team-role{font-size:.75rem;letter-spacing:.1em;text-transform:uppercase;color:var(--sage)!important;font-weight:700;margin-bottom:10px!important}
.tsi-scope .team-expand{position:relative;margin-top:20px;background:var(--surface);border:1px solid var(--line);border-radius:18px;padding:26px;overflow:hidden}
.tsi-scope .team-expand h3{font-size:1.18rem;color:var(--accent);margin-bottom:10px}
.tsi-scope .team-expand p{max-width:82ch}
.tsi-scope .end-card{position:relative;margin-block:14px 0;background:var(--surface);border-radius:22px;padding:40px clamp(22px,4vw,42px);overflow:hidden}
.tsi-scope .end-card .motif{width:126px;height:48px;opacity:.28;margin-bottom:18px}
.tsi-scope .end-card h2{max-width:26ch}
.tsi-scope .end-grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:20px}
.tsi-scope .end-grid h3{font-size:1.05rem;color:var(--accent);margin-bottom:8px}
.tsi-scope .final{position:relative;margin-top:20px;background:var(--accent);border-radius:24px;padding:40px;display:grid;grid-template-columns:1.1fr .9fr;gap:34px;overflow:hidden}
.tsi-scope .final .eyebrow{color:#ead8ed}
.tsi-scope .final h2{color:var(--bg);font-size:clamp(2rem,4vw,3rem);line-height:1.03;max-width:16ch}
.tsi-scope .final p{color:rgba(250,245,238,.82);margin-top:14px}
.tsi-scope .final-box{position:relative;z-index:1;background:rgba(250,245,238,.1);border:1px solid rgba(250,245,238,.18);border-radius:18px;padding:22px;color:var(--bg)}
.tsi-scope .final-box strong{display:block;font-family:var(--font-fraunces),Georgia,serif;font-size:1.15rem;margin-bottom:10px}
.tsi-scope .final-box span{color:rgba(250,245,238,.82);font-size:.9rem;line-height:1.55}
.tsi-scope .final .motif{position:absolute;right:-36px;bottom:-10px;width:270px;height:auto;opacity:.14}
.tsi-scope .piece{fill:var(--accent-soft)}
.tsi-scope .piece-sage{fill:var(--sage)}
.tsi-scope .piece-light{fill:var(--bg)}
.tsi-scope .footer{border-top:1px solid var(--line);padding-block:30px 48px;text-align:center;margin-top:38px}
.tsi-scope .footer p{font-size:.8rem;margin-top:14px}
@media (prefers-color-scheme:dark){
  .tsi-scope{
    --bg:#FAF5EE;--surface:#F1E8D9;--surface-2:#F7EFE5;--ink:#231C2A;--ink-soft:#5E5668;
    --accent:#6B3F78;--accent-soft:#8C5C98;--sage:#69795A;--line:#DED0BB;--white:#FFFDFC;
    background:var(--bg);color:var(--ink);color-scheme:light;
  }
}
@media (max-width:800px){
  .tsi-scope .hero,.tsi-scope .intro-grid,.tsi-scope .relationship-head,.tsi-scope .team-head,.tsi-scope .final{grid-template-columns:1fr}
  .tsi-scope .flow{grid-template-columns:1fr 1fr}
  .tsi-scope .deliverable{grid-template-columns:1fr;gap:18px}
  .tsi-scope .deliverable-head{padding-right:0;min-height:0}
  .tsi-scope .deliverable-head .motif{position:static;display:block;width:170px;height:64px;margin:-4px 0 18px auto;opacity:.23}
  .tsi-scope .two-col,.tsi-scope .end-grid,.tsi-scope .relationship-note{grid-template-columns:1fr}
  .tsi-scope .relationship-grid,.tsi-scope .team-grid{grid-template-columns:1fr}
  .tsi-scope .metrics{grid-template-columns:1fr}
}
@media (max-width:560px){
  .tsi-scope .shell{padding-inline:14px}
  .tsi-scope .brand-bar{align-items:flex-start}
  .tsi-scope .brand-left{gap:12px}
  .tsi-scope .bcorp{width:116px}
  .tsi-scope .hero h1{font-size:2.35rem}
  .tsi-scope .flow{grid-template-columns:1fr}
  .tsi-scope .final{padding:28px 22px}
}
`;

export default function TsiPhaseOneScopePage() {
  return (
    <main className="tsi-scope">
      <style>{styles}</style>
      <div className="shell">
        <header className="brand-bar">
          <div className="brand-left">
            <Image
              src="/tsi-partnership/bcorp-badge.webp"
              alt="RampRate — Certified B Corporation"
              width={1140}
              height={246}
              className="bcorp"
              priority
            />
          </div>
          <p className="note">
            Confidential discussion materials prepared for TSI.
          </p>
        </header>

        <nav aria-label="Section navigation">
          <div className="toc">
            <a href="#objective">Objective</a>
            <a href="#relationships">Relationships</a>
            <a href="#phase-flow">How it works</a>
            <a href="#deliverable-1">Deliverable 1</a>
            <a href="#deliverable-2">Deliverable 2</a>
            <a href="#deliverable-3">Deliverable 3</a>
            <a href="#deliverable-4">Deliverable 4</a>
            <a href="#end">End of Phase One</a>
            <a href="#team">Team</a>
          </div>
        </nav>

        <section className="scope-note" aria-label="Proposed scope note">
          <p>
            <strong>
              This is an initial proposed scope and set of deliverables for
              discussion with Joe.
            </strong>{" "}
            It is intended to give us a concrete starting point for the
            conversation, not a fixed statement of work. We expect to refine and
            agree the final scope, priorities and outputs based on the meeting
            on the 20th.
          </p>
        </section>

        <section className="hero" id="objective">
          <div>
            <p className="eyebrow">RampRate + TSI / Phase One scope</p>
            <h1>From market hypothesis to relationships ready to advance.</h1>
            <p className="tagline">
              Prove demand and economics in the EAP and employer-health channel
              while advancing real partner candidates throughout.
            </p>
            <p className="hero-copy">
              The objective is not to finish with a market study and then start
              outreach. It is to learn with the market in real time, carry the
              strongest candidates forward at every step, and end Phase One with
              one or more qualified relationships already moving toward an
              internal decision.
            </p>
          </div>
          <aside className="hero-card" aria-label="Phase One progression">
            <Motif className="hero-motif" />
            <p className="eyebrow">One continuous motion</p>
            <div className="hero-steps">
              {[
                [
                  "1",
                  "Map the market",
                  "Identify who pays, who influences, and which partner brands can carry Tailored Script to market.",
                ],
                [
                  "2",
                  "Test value live",
                  "Use real candidate conversations to validate need, engagement, budget and timing.",
                ],
                [
                  "3",
                  "Model the economics",
                  "Tie PEPM pricing, enrollment and dispensing volume to the prospects still advancing.",
                ],
                [
                  "4",
                  "Advance the strongest relationships",
                  "Work through population, delivery and internal approval with every candidate that earns the right to keep moving.",
                ],
              ].map(([n, title, body]) => (
                <div className="step" key={n}>
                  <div className="step-num">{n}</div>
                  <div>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="relationship-section" id="relationships">
          <div className="relationship-head">
            <div>
              <p className="eyebrow">Joe&apos;s question / Relationships</p>
              <h2>
                What relationships do we already have, and how do we build them
                in a new channel?
              </h2>
            </div>
            <p className="relationship-lead">
              We do not start from an existing book of contacts. We identify the
              organizations that actually control access in the channel and
              bring them to the table on terms that work for everyone. That is
              the approach that has worked for us elsewhere, and it is already
              in motion here.
            </p>
          </div>

          <div className="relationship-grid">
            <article className="relationship-card">
              <CardMotif className="card-motif" />
              <h3>Payer &amp; administration access</h3>
              <p>
                We have warm relationship paths into <strong>ComPsych</strong>,
                one of the largest EAP providers in the country, and into{" "}
                <strong>UnitedHealth Group</strong>. Both are exactly the kind
                of gatekeeper that controls distribution into the
                employer-health and capitated-care space being discussed.
              </p>
            </article>
            <article className="relationship-card">
              <CardMotif className="card-motif" />
              <h3>Distribution access</h3>
              <p>
                We are working a deal with <strong>Threshold Industries</strong>
                , which brings a team of roughly{" "}
                <strong>60 sales representatives and 40 PhDs</strong>. That
                combination matters because it offers both commercial reach and
                scientific credibility: a scaled team that could take the
                platform into market, support technically complex buyer
                conversations and help open additional distribution
                relationships.
              </p>
            </article>
            <article className="relationship-card">
              <CardMotif className="card-motif" />
              <h3>What these relationships show</h3>
              <p>
                These are not signed commitments to this specific opportunity,
                and they are not intended to be the only relationships pursued.
                They show the process already in motion: start with credible
                access points, learn who really controls the decision, then use
                both those conversations and our wider advisor and relationship
                network to open the next relevant door.
              </p>
            </article>
          </div>

          <div className="relationship-note">
            <article className="card">
              <h3>How the relationship map expands</h3>
              <p>
                Deliverables 1 and 2 are not a static target-list exercise. We
                continuously update the relationship map with named decision
                makers, introducers and adjacent channel organizations surfaced
                through the work. We also take those needs back into
                RampRate&apos;s own network: our advisors, long-standing
                relationships and trusted connectors are used deliberately to
                identify additional routes into the organizations that matter.
              </p>
              <p style={{ marginTop: "12px" }}>
                The objective is to compound access. One credible relationship
                should lead to the next relevant person, and our wider network
                gives us more than one route for opening that door.
              </p>
            </article>
            <article className="card">
              <h3>What we are not claiming yet</h3>
              <p>
                We are not claiming that any of these organizations has already
                committed interest, budget or funding for a pilot. That is the
                next question to answer.
              </p>
            </article>
            <article className="card">
              <h3>What happens next</h3>
              <p>
                Deliverable 2 is where we test who is actually willing to move,
                and on what terms. What we can commit to now is opening those
                conversations with the organizations above as soon as we are
                aligned on scope.
              </p>
            </article>
          </div>
        </section>

        <section className="section" id="phase-flow">
          <div className="intro-grid">
            <div>
              <p className="eyebrow">How Phase One works</p>
              <h2>Research and relationship development happen together.</h2>
            </div>
            <p>
              Each deliverable produces an output, but also narrows and advances
              the candidate set. The strongest relationships are not selected
              after the analysis is complete. They reveal themselves through
              participation, evidence, economics and internal movement during
              the work itself.
            </p>
          </div>
          <div className="flow">
            {[
              [
                "Broad market",
                "Buyers, EAPs, plans, brokers and white-label partner brands.",
              ],
              [
                "Ranked targets",
                "Prioritized by addressable volume, relevance and route-to-market fit.",
              ],
              [
                "Engaged candidates",
                "Actual conversations test value, interest, budget and timing.",
              ],
              [
                "Advanced relationships",
                "At least one candidate reaches a concrete close/no-close decision point, with others carried forward where momentum supports it.",
              ],
            ].map(([title, body]) => (
              <article className="flow-card" key={title}>
                <CardMotif className="card-motif" />
                <b>{title}</b>
                <span>{body}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="deliverable" id="deliverable-1">
          <div className="num">01</div>
          <div>
            <div className="deliverable-head">
              <p className="eyebrow">Deliverable 1</p>
              <h2>Map who pays, and who can carry the platform to market.</h2>
              <Motif className="motif" />
            </div>
            <p className="lede">
              Build two separate maps, then rank both by addressable volume and
              begin turning the highest-priority names into live relationships
              immediately. Alongside the mapping, define where TSI is most
              differentiated on cost, quality and timeliness, and identify
              shortage-prone formulations where the platform may have an
              especially strong commercial advantage.
            </p>
            <div className="two-col">
              <article className="card">
                <CardMotif className="card-motif" />
                <h3>Buyer map</h3>
                <p>
                  Organizations that can fund, bundle, recommend or materially
                  influence adoption in the employer-health channel.
                </p>
                <div className="pills">
                  <span className="pill">Self-insured employers</span>
                  <span className="pill">EAP vendors</span>
                  <span className="pill">Health plans</span>
                  <span className="pill">Capitated-care organizations</span>
                  <span className="pill">Benefits brokers</span>
                </div>
                <div className="carry">
                  Rank by addressable volume and buying influence, then carry
                  the strongest candidates into live outreach.
                </div>
              </article>
              <article className="card">
                <CardMotif className="card-motif" />
                <h3>Partner map</h3>
                <p>
                  Existing wellness and supplement brands that could license the
                  personalization and dispensing technology and deliver it under
                  their own name, with Tailored Script positioned as the
                  platform behind the offering.
                </p>
                <div className="pills">
                  <span className="pill">Wellness brands</span>
                  <span className="pill">Supplement brands</span>
                  <span className="pill">White-label operators</span>
                  <span className="pill">Established distribution</span>
                </div>
                <div className="carry">
                  Rank by addressable volume and carry the best-fit partner
                  relationships forward alongside the buyer map.
                </div>
              </article>
            </div>
            <div className="two-col">
              <article className="card sage">
                <CardMotif className="card-motif" />
                <h3>Differentiation &amp; positioning</h3>
                <p>
                  Define the clearest reasons a buyer or partner would choose
                  TSI over existing alternatives, including where the platform
                  wins on cost, quality or timeliness and where supply
                  constraints make TSI&apos;s capabilities especially relevant.
                </p>
                <ul>
                  <li>Cost advantage and manufacturing economics.</li>
                  <li>Quality, reliability and formulation capability.</li>
                  <li>Timeliness and speed to dispense or launch.</li>
                  <li>Shortage-prone formulations and supply gaps.</li>
                  <li>
                    Positioning TSI as the platform or &quot;ingredient
                    inside&quot; the end-customer offering.
                  </li>
                </ul>
              </article>
              <article className="card">
                <h3>How it carries forward</h3>
                <p>
                  The positioning hypotheses become explicit questions in the
                  candidate interviews, so the strongest differentiation is
                  validated by the market rather than assumed internally.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="deliverable" id="deliverable-2">
          <div className="num">02</div>
          <div>
            <div className="deliverable-head">
              <p className="eyebrow">Deliverable 2</p>
              <h2>Test why it has value, directly with the candidates.</h2>
              <Motif className="motif" />
            </div>
            <p className="lede">
              Run structured interviews with the actual candidates from the
              maps. Every conversation does two things at once: it tests whether
              personalization genuinely moves the needle, and it qualifies real
              commercial intent.
            </p>
            <div className="two-col">
              <article className="card">
                <CardMotif className="card-motif" />
                <h3>What the conversations test</h3>
                <ul>
                  <li>
                    Whether personalization improves engagement versus generic
                    supplementation.
                  </li>
                  <li>
                    Whether the value proposition matters to the buyer or
                    channel partner in practice.
                  </li>
                  <li>
                    Which points of differentiation actually resonate: cost,
                    quality, timeliness, supply resilience or the platform
                    &quot;ingredient inside&quot; model.
                  </li>
                  <li>
                    What evidence would be needed to support engagement or
                    outcome claims.
                  </li>
                  <li>
                    Who would need to sponsor, approve or operationalize a
                    pilot.
                  </li>
                </ul>
              </article>
              <article className="card sage">
                <CardMotif className="card-motif" />
                <h3>What the conversations qualify</h3>
                <ul>
                  <li>Real interest level and decision timeline.</li>
                  <li>Budget ownership and funding path.</li>
                  <li>Population opportunity.</li>
                  <li>Internal approval process.</li>
                </ul>
              </article>
            </div>
            <p className="lede">
              By the end of this step, the strongest two or three candidates
              have already distinguished themselves through genuine engagement,
              not a shortlist built afterward from cold research.
            </p>
          </div>
        </section>

        <section className="deliverable" id="deliverable-3">
          <div className="num">03</div>
          <div>
            <div className="deliverable-head">
              <p className="eyebrow">Deliverable 3</p>
              <h2>Prove what justifies scaling.</h2>
              <Motif className="motif" />
            </div>
            <p className="lede">
              Build a quantified economics model against the candidates still
              advancing from Deliverable 2. Tying the model to real prospects
              means the numbers reflect what scaling would actually require.
            </p>
            <div className="metrics">
              {[
                [
                  "Commercial input 1",
                  "Price point",
                  "Test PEPM-style pricing and any channel or reseller economics required by the candidate.",
                ],
                [
                  "Commercial input 2",
                  "Enrolled population",
                  "Model the covered or participating lives required to make the opportunity material.",
                ],
                [
                  "Commercial input 3",
                  "Dispensing volume",
                  "Translate enrollment and utilization into the volume needed to clear underlying manufacturing economics.",
                ],
              ].map(([label, title, body]) => (
                <article className="metric" key={title}>
                  <CardMotif className="card-motif" />
                  <small>{label}</small>
                  <strong>{title}</strong>
                  <p>{body}</p>
                </article>
              ))}
            </div>
            <div className="two-col">
              <article className="card">
                <h3>The model answers</h3>
                <ul>
                  <li>What a viable customer economics case looks like.</li>
                  <li>What utilization assumptions matter most.</li>
                  <li>What volume threshold makes scaling rational.</li>
                  <li>
                    Where economics become sensitive to partner margin, delivery
                    or manufacturing cost.
                  </li>
                </ul>
              </article>
              <article className="card sage">
                <h3>Why real prospects matter</h3>
                <p>
                  The model becomes decision-grade because it is grounded in an
                  actual candidate&apos;s population, budget structure, delivery
                  model and buying process rather than a generic market average.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="deliverable" id="deliverable-4">
          <div className="num">04</div>
          <div>
            <div className="deliverable-head">
              <p className="eyebrow">Deliverable 4</p>
              <h2>The most advanced candidates, ready to take forward.</h2>
              <Motif className="motif" />
            </div>
            <p className="lede">
              By the end of the phase, we expect at least one relationship to
              have reached a meaningful close/no-close decision point. If
              several candidates show real momentum, we carry all of them
              forward rather than artificially narrowing the outcome to one. The
              goal is not a name on a list. It is a set of relationships that
              have worked through enough of the opportunity to justify continued
              pursuit.
            </p>
            <div className="two-col">
              <article className="card sage">
                <h3>By the end of Phase One</h3>
                <div className="checklist">
                  <div className="check">
                    Population size has been discussed.
                  </div>
                  <div className="check">
                    The delivery mechanism has been worked through.
                  </div>
                  <div className="check">
                    Economics have been connected to the candidate&apos;s actual
                    opportunity.
                  </div>
                  <div className="check">
                    The candidate&apos;s internal approval process is underway.
                  </div>
                </div>
              </article>
              <article className="card">
                <h3>The decision point</h3>
                <p>
                  Which relationships have earned the right to move toward
                  signature? The answer is based on real progress, real
                  economics and real internal movement. At least one should
                  reach that decision point; more than one can if the
                  conversations support it.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="end-card" id="end">
          <Motif className="motif" />
          <p className="eyebrow">End of Phase One</p>
          <h2>
            One or more qualified, advanced relationships and a channel business
            plan TSI can use to take the opportunity forward.
          </h2>
          <div className="end-grid">
            <div>
              <h3>Channel business plan</h3>
              <p>
                A final document bringing together the ranked buyer and partner
                maps, validated differentiation and positioning, candidate
                evidence, commercial economics, priority relationships and a
                practical path to market.
              </p>
            </div>
            <div>
              <h3>Advanced commercial relationships</h3>
              <p>
                At least one relationship advanced toward a close/no-close
                decision, with additional candidates carried forward wherever
                discussions justify it. For each, TSI has a clear view of why
                the candidate cares, how the economics need to work and what
                remains between the current position and signature.
              </p>
            </div>
          </div>
        </section>

        <section className="team-section" id="team">
          <div className="team-head">
            <div>
              <p className="eyebrow">Joe&apos;s question / Team</p>
              <h2>Who would actually do the work?</h2>
            </div>
            <p className="relationship-lead">
              The core team is deliberately small and accountable, with clear
              ownership across relationships, commercial structure and senior
              access. We then add the right specialist or advisor support as the
              work reveals where it will create leverage.
            </p>
          </div>

          <div className="team-grid">
            <article className="team-card">
              <CardMotif className="card-motif" />
              <h3>Rob Holmes</h3>
              <p className="team-role">Relationship &amp; outreach lead</p>
              <p>
                Leads the day-to-day relationship with TSI, target mapping,
                outreach, interview coordination and follow-through with
                prospective buyers, channel partners and introducers.
              </p>
            </article>

            <article className="team-card">
              <CardMotif className="card-motif" />
              <h3>Alex Veytsel</h3>
              <p className="team-role">Commercial structure &amp; economics</p>
              <p>
                Owns the commercial model, pricing and unit economics, deal
                structure, qualification logic and the economic case that
                determines which opportunities are worth carrying forward.
              </p>
            </article>

            <article className="team-card">
              <CardMotif className="card-motif" />
              <h3>Tony Greenberg</h3>
              <p className="team-role">Introductions &amp; senior decisions</p>
              <p>
                Supports senior introductions, opens doors through
                RampRate&apos;s network and advisor relationships, and helps
                make the key decisions on where to focus, escalate or bring
                additional people into the work.
              </p>
            </article>
          </div>

          <article className="team-expand">
            <Motif className="hero-motif" />
            <h3>
              The team expands around the opportunity, not around a fixed
              roster.
            </h3>
            <p>
              In practice, that means keeping a small accountable core team in
              place and adding specialist expertise only when the work shows it
              can materially improve access, credibility or execution.
            </p>
            <p style={{ marginTop: "12px" }}>
              One capability we are already looking to add is deeper
              nutraceutical and formulation expertise: someone who can bring
              real operating credibility in supplements, product formulation and
              the science behind the offer, while also helping sharpen how the
              opportunity is presented to partners and buyers.
            </p>
            <p style={{ marginTop: "12px" }}>
              Tony is already working that search through his network.
            </p>
          </article>
        </section>

        <section className="final">
          <Motif className="motif" light />
          <div>
            <p className="eyebrow">Phase One outcome</p>
            <h2>The output is momentum, not just analysis.</h2>
            <p>
              Phase One ends with at least one qualified, advanced relationship,
              potentially several if the market responds well, plus validated
              positioning and economics and a channel business plan that turns
              the work into a concrete route to market.
            </p>
          </div>
          <div className="final-box">
            <strong>Relationships already moving.</strong>
            <span>
              At least one candidate is advanced toward a concrete decision, and
              any additional candidates showing real momentum are carried
              forward as well. The differentiation has been tested with the
              market, and the commercial case is captured in a final channel
              business plan.
            </span>
          </div>
        </section>

        <footer className="footer">
          <Image
            src="/tsi-partnership/bcorp-badge.webp"
            alt="RampRate — Certified B Corporation"
            width={1140}
            height={246}
            className="bcorp"
          />
          <p>Confidential discussion materials prepared for TSI.</p>
        </footer>
      </div>
    </main>
  );
}
