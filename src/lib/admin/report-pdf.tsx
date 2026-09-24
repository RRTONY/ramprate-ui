import { renderToBuffer } from "@react-pdf/renderer";
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { RAMPRATE_LOGO_DATA_URI } from "@/lib/admin/report-assets";

// RampRate brand palette - fixed, do not substitute other colors here.
// Matches scripts/report-template/report-template.html (the local/manual
// equivalent of this same report - keep the two in step) and the site's actual CSS variables.
const COLORS = {
  dark: "#0a0f1a",
  gold: "#d4a843",
  warmBg: "#f5f0e8",
  textDark: "#2a1f14",
  textMid: "#6b5e52",
  border: "#e5ded2",
};

// @react-pdf/renderer can't apply CSS filters (no way to invert the logo's
// colors for a dark background the way Logo.tsx does with brightness-0
// invert), so the cover carries the logo inside a plain white card instead
// of trying to recolor the source PNG.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLORS.textDark,
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 50,
  },
  cover: {
    backgroundColor: COLORS.dark,
    padding: 0,
  },
  coverInner: {
    position: "absolute",
    top: "45%",
    left: 68,
    right: 68,
  },
  logoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginBottom: 36,
  },
  logo: {
    width: 140,
    height: undefined,
  },
  eyebrow: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 20,
  },
  coverTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 14,
    lineHeight: 1.25,
  },
  coverSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  coverDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    marginTop: 30,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 700,
    color: COLORS.dark,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
    paddingBottom: 4,
    marginBottom: 10,
  },
  paragraph: {
    lineHeight: 1.5,
    marginBottom: 8,
  },
  callout: {
    backgroundColor: COLORS.warmBg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.gold,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  table: {
    marginBottom: 10,
    borderTopWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 5,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: COLORS.gold,
    paddingBottom: 5,
    marginBottom: 2,
  },
  tableCell: {
    flex: 1,
    fontSize: 9.5,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9.5,
    fontWeight: 700,
    color: COLORS.dark,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  footerLogo: {
    width: 42,
    height: undefined,
    marginRight: 6,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.textMid,
  },
  footerTitle: {
    flex: 1,
    fontSize: 8,
    color: COLORS.textMid,
  },
  footerPage: {
    fontSize: 8,
    color: COLORS.textMid,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  listMarker: {
    width: 16,
    color: COLORS.gold,
    fontWeight: 700,
  },
  listText: {
    flex: 1,
    lineHeight: 1.45,
  },
  infoLabel: {
    width: 120,
    fontSize: 9.5,
    fontWeight: 700,
    color: COLORS.dark,
  },
  tocRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tocNumber: {
    width: 22,
    color: COLORS.gold,
    fontWeight: 700,
  },
});

export interface ReportTableData {
  headers: string[];
  rows: string[][];
}

export interface ReportSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  callout?: string;
  table?: ReportTableData;
}

export interface ReportDocumentInfo {
  version?: string;
  owner?: string;
  audience?: string;
  purpose?: string;
  classification?: string;
}

export interface ReportInput {
  title: string;
  subtitle: string;
  date: string;
  sections: ReportSection[];
  // Cover label above the title, e.g. "Internal Guide". Default "RampRate Report".
  eyebrow?: string;
  // Footer credit. Default "RampRate Web Team".
  preparedBy?: string;
  // When given, adds a Document information + Contents page after the cover.
  documentInfo?: ReportDocumentInfo;
}

const INFO_LABELS: Array<[keyof ReportDocumentInfo, string]> = [
  ["version", "Version"],
  ["owner", "Owner"],
  ["audience", "Audience"],
  ["purpose", "Purpose"],
  ["classification", "Classification"],
];

