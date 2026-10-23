type City = {
  name: string;
  nameKey: string;
  label: string;
  tz: string;
  aliases: string[];
  labelWords: string[];
};

const CITY_ROWS: [string, string, string, string[]?][] = [
  ["New York", "NY, USA", "America/New_York", ["nyc"]],
  ["Los Angeles", "CA, USA", "America/Los_Angeles", ["la"]],
  ["San Francisco", "CA, USA", "America/Los_Angeles", ["sf bay area"]],
  ["Chicago", "IL, USA", "America/Chicago"],
  ["Boston", "MA, USA", "America/New_York"],
  ["Miami", "FL, USA", "America/New_York"],
  ["Austin", "TX, USA", "America/Chicago"],
  ["Seattle", "WA, USA", "America/Los_Angeles"],
  ["Toronto", "ON, Canada", "America/Toronto"],
  ["Vancouver", "BC, Canada", "America/Vancouver"],
  ["Santa Monica", "CA, USA", "America/Los_Angeles"],
  ["San Diego", "CA, USA", "America/Los_Angeles"],
  ["San Jose", "CA, USA", "America/Los_Angeles"],
  ["Palo Alto", "CA, USA", "America/Los_Angeles"],
  ["Oakland", "CA, USA", "America/Los_Angeles"],
  ["Sacramento", "CA, USA", "America/Los_Angeles"],
  ["Irvine", "CA, USA", "America/Los_Angeles"],
  ["Las Vegas", "NV, USA", "America/Los_Angeles"],
  ["Portland", "OR, USA", "America/Los_Angeles"],
  ["Phoenix", "AZ, USA", "America/Phoenix"],
  ["Scottsdale", "AZ, USA", "America/Phoenix"],
  ["Denver", "CO, USA", "America/Denver"],
  ["Boulder", "CO, USA", "America/Denver"],
  ["Salt Lake City", "UT, USA", "America/Denver"],
  ["Dallas", "TX, USA", "America/Chicago"],
  ["Houston", "TX, USA", "America/Chicago"],
  ["San Antonio", "TX, USA", "America/Chicago"],
  ["Nashville", "TN, USA", "America/Chicago"],
  ["New Orleans", "LA, USA", "America/Chicago"],
  ["Minneapolis", "MN, USA", "America/Chicago"],
  ["Kansas City", "MO, USA", "America/Chicago"],
  ["St. Louis", "MO, USA", "America/Chicago", ["saint louis"]],
  ["Milwaukee", "WI, USA", "America/Chicago"],
  ["Atlanta", "GA, USA", "America/New_York"],
  ["Washington", "DC, USA", "America/New_York", ["washington dc"]],
  ["Philadelphia", "PA, USA", "America/New_York"],
  ["Pittsburgh", "PA, USA", "America/New_York"],
  ["Baltimore", "MD, USA", "America/New_York"],
  ["Charlotte", "NC, USA", "America/New_York"],
  ["Raleigh", "NC, USA", "America/New_York"],
  ["Orlando", "FL, USA", "America/New_York"],
  ["Tampa", "FL, USA", "America/New_York"],
  ["Fort Lauderdale", "FL, USA", "America/New_York"],
  ["Palm Beach", "FL, USA", "America/New_York", ["west palm beach"]],
  ["Cambridge", "MA, USA", "America/New_York"],
  ["Providence", "RI, USA", "America/New_York"],
  ["Hartford", "CT, USA", "America/New_York"],
  ["Stamford", "CT, USA", "America/New_York"],
  ["Greenwich", "CT, USA", "America/New_York"],
  ["Detroit", "MI, USA", "America/Detroit"],
  ["Cleveland", "OH, USA", "America/New_York"],
  ["Columbus", "OH, USA", "America/New_York"],
  ["Cincinnati", "OH, USA", "America/New_York"],
  ["Indianapolis", "IN, USA", "America/Indiana/Indianapolis"],
  ["Honolulu", "HI, USA", "Pacific/Honolulu"],
  ["Anchorage", "AK, USA", "America/Anchorage"],
  ["Montreal", "QC, Canada", "America/Toronto", ["montréal"]],
  ["Ottawa", "ON, Canada", "America/Toronto"],
  ["Calgary", "AB, Canada", "America/Edmonton"],
  ["Edmonton", "AB, Canada", "America/Edmonton"],
  ["Winnipeg", "MB, Canada", "America/Winnipeg"],
  ["Halifax", "NS, Canada", "America/Halifax"],
  ["Victoria", "BC, Canada", "America/Vancouver"],
  ["Mexico City", "Mexico", "America/Mexico_City", ["cdmx"]],
  ["Guadalajara", "Mexico", "America/Mexico_City"],
  ["Monterrey", "Mexico", "America/Monterrey"],
  ["Cancun", "Mexico", "America/Cancun"],
  ["Tijuana", "Mexico", "America/Tijuana"],
  ["San Juan", "Puerto Rico", "America/Puerto_Rico"],
  ["Nassau", "Bahamas", "America/Nassau"],
  ["Kingston", "Jamaica", "America/Jamaica"],
  ["Panama City", "Panama", "America/Panama"],
  ["San Jose", "Costa Rica", "America/Costa_Rica"],
  ["London", "UK", "Europe/London"],
  ["Paris", "France", "Europe/Paris"],
  ["Berlin", "Germany", "Europe/Berlin"],
  ["Amsterdam", "Netherlands", "Europe/Amsterdam"],
  ["Madrid", "Spain", "Europe/Madrid"],
  ["Ibiza", "Spain", "Europe/Madrid"],
  ["Zurich", "Switzerland", "Europe/Zurich"],
  ["Dublin", "Ireland", "Europe/Dublin"],
  ["Edinburgh", "UK", "Europe/London"],
  ["Manchester", "UK", "Europe/London"],
  ["Barcelona", "Spain", "Europe/Madrid"],
  ["Palma", "Spain", "Europe/Madrid", ["mallorca", "majorca"]],
  ["Lisbon", "Portugal", "Europe/Lisbon"],
  ["Rome", "Italy", "Europe/Rome"],
  ["Milan", "Italy", "Europe/Rome"],
  ["Munich", "Germany", "Europe/Berlin", ["munchen"]],
  ["Frankfurt", "Germany", "Europe/Berlin"],
  ["Hamburg", "Germany", "Europe/Berlin"],
  ["Brussels", "Belgium", "Europe/Brussels"],
  ["Luxembourg", "Luxembourg", "Europe/Luxembourg"],
  ["Geneva", "Switzerland", "Europe/Zurich"],
  ["Vienna", "Austria", "Europe/Vienna"],
  ["Stockholm", "Sweden", "Europe/Stockholm"],
  ["Copenhagen", "Denmark", "Europe/Copenhagen"],
  ["Oslo", "Norway", "Europe/Oslo"],
  ["Helsinki", "Finland", "Europe/Helsinki"],
  ["Reykjavik", "Iceland", "Atlantic/Reykjavik"],
  ["Prague", "Czechia", "Europe/Prague"],
  ["Warsaw", "Poland", "Europe/Warsaw"],
  ["Budapest", "Hungary", "Europe/Budapest"],
  ["Bucharest", "Romania", "Europe/Bucharest"],
  ["Sofia", "Bulgaria", "Europe/Sofia"],
  ["Athens", "Greece", "Europe/Athens"],
  ["Istanbul", "Turkey", "Europe/Istanbul"],
  ["Tallinn", "Estonia", "Europe/Tallinn"],
  ["Riga", "Latvia", "Europe/Riga"],
  ["Vilnius", "Lithuania", "Europe/Vilnius"],
  ["Kyiv", "Ukraine", "Europe/Kyiv", ["kiev"]],
  ["Zagreb", "Croatia", "Europe/Zagreb"],
  ["Belgrade", "Serbia", "Europe/Belgrade"],
  ["Tirana", "Albania", "Europe/Tirane"],
  ["Valletta", "Malta", "Europe/Malta"],
  ["Monaco", "Monaco", "Europe/Monaco"],
  ["Dubai", "UAE", "Asia/Dubai"],
  ["Mumbai", "India", "Asia/Kolkata", ["bombay"]],
  ["Singapore", "Singapore", "Asia/Singapore"],
  ["Hong Kong", "Hong Kong", "Asia/Hong_Kong"],
  ["Tokyo", "Japan", "Asia/Tokyo"],
  ["Sydney", "Australia", "Australia/Sydney"],
  ["Bengaluru", "India", "Asia/Kolkata", ["bangalore"]],
  ["Delhi", "India", "Asia/Kolkata", ["new delhi"]],
  ["Hyderabad", "India", "Asia/Kolkata"],
  ["Chennai", "India", "Asia/Kolkata"],
  ["Pune", "India", "Asia/Kolkata"],
  ["Kolkata", "India", "Asia/Kolkata", ["calcutta"]],
  ["Abu Dhabi", "UAE", "Asia/Dubai"],
  ["Doha", "Qatar", "Asia/Qatar"],
  ["Riyadh", "Saudi Arabia", "Asia/Riyadh"],
  ["Tel Aviv", "Israel", "Asia/Jerusalem"],
  ["Seoul", "South Korea", "Asia/Seoul"],
  ["Shanghai", "China", "Asia/Shanghai"],
  ["Beijing", "China", "Asia/Shanghai"],
  ["Shenzhen", "China", "Asia/Shanghai"],
  ["Taipei", "Taiwan", "Asia/Taipei"],
  ["Bangkok", "Thailand", "Asia/Bangkok"],
  ["Jakarta", "Indonesia", "Asia/Jakarta"],
  ["Kuala Lumpur", "Malaysia", "Asia/Kuala_Lumpur"],
  ["Manila", "Philippines", "Asia/Manila"],
  ["Ho Chi Minh City", "Vietnam", "Asia/Ho_Chi_Minh", ["saigon"]],
  ["Karachi", "Pakistan", "Asia/Karachi"],
  ["Dhaka", "Bangladesh", "Asia/Dhaka"],
  ["Colombo", "Sri Lanka", "Asia/Colombo"],
  ["Melbourne", "Australia", "Australia/Melbourne"],
  ["Brisbane", "Australia", "Australia/Brisbane"],
  ["Perth", "Australia", "Australia/Perth"],
  ["Auckland", "New Zealand", "Pacific/Auckland"],
  ["Johannesburg", "South Africa", "Africa/Johannesburg"],
  ["Cape Town", "South Africa", "Africa/Johannesburg"],
  ["Lagos", "Nigeria", "Africa/Lagos"],
  ["Nairobi", "Kenya", "Africa/Nairobi"],
  ["Cairo", "Egypt", "Africa/Cairo"],
  ["Casablanca", "Morocco", "Africa/Casablanca"],
  ["Sao Paulo", "Brazil", "America/Sao_Paulo", ["são paulo"]],
  ["Rio de Janeiro", "Brazil", "America/Sao_Paulo"],
  ["Buenos Aires", "Argentina", "America/Argentina/Buenos_Aires"],
  ["Santiago", "Chile", "America/Santiago"],
  ["Bogota", "Colombia", "America/Bogota", ["bogotá"]],
  ["Medellin", "Colombia", "America/Bogota", ["medellín"]],
  ["Lima", "Peru", "America/Lima"],
];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const CITIES: City[] = CITY_ROWS.map(([name, label, tz, aliases]) => ({
  name,
  nameKey: normalize(name),
  label,
  tz,
  aliases: (aliases ?? []).map(normalize),
  labelWords: normalize(label).split(" "),
}));

