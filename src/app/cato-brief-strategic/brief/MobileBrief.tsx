// Phone layout of the Cato Digital strategic financing brief, converted from the
// HTML Alex sent on Nov 24, 2026 (#webmaster). Server component: it is only
// rendered after the password check (CatoBriefPage), so the brief never ships
// in public JavaScript. Edit the wording here directly. Styles and behaviour:
// src/components/cato-brief (scoped to .cato-m); images: src/lib/cato-brief/media.
import Image from "next/image";
import MobileNav from "@/components/cato-brief/MobileNav";

export default function MobileBrief() {
  return (
    <div className="cato-m">
      <MobileNav />
      <main className="deck">
        <section className="pg cover" id="pg1">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Brief</div>
          </div>
          <div className="body">
            <div className="inv">An exclusive invitation</div>
            <div className="kicker">
              Cato Digital · GPU equipment financing brief
            </div>
            <h1>Thriving in AI infrastructure financing, in boom or bust</h1>
            <p className="disc">
              RampRate introduces lenders to Cato and other well qualified orgs.
              We do not represent either side, negotiate terms or place
              securities, and equity raises are out of scope, as we are not a
              broker dealer or investment bank. No compensation from the lender
              is requested or expected. CEO Tony Greenberg holds an interest in
              Cato. Confidential; not an offer or a commitment to lend.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>1 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg2">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Opportunity</div>
          </div>
          <div className="body">
            <h2 id="n0">
              <span className="num">01</span>AI infrastructure: top finance
              growth market
            </h2>
            <svg
              className="cs-63b32aea"
              viewBox="0 0 300 140"
              role="img"
              aria-label="Public GPU-backed debt by year in billions of dollars: 2023 about 2.5, 2024 about 9.3, 2025 6.6, 2026 to October 10 48.4"
            >
              <line
                x1="8"
                y1="112"
                x2="292"
                y2="112"
                stroke="#1C1410"
                strokeWidth="1.2"
              ></line>
              <rect
                x="14"
                y="108.1"
                width="52"
                height="3.9"
                fill="#8A7B6A"
              ></rect>
              <rect
                x="82"
                y="97.4"
                width="52"
                height="14.6"
                fill="#8A7B6A"
              ></rect>
              <rect
                x="150"
                y="101.6"
                width="52"
                height="10.4"
                fill="#8A7B6A"
              ></rect>
              <rect x="218" y="36" width="52" height="76" fill="#7E32D3"></rect>
              <g
                fontSize="12"
                fontWeight="700"
                fill="#1C1410"
                textAnchor="middle"
                fontFamily="Helvetica Neue,Arial,sans-serif"
              >
                <text x="40" y="103">
                  $2.5B
                </text>
                <text x="108" y="92">
                  $9.3B
                </text>
                <text x="176" y="96">
                  $6.6B
                </text>
                <text x="244" y="30">
                  $48.4B
                </text>
              </g>
              <g
                fontSize="10.5"
                fill="#4A3F36"
                textAnchor="middle"
                fontFamily="Helvetica Neue,Arial,sans-serif"
              >
                <text x="40" y="127">
                  2023
                </text>
                <text x="108" y="127">
                  2024
                </text>
                <text x="176" y="127">
                  2025
                </text>
                <text x="244" y="127">
                  2026 to Oct 10
                </text>
              </g>
            </svg>
            <p className="cap">
              Public GPU-backed debt raised, excl. private deals.
            </p>
            <div className="cs-b2dc8bf1"></div>
            <div className="stat">
              <div className="big">$66.8B</div>
              <p>
                of publicly announced GPU-backed debt since 2023. Private deals
                could double this.
              </p>
            </div>
            <div className="stat">
              <div className="big ink">SOFR + 2.25–3.0%</div>
              <p>
                for investment-grade clients (~6.2–6.9% total). Unrated
                borrowers: SOFR + 4.5–5.5% (~8.4–9.4% total).
              </p>
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>2 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg3">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Opportunity</div>
          </div>
          <div className="body">
            <ol className="proof">
              <li>
                <b>GPU lending is a mainstream asset class.</b> SPV owns
                hardware; rent repays loans; receivables &amp; GPUs are
                collateral.
              </li>
              <li>
                <b>Smart bets carry upside and scale,</b> with 7x growth vs.
                2025 already this year.
              </li>
              <li>
                <b>Top name lenders</b> include JPMorgan, Goldman Sachs, Morgan
                Stanley, MUFG, Blackstone, Apollo and Macquarie.
              </li>
            </ol>
            <div className="cs-b2dc8bf1"></div>
            <h2 id="n1">
              <span className="num">02</span>Opportunity: up to $200M for
              insider ally
            </h2>
            <ol className="proof">
              <li>
                <b>Opportunity tempered by complexity.</b> It’s hard to find
                deals; hard to qualify them &amp; manage risk; hard to prep for
                and price a black swan crash.
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>3 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg4">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Opportunity</div>
          </div>
          <div className="body">
            <ol className="proof cs-d32094e1">
              <li>
                <b>
                  Connections &amp; expertise to cut risk &amp; grow volume.
                </b>{" "}
                Most respected technologists, builders, and operators of AI
                infrastructure on your side to:
                <ul className="lg">
                  <li>
                    <Image
                      src="/cato-brief-strategic/media/86bf3209f60819f6.webp"
                      alt=""
                      width={300}
                      height={170}
                      unoptimized
                    />
                    <span>
                      Find fast-moving opportunities your sales team never sees
                    </span>
                  </li>
                  <li>
                    <Image
                      src="/cato-brief-strategic/media/92460a26091cb3ae.webp"
                      alt=""
                      width={300}
                      height={170}
                      unoptimized
                    />
                    <span>
                      Help design due diligence &amp; risk management frameworks
                    </span>
                  </li>
                  <li>
                    <Image
                      src="/cato-brief-strategic/media/38df54b106dac108.webp"
                      alt=""
                      width={300}
                      height={169}
                      unoptimized
                    />
                    <span>
                      Vet critical deals beyond your in-house tech expertise
                    </span>
                  </li>
                  <li>
                    <Image
                      src="/cato-brief-strategic/media/1eddac5749d995e5.webp"
                      alt=""
                      width={300}
                      height={170}
                      unoptimized
                    />
                    <span>
                      Minimize losses on individual defaults or industry-wide
                      crash
                    </span>
                  </li>
                  <li>
                    <Image
                      src="/cato-brief-strategic/media/4c2c1284936fb8f6.webp"
                      alt=""
                      width={300}
                      height={170}
                      unoptimized
                    />
                    <span>Buy for pennies on the dollar when others fail</span>
                  </li>
                </ul>
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>4 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg5">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Opportunity</div>
          </div>
          <div className="body">
            <ol className="proof cs-b4a8930a">
              <li>
                <b>Only price: fast &amp; flexible deal evaluation.</b>
                <ul className="sub">
                  <li>Your own credit bets or syndication to allies</li>
                  <li>Navigate to the right internal &amp; external lender</li>
                  <li>
                    No blank checks: everything vetted &amp; priced by your risk
                    team.
                  </li>
                  <li>
                    Deals are fast, fair, on best terms relative to the
                    end-client counterparty risk.
                  </li>
                </ul>
              </li>
              <li>
                <b>Strategic partnership target: $200M credit line</b>
                <ul className="sub">
                  <li>
                    $3.6M–$1B in insider opportunities detailed in this brief
                  </li>
                </ul>
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>5 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg6">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Roadmap</div>
          </div>
          <div className="body">
            <h2 id="n2">
              <span className="num">03</span>Short term: find the deal, evaluate
              fast, reduce risk
            </h2>
            <ol className="proof">
              <li>
                <b>Most deals close quickly and privately.</b> Outsiders rarely
                get a seat.
              </li>
              <li>
                <b>Decision time is compressed.</b> OEM lead times grow,
                customers want fast delivery, so financing decisions happen in
                weeks.
              </li>
              <li>
                <b>Winning takes the right connections &amp; model.</b> You need
                intros to deals early and a repeatable way to price or reject
                deals fast.
              </li>
            </ol>
            <div className="cs-b2dc8bf1"></div>
            <h2 id="n3">
              <span className="num">04</span>Medium term: manage the risks
              better than others
            </h2>
            <ol className="proof">
              <li>
                <b>Look past the balance sheet.</b> Uptime record, delivery
                discipline, site readiness &amp; customer concentration predict
                outcomes better.
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>6 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg7">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Roadmap</div>
          </div>
          <div className="body">
            <p className="cs-281c0215">Know where GPU financings get hurt.</p>
            <div className="risk8">
              <div className="rk">
                <b>
                  <i>A</i>No firm demand
                </b>
                <span>Spot pricing or soft commitments.</span>
              </div>
              <div className="rk">
                <b>
                  <i>B</i>Counterparty credit
                </b>
                <span>Defaults on long-term obligations.</span>
              </div>
              <div className="rk">
                <b>
                  <i>C</i>Concentration
                </b>
                <span>By client or sector.</span>
              </div>
              <div className="rk">
                <b>
                  <i>D</i>Supply
                </b>
                <span>Servers late or overpriced.</span>
              </div>
              <div className="rk">
                <b>
                  <i>E</i>Site and consent
                </b>
                <span>Power, cooling, or local approval not ready.</span>
              </div>
              <div className="rk">
                <b>
                  <i>F</i>Build and operations
                </b>
                <span>Outages, service credits, early exit.</span>
              </div>
              <div className="rk">
                <b>
                  <i>G</i>Obsolescence
                </b>
                <span>New GPU gen lowers rental rates &amp; resale value.</span>
              </div>
              <div className="rk">
                <b>
                  <i>H</i>The cycle
                </b>
                <span>AI spending pulls back before the loan is repaid.</span>
              </div>
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>7 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg8">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Roadmap</div>
          </div>
          <div className="body">
            <h2 id="n4">
              <span className="num">05</span>Long term: come out on top in a
              market-wide downturn
            </h2>
            <ol className="proof">
              <li>
                <b>Dot-com era blueprint:</b> Big names like Exodus and Cable
                &amp; Wireless collapsed; well-run upstart Savvis bought them
                for pennies. GI Partners built Digital Realty from 21 distressed
                data centers.
              </li>
              <li>
                <b>Plan for the crash.</b> Today, downside is capped by
                scarcity. Future correlated defaults may create GPU liquidation
                glut.
              </li>
              <li>
                <b>
                  Whether in 6 months or 6 years, be ready to profit on the dip.
                </b>{" "}
                Winners have structure &amp; partners to extract value when
                everyone else sells.
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>8 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg9">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Political risk</div>
          </div>
          <div className="body">
            <h2 className="cs-2eb6840f" id="n5">
              New political risk: anti-data center public sentiment
            </h2>
            <div className="tiles2">
              <div className="tl">
                <b>75+ / $130B</b>projects blocked or delayed in Q1 2026 alone
              </div>
              <div className="tl">
                <b>14 states</b>with statewide moratorium proposals
              </div>
              <div className="tl">
                <b>12 of 34</b>new governors back bans / moratoriums; 32 / 34
                for tighter rules
              </div>
              <div className="tl">
                <b>44 of 45</b>counted local data center ballot measures
                restricted them
              </div>
              <div className="tl">
                <b>3 states</b>with active pauses: NY; Texas; Ohio (tax
                exemptions)
              </div>
              <div className="tl">
                <b>New on-grid build</b>Biggest predictor of lender risk
              </div>
            </div>
            <div className="cs-b2dc8bf1"></div>
            <figure className="fig">
              <Image
                src="/cato-brief-strategic/media/996bd661894a2790.webp"
                alt="Map of the United States shaded by the number of data center-related ballot measures by state, with Ohio darkest and hatching on Texas, Georgia, Ohio, Michigan and Wisconsin"
                width={900}
                height={600}
                unoptimized
              />
            </figure>
            <p className="small cs-d7f998d8">
              Sources:{" "}
              <a href="https://www.amcompute.com/gpu-financing-tracker">
                American Compute
              </a>
              ;{" "}
              <a href="https://datacenterwatch.org/q1-2026">
                Data Center Watch
              </a>
              ;{" "}
              <a href="https://www.news5cleveland.com/politics/america-votes/voters-elected-governors-to-curb-data-centers-lowering-bills-for-gas-and-groceries-is-harder">
                News5 Cleveland
              </a>
              ;{" "}
              <a href="https://www.clickondetroit.com/news/politics/2026/11/06/data-centers-took-a-beating-in-the-midterm-elections-a-reckoning-may-be-ahead-for-tech-giants/">
                Click On Detroit
              </a>
              ;{" "}
              <a href="https://www.jonesday.com/de/insights/2026/08/texas-pauses-data-center-approvals-for-statewide-audit-stops-short-of-ban">
                Jones Day
              </a>
              ;{" "}
              <a href="https://www.wsj.com/tech/ai/the-election-day-revolt-that-threatens-americas-ai-boom-03a53b52">
                The Wall Street Journal
              </a>
              ;{" "}
              <a href="https://www.internetnews.com/archive/court-approves-savvis-bid-for-bankrupt-cw">
                InternetNews
              </a>
              ;{" "}
              <a href="https://www.gipartners.com/real-estate/investment/digital-realty">
                GI Partners
              </a>
              .
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>9 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg10">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <h2 id="n6">
              <span className="num">01</span>Today: up to $200M in well-managed
              credit
            </h2>
            <ol className="proof">
              <li>
                <b>Signed take-or-pay contracts.</b> 3 clients, $20.3M
                contracted; $2.2M prepayments received. 36-month take-or-pay
                terms.
              </li>
              <li>
                <b>Diversified customers with solid backing.</b> GMI Cloud:
                NVIDIA participated in $223M Series B in September. Five further
                B300 prospects in qualification.
              </li>
              <li>
                <b>Potential 2027 demand.</b> Up to $200M across a broad
                pipeline.
              </li>
            </ol>
            <div className="cs-b2dc8bf1"></div>
            <ol className="proof cs-654a6ed7">
              <li>
                <b>Second-life revenue, proven on earlier generations.</b> V100
                &amp; A100 servers still earning well past their depreciation
                schedule.
              </li>
              <li>
                <b>14 years in business; 3 in GPU hosting.</b> First decade to
                build tech extracting surplus power from data centers; last 3
                running it at scale with stellar uptime.
              </li>
              <li>
                <b>Luminary CEO:</b> Sun, eBay, PayPal, Uber, iMasons.
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>10 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg11">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <ol className="proof cs-58f23d94">
              <li>
                <b>Capacity and supply in hand.</b> Existing facilities in
                Plano, TX and New York, POs and wires on file with five hardware
                suppliers.
              </li>
              <li>
                <b>No build risks today.</b> No new land or power needed to
                deploy current pipeline.
              </li>
              <li>
                <b>Equipped to handle future political risk.</b> Excellent
                reputation and early adoption of conscious compute standards.
              </li>
            </ol>
            <div className="cs-b2dc8bf1"></div>
            <h3>This financing is the first of five opportunities</h3>
            <ol className="vsteps plainsteps cs-36e2002a">
              <li>
                <b>1</b>
                <span>
                  Debt tranche 1<br />
                  <b className="cs-5f664feb">$13–20M</b>
                </span>
              </li>
              <li>
                <b>2</b>
                <span>
                  SAFE
                  <br />
                  <b className="cs-5f664feb">$10M</b>
                </span>
              </li>
              <li>
                <b>3</b>
                <span>
                  Debt tranche 2<br />
                  <b className="cs-5f664feb">$25–30M</b>
                </span>
              </li>
              <li>
                <b>4</b>
                <span>
                  Credit line
                  <br />
                  <b className="cs-5f664feb">$200M</b>
                </span>
              </li>
              <li>
                <b>5</b>
                <span>$1B+ diversified real estate project (2027)</span>
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>11 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg12">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <h2 id="n7">
              <span className="num">02</span>Tomorrow: your guide to access,
              credibility &amp; insight for the whole market
            </h2>
            <div className="dean">
              <Image
                src="/cato-brief-strategic/media/55ed247b260b3bfd.webp"
                alt="Dean Nelson, CEO of Cato Digital"
                width={240}
                height={240}
                unoptimized
              />
              <div>
                <div className="nm">Dean Nelson</div>
                <div className="rl">
                  Founder and chairman, Infrastructure Masons · CEO, Cato
                </div>
              </div>
            </div>
            <p className="cs-f2345a46">
              17 years at Sun, VP of Global Foundation Services at eBay; head of
              Uber’s Metal team before founding the industry’s standards
              community (iMasons).
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>12 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg13">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <h3>Cato sits at the center of four groups</h3>
            <div className="nodebox dk cs-6aa73103">
              <Image
                src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
                alt="Cato"
                width={272}
                height={240}
                unoptimized
                className="cs-80ec369b"
              />
            </div>
            <div className="tiles2">
              <div className="nodebox">
                <b>Innovators</b>
              </div>
              <div className="nodebox">
                <b>Hyperscalers</b>
              </div>
              <div className="nodebox">
                <b>Equipment manufacturers</b>
              </div>
              <div className="nodebox">
                <b>Facilities operators</b>
              </div>
            </div>
            <div className="nodebox dash cs-f2345a46">
              <b className="cs-2293cb10">A lender’s seat</b>first look at deals
            </div>
            <p className="cs-d7f998d8">
              A lender doing business with Cato hears about the next deals
              first, vets them faster / better, and becomes part of the
              industry’s implicit reputation ecosystem.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>13 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg14">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <div className="invh">Investors, Advisors, &amp; Allies</div>
            <div className="pr cs-e72abdd6">
              <Image
                src="/cato-brief-strategic/media/5f24d75e59e2d365.webp"
                alt="Peter Gross"
                width={200}
                height={200}
                unoptimized
              />
              <div>
                <div className="nm">Peter Gross</div>
                <p>Top Advisor / Investor in mission-critical systems</p>
              </div>
            </div>
            <div className="pr">
              <Image
                src="/cato-brief-strategic/media/1280ffd5368adc09.webp"
                alt="Tony Greenberg"
                width={200}
                height={200}
                unoptimized
              />
              <div>
                <div className="nm">Tony Greenberg</div>
                <p>
                  Connector representing more than 400 suppliers in IT
                  infrastructure
                </p>
              </div>
            </div>
            <div className="pr">
              <Image
                src="/cato-brief-strategic/media/c3a920508a75c7ff.webp"
                alt="George Rockett"
                width={200}
                height={200}
                unoptimized
              />
              <div>
                <div className="nm">George Rockett</div>
                <p>
                  Founder of DCD and Yotta, the industry’s premier convener for
                  25+ years
                </p>
              </div>
            </div>
            <div className="cs-b2dc8bf1"></div>
            <h2 id="n8">
              <span className="num">03</span>Mid-term: Conscious Compute, the
              model the industry will need
            </h2>
            <p>
              Opposition to new data centers is rising &amp; moratorium bills
              are moving in 14 states. Operators will have to show low waste,
              small footprints and community integration. Cato already works
              this way.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>14 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg15">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <ul className="plain">
              <li className="ic">
                <Image
                  src="/cato-brief-strategic/media/20232327fd53c8cb.webp"
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="icn"
                />
                <div>
                  <b>Second-life equipment.</b> Used servers are redeployed
                  instead of scrapped, then pass to ITAD partners at EOL,
                  keeping electronic waste out of landfills.
                </div>
              </li>
              <li className="ic">
                <Image
                  src="/cato-brief-strategic/media/3d86f3e1a6bc5edd.webp"
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="icn"
                />
                <div>
                  <b>Stranded power.</b> Cato’s patented M9 system uses power
                  that data centers have already built but cannot sell, so no
                  new capacity is needed.
                </div>
              </li>
              <li className="ic">
                <Image
                  src="/cato-brief-strategic/media/522235b4caad02cd.webp"
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="icn"
                />
                <div>
                  <b>Efficient design.</b> Air-cooled B300 racks draw about 7.5
                  kW / server vs. 14 kW nameplate.
                </div>
              </li>
            </ul>
            <div className="cs-b2dc8bf1"></div>
            <ul className="plain">
              <li className="ic">
                <Image
                  src="/cato-brief-strategic/media/343a6609d4389955.webp"
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="icn"
                />
                <div>
                  <b>Standards leadership.</b> iMasons’ Climate Accord has 250+
                  members including AWS, Google, Meta, Microsoft, Schneider
                  Electric and Digital Realty, while its Social Accord covers
                  community engagement.
                </div>
              </li>
              <li className="ic">
                <Image
                  src="/cato-brief-strategic/media/421d391c70d3abf5.webp"
                  alt=""
                  width={120}
                  height={120}
                  unoptimized
                  className="icn"
                />
                <div>
                  <b>Pioneering adopter of Conscious Compute standards.</b>{" "}
                  Expected to receive one of the first independent
                  certifications for responsible data centers on its 2027
                  launch.
                </div>
              </li>
            </ul>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>15 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg16">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <h2 id="n9">
              <span className="num">04</span>Long term: building back better
              after an AI crash
            </h2>
            <p>
              If a market-wide downturn comes, Cato is the partner you want
              holding the servers that came back to you as collateral on failed
              loans.
            </p>
            <div className="art l3x cs-d1cfa33b">
              <Image
                src="/cato-brief-strategic/media/0f7d1456cbc63b9d.webp"
                alt="Circular graphic of three server lives: 01 frontier use by hyperscalers, 02 re-contract with Cato at lower rates, 03 parts and recycling"
                width={720}
                height={720}
                unoptimized
                className="cs-62892bde"
              />
              <div className="lv big cs-2205a667">Frontier life</div>
              <div className="lv sm cs-d04bf22e">Hyperscalers</div>
              <div className="lv big cs-fd68b40d">Cato re-contract</div>
              <div className="lv sm cs-5ea5faab">Lower rates</div>
              <div className="lv big cs-e4ace81b">Parts</div>
              <div className="lv sm cs-df81439e">Recycle, ITAD</div>
              <div className="lv ctr cs-e0ea1e1a">
                3<br />
                lives
              </div>
            </div>
            <div className="lg">
              <div>
                <i className="cs-93483b3c"></i>
                <span>
                  <b>Life 1 · frontier.</b> Hyperscalers run the newest GPUs on
                  the most intense workloads.
                </span>
              </div>
              <div>
                <i className="cs-3ca6c53f"></i>
                <span>
                  <b>Life 2 · Cato.</b> Lighter workloads: inference,
                  development &amp; batch on older hardware.
                </span>
              </div>
              <div>
                <i className="cs-9c3deeba"></i>
                <span>
                  <b>Life 3 · parts.</b> Spares and recycling keep the fleet
                  running, then ITAD.
                </span>
              </div>
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>16 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg17">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">Cato as partner</div>
          </div>
          <div className="body">
            <p>
              <b>Insulated from other deals.</b> Each financing sits in its own
              SPV, so collateral stays clear of other obligations.
            </p>
            <p>
              <b>A plan for lives two and three.</b> Path to standing step-in
              and re-marketing rights for collateral from your other defaults.
            </p>
            <p className="cap">
              For these B300 GPUs, Cato buys new and runs life 1 under a
              36-month take-or-pay contract. Lives 2 and 3 are upside /
              backstop, not your underwriting.
            </p>
            <div className="strip">
              <span className="lab">The bottom line</span>A financing you can
              underwrite today, a trusted entry into the rest of the industry,
              and a steward for the collateral if the cycle turns.
            </div>
            <p className="small cs-c73d4a73">
              Sources: Data Center Frontier;{" "}
              <a href="https://imasons.org">Infrastructure Masons</a>;{" "}
              <a href="https://datacenterwatch.org/q1-2026">
                Data Center Watch
              </a>
              . Confidential; not an offer or a commitment to lend.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>17 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg18">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h2 id="n10">
              <span className="num">01</span>Target credit line &amp; immediate
              opportunity
            </h2>
            <p>
              <b>Up to $200M total expected opportunity by end of 2027.</b>
            </p>
            <div className="stat">
              <div className="big">$3.6M</div>
              <p>
                <b>
                  Bridge funding secured, closing anticipated in next 2 weeks.
                </b>
              </p>
            </div>
            <div className="stat cs-45b242c3">
              <div className="big">$13–20M</div>
              <p>
                Now to December 2026, for the 22 contracted B300s and the next
                customers ready to sign. Subject to diligence of those
                customers.
              </p>
            </div>
            <table className="t">
              <tbody>
                <tr>
                  <th>Use</th>
                  <th className="r">Servers</th>
                  <th className="r">At ~$621K</th>
                </tr>
                <tr>
                  <td>Contracted: 16 GMI, 6 Tinfoil</td>
                  <td className="r">22</td>
                  <td className="r">$13.7M</td>
                </tr>
                <tr>
                  <td>Next customers ready to sign</td>
                  <td className="r">up to ~10</td>
                  <td className="r">to ~$20M total</td>
                </tr>
              </tbody>
            </table>
            <p className="cs-d7f998d8">
              <b>What the capital buys.</b> Servers, InfiniBand networking and
              site build-out for contracted customers. Customer prepayments of
              ~19% of contract value already fund the equity slice.
            </p>
            <p className="cap">
              Indicative sizing from management, subject to diligence. This is
              an opportunity, not a lender commitment.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>18 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg19">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h2 id="n11">
              <span className="num">02</span>What it buys, and how supply is
              secured
            </h2>
            <div className="kpi">
              <div className="big">$523–581K</div>
              <p>per 8-GPU air-cooled B300 server. Planning basis: $600K.</p>
            </div>
            <div className="kpi">
              <div className="big">$301–322K</div>
              <p>annual revenue per server at $4.29–4.59 per GPU-hour.</p>
            </div>
            <div className="kpi">
              <div className="big">~24 months</div>
              <p>to recover hardware cost, inside a 36-month contract.</p>
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>19 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg20">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h3>2026 payments, June to October</h3>
            <div className="key">
              <span>
                <i className="cs-93483b3c"></i>Cato pays suppliers
              </span>
              <span>
                <i className="cs-3ca6c53f"></i>Customers pay Cato
              </span>
              <span>
                <i className="cs-dfcf3d21"></i>PO only
              </span>
            </div>
            <ul className="tlv">
              <li>
                <span className="m">June · supplier</span>
                <span className="a">$169K</span>
                <br />2 A100 systems
              </li>
              <li>
                <span className="m">August · supplier</span>
                <span className="a">$1.16M</span>
                <br />2 B300, paid in full
              </li>
              <li className="cu">
                <span className="m">September · customer</span>
                <span className="a">$375K</span>
                <br />
                Tinfoil prepay
              </li>
              <li className="cu">
                <span className="m">September · customer</span>
                <span className="a">$367K</span>
                <br />
                Tinfoil prepay
              </li>
              <li>
                <span className="m">October · supplier</span>
                <span className="a">$337K</span>
                <br />6 B300 deposit
              </li>
              <li className="cu">
                <span className="m">October · customer</span>
                <span className="a">$1.44M</span>
                <br />
                GMI prepay
              </li>
              <li className="po">
                <span className="m">October · purchase order</span>
                <span className="a">$301K</span>
                <br />
                InfiniBand switches
              </li>
            </ul>
            <p className="cap">
              2026 wires and ACH credits from the bank records. Hollow marker:
              purchase order only.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>20 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg21">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <p>
              <b>Suppliers:</b> Sycomp (2 B300s bought and paid), Amaara
              Networks (6 B300s ordered with 10% deposit, 34 more on purchase
              orders), General Datatech (quote for 22), Sourceability, Velerity.
            </p>
            <p>
              Direct OEM lead times have stretched to 36 weeks, so Cato buys via
              channel partners on prepayment terms.
            </p>
            <div className="cs-b2dc8bf1"></div>
            <h2 id="n12">
              <span className="num">03</span>Committed revenue and pipeline
            </h2>
            <p className="cap cs-54a0dbbc">
              <b>Executed: $20.3M</b> across three signed customers, by share of
              contract value.
            </p>
            <div
              className="seg"
              role="img"
              aria-label="Executed contract value $20.3 million: GMI 71 percent, Tinfoil 28 percent, Milestone 1 percent"
            >
              <span className="a cs-ddbc30f3">GMI $14.4M</span>
              <span className="b cs-5db579d7">Tinfoil $5.7M</span>
              <span className="c cs-41e8da8f"></span>
            </div>
            <p className="cap cs-501b844f">
              <b>Named pipeline: about $85M,</b> unsigned, roughly four times
              executed value.
            </p>
            <div className="seg pipe">
              <span>Five B300 prospects, not yet contracted</span>
            </div>
            <p className="cap cs-c98a48d8">
              At full deployment the signed contracts bill about $571K a month.
              Cato has already delayed requests for 128+ servers as this round
              is completed.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>21 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg22">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h3>Customers</h3>
            <div className="cust">
              <div className="top">
                <b>GMI Cloud</b>
                <span className="pill go">Signed</span>
              </div>
              <dl>
                <dt>Servers</dt>
                <dd>16 B300</dd>
                <dt>$/GPU-hr</dt>
                <dd>$4.29</dd>
                <dt>Prepay</dt>
                <dd>19.4%</dd>
              </dl>
            </div>
            <div className="cust">
              <div className="top">
                <b>Tinfoil</b>
                <span className="pill go">Signed</span>
              </div>
              <dl>
                <dt>Servers</dt>
                <dd>2 + 4 B300</dd>
                <dt>$/GPU-hr</dt>
                <dd>$4.59, $4.49</dd>
                <dt>Prepay</dt>
                <dd>19.4%</dd>
              </dl>
            </div>
            <div className="cust">
              <div className="top">
                <b>Milestone</b>
                <span className="pill go">Signed</span>
              </div>
              <dl>
                <dt>Servers</dt>
                <dd>2 A100</dd>
                <dt>Term</dt>
                <dd>1 year</dd>
                <dt>Prepay</dt>
                <dd>none</dd>
              </dl>
            </div>
            <div className="cs-b2dc8bf1"></div>
            <div className="cust">
              <div className="top">
                <b>Pipeline</b>
                <span className="pill">Pipeline</span>
              </div>
              <p className="cs-8630938f">
                Inworld, Cognichip, Ornn, Andromeda, Prime Intellect
              </p>
              <dl>
                <dt>Servers</dt>
                <dd>32+ each (8 Cognichip)</dd>
                <dt>$/GPU-hr</dt>
                <dd>$3.99–4.39</dd>
                <dt>Prepay</dt>
                <dd>open</dd>
              </dl>
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>22 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg23">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h2 id="n13">
              <span className="num">04</span>Deal structure and options
            </h2>
            <ul className="plain">
              <li>
                <b>Target.</b> A revolving, delayed-draw facility in a
                standalone SPV. Each newly signed customer contract becomes a
                draw request with fast approval, and customer payments repay it.
              </li>
              <li>
                <b>Other options.</b> A single-tranche loan or lease for the
                first 22 servers, vendor financing, sale-leaseback, receivables
                financing against contract invoices, and impact-finance
                participation.
              </li>
            </ul>
            <div className="cs-b2dc8bf1"></div>
            <ul className="plain">
              <li>
                <b>Lender incentives.</b> Open to equity kickers, warrants or
                fee structures for lenders who commit early.
              </li>
              <li>
                <b>Collateral.</b> Serial-numbered, high-demand servers plus
                assigned customer payments and deposits. Cato’s legacy business
                stays outside the structure.
              </li>
              <li>
                <b>Parent equity.</b> The $10M SAFE (opportunity 2) is raised in
                parallel: $25M cap, 20% discount, $6.5M committed.
              </li>
            </ul>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>23 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg24">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h3>Draw cycle</h3>
            <ol className="vsteps plainsteps">
              <li>
                <b>1</b>Contract signed
              </li>
              <li>
                <b>2</b>Prepayment received
              </li>
              <li>
                <b>3</b>Draw approved
              </li>
              <li>
                <b>4</b>Servers delivered
              </li>
              <li>
                <b>5</b>Customer pays, loan repays
              </li>
            </ol>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>24 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg25">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <h2 id="n14">
              <span className="num">05</span>The next four opportunities
            </h2>
            <div className="nx">
              <span className="k">2 · Equity, in parallel</span>
              <div className="big">$10M SAFE</div>Parent-company SAFE alongside
              the debt round: $25M cap, 20% discount.
            </div>
            <div className="nx">
              <span className="k">3 · Debt tranche 2</span>
              <div className="big">$25–30M</div>The pipeline through early 2027,
              subject to client vetting.
            </div>
            <div className="nx">
              <span className="k">4 · Debt tranche 3</span>
              <div className="big">$200M</div>Credit line, inclusive of the
              allocations above. Drawn over 2027, contract by contract as
              customers sign.
            </div>
            <div className="nx">
              <span className="k">5 · Larger program</span>
              <div className="big">$1B+</div>A diversified real estate project
              with world-class indoor sports training, hotel and conference
              center, briefed separately.
            </div>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>25 / 26</span>
          </div>
        </section>
        <section className="pg" id="pg26">
          <div className="bar">
            <Image
              src="/cato-brief-strategic/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
            />
            <div className="tag">The deal</div>
          </div>
          <div className="body">
            <p className="cap cs-478db48c">
              Indicative sizing from management, subject to diligence and client
              vetting. These are opportunities, not lender commitments.
            </p>
            <div className="strip">
              <span className="lab">The bottom line</span>Cato wants a long-term
              strategic finance partner and will adapt the structure to fit. The
              data room is open and ready for diligence, and discussions with
              lessors and specialty lenders are active.
            </div>
            <p className="small cs-c73d4a73">
              Sources: Cato data room; management updates. Confidential; not an
              offer or a commitment to lend.
            </p>
          </div>
          <div className="foot">
            <span>GPU equipment financing brief</span>
            <span>26 / 26</span>
          </div>
        </section>
      </main>
    </div>
  );
}
