import type { FaqItem } from "@/components/biochain/PartnerFaqSection";

export const overviewCards = [
  {
    title: "What is this document?",
    body: "This FAQ explains the full spectrum of ways RampRate can engage with a manufacturing partner in its BioChain network, from a single vetted buyer introduction through developing anchor client relationships for a new entrant to full channel development and deal management, and how compensation is structured for each. It is meant to give a prospective partner's legal and commercial teams a clear, self-contained reference alongside the partnership agreement.",
  },
  {
    title: "What is RampRate's role in the BioChain network?",
    body: "RampRate holds a relationship map across manufacturers, compounders, clinics, and brands, and puts it to work as a sourcing and buyer network. It is a procurement and channel advisory firm, not a commodities broker: its value comes from vetting buyers and suppliers, running objective processes, and building the infrastructure that makes a channel work, not from simply passing a name across the table. Depending on what a partner needs, RampRate's involvement spans a wide spectrum: from a single vetted buyer introduction, through building pricing and sales infrastructure, to designing and operating entire distribution channels, such as employer/EAP benefit programs, capitated-healthcare channels, or technology- and device-distributed consumer channels, using RampRate's own data, relationships, and technology partnerships.",
  },
];

export const programs = [
  {
    num: "01",
    title:
      "Buyer Introductions - Standard Bilateral Referral Agreement (NOT a Reseller Agreement)",
    body: (
      <ul className="list-disc pl-5 space-y-2 marker:text-gold">
        <li>
          RampRate identifies a qualified buyer in its network that is ready
          to transact immediately.
        </li>
        <li>
          RampRate makes the buyer ready for the purchase, identifying
          realistic needs, constraints, and uncertainties; and building a
          decision scorecard that fairly accounts for quality and reliability
          rather than a race to the bottom on price with questionable
          suppliers.
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>
              These services are either paid for up front by the buyer, with
              the consulting fee rebated from supplier referral payments; or,
              in specific high-trust situations, collected directly from
              supplier payments, with the buyer owing us a cancellation fee if
              they don&rsquo;t transact.
            </li>
          </ul>
        </li>
        <li>
          RampRate executes a uniform referral agreement with all target
          suppliers so that no individual participant in the process is
          disadvantaged unfairly. Generally the rates for peptides are:
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>Retail / direct-to-consumer - 20%</li>
            <li>Wholesale - 5% - 7.5% depending on the deal scale and margin</li>
          </ul>
        </li>
        <li>
          RampRate operates a quote analysis process that helps clients make
          an objective decision based on all the different dimensions of
          value in addition to price and down-select to a few finalists.
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>
              At the time the finalists are selected, RampRate reviews
              referral fee parity as well - if a supplier is exempted (e.g.
              due to being an incumbent), RampRate ensures that the
              client&rsquo;s own unrebated consulting costs are included in
              the analysis so there is parity for all participants in the
              process.
            </li>
            <li>
              If this still does not create a level playing field for
              suppliers, RampRate will meet with them individually to adjust
              the referral fee percentage in full transparency.
            </li>
          </ul>
        </li>
        <li>
          Fees are generally paid only on receipt of actual revenue from
          clients - not introductions or signed contracts alone. If any
          acceleration is needed to refund the client&rsquo;s professional
          services fee up front, this will be disclosed at lead registration
          and applied uniformly to all participants.
        </li>
        <li>
          Terms are fully bilateral - suppliers can send us clients on the
          same terms as we send them leads.
        </li>
        <li>
          This is not a reseller agreement - we do not take inventory or
          payments; only make referrals.
        </li>
      </ul>
    ),
  },
  {
    num: "02",
    title:
      "Anchor Client Introductions - Early Stage Supplier Referral Agreement (Elevate Program)",
    body: (
      <ul className="list-disc pl-5 space-y-2 marker:text-gold">
        <li>
          Same as the standard referral agreement, but includes additional
          provisions to specifically help suppliers that have not yet
          established themselves in the target market or region
        </li>
        <li>
          In addition to regular referral fees, it includes the following
          provisions:
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>Conversion of referral fees to equity at our option</li>
            <li>
              Equity bonuses for generating more than 30% of the
              supplier&rsquo;s revenue
            </li>
            <li>
              Audit fees to validate initial claims if the market track
              record is particularly thin
            </li>
          </ul>
        </li>
        <li>
          In exchange for these provisions, we also typically provide some
          guidance on value proposition, target customer segments, and
          marketing materials based on our market knowledge &amp; experience.
        </li>
      </ul>
    ),
  },
  {
    num: "03",
    title: "Sales Advisory - Professional Services SOW (Advance Program)",
    body: (
      <ul className="list-disc pl-5 space-y-2 marker:text-gold">
        <li>
          These agreements are highly customized to each individual
          partner&rsquo;s needs. In our enterprise tech practice, for
          example, AT&amp;T and Verizon asked us to write their price books.
          Level 3 asked us to develop contract terms and service level
          guarantees. Microsoft asked us to vet their partnership strategies
          and help develop sales channels.
        </li>
        <li>
          <strong>Example:</strong> Channel Development &amp; Deal
          Management: Based on our initial discussions, this is where we
          believe an initial engagement will add the most value in this
          market: building out the channel and indirect-sales capability
          without cannibalizing existing direct relationships.
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>
              At the lighter end, this includes setting up pricing frameworks
              and sales calculators so the partner understands its own
              margins deal-by-deal, running an objective vendor-comparison
              process to help win business away from an underperforming
              incumbent, defining deal-qualification criteria to filter out
              unready leads, and coordinating operational work such as
              inventory or order-system integrations.
            </li>
            <li>
              At the deeper end, it extends to designing and standing up
              entire distribution channels on the partner&rsquo;s behalf, for
              example employer benefit/EAP programs, capitated-healthcare
              risk pools, or technology- and device-distributed consumer
              channels, bringing RampRate&rsquo;s own data, audience
              relationships, and technology partnerships into the
              arrangement rather than only its process.
            </li>
          </ul>
        </li>
        <li>
          Because these agreements are bespoke, pricing for them varies more
          broadly.
          <ul className="list-disc pl-5 mt-2 space-y-1.5 opacity-80">
            <li>
              Typical advisory agreements run for 3-12 months with a
              recurring monthly fee if the scope includes multiple areas of
              collaboration and evolves over time; or a flat project fee if
              the activities are more discrete and fixed (e.g. a research
              project).
            </li>
            <li>
              Additionally, milestone-based compensation (typically in
              equity) can apply for specific difficult tasks achieved on the
              client&rsquo;s behalf.
            </li>
            <li>
              Channel development fees can include a small overlay on the
              channel partner&rsquo;s revenue, to be discussed during the
              deal formalization; otherwise referral fees are the same as
              with the referral agreement structure.
            </li>
            <li>
              All advisory relationships include a social impact measurement
              phase - this is part of our alignment with our B Labs
              certification.
            </li>
          </ul>
        </li>
      </ul>
    ),
  },
];