// Best-effort time zone for a typed city. Returns null when the city is not
// in the list, so the caller can fall back to the visitor's device.
export function tzFromCity(text: string): string | null {
  const query = normalize(text);
  if (!query) return null;
  const padded = ` ${query} `;
  let best: string | null = null;
  let bestScore = -Infinity;

  CITIES.forEach((city, index) => {
    const nameHit =
      query === city.nameKey || query.startsWith(`${city.nameKey} `);
    const aliasHit = city.aliases.some(
      (a) => query === a || (a.length >= 5 && query.startsWith(`${a} `)),
    );
    if (!nameHit && !aliasHit) return;
    const words = city.labelWords.filter(
      (w) => w.length > 1 && padded.includes(` ${w} `),
    ).length;
    const score = city.nameKey.length + words * 10 - index * 0.001;
    if (score > bestScore) {
      bestScore = score;
      best = city.tz;
    }
  });
  return best;
}

export type ZoneChoice = [tz: string, label: string];

export const TZ_NORTH_AMERICA: ZoneChoice[] = [
  ["America/Los_Angeles", "Pacific Time (Los Angeles, Vancouver, Seattle)"],
  ["America/Denver", "Mountain Time (Denver, Calgary, Salt Lake City)"],
  ["America/Phoenix", "Arizona (Phoenix)"],
  ["America/Chicago", "Central Time (Chicago, Dallas, Winnipeg)"],
  ["America/New_York", "Eastern Time (New York, Toronto, Miami)"],
  ["America/Halifax", "Atlantic Time (Halifax)"],
  ["America/St_Johns", "Newfoundland (St. John’s)"],
  ["America/Anchorage", "Alaska (Anchorage)"],
  ["Pacific/Honolulu", "Hawaii (Honolulu)"],
  ["America/Mexico_City", "Mexico City"],
];