function Table({ data }: { data: ReportTableData }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        {data.headers.map((h, i) => (
          <Text key={i} style={styles.tableHeaderCell}>
            {h}
          </Text>
        ))}
      </View>
      {data.rows.map((row, ri) => (
        <View key={ri} style={styles.tableRow} wrap={false}>
          {row.map((cell, ci) => (
            <Text key={ci} style={styles.tableCell}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function List({ items, numbered }: { items: string[]; numbered: boolean }) {
  return (
    // Short lists stay together on one page; long ones may flow.
    <View style={{ marginBottom: 8 }} wrap={items.length > 8}>
      {items.map((item, i) => (
        <View key={i} style={styles.listItem} wrap={false}>
          <Text style={styles.listMarker}>
            {numbered ? `${i + 1}.` : "\u2022"}
          </Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// Repeats on every page after the cover: logo, title, date + credit, and
// "Page X of Y" (the cover counts as page 1, matching the HTML template).
function Footer({
  title,
  date,
  preparedBy,
}: {
  title: string;
  date: string;
  preparedBy: string;
}) {
  return (
    <View style={styles.footer} fixed>
      {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is a PDF drawing primitive, not an HTML <img>; it has no alt prop */}
      <Image style={styles.footerLogo} src={RAMPRATE_LOGO_DATA_URI} />
      <Text style={styles.footerTitle}>
        {title}
        {date ? ` \u00b7 ${date}` : ""}
        {` \u00b7 Prepared by ${preparedBy}`}
      </Text>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
      />
    </View>
  );
}

function FrontMatter({
  info,
  title,
  date,
  sections,
}: {
  info: ReportDocumentInfo;
  title: string;
  date: string;
  sections: ReportSection[];
}) {
  const rows: Array<[string, string]> = [
    ["Document", title],
    ...(date ? ([["Date", date]] as Array<[string, string]>) : []),
    ...INFO_LABELS.filter(([k]) => info[k]).map(
      ([k, label]) => [label, String(info[k])] as [string, string],
    ),
  ];
  return (
    <View>
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Document information</Text>
        {rows.map(([label, value], i) => (
          <View key={i} style={styles.tableRow} wrap={false}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.tableCell}>{value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Contents</Text>
        {sections.map((section, i) => (
          <View key={i} style={styles.tocRow} wrap={false}>
            <Text style={styles.tocNumber}>{i + 1}</Text>
            <Text style={styles.listText}>{section.heading}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ReportDocument({
  title,
  subtitle,
  date,
  sections,
  eyebrow = "RampRate Report",
  preparedBy = "RampRate Web Team",
  documentInfo,
}: ReportInput) {
  return (
    <Document title={title}>
      <Page size="A4" style={[styles.page, styles.cover]}>
        <View style={styles.coverInner}>
          <View style={styles.logoCard}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- @react-pdf/renderer's Image is a PDF drawing primitive, not an HTML <img>; it has no alt prop */}
            <Image style={styles.logo} src={RAMPRATE_LOGO_DATA_URI} />
          </View>
          <Text style={styles.eyebrow}>{eyebrow}</Text>
          <Text style={styles.coverTitle}>{title}</Text>
          <Text style={styles.coverSubtitle}>{subtitle}</Text>
          <Text style={styles.coverDate}>{date}</Text>
        </View>
      </Page>

      {documentInfo ? (
        <Page size="A4" style={styles.page}>
          <FrontMatter
            info={documentInfo}
            title={title}
            date={date}
            sections={sections}
          />
          <Footer title={title} date={date} preparedBy={preparedBy} />
        </Page>
      ) : null}

      <Page size="A4" style={styles.page}>
        {/* Sections may flow across pages - a wrap={false} section taller
            than one page gets clipped. Headings carry minPresenceAhead so
            one never sits alone at the bottom of a page. */}
        {sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionHeading} minPresenceAhead={60}>
              {documentInfo ? `${i + 1}. ` : ""}
              {section.heading}
            </Text>
            {(section.paragraphs ?? []).map((p, pi) => (
              <Text key={pi} style={styles.paragraph}>
                {p}
              </Text>
            ))}
            {section.bullets?.length ? (
              <List items={section.bullets} numbered={false} />
            ) : null}
            {section.steps?.length ? (
              <List items={section.steps} numbered />
            ) : null}
            {section.callout ? (
              <Text style={styles.callout} wrap={false}>
                {section.callout}
              </Text>
            ) : null}
            {section.table ? <Table data={section.table} /> : null}
          </View>
        ))}
        <Footer title={title} date={date} preparedBy={preparedBy} />
      </Page>
    </Document>
  );
}

export async function generateReportPdf(input: ReportInput): Promise<Buffer> {
  return renderToBuffer(<ReportDocument {...input} />);
}
