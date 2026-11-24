// Desktop layout of the Cato Digital original financing brief, converted from Alex's HTML
// (#webmaster, Nov 2026). Server component: it is only rendered after the
// password check (CatoBriefPage), so the brief never ships in public
// JavaScript. Edit the wording here directly. Styles and behaviour:
// src/components/cato-brief (scoped to .cato-d); images: src/lib/cato-brief/media.
import Image from "next/image";
import { ViewToggle } from "@/components/cato-brief/BriefViewer";

export default function DesktopBrief() {
  return (
    <div className="cato-d">
      <ViewToggle className="vt" id="vt">
        Mobile view
      </ViewToggle>
      <section className="sheet" id="p0">
        <div className="head">
          <div className="brand">
            <Image
              src="/cato-digital-financing/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
              className="logo"
            />
            <div>
              <div className="kicker">
                Cato Digital · GPU equipment financing brief · Page 1
              </div>
              <h1>Thriving in AI infrastructure financing, in boom or bust</h1>
            </div>
          </div>
          <div className="side">An exclusive invitation</div>
        </div>
        <div className="grid">
          <article className="quad">
            <h2>
              <span className="num">01</span>AI infrastructure: top finance
              growth market
            </h2>
            <div className="row2">
              <div>
                <svg
                  viewBox="0 0 300 244"
                  role="img"
                  aria-label="Public GPU-backed debt by year in billions of dollars: 2023 about 2.5, 2024 about 9.3, 2025 6.6, 2026 to October 10 48.4"
                >
                  <line
                    x1="8"
                    y1="204"
                    x2="292"
                    y2="204"
                    stroke="#1C1410"
                    strokeWidth="1.4"
                  ></line>
                  <rect
                    x="14"
                    y="196.2"
                    width="52"
                    height="7.8"
                    fill="#8A7B6A"
                  ></rect>
                  <text
                    x="40"
                    y="189.2"
                    fontSize="17"
                    fontWeight="700"
                    fill="#1C1410"
                    textAnchor="middle"
                  >
                    $2.5B
                  </text>
                  <text
                    x="40"
                    y="224"
                    fontSize="15"
                    fill="#4A3F36"
                    textAnchor="middle"
                  >
                    2023
                  </text>
                  <rect
                    x="82"
                    y="175.2"
                    width="52"
                    height="28.8"
                    fill="#8A7B6A"
                  ></rect>
                  <text
                    x="108"
                    y="168.2"
                    fontSize="17"
                    fontWeight="700"
                    fill="#1C1410"
                    textAnchor="middle"
                  >
                    $9.3B
                  </text>
                  <text
                    x="108"
                    y="224"
                    fontSize="15"
                    fill="#4A3F36"
                    textAnchor="middle"
                  >
                    2024
                  </text>
                  <rect
                    x="150"
                    y="183.5"
                    width="52"
                    height="20.5"
                    fill="#8A7B6A"
                  ></rect>
                  <text
                    x="176"
                    y="176.5"
                    fontSize="17"
                    fontWeight="700"
                    fill="#1C1410"
                    textAnchor="middle"
                  >
                    $6.6B
                  </text>
                  <text
                    x="176"
                    y="224"
                    fontSize="15"
                    fill="#4A3F36"
                    textAnchor="middle"
                  >
                    2025
                  </text>
                  <rect
                    x="218"
                    y="54.0"
                    width="52"
                    height="150.0"
                    fill="#7E32D3"
                  ></rect>
                  <text
                    x="244"
                    y="47.0"
                    fontSize="17"
                    fontWeight="700"
                    fill="#1C1410"
                    textAnchor="middle"
                  >
                    $48.4B
                  </text>
                  <text
                    x="244"
                    y="224"
                    fontSize="15"
                    fill="#4A3F36"
                    textAnchor="middle"
                  >
                    2026
                  </text>
                  <text
                    x="244"
                    y="240"
                    fontSize="12.5"
                    fill="#4A3F36"
                    textAnchor="middle"
                  >
                    to Oct 10
                  </text>
                </svg>
                <p className="cap">
                  Public GPU-backed debt raised, excl. private deals.
                </p>
              </div>
              <div>
                <div className="stat">
                  <div className="big">$66.8B</div>
                  <p>
                    of publicly announced GPU-backed debt since 2023. Private
                    deals could double this.
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
            </div>
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
          </article>
          <article className="quad">
            <h2>
              <span className="num">02</span>Strategic opportunity: insider ally
            </h2>
            <ol className="proof">
              <li>
                <b>Opportunity tempered by complexity.</b> It’s hard to find
                deals; hard to qualify them &amp; manage risk; hard to prep for
                and price a black swan crash.
              </li>
              <li>
                <b>
                  Connections &amp; expertise to cut risk &amp; grow volume.
                </b>{" "}
                Most respected technologists, builders, and operators of AI
                infrastructure on your side to:{" "}
                <Image
                  src="/cato-digital-financing/media/120ffa13295c61c0.webp"
                  alt="Five ways the insiders help a lender: 1 find fast-moving opportunities your sales team never sees; 2 help design due diligence and risk management frameworks; 3 vet critical deals beyond your in-house tech expertise; 4 minimize losses on individual defaults or an industry-wide crash; 5 buy for pennies on the dollar when others fail"
                  width={1600}
                  height={533}
                  unoptimized
                  className="ladimg"
                />
              </li>
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
                <b>The starting point:</b> $13M–$1B+ in insider opportunities
                detailed in this brief.
              </li>
            </ol>
          </article>
        </div>
        <div className="rm">
          <div className="band">
            <h2>Roadmap to your success in AI infrastructure finance</h2>
          </div>
          <div className="row3">
            <article className="quad">
              <h2>
                <span className="num">03</span>Short term: find the deal,
                evaluate fast, reduce risk
              </h2>
              <ol className="proof">
                <li>
                  <b>Most deals close quickly and privately.</b> Outsiders
                  rarely get a seat.
                </li>
                <li>
                  <b>Decision time is compressed.</b> OEM lead times grow,
                  customers want fast delivery, so financing decisions happen in
                  weeks.
                </li>
                <li>
                  <b>Winning takes the right connections &amp; model.</b> You
                  need intros to deals early and a repeatable way to price or
                  reject deals fast.
                </li>
              </ol>
            </article>
            <article className="quad">
              <h2>
                <span className="num">04</span>Medium term: manage the risks
                better than others
              </h2>
              <ol className="proof">
                <li>
                  <b>Look past the balance sheet.</b> Uptime record, delivery
                  discipline, site readiness &amp; customer concentration
                  predict outcomes better.
                </li>
                <li>
                  <b>Know where GPU financings get hurt.</b>
                  <div className="tiles">
                    <div className="tile">
                      <b>
                        <span className="n">A</span>No firm demand
                      </b>
                      <span className="d">
                        Spot pricing or soft commitments.
                      </span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">B</span>Counterparty credit
                      </b>
                      <span className="d">
                        Defaults on long-term obligations.
                      </span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">C</span>Concentration
                      </b>
                      <span className="d">By client or sector.</span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">D</span>Supply
                      </b>
                      <span className="d">Servers late or overpriced.</span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">E</span>Site and consent
                      </b>
                      <span className="d">
                        Power, cooling, or local approval not ready.
                      </span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">F</span>Build and operations
                      </b>
                      <span className="d">
                        Outages, service credits, early exit.
                      </span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">G</span>Obsolescence
                      </b>
                      <span className="d">
                        New GPU gen lowers rental rates &amp; resale value.
                      </span>
                    </div>
                    <div className="tile">
                      <b>
                        <span className="n">H</span>The cycle
                      </b>
                      <span className="d">
                        AI spending pulls back before the loan is repaid.
                      </span>
                    </div>
                  </div>
                </li>
              </ol>
            </article>
            <article className="quad">
              <h2>
                <span className="num">05</span>Long term: come out on top in a
                market-wide downturn
              </h2>
              <ol className="proof">
                <li>
                  <b>Dot-com era blueprint:</b> Big names like Exodus and Cable
                  &amp; Wireless collapsed; well-run upstart Savvis bought them
                  for pennies. GI Partners built Digital Realty from 21
                  distressed data centers.
                </li>
                <li>
                  <b>Plan for the crash.</b> Today, downside is capped by
                  scarcity. Future correlated defaults may create GPU
                  liquidation glut.
                </li>
                <li>
                  <b>
                    Whether in 6 months or 6 years, be ready to profit on the
                    dip.
                  </b>{" "}
                  Winners have structure &amp; partners to extract value when
                  everyone else sells.
                </li>
              </ol>
            </article>
          </div>
        </div>
        <article className="quad pol">
          <div className="pg">
            <div className="pcol">
              <h2>New political risk: anti-data center public sentiment</h2>
              <div className="pst6">
                <div>
                  <b>75+ / $130B</b>projects blocked or delayed in Q1 2026 alone
                </div>
                <div>
                  <b>14 states</b>with statewide moratorium proposals
                </div>
                <div>
                  <b>12 of 34</b>new governors back bans / moratoriums; 32 / 34
                  for tighter rules
                </div>
                <div>
                  <b>44 of 45</b>counted local data center ballot measures
                  restricted them
                </div>
                <div>
                  <b>3 states</b>with active pauses
                  <br />
                  NY; Texas; Ohio (tax exemptions)
                </div>
                <div>
                  <b>New on-grid build</b>Biggest predictor of lender risk
                </div>
              </div>
            </div>
            <figure>
              <Image
                src="/cato-digital-financing/media/996bd661894a2790.webp"
                alt="Map of the United States shaded by the number of data center-related ballot measures by state, with Ohio darkest and hatching on Texas, Georgia, Ohio, Michigan and Wisconsin"
                width={900}
                height={600}
                unoptimized
              />
            </figure>
          </div>
        </article>
        <p className="foot fn">
          Sources:{" "}
          <a href="https://www.amcompute.com/gpu-financing-tracker">
            American Compute
          </a>
          ; <a href="https://datacenterwatch.org/q1-2026">Data Center Watch</a>;{" "}
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
        </p>
        <p className="foot">
          RampRate introduces lenders to Cato and other well qualified orgs. We
          do not represent either side, negotiate terms or place securities, and
          equity raises are out of scope, as we are not a broker dealer or
          investment bank. No compensation from the lender is requested or
          expected. CEO Tony Greenberg holds an interest in Cato. Confidential;
          not an offer or a commitment to lend.
        </p>
      </section>
      <section className="sheet" id="p1">
        <div className="head">
          <div className="brand">
            <Image
              src="/cato-digital-financing/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
              className="logo"
            />
            <div>
              <div className="kicker">
                Cato Digital · GPU equipment financing brief · Page 2
              </div>
              <h1>
                Cato as the right partner for the short, medium and long term
              </h1>
            </div>
          </div>
          <div className="side">
            Today, tomorrow,
            <br />
            mid-term and long term
          </div>
        </div>
        <div className="grid">
          <article className="quad">
            <h2>
              <span className="num">01</span>Today: a well-qualified,
              well-managed financing
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
                <b>Industry luminary CEO.</b> Dean Nelson founded the top tech
                industry org (Infrastructure Masons) and has run infrastructure
                at Sun, eBay, PayPal and Uber.
              </li>
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
            <Image
              src="/cato-digital-financing/media/9e2b8698b7d513e3.webp"
              alt="The five opportunities: 1 debt tranche 1, $13 to 20 million; 2 SAFE, $10 million; 3 debt tranche 2, $25 to 30 million; 4 credit line, $170 million; 5 $1 billion plus diversified real estate project, 2027"
              width={1400}
              height={298}
              unoptimized
              className="ladimg"
            />
            <p className="cap">
              This financing is the first of five opportunities.
            </p>
          </article>
          <article className="quad">
            <h2>
              <span className="num">02</span>Tomorrow: your guide to access,
              credibility &amp; insight for the whole market
            </h2>
            <div className="dean">
              <div>
                <Image
                  src="/cato-digital-financing/media/55ed247b260b3bfd.webp"
                  alt="Dean Nelson, CEO of Cato Digital"
                  width={240}
                  height={240}
                  unoptimized
                />
              </div>
              <div>
                <div className="nm">Dean Nelson</div>
                <div className="rl">
                  Founder and chairman, Infrastructure Masons · CEO, Cato
                </div>
                <p className="cs-41862172">
                  17 years at Sun, VP of Global Foundation Services at eBay;
                  head of Uber’s Metal team before founding the industry’s
                  standards community (iMasons).
                </p>
              </div>
            </div>
            <figure className="eco">
              <div className="art ecoart cs-086fc5b3">
                <Image
                  src="/cato-digital-financing/media/6203acb53a409b7d.webp"
                  alt="Diagram with Cato at the center, connected to four groups: innovators, equipment manufacturers, facilities operators and hyperscalers, with a lender’s seat at the edge"
                  width={1100}
                  height={642}
                  unoptimized
                />
                <div className="lb2 cs-94e7001c">Innovators</div>
                <div className="lb2 cs-ab78c1bf">Hyperscalers</div>
                <div className="lb2 cs-659a0776">
                  Equipment
                  <br />
                  manufacturers
                </div>
                <div className="lb2 cs-0033a1a4">Facilities operators</div>
                <div className="hub cs-bb9149dc">
                  <Image
                    src="/cato-digital-financing/media/b272d223b1c7abd7.webp"
                    alt="Cato"
                    width={272}
                    height={240}
                    unoptimized
                  />
                </div>
                <div className="lend cs-d9d8ab02">
                  <b>A lender’s seat</b>
                  <span>first look at deals</span>
                </div>
              </div>
            </figure>
            <div className="invh">Investors, Advisors, &amp; Allies</div>
            <div className="trio">
              <div className="pc">
                <Image
                  src="/cato-digital-financing/media/5f24d75e59e2d365.webp"
                  alt="Peter Gross"
                  width={200}
                  height={200}
                  unoptimized
                />
                <b>Peter Gross</b>Top Advisor / Investor in mission-critical
                systems
              </div>
              <div className="pc">
                <Image
                  src="/cato-digital-financing/media/1280ffd5368adc09.webp"
                  alt="Tony Greenberg"
                  width={200}
                  height={200}
                  unoptimized
                />
                <b>Tony Greenberg</b>Connector representing more than 400
                suppliers in IT infrastructure
              </div>
              <div className="pc">
                <Image
                  src="/cato-digital-financing/media/c3a920508a75c7ff.webp"
                  alt="George Rockett"
                  width={200}
                  height={200}
                  unoptimized
                />
                <b>George Rockett</b>Founder of DCD and Yotta, the industry’s
                premier convener for 25+ years
              </div>
            </div>
            <p>
              A lender doing business with Cato hears about the next deals
              first, vets them faster / better, and becomes part of the
              industry’s implicit reputation ecosystem.
            </p>
          </article>
          <article className="quad">
            <h2>
              <span className="num">03</span>Mid-term: Conscious Compute, the
              model the industry will need
            </h2>
            <p>
              Opposition to new data centers is rising &amp; moratorium bills
              are moving in 14 states. Operators will have to show low waste,
              small footprints and community integration. Cato already works
              this way.
            </p>
            <ul className="plain">
              <li className="ic">
                <Image
                  src="/cato-digital-financing/media/20232327fd53c8cb.webp"
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
                  src="/cato-digital-financing/media/3d86f3e1a6bc5edd.webp"
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
                  src="/cato-digital-financing/media/522235b4caad02cd.webp"
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
              <li className="ic">
                <Image
                  src="/cato-digital-financing/media/343a6609d4389955.webp"
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
                  src="/cato-digital-financing/media/421d391c70d3abf5.webp"
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
          </article>
          <article className="quad">
            <h2>
              <span className="num">04</span>Long term: building back better
              after an AI crash
            </h2>
            <p>
              If a market-wide downturn comes, Cato is the partner you want
              holding the servers that came back to you as collateral on failed
              loans.
            </p>
            <div className="l3x">
              <div className="art cs-d1cfa33b">
                <Image
                  src="/cato-digital-financing/media/0f7d1456cbc63b9d.webp"
                  alt="Circular graphic of three server lives: 01 frontier use by hyperscalers, 02 re-contract with Cato at lower rates, 03 parts and recycling"
                  width={720}
                  height={720}
                  unoptimized
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
              <div>
                <div className="lg">
                  <div>
                    <i className="cs-93483b3c"></i>
                    <span>
                      <b>Life 1 · frontier.</b> Hyperscalers run the newest GPUs
                      on the most intense workloads.
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
                <div className="fade"></div>
                <div className="fadel">
                  <span>Workload intensity steps down</span>
                  <span>The asset keeps earning</span>
                </div>
              </div>
            </div>
            <p className="cs-c3bdfaef">
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
          </article>
        </div>
        <div className="strip">
          <span className="lab">The bottom line</span>A financing you can
          underwrite today, a trusted entry into the rest of the industry, and a
          steward for the collateral if the cycle turns.
        </div>
        <p className="foot fn">
          Sources: Data Center Frontier;{" "}
          <a href="https://imasons.org">Infrastructure Masons</a>;{" "}
          <a href="https://datacenterwatch.org/q1-2026">Data Center Watch</a>.
          Confidential; not an offer or a commitment to lend.
        </p>
      </section>
      <section className="sheet" id="p2">
        <div className="head">
          <div className="brand">
            <Image
              src="/cato-digital-financing/media/b272d223b1c7abd7.webp"
              alt="Cato Digital"
              width={272}
              height={240}
              unoptimized
              className="logo"
            />
            <div>
              <div className="kicker">
                Cato Digital · GPU equipment financing brief · Page 3
              </div>
              <h1>
                The deal: tranche 1 in detail, then the four opportunities that
                follow
              </h1>
            </div>
          </div>
          <div className="side">
            Terms and
            <br />
            proof points
          </div>
        </div>
        <div className="grid">
          <article className="quad">
            <h2>
              <span className="num">01</span>The first opportunity: debt tranche
              1
            </h2>
            <div className="stat cs-15c21a9f">
              <div className="big">$3.6M</div>
              <p>
                <b>Bridge closing in the next two weeks.</b>
              </p>
            </div>
            <div className="stat cs-06615130">
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
                  <th className="r">At ~$621K each</th>
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
            <p className="cs-a7cc0fd8">
              <b>What the capital buys.</b> Servers, InfiniBand networking and
              site build-out for contracted customers. Customer prepayments of
              ~19% of contract value already fund the equity slice.
            </p>
            <p className="cap">
              Indicative sizing from management, subject to diligence. This is
              an opportunity, not a lender commitment.
            </p>
          </article>
          <article className="quad">
            <h2>
              <span className="num">02</span>What it buys, and how supply is
              secured
            </h2>
            <div className="kpis">
              <div className="kpi">
                <div className="big">$523–581K</div>
                <p>per 8-GPU air-cooled B300 server. Planning basis: $600K.</p>
              </div>
              <div className="kpi">
                <div className="big">$301–322K</div>
                <p>
                  annual revenue per server at{" "}
                  <span className="cs-08109acb">$4.29–4.59</span> per GPU-hour.
                </p>
              </div>
              <div className="kpi">
                <div className="big">~24 months</div>
                <p>to recover hardware cost, inside a 36-month contract.</p>
              </div>
            </div>
            <svg
              viewBox="0 0 560 176"
              role="img"
              aria-label="Timeline June to October 2026 of Cato payments to suppliers and customer payments to Cato"
            >
              <g fontSize="10" fill="#4A3F36">
                <text x="6" y="50" fontWeight="700" fill="#1C1410">
                  Cato pays
                </text>
                <text x="6" y="62">
                  suppliers
                </text>
                <text x="6" y="120" fontWeight="700" fill="#7E32D3">
                  Customers
                </text>
                <text x="6" y="132">
                  pay Cato
                </text>
              </g>
              <line
                x1="120"
                y1="56"
                x2="540"
                y2="56"
                stroke="#1C1410"
                strokeWidth="1.5"
              ></line>
              <line
                x1="120"
                y1="126"
                x2="540"
                y2="126"
                stroke="#7E32D3"
                strokeWidth="1.5"
              ></line>
              <circle cx="172" cy="56" r="5" fill="#1C1410"></circle>
              <circle cx="333" cy="56" r="5" fill="#1C1410"></circle>
              <circle cx="481" cy="56" r="5" fill="#1C1410"></circle>
              <circle
                cx="515"
                cy="56"
                r="4"
                fill="none"
                stroke="#1C1410"
                strokeWidth="1.5"
              ></circle>
              <g fontSize="10" textAnchor="middle" fill="#4A3F36">
                <text
                  x="172"
                  y="34"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $169K
                </text>
                <text x="172" y="45">
                  2 A100 systems
                </text>
                <text
                  x="333"
                  y="34"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $1.16M
                </text>
                <text x="333" y="45">
                  2 B300, paid in full
                </text>
              </g>
              <g fontSize="10" textAnchor="end" fill="#4A3F36">
                <text
                  x="489"
                  y="34"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $337K
                </text>
                <text x="489" y="45">
                  6 B300 deposit
                </text>
                <text
                  x="530"
                  y="76"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  PO $301K
                </text>
                <text x="530" y="87">
                  InfiniBand switches
                </text>
              </g>
              <circle cx="395" cy="126" r="5" fill="#7E32D3"></circle>
              <circle cx="421" cy="126" r="5" fill="#7E32D3"></circle>
              <circle cx="515" cy="126" r="5" fill="#7E32D3"></circle>
              <g fontSize="10" fill="#4A3F36">
                <text
                  x="399"
                  y="104"
                  textAnchor="end"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $375K
                </text>
                <text x="399" y="115" textAnchor="end">
                  Tinfoil prepay
                </text>
                <text
                  x="421"
                  y="146"
                  textAnchor="middle"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $367K
                </text>
                <text x="421" y="157" textAnchor="middle" fontSize="0">
                  {" "}
                </text>
                <text
                  x="519"
                  y="104"
                  textAnchor="end"
                  fontWeight="700"
                  fill="#1C1410"
                  fontSize="11"
                >
                  $1.44M
                </text>
                <text x="519" y="115" textAnchor="end">
                  GMI prepay
                </text>
              </g>
              <line x1="120" y1="158" x2="540" y2="158" stroke="#CFC6B6"></line>
              <g stroke="#8A7B6A">
                <line x1="130" y1="155" x2="130" y2="161"></line>
                <line x1="208" y1="155" x2="208" y2="161"></line>
                <line x1="289" y1="155" x2="289" y2="161"></line>
                <line x1="369" y1="155" x2="369" y2="161"></line>
                <line x1="447" y1="155" x2="447" y2="161"></line>
              </g>
              <g fontSize="9.5" fill="#4A3F36" textAnchor="middle">
                <text x="130" y="173">
                  Jun 1
                </text>
                <text x="208" y="173">
                  Jul 1
                </text>
                <text x="289" y="173">
                  Aug 1
                </text>
                <text x="369" y="173">
                  Sep 1
                </text>
                <text x="447" y="173">
                  Oct 1
                </text>
              </g>
            </svg>
            <p className="cap">
              2026 wires and ACH credits from the bank records. Hollow marker:
              purchase order only.
            </p>
            <p className="cs-9bd527f6">
              <b>Suppliers:</b> Sycomp (2 B300s bought and paid), Amaara
              Networks (6 B300s ordered with 10% deposit, 34 more on purchase
              orders), General Datatech (quote for 22), Sourceability, Velerity.
              Direct OEM lead times have stretched to 36 weeks, so Cato buys via
              channel partners on prepayment terms.
            </p>
          </article>
          <article className="quad">
            <h2>
              <span className="num">03</span>Committed revenue and pipeline
            </h2>
            <p className="cap cs-c4f8e6f4">
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
            <p className="cap cs-63dce17b">
              <b>Named pipeline: about $85M</b>, unsigned, roughly four times
              executed value.
            </p>
            <div
              className="seg pipe"
              role="img"
              aria-label="Named pipeline about 85 million dollars, unsigned"
            >
              <span>Five B300 prospects, not yet contracted</span>
            </div>
            <table className="t">
              <tbody>
                <tr>
                  <th>Customer</th>
                  <th>Servers</th>
                  <th className="cs-08109acb">$/GPU-hr</th>
                  <th>Prepay</th>
                  <th className="r">Status</th>
                </tr>
                <tr>
                  <td>GMI Cloud</td>
                  <td>16 B300</td>
                  <td>$4.29</td>
                  <td>19.4%</td>
                  <td className="r">
                    <span className="pill go">Signed</span>
                  </td>
                </tr>
                <tr>
                  <td>Tinfoil</td>
                  <td>2 + 4 B300</td>
                  <td className="cs-08109acb">$4.59, $4.49</td>
                  <td>19.4%</td>
                  <td className="r">
                    <span className="pill go">Signed</span>
                  </td>
                </tr>
                <tr>
                  <td>Milestone</td>
                  <td>2 A100</td>
                  <td>1-year term</td>
                  <td>none</td>
                  <td className="r">
                    <span className="pill go">Signed</span>
                  </td>
                </tr>
                <tr>
                  <td>Inworld, Cognichip, Ornn, Andromeda, Prime Intellect</td>
                  <td>32+ each (8 Cognichip)</td>
                  <td>$3.99–4.39</td>
                  <td>open</td>
                  <td className="r">
                    <span className="pill">Pipeline</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="cap cs-da6e6914">
              At full deployment the signed contracts bill about $571K a month.
              Cato has already delayed requests for 128+ servers as this round
              is completed.
            </p>
          </article>
          <article className="quad">
            <h2>
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
            <Image
              src="/cato-digital-financing/media/350e43fcf79d2224.webp"
              alt="Draw cycle in five steps: 1 contract signed, 2 prepayment received, 3 draw approved, 4 servers delivered, 5 customer pays and loan repays"
              width={1400}
              height={300}
              unoptimized
              className="ladimg"
            />
          </article>
          <article className="quad cs-a5cf4aec">
            <h2>
              <span className="num">05</span>The next four opportunities
            </h2>
            <div className="next4">
              <div>
                <span className="k">2 · Equity, in parallel</span>
                <div className="big">$10M SAFE</div>Parent-company SAFE
                alongside the debt round: $25M cap, 20% discount.
              </div>
              <div>
                <span className="k">3 · Debt tranche 2</span>
                <div className="big">$25–30M</div>The pipeline through the end
                of 2026, subject to client vetting.
              </div>
              <div>
                <span className="k">4 · Debt tranche 3</span>
                <div className="big">$170M</div>A credit line drawn over 2027,
                contract by contract as customers sign.
              </div>
              <div>
                <span className="k">5 · Larger program</span>
                <div className="big">$1B+</div>A diversified real estate project
                with world-class indoor sports training, hotel and conference
                center, briefed separately.
              </div>
            </div>
            <p className="cap">
              Indicative sizing from management, subject to diligence and client
              vetting. These are opportunities, not lender commitments.
            </p>
          </article>
        </div>
        <div className="strip">
          <span className="lab">The bottom line</span>Cato wants a long-term
          strategic finance partner and will adapt the structure to fit. The
          data room is open and ready for diligence, and discussions with
          lessors and specialty lenders are active.
        </div>
        <p className="foot fn">
          Sources: Cato data room; management updates. Confidential; not an
          offer or a commitment to lend.
        </p>
      </section>
    </div>
  );
}