const scorecardRows: [string, string, string][] = [
  [
    "Price vs. benchmark",
    "30%",
    "Competitive against market rates embedded in the Quote Form. Suppliers modestly above benchmark are not automatically disqualified — context matters.",
  ],
  [
    "Product coverage",
    "25%",
    "Ability to supply all four priority GLP-1 lines plus meaningful breadth across the regenerative and longevity catalogue.",
  ],
  [
    "Speed to first fulfilment",
    "20%",
    "Confirmed ability to dispatch by ______. This is a hard constraint for first-order selection.",
  ],
  [
    "Quality & compliance",
    "15%",
    "GMP or equivalent certification; batch-specific Certificate of Analysis; endotoxin and sterility testing; cold chain documentation. Quality claims must be verifiable.",
  ],
  [
    "Scale flexibility",
    "10%",
    "Volume tier pricing, acceptance of annual market rate review, MFN commitment, and willingness to extend payment terms as relationship matures.",
  ],
];

function Scorecard() {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 my-4">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="bg-dark text-warm-bg text-left font-mono text-[11px] uppercase px-3 py-3">
              Criterion
            </th>
            <th className="bg-dark text-warm-bg text-center font-mono text-[11px] uppercase px-3 py-3 w-[90px]">
              Weight
            </th>
            <th className="bg-dark text-warm-bg text-left font-mono text-[11px] uppercase px-3 py-3">
              What we look for
            </th>
          </tr>
        </thead>
        <tbody>
          {scorecardRows.map((row, i) => (
            <tr key={i} className="border-t border-black/10 align-top">
              <td className="px-3 py-3 font-semibold">{row[0]}</td>
              <td className="px-3 py-3 text-center">{row[1]}</td>
              <td className="px-3 py-3 text-ink-mid">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const faqSections: {
  id: string;
  kicker: string;
  title: string;
  dark: boolean;
  items: FaqItem[];
}[] = [
  {
    id: "section-1",
    kicker: "03 / FAQ",
    title: "RampRate's Sourcing Process: What It Is and How to Ace It",
    dark: false,
    items: [
      {
        q: "What is RampRate's typical role in sourcing health products?",
        searchText:
          "what is ramprate's typical role in sourcing health products buyer's agent",
        a: (
          <p>
            Think of us as the buyer&rsquo;s agent. RampRate works with the
            executive team and sourcing professionals at clinics, research
            facilities, and distributors to obtain the products they need to
            do their work. Our goal is not to maximize commissions or push
            any one supplier&rsquo;s product. It&rsquo;s to find the right
            fit between supplier and buyer; remove friction; and create
            enough efficiencies on both sides to justify our cut of the deal.
          </p>
        ),
      },
      {
        q: "What value does RampRate add to the buyer's sourcing process?",
        searchText:
          "what value does ramprate add to the buyer's sourcing process trust termination time cost reduction",
        a: (
          <>
            <p>
              Only time buys trust. RampRate&rsquo;s business is predicated
              on building long-term, trusted relationships with buyers of
              health products. This means that we prioritize our success
              metrics in the following order:
            </p>
            <ul className="list-disc">
              <li>
                99% reduction in risk of early termination. Across 25+ years
                and billions in spend managed, RampRate&rsquo;s early
                termination rate is &lt;1%, compared to an industry-wide
                failure rate in excess of 50%.
                <ul className="list-disc">
                  <li>
                    We ensure clients prioritize quality and reliability over
                    price in their evaluation by surfacing the full cost of
                    supply chain failures
                  </li>
                  <li>
                    We do deep due diligence on suppliers to ensure that they
                    are capable of delivering on their promises, including
                    product testing review, reference checks, etc.
                  </li>
                  <li>
                    We build contracts that adapt instead of collapsing if
                    client needs change or suppliers fail to deliver on their
                    commitments the first time around.
                  </li>
                </ul>
              </li>
              <li>
                80% faster time to building a supply relationship. This is a
                core source of efficiency. We dramatically reduce the time
                that suppliers spend on sales and buyers spend on finding a
                match.
                <ul className="list-disc">
                  <li>
                    Our process is quantitative and tracks across multiple
                    transactions so that you never have to write a long
                    bespoke RFP response, but only update your profile and
                    deal pricing.
                  </li>
                  <li>Our pre-built price targets reduce negotiation cycles.</li>
                  <li>
                    Our coordination of information and decision making means
                    less pursuit time and faster closing.
                  </li>
                  <li>
                    The referral fee is effectively an offset against that
                    reduction in time &amp; complexity.
                  </li>
                </ul>
              </li>
              <li>
                All-in cost reduction. This is never based on just the
                nominal cost, but weighted against risk, time, and quality.
                That said, we expect suppliers to provide their best price
                first time out, and will provide specific guidance on the
                expected price levels in every deal to ensure you know what
                it takes to win a deal.
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "What's in it for us, especially if you're explicitly pursuing cost reductions for clients?",
        searchText:
          "what's in it for us cost reductions clients sales cost pursuit market intelligence marketing spend",
        a: (
          <>
            <p>
              First, we&rsquo;re also reducing your sales cost of pursuit,
              negotiations, and account servicing.
            </p>
            <ul className="list-disc">
              <li>
                You never get tire kicking or general information pursuits.
                If you hear from us, someone is buying
              </li>
              <li>
                Instead of prospecting, you get pre-qualified inbound leads
                in your inbox to accept or reject
              </li>
              <li>
                Instead of a salesperson, we only need a sales engineer or
                channel manager to close a deal
              </li>
              <li>
                Instead of long RFP responses, you fill out and periodically
                update a profile
              </li>
              <li>
                Instead of visiting prospects where you&rsquo;re one of 10
                options, we only ask you to make an appearance once
                you&rsquo;re one of 1-3 finalists in a deal
              </li>
              <li>
                We even pre-recommend financial and contract terms needed to
                close a deal. All you have to do is say &ldquo;yes&rdquo; and
                we will make the deal happen
              </li>
              <li>
                We prevent buyers from wasting your time with unreasonable or
                unclear demands. If you get a request from us, it&rsquo;s a
                specific target or contract redline that&rsquo;s supported by
                market practices.
              </li>
              <li>
                We stay with the deal for its entire lifecycle to help solve
                issues before they snowball.
              </li>
            </ul>
            <p>
              Second, we provide real-time market intelligence. In addition
              to having specific targets based on actual competitive offers,
              not poker-playing, each deal is closed out with detailed
              supplier feedback on how you performed across each dimension of
              evaluation, so you understand where you&rsquo;re ahead of the
              curve and where more work is needed (Sales Advisory projects
              can then fill in the gaps as to how to repair these
              disadvantages).
            </p>
            <p>
              Third, we&rsquo;re replacing marketing spend. Normally you have
              to perform well, then get the client&rsquo;s permission to
              write a case study; then spend to have that case study seen in
              the world. We serve as the reputation layer for the industry to
              shortcut that cycle - do well for your clients and the market
              will know through our supplier index.
            </p>
          </>
        ),
      },
      {
        q: "How does RampRate recommend suppliers to its clients?",
        searchText:
          "how does ramprate recommend suppliers to its clients objective quantitative transparent scorecard",
        a: (
          <>
            <p>
              Our recommendations are 100% objective, quantitative, and
              transparent. This is what allows us to be paid by both sides in
              a transaction without loss of trust. Each customer has its own
              selection criteria. Our job is to translate those criteria into
              quantifiable metrics and assess supplier performance against
              them on a level playing field. Here is an example scorecard
              used in a mid-size recent deal.
            </p>
            <Scorecard />
          </>
        ),
      },
      {
        q: "How important is price to the final decision?",
        searchText:
          "how important is price to the final decision surprisingly little",
        a: (
          <p>
            Surprisingly little. Our aggregate across tech and health deals
            for the last 20 years is 20% price, 19% reliability of services
            provided, 13% scalability, 11% contract terms; 11% fit to client
            needs; 11% supplier scale &amp; stability; 8% breadth of
            offerings; and 7% sustainability and experience in client&rsquo;s
            vertical.
          </p>
        ),
      },
      {
        q: "What if I can't meet a price target? Should I walk away / no-bid?",
        searchText:
          "what if i can't meet a price target should i walk away no-bid",
        a: (
          <p>
            Our evaluations are holistic and in some cases, price targets can
            be adjusted. The suppliers that set the standard for price may
            fail other due diligence, and no-bidding would lose a valuable
            opportunity. If something feels impossible tell us why and maybe
            we&rsquo;ll uncover an error or misstatement by competitors who
            did promise it.
          </p>
        ),
      },
      {
        q: "What if our unique value is not represented in the scorecard variables?",
        searchText:
          "what if our unique value is not represented in the scorecard variables",
        a: (
          <p>
            We are always happy to learn more about new dimensions of value
            to clients. If you believe that our RFPs do not reflect your
            areas of strength and unique differentiation, let us know what we
            should have asked; and we&rsquo;ll ensure that future processes
            include this additional detail. This is not a guarantee that
            clients will value these dimensions, but we strive to be as
            comprehensive as possible in giving them the option to say
            &ldquo;yes, this is actually useful.&rdquo;
          </p>
        ),
      },
      {
        q: "How are RampRate's sourcing services compensated?",
        searchText:
          "how are ramprate's sourcing services compensated project fee referral fee",
        a: (
          <>
            <p>
              RampRate is paid by both sides in a way that optimally supports
              objectivity and balance between all the parties to a
              transaction:
            </p>
            <ul className="list-disc">
              <li>
                A buyer pays us a professional services fee (project fee) to
                run the sourcing process
                <ul className="list-disc">
                  <li>
                    If there is an existing spend baseline, that project fee
                    can be reduced by substituting a performance-based
                    success fee tied to reducing costs or improving
                    performance
                  </li>
                </ul>
              </li>
              <li>
                A supplier pays us a uniform referral fee if and only if it
                earns revenue through our process. We don&rsquo;t charge for
                intros or access to RFPs or even signed contracts, only real
                receipt of funds.
                <ul className="list-disc">
                  <li>
                    These referral fees are shared with the client to rebate
                    their project fee
                  </li>
                </ul>
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "How do you prevent supplier referral fees from affecting your objectivity?",
        searchText:
          "how do you prevent supplier referral fees from affecting your objectivity guardrails exclusive agent",
        a: (
          <>
            <p>There are multiple guardrails across several categories:</p>
            <ul className="list-disc">
              <li>
                Client deal structure
                <ul className="list-disc">
                  <li>
                    Referral fees from suppliers are always disclosed to
                    buyers.
                  </li>
                  <li>
                    In a standard agreement, we are appointed as an exclusive
                    agent of the buyer (this is different than exclusivity
                    with a supplier, which we don&rsquo;t do), and all
                    suppliers must operate within the process, including
                    incumbents. No one gets to cut the line and go directly
                    to the client.
                  </li>
                  <li>
                    In addition to the contractual commitment, there are
                    financial client incentives for not allowing anyone to
                    circumvent this exclusivity and our sourcing process.
                    <ul className="list-disc">
                      <li>
                        Most of the time, this is a project fee is paid up
                        front by the client, which is then rebated after
                        receipt of referral fees.
                      </li>
                      <li>
                        Sometimes, a cancellation fee applies instead if they
                        don&rsquo;t source through our process.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Where the client has an existing spend baseline, we
                    typically propose a savings fee that is higher than any
                    supplier&rsquo;s referral fee (typically 25% of savings
                    achieved vs. baseline).
                    <ul className="list-disc">
                      <li>
                        This means that regardless of the fee percentage,
                        buyers can be confident that a dollar retained by the
                        client is more profitable than a dollar sent to any
                        specific supplier.
                      </li>
                      <li>
                        However, since these fees are only paid if the
                        relationship lasts, there is an incentive to ensure
                        quality and service levels along with low prices.
                      </li>
                    </ul>
                  </li>
                  <li>
                    If they still have concerns about objectivity, all
                    clients have the option to block supplier referral fees
                    completely by paying an additional professional services
                    project fee.
                  </li>
                </ul>
              </li>
              <li>
                Supplier fee contractual terms
                <ul className="list-disc">
                  <li>Supplier fees are uniform within a category</li>
                  <li>Supplier fees are fully transparent to the client</li>
                  <li>
                    If a supplier doesn&rsquo;t pay a referral fee, the client
                    pays more, and this difference is reflected in the quote
                    analysis financial terms.
                  </li>
                </ul>
              </li>
              <li>
                Delivery team evaluation &amp; incentives
                <ul className="list-disc">
                  <li>
                    The sourcing analysis team is evaluated on objectivity
                    and customer satisfaction, not supplier referral fee
                    revenue.
                  </li>
                  <li>
                    The sourcing delivery team receives no commissions or
                    bonuses based on supplier fees received.
                  </li>
                </ul>
              </li>
              <li>
                Deal fairness exec oversight
                <ul className="list-disc">
                  <li>
                    After downselection to finalists, the RampRate executive
                    team reviews any discrepancies in supplier referral fees.
                    If anyone is unfairly disadvantaged, they can override the
                    fee structure.
                  </li>
                  <li>
                    For example, in some past tech deals, incumbent suppliers
                    did not pay referral fees and client project fees were
                    not enough to offset the difference. To level the playing
                    field, RampRate reduced its referral fees for other
                    participants to exactly equal the un-rebated client
                    project fee.
                  </li>
                </ul>
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "Why don't you just charge the buyer and we'll reduce our prices by the amount of the referral fee?",
        searchText:
          "why don't you just charge the buyer and we'll reduce our prices by the amount of the referral fee budget",
        a: (
          <p>
            Some buyers choose to do exactly that - raise our project fees
            and block us from collecting referral fees. Most do not.
            Here&rsquo;s why: a sourcing advisory professional service is not
            something that they have a budget line item for. The products or
            services we&rsquo;re sourcing, on the other hand, are already
            budgeted for. So by not charging a large amount up front, but
            taking savings fees for cost reduction or supplier referral fees
            that offset the initial professional services investment,
            we&rsquo;re helping the buyer present more reasonable budgets to
            their management, exec team, or board.
          </p>
        ),
      },
      {
        q: "How do we know you're actually authorized to represent a client?",
        searchText:
          "how do we know you're actually authorized to represent a client letter of agency",
        a: (
          <p>
            Clients typically sign a letter of agency authorizing us to act
            on their behalf and share their requirements. If you want to
            confirm a specific engagement is real before sharing pricing or
            committing time, ask us for that authorization letter (it will
            usually be provided at lead registration or during the RFQ
            process).
          </p>
        ),
      },
      {
        q: "Will the client's team talk to us directly, or does everything route through you?",
        searchText:
          "will the client's team talk to us directly or does everything route through you gatekeeper",
        a: (
          <p>
            During the initial sourcing process we&rsquo;re paid to be a
            gatekeeper that keeps our clients in their zone of genius while
            we handle the initial filtering. Once we get to the finalist
            stage, contact begins in a controlled environment, with direct
            meetings we mediate to hash out final terms and relationship
            dynamics. Once the contract is signed, the relationship is fully
            turned over to the client, and our role becomes secondary for
            tasks like troubleshooting, dispute mediation, verification of
            commitments, etc.
          </p>
        ),
      },
      {
        q: "Can you just take some inventory and resell it?",
        searchText:
          "can you just take some inventory and resell it legal obligations objectivity",
        a: (
          <p>
            Generally speaking we avoid this due to the legal obligations
            involved in holding inventory of these products; lack of
            physical facilities appropriate for material inventory
            quantities; and objectivity concerns. We don&rsquo;t want our
            guidance to the client be based on sunk costs, but only on what
            the right fit for them is.
          </p>
        ),
      },
    ],
  },
  {
    id: "section-2",
    kicker: "04 / FAQ",
    title: "Core Referral Terms",
    dark: true,
    items: [
      {
        q: "How does lead registration work?",
        searchText:
          "how does lead registration work opportunity registration document accept reject",
        a: (
          <p>
            We send you an opportunity registration document (typically
            e-mail, though we can discuss directly interacting with your
            CRM) that names the client and overviews the opportunity. You
            have 1-2 weeks to accept or reject it. You do not need to give us
            a reason for rejection; however, if you reject a lead and we
            find that you have sold something to that client subsequently,
            you will need to demonstrate to us that you had a prior
            relationship with that client to avoid this sale being
            considered a circumvention of our agreement.
          </p>
        ),
      },
      {
        q: "What if you try to register a client or a prospect I'm already pursuing?",
        searchText:
          "what if you try to register a client or a prospect i'm already pursuing pre-existing relationship non-circumvention",
        a: (
          <p>
            You can reject the lead, and as long as that pre-existing
            relationship is demonstrated, the non-circumvention provisions
            will not trigger. However, you may not be included in the
            specific opportunities we&rsquo;re sourcing for as an exclusive
            client representative, since the clients rely on supplier
            referral fees to offset their up-front investment in our
            professional services.
          </p>
        ),
      },
      {
        q: "Why do you register corporate parents when sourcing for a division or subsidiary?",
        searchText:
          "why do you register corporate parents when sourcing for a division or subsidiary good deals spread",
        a: (
          <p>
            Good deals spread. Typically we build contracts that our clients
            are proud of and share up the reporting chain. It&rsquo;s not
            uncommon for a deal we did with a small division of Sony,
            Microsoft, or Hearst to become corporate-wide ones in a couple of
            years. The same will inevitably apply to health products.
          </p>
        ),
      },
      {
        q: "How long does a fee obligation last once a Deal is registered?",
        searchText:
          "how long does a fee obligation last once a deal is registered 5 years",
        a: (
          <p>
            5 years from the date of the first transaction if a deal is
            managed by RampRate, including any follow-on orders / renewals
            not in the initial RFP scope. If no referred transaction or
            active conversation with a prospect happens for 1 year, the lead
            expires.
          </p>
        ),
      },
      {
        q: "What transactions do you get paid on?",
        searchText:
          "what transactions do you get paid on registered buyer supplier",
        a: (
          <p>
            We get paid on all the transactions between a registered buyer
            and supplier during the term of the registration. This includes
            initial orders, subsequent orders, products, services, renewals,
            expansions, extensions, etc. If revenue comes in from a client
            that&rsquo;s registered, we get paid.
          </p>
        ),
      },
      {
        q: "What can and cannot be excluded from a referral fee?",
        searchText:
          "what can and cannot be excluded from a referral fee passthrough costs shipping taxes",
        a: (
          <p>
            We can exclude only direct passthrough costs that go to third
            parties and you don&rsquo;t charge a markup (e.g. shipping fees
            can be excluded; but internal handling costs are not). We do not
            exclude payment processing fees, your amortized costs of tech,
            staff, or distribution. Taxes are excluded if you charge sales
            tax on behalf of the consumer; not your own payroll or income
            taxes.
          </p>
        ),
      },
      {
        q: "What if parts of my offerings don't support the top-line referral fee percentage we agreed on?",
        searchText:
          "what if parts of my offerings don't support the top-line referral fee percentage we agreed on multiple services",
        a: (
          <p>
            Our agreements generally have room for multiple services
            compensated at different percentages. For instance, retail sales
            can be compensated at 20% due to their higher margins, while
            wholesale ones are compensated at 5%-7.5%. We prefer to negotiate
            these up front, but can amend an existing agreement where needed.
          </p>
        ),
      },
    ],
  },
  {
    id: "section-3",
    kicker: "05 / FAQ",
    title: "Early Stage Startup / Elevate Referral Terms",
    dark: false,
    items: [
      {
        q: "For earlier-stage partners, can referral fees be paid in equity instead of cash?",
        searchText:
          "for earlier-stage partners can referral fees be paid in equity instead of cash unilateral bilateral",
        a: (
          <>
            <p>
              Our standard bilateral agreement, the one we use with
              established suppliers, pays referral fees in cash only. The
              unilateral version we use with earlier-stage partners builds in
              optionality: when a fee comes due, we can take it in cash, take
              it in equity, or defer the decision and revisit later.
            </p>
            <p>
              This isn&rsquo;t something we ask for by default &mdash; it
              shows up specifically where RampRate is helping a company land
              its first anchor clients rather than adding incremental volume
              to an already-established book of business.
            </p>
          </>
        ),
      },
      {
        q: "How is the equity valued if you elect that option?",
        searchText:
          "how is the equity valued if you elect that option valuation signing payable",
        a: (
          <p>
            We use whichever is lower: the company&rsquo;s valuation at
            signing, or its valuation at the time the fee becomes payable.
            That protects us if a funding round happens in between and
            pushes the price up &mdash; it doesn&rsquo;t run the other way,
            so a lower valuation at payout is the number that applies.
            There&rsquo;s also a hard cap on how much of the company&rsquo;s
            total equity we can end up holding through this mechanism
            combined with the bonus provision below.
          </p>
        ),
      },
      {
        q: 'What’s the "bonus equity" provision about?',
        searchText:
          "what's the bonus equity provision about revenue share anchor",
        a: (
          <p>
            About a year in, if RampRate turns out to be responsible for a
            meaningful share of the company&rsquo;s total revenue,
            we&rsquo;re entitled to an additional bonus equity allocation on
            top of whatever we&rsquo;ve already earned in ordinary referral
            fees. It&rsquo;s meant to recognize the difference between being
            one of several lead sources and being the reason a company got
            its footing. It only applies at that scale, and only in the
            unilateral form &mdash; never in the standard bilateral
            agreement.
          </p>
        ),
      },
    ],
  },
  {
    id: "section-4",
    kicker: "06 / FAQ",
    title: "You Can Send Us Leads Too",
    dark: true,
    items: [
      {
        q: "Why would I want to send you leads?",
        searchText:
          "why would i want to send you leads dead lead fair shake rapport",
        a: (
          <>
            <p>Three main reasons:</p>
            <ul className="list-disc">
              <li>
                You have a dead lead. For example because the products they
                need are not ones you are currently providing; or because you
                don&rsquo;t operate in the right geographic region. Sending
                the opportunity to us enables you to still make money from
                this lead.
              </li>
              <li>
                You can&rsquo;t get a fair shake in a deal. For example, a
                large incumbent seems to be entrenched and your proposals are
                only used for leverage even though you have a better
                product. Engaging RampRate forces the buyer to be more
                objective and operate less on the basis of &ldquo;no one gets
                fired for buying IBM&rdquo;
              </li>
              <li>
                You want to build a better rapport with the client. What
                better way to prove that you&rsquo;re not just a replaceable
                vendor but a long-term partner than by solving their other
                sourcing needs where you&rsquo;re not competing for
                business?
              </li>
            </ul>
          </>
        ),
      },
      {
        q: "How much do you pay us?",
        searchText: "how much do you pay us same as your own referral fee 7.5%",
        a: (
          <p>
            Same as your own referral fee for professional services -
            typically 7.5% of cash compensation.
          </p>
        ),
      },
      {
        q: "Should I be worried about you messing with my existing deals and margin?",
        searchText:
          "should i be worried about you messing with my existing deals and margin exclusions list",
        a: (
          <>
            <p>
              Not if you are the ones that refer us into that client. If you
              bring us into a client relationship, you get to decide whether
              or not we help source the categories where you compete (e.g.
              if you can&rsquo;t get a fair shake); or you want us to stay
              away and only pitch the categories / regions where you&rsquo;re
              not present today. We will not negotiate your deal on behalf of
              the client unless you authorize us to.
            </p>
            <p>
              If we come across your clients on our own, though, everything
              is fair game. We will not accept an exclusions list where
              we&rsquo;re not allowed to provide services to your clients or
              lead them to other suppliers except where you are the entity
              that introduced us to that client.
            </p>
          </>
        ),
      },
      {
        q: "What's the paperwork needed?",
        searchText:
          "what's the paperwork needed bilateral custom agreements parallel agreement",
        a: (
          <p>
            Many of our agreements for established suppliers are fully
            bilateral at signing. Earlier stage partners and advisory clients
            may have more custom agreements (e.g. with equity conversion and
            incentive packages) that are not bilateral, but we are happy to
            execute a parallel agreement for sending leads to us.
          </p>
        ),
      },
    ],
  },
  {
    id: "section-5",
    kicker: "07 / FAQ",
    title: "Overarching Agreement Structure Beyond the Core Referral Terms",
    dark: false,
    items: [
      {
        q: "What happens to fees if RampRate's partnership with the manufacturer ends?",
        searchText:
          "what happens to fees if ramprate's partnership with the manufacturer ends continue regardless 5-year term",
        a: (
          <p>
            They continue regardless. Fees on registered Buyer Introductions,
            and on revenue generated through Channel Development &amp; Deal
            Management work, run for the full 5-year term from the date each
            was registered or generated, whether or not the broader
            partnership between RampRate and the manufacturing partner is
            still in place. In short, we don&rsquo;t want short-sighted ideas
            about terminating our agreement to save on referral fees.
          </p>
        ),
      },
      {
        q: "What payment schedule will you accept for referral fees?",
        searchText:
          "what payment schedule will you accept for referral fees monthly quarterly annual",
        a: (
          <p>
            Monthly in arrears, 30 days after we receive payment from the
            customer, is standard. Quarterly works if needed for
            administrative or deal size reasons. Annual is fine if an
            estimated amount is paid up front and reconciled over the year.
          </p>
        ),
      },
      {
        q: "Do we have to route every reorder through you, or can the client order directly from us afterward?",
        searchText:
          "do we have to route every reorder through you or can the client order directly from us afterward direct is fine",
        a: (
          <p>
            Direct is fine &mdash; the goal is simply to get you and the
            client connected, not to sit in the middle of every transaction.
          </p>
        ),
      },
      {
        q: "How are payments verified — does either side get audit rights?",
        searchText:
          "how are payments verified does either side get audit rights written breakdown",
        a: (
          <p>
            Every payment comes with a written breakdown of the qualifying
            revenue behind it. If something looks off, we can request
            supporting records. Audit rights are present, but rarely if ever
            invoked.
          </p>
        ),
      },
      {
        q: "What should a partner know about general legal terms?",
        searchText:
          "what should a partner know about general legal terms confidentiality exclusivity non-disparagement liability indemnification",
        a: (
          <>
            <p>
              RampRate is generally flexible on legal terms, with the
              following exceptions:
            </p>
            <ul className="list-disc">
              <li>
                Any confidentiality restrictions cannot block us from
                disclosing the referral arrangement to buyers. We need to be
                able to tell them you&rsquo;re paying us and how much
                you&rsquo;re paying us to maintain our reputation.
              </li>
              <li>
                We will not accept any form of exclusivity or non-compete in
                a referral agreement. Our services to buyers rely on creating
                a competitive bidding process among multiple partners.
              </li>
              <li>
                We will not accept any non-disparagement clauses that fall
                short of the legal standard for libel (i.e. untrue, known to
                us to be untrue and not just an honest error or
                misinformation, etc.) This is because our responsibility to
                our buyer clients is to deliver full unvarnished facts about
                all suppliers. If one of your past clients alleges
                wrongdoing, we need to report it. If a news story is
                negative, we need to relay that. You can dispute the veracity
                of these reports and we&rsquo;ll be happy to make your side
                of the story heard. You can&rsquo;t sue us for merely
                reporting.
              </li>
              <li>
                We will not accept uncapped liability (a year&rsquo;s worth
                of fees is typically reasonable).
              </li>
              <li>
                Generally we don&rsquo;t have much indemnification language.
                If needed, it should only cover against third-party claims
                arising from the indemnifying party&rsquo;s own gross
                negligence, willful misconduct, or intentional
                misrepresentation of your prices or services &mdash; not
                ordinary disputes between us.
              </li>
              <li>
                Any custom protections a partner requests need to be mutual,
                not one-sided.
              </li>
            </ul>
            <p>
              Everything else is open to discussion once the accompanying
              agreement is under review.
            </p>
          </>
        ),
      },
      {
        q: "What are the confidentiality guidelines this is governed by?",
        searchText:
          "what are the confidentiality guidelines this is governed by mini-nda supplier price index",
        a: (
          <p>
            There is a mini-NDA embedded in our agreements or we can execute
            a separate one. We also execute one with our clients. Your quotes
            and offers are governed by these protections. However, unless you
            opt out explicitly, we reserve the right to anonymize your offer
            details in our supplier and price index.
          </p>
        ),
      },
      {
        q: "Why would I allow my pricing and offer terms to be in your index?",
        searchText:
          "why would i allow my pricing and offer terms to be in your index opt out",
        a: (
          <p>
            You have the right to opt out at any time. We recommend not
            opting out, as the index can indicate to a buyer who is skeptical
            that better options exist that they should evaluate new options.
            If they believe that no one can sell them a product below $X, but
            you just did so for one of their peers, it&rsquo;s better for us
            to be able to share the fact that their pricing is not in fact
            best in class.
          </p>
        ),
      },
      {
        q: "Who should a prospective partner's legal team contact with questions?",
        searchText:
          "who should a prospective partner's legal team contact with questions tony greenberg alex veytsel rob holmes",
        a: (
          <p>
            Tony Greenberg (Founder/CEO), Alex Veytsel (CSO), and Rob Holmes
            (BD lead). Direct any questions on these terms to them before
            signing.
          </p>
        ),
      },
    ],
  },
];