export const TZ_EUROPE: ZoneChoice[] = [
  ["Europe/London", "United Kingdom and Ireland (London, Dublin)"],
  ["Europe/Lisbon", "Portugal (Lisbon)"],
  [
    "Europe/Paris",
    "Central Europe (Paris, Berlin, Amsterdam, Madrid, Rome, Zurich)",
  ],
  ["Europe/Athens", "Eastern Europe (Athens, Helsinki, Kyiv)"],
  ["Europe/Istanbul", "Turkey (Istanbul)"],
  ["Europe/Moscow", "Moscow"],
  ["Atlantic/Reykjavik", "Iceland (Reykjavik)"],
];

export const TZ_FALLBACK: string[] = [
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Hong_Kong",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Australia/Sydney",
  "Pacific/Auckland",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Africa/Lagos",
  "America/Sao_Paulo",
  "America/Bogota",
  "America/Argentina/Buenos_Aires",
];

export function tzOffsetLabel(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const part = parts.find((p) => p.type === "timeZoneName");
    return part ? part.value.replace("GMT", "UTC") : "";
  } catch {
    return "";
  }
}

export function describeZone(tz: string): string {
  let name = tz;
  let now = "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "longGeneric",
    }).formatToParts(new Date());
    name = parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
    now = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date());
  } catch {
    // Unknown zone name: fall back to the raw identifier.
  }
  return now ? `${name}, it is ${now} there now` : name;
}
