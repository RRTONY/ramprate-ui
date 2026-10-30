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

export function tzOffsetLabel(tz: string, date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(date);
    const part = parts.find((p) => p.type === "timeZoneName");
    return part
      ? part.value.replace("GMT", "UTC").replace(/^UTC[+-]0(?::00)?$/, "UTC")
      : "";
  } catch {
    return "";
  }
}

export function describeZone(tz: string, date: Date = new Date()): string {
  let name = tz;
  let now = "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "longGeneric",
    }).formatToParts(date);
    name = parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
    now = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    // Unknown zone name: fall back to the raw identifier.
  }
  return now ? `${name}, it is ${now} there now` : name;
}

export const COMMON_TIME_ZONES: ZoneChoice[] = [
  ["America/Los_Angeles", "Pacific (Los Angeles, Las Vegas, Seattle)"],
  ["America/Denver", "Mountain (Denver, Salt Lake City)"],
  ["America/Phoenix", "Arizona (Phoenix)"],
  ["America/Chicago", "Central (Chicago, Dallas)"],
  ["America/New_York", "Eastern (New York, Miami, Toronto)"],
  ["Pacific/Honolulu", "Hawaii (Honolulu)"],
  ["America/Anchorage", "Alaska (Anchorage)"],
  ["Europe/London", "London and Dublin"],
  ["Europe/Paris", "Central Europe (Paris, Berlin, Madrid, Rome)"],
  ["Asia/Kolkata", "India (Mumbai, Delhi, Bengaluru)"],
  ["Asia/Dubai", "Dubai"],
  ["Asia/Singapore", "Singapore and Hong Kong"],
  ["Australia/Sydney", "Sydney and Melbourne"],
];

const MODERN_ZONE_NAMES: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "Asia/Saigon": "Asia/Ho_Chi_Minh",
  "Asia/Rangoon": "Asia/Yangon",
  "Europe/Kiev": "Europe/Kyiv",
};

const ZONE_COUNTRIES: [country: string, zones: string][] = [
  ["Afghanistan AF", "Asia/Kabul"],
  ["Albania AL", "Europe/Tirane"],
  ["Algeria DZ", "Africa/Algiers"],
  ["Andorra AD", "Europe/Andorra"],
  ["Angola AO", "Africa/Luanda"],
  ["Antigua & Barbuda AG", "America/Antigua"],
  [
    "Argentina AR",
    "America/Argentina/Buenos_Aires America/Argentina/Catamarca America/Argentina/ComodRivadavia America/Argentina/Cordoba America/Argentina/Jujuy America/Argentina/La_Rioja America/Argentina/Mendoza America/Argentina/Rio_Gallegos America/Argentina/Salta America/Argentina/San_Juan America/Argentina/San_Luis America/Argentina/Tucuman America/Argentina/Ushuaia America/Buenos_Aires America/Catamarca America/Cordoba America/Jujuy America/Mendoza America/Rosario",
  ],
  ["Armenia AM", "Asia/Yerevan"],
  [
    "Australia AU",
    "Australia/ACT Australia/Adelaide Australia/Brisbane Australia/Broken_Hill Australia/Canberra Australia/Currie Australia/Darwin Australia/Eucla Australia/Hobart Australia/LHI Australia/Lindeman Australia/Lord_Howe Australia/Melbourne Australia/NSW Australia/North Australia/Perth Australia/Queensland Australia/South Australia/Sydney Australia/Tasmania Australia/Victoria Australia/West Australia/Yancowinna",
  ],
  ["Austria AT", "Europe/Vienna"],
  ["Azerbaijan AZ", "Asia/Baku"],
  ["Bahamas BS", "America/Nassau"],
  ["Bahrain BH", "Asia/Bahrain"],
  ["Bangladesh BD", "Asia/Dacca Asia/Dhaka"],
  ["Barbados BB", "America/Barbados"],
  ["Belarus BY", "Europe/Minsk"],
  ["Belgium BE", "Europe/Brussels"],
  ["Belize BZ", "America/Belize"],
  ["Benin BJ", "Africa/Porto-Novo"],
  ["Bhutan BT", "Asia/Thimbu Asia/Thimphu"],
  ["Bolivia BO", "America/La_Paz"],
  ["Bosnia & Herzegovina BA", "Europe/Sarajevo"],
  ["Botswana BW", "Africa/Gaborone"],
  [
    "Brazil BR",
    "America/Araguaina America/Bahia America/Belem America/Boa_Vista America/Campo_Grande America/Cuiaba America/Eirunepe America/Fortaleza America/Maceio America/Manaus America/Noronha America/Porto_Acre America/Porto_Velho America/Recife America/Rio_Branco America/Santarem America/Sao_Paulo",
  ],
  ["Britain (UK) GB", "Europe/Belfast Europe/London"],
  ["Brunei BN", "Asia/Brunei"],
  ["Bulgaria BG", "Europe/Sofia"],
  ["Burkina Faso BF", "Africa/Ouagadougou"],
  ["Burundi BI", "Africa/Bujumbura"],
  ["Cambodia KH", "Asia/Phnom_Penh"],
  ["Cameroon CM", "Africa/Douala"],
  [
    "Canada CA",
    "America/Atikokan America/Blanc-Sablon America/Cambridge_Bay America/Coral_Harbour America/Creston America/Dawson America/Dawson_Creek America/Edmonton America/Fort_Nelson America/Glace_Bay America/Goose_Bay America/Halifax America/Inuvik America/Iqaluit America/Moncton America/Montreal America/Nipigon America/Pangnirtung America/Rainy_River America/Rankin_Inlet America/Regina America/Resolute America/St_Johns America/Swift_Current America/Thunder_Bay America/Toronto America/Vancouver America/Whitehorse America/Winnipeg America/Yellowknife",
  ],
  ["Cape Verde CV", "Atlantic/Cape_Verde"],
  ["Central African Rep. CF", "Africa/Bangui"],
  ["Chad TD", "Africa/Ndjamena"],
  [
    "Chile CL",
    "America/Coyhaique America/Punta_Arenas America/Santiago Pacific/Easter",
  ],
  [
    "China CN",
    "Asia/Chongqing Asia/Chungking Asia/Harbin Asia/Kashgar Asia/Shanghai Asia/Urumqi",
  ],
  ["Colombia CO", "America/Bogota"],
  ["Comoros KM", "Indian/Comoro"],
  ["Congo (Dem. Rep.) CD", "Africa/Kinshasa Africa/Lubumbashi"],
  ["Congo (Rep.) CG", "Africa/Brazzaville"],
  ["Costa Rica CR", "America/Costa_Rica"],
  ["Croatia HR", "Europe/Zagreb"],
  ["Cuba CU", "America/Havana"],
  ["Cyprus CY", "Asia/Famagusta Asia/Nicosia Europe/Nicosia"],
  ["Czech Republic CZ", "Europe/Bratislava Europe/Prague"],
  ["C\u00f4te d'Ivoire CI", "Africa/Abidjan"],
  ["Denmark DK", "Europe/Copenhagen"],
  ["Djibouti DJ", "Africa/Djibouti"],
  ["Dominica DM", "America/Dominica"],
  ["Dominican Republic DO", "America/Santo_Domingo"],
  ["East Timor TL", "Asia/Dili"],
  ["Ecuador EC", "America/Guayaquil Pacific/Galapagos"],
  ["Egypt EG", "Africa/Cairo"],
  ["El Salvador SV", "America/El_Salvador"],
  ["Equatorial Guinea GQ", "Africa/Malabo"],
  ["Eritrea ER", "Africa/Asmara Africa/Asmera"],
  ["Estonia EE", "Europe/Tallinn"],
  ["Eswatini (Swaziland) SZ", "Africa/Mbabane"],
  ["Ethiopia ET", "Africa/Addis_Ababa"],
  ["Fiji FJ", "Pacific/Fiji"],
  ["Finland FI", "Europe/Helsinki Europe/Mariehamn"],
  ["France FR", "Europe/Paris"],
  ["Gabon GA", "Africa/Libreville"],
  ["Gambia GM", "Africa/Banjul"],
  ["Georgia GE", "Asia/Tbilisi"],
  ["Germany DE", "Europe/Berlin"],
  ["Ghana GH", "Africa/Accra"],
  ["Greece GR", "Europe/Athens"],
  ["Grenada GD", "America/Grenada"],
  ["Guatemala GT", "America/Guatemala"],
  ["Guinea GN", "Africa/Conakry"],
  ["Guinea-Bissau GW", "Africa/Bissau"],
  ["Guyana GY", "America/Guyana"],
  ["Haiti HT", "America/Port-au-Prince"],
  ["Honduras HN", "America/Tegucigalpa"],
  ["Hong Kong HK", "Asia/Hong_Kong"],
  ["Hungary HU", "Europe/Budapest"],
  ["Iceland IS", "Atlantic/Reykjavik"],
  ["India IN", "Asia/Calcutta Asia/Kolkata"],
  [
    "Indonesia ID",
    "Asia/Jakarta Asia/Jayapura Asia/Makassar Asia/Pontianak Asia/Ujung_Pandang",
  ],
  ["Iran IR", "Asia/Tehran"],
  ["Iraq IQ", "Asia/Baghdad"],
  ["Ireland IE", "Europe/Dublin"],
  ["Israel IL", "Asia/Jerusalem Asia/Tel_Aviv"],
  ["Italy IT", "Europe/Rome Europe/San_Marino Europe/Vatican"],
  ["Jamaica JM", "America/Jamaica"],
  ["Japan JP", "Asia/Tokyo"],
  ["Jordan JO", "Asia/Amman"],
  [
    "Kazakhstan KZ",
    "Asia/Almaty Asia/Aqtau Asia/Aqtobe Asia/Atyrau Asia/Oral Asia/Qostanay Asia/Qyzylorda",
  ],
  ["Kenya KE", "Africa/Nairobi"],
  [
    "Kiribati KI",
    "Pacific/Enderbury Pacific/Kanton Pacific/Kiritimati Pacific/Tarawa",
  ],
  ["Korea (North) KP", "Asia/Pyongyang"],
  ["Korea (South) KR", "Asia/Seoul"],
  ["Kuwait KW", "Asia/Kuwait"],
  ["Kyrgyzstan KG", "Asia/Bishkek"],
  ["Laos LA", "Asia/Vientiane"],
  ["Latvia LV", "Europe/Riga"],
  ["Lebanon LB", "Asia/Beirut"],
  ["Lesotho LS", "Africa/Maseru"],
  ["Liberia LR", "Africa/Monrovia"],
  ["Libya LY", "Africa/Tripoli"],
  ["Liechtenstein LI", "Europe/Vaduz"],
  ["Lithuania LT", "Europe/Vilnius"],
  ["Luxembourg LU", "Europe/Luxembourg"],
  ["Macau MO", "Asia/Macao Asia/Macau"],
  ["Madagascar MG", "Indian/Antananarivo"],
  ["Malawi MW", "Africa/Blantyre"],
  ["Malaysia MY", "Asia/Kuala_Lumpur Asia/Kuching"],
  ["Maldives MV", "Indian/Maldives"],
  ["Mali ML", "Africa/Bamako Africa/Timbuktu"],
  ["Malta MT", "Europe/Malta"],
  ["Marshall Islands MH", "Pacific/Kwajalein Pacific/Majuro"],
  ["Mauritania MR", "Africa/Nouakchott"],
  ["Mauritius MU", "Indian/Mauritius"],
  [
    "Mexico MX",
    "America/Bahia_Banderas America/Cancun America/Chihuahua America/Ciudad_Juarez America/Ensenada America/Hermosillo America/Matamoros America/Mazatlan America/Merida America/Mexico_City America/Monterrey America/Ojinaga America/Santa_Isabel America/Tijuana",
  ],
  [
    "Micronesia FM",
    "Pacific/Chuuk Pacific/Kosrae Pacific/Pohnpei Pacific/Ponape Pacific/Truk Pacific/Yap",
  ],
  ["Moldova MD", "Europe/Chisinau Europe/Tiraspol"],
  ["Mongolia MN", "Asia/Choibalsan Asia/Hovd Asia/Ulaanbaatar Asia/Ulan_Bator"],
  ["Morocco MA", "Africa/Casablanca"],
  ["Mozambique MZ", "Africa/Maputo"],
  ["Myanmar (Burma) MM", "Asia/Rangoon Asia/Yangon"],
  ["Namibia NA", "Africa/Windhoek"],
  ["Nepal NP", "Asia/Kathmandu Asia/Katmandu"],
  ["Netherlands NL", "Europe/Amsterdam"],
  ["New Zealand NZ", "Pacific/Auckland Pacific/Chatham"],
  ["Nicaragua NI", "America/Managua"],
  ["Niger NE", "Africa/Niamey"],
  ["Nigeria NG", "Africa/Lagos"],
  ["North Macedonia MK", "Europe/Skopje"],
  ["Norway NO", "Atlantic/Jan_Mayen Europe/Oslo"],
  ["Oman OM", "Asia/Muscat"],
  ["Pakistan PK", "Asia/Karachi"],
  ["Palau PW", "Pacific/Palau"],
  ["Palestine PS", "Asia/Gaza Asia/Hebron"],
  ["Panama PA", "America/Panama"],
  ["Papua New Guinea PG", "Pacific/Bougainville Pacific/Port_Moresby"],
  ["Paraguay PY", "America/Asuncion"],
  ["Peru PE", "America/Lima"],
  ["Philippines PH", "Asia/Manila"],
  ["Poland PL", "Europe/Warsaw"],
  ["Portugal PT", "Atlantic/Azores Atlantic/Madeira Europe/Lisbon"],
  ["Puerto Rico PR", "America/Puerto_Rico"],
  ["Qatar QA", "Asia/Qatar"],
  ["Romania RO", "Europe/Bucharest"],
  [
    "Russia RU",
    "Asia/Anadyr Asia/Barnaul Asia/Chita Asia/Irkutsk Asia/Kamchatka Asia/Khandyga Asia/Krasnoyarsk Asia/Magadan Asia/Novokuznetsk Asia/Novosibirsk Asia/Omsk Asia/Sakhalin Asia/Srednekolymsk Asia/Tomsk Asia/Ust-Nera Asia/Vladivostok Asia/Yakutsk Asia/Yekaterinburg Europe/Astrakhan Europe/Kaliningrad Europe/Kirov Europe/Moscow Europe/Samara Europe/Saratov Europe/Ulyanovsk Europe/Volgograd",
  ],
  ["Rwanda RW", "Africa/Kigali"],
  ["Samoa (western) WS", "Pacific/Apia"],
  ["Sao Tome & Principe ST", "Africa/Sao_Tome"],
  ["Saudi Arabia SA", "Asia/Riyadh"],
  ["Senegal SN", "Africa/Dakar"],
  ["Serbia RS", "Europe/Belgrade Europe/Podgorica"],
  ["Seychelles SC", "Indian/Mahe"],
  ["Sierra Leone SL", "Africa/Freetown"],
  ["Singapore SG", "Asia/Singapore"],
  ["Slovenia SI", "Europe/Ljubljana"],
  ["Solomon Islands SB", "Pacific/Guadalcanal"],
  ["Somalia SO", "Africa/Mogadishu"],
  ["South Africa ZA", "Africa/Johannesburg"],
  ["South Sudan SS", "Africa/Juba"],
  ["Spain ES", "Africa/Ceuta Atlantic/Canary Europe/Madrid"],
  ["Sri Lanka LK", "Asia/Colombo"],
  ["St Kitts & Nevis KN", "America/St_Kitts"],
  ["St Lucia LC", "America/St_Lucia"],
  ["St Vincent VC", "America/St_Vincent"],
  ["Sudan SD", "Africa/Khartoum"],
  ["Suriname SR", "America/Paramaribo"],
  ["Sweden SE", "Europe/Stockholm"],
  ["Switzerland CH", "Europe/Busingen Europe/Zurich"],
  ["Syria SY", "Asia/Damascus"],
  ["Taiwan TW", "Asia/Taipei"],
  ["Tajikistan TJ", "Asia/Dushanbe"],
  ["Tanzania TZ", "Africa/Dar_es_Salaam"],
  ["Thailand TH", "Asia/Bangkok"],
  ["Togo TG", "Africa/Lome"],
  ["Tonga TO", "Pacific/Tongatapu"],
  [
    "Trinidad & Tobago TT",
    "America/Marigot America/Port_of_Spain America/St_Barthelemy",
  ],
  ["Tunisia TN", "Africa/Tunis"],
  ["Turkey TR", "Asia/Istanbul Europe/Istanbul"],
  ["Turkmenistan TM", "Asia/Ashgabat Asia/Ashkhabad"],
  ["Uganda UG", "Africa/Kampala"],
  [
    "Ukraine UA",
    "Europe/Kiev Europe/Kyiv Europe/Simferopol Europe/Uzhgorod Europe/Zaporozhye",
  ],
  ["United Arab Emirates AE", "Asia/Dubai"],
  [
    "United States US",
    "America/Adak America/Anchorage America/Atka America/Boise America/Chicago America/Denver America/Detroit America/Fort_Wayne America/Indiana/Indianapolis America/Indiana/Knox America/Indiana/Marengo America/Indiana/Petersburg America/Indiana/Tell_City America/Indiana/Vevay America/Indiana/Vincennes America/Indiana/Winamac America/Indianapolis America/Juneau America/Kentucky/Louisville America/Kentucky/Monticello America/Knox_IN America/Los_Angeles America/Louisville America/Menominee America/Metlakatla America/New_York America/Nome America/North_Dakota/Beulah America/North_Dakota/Center America/North_Dakota/New_Salem America/Phoenix America/Shiprock America/Sitka America/Yakutat Pacific/Honolulu Pacific/Johnston",
  ],
  ["Uruguay UY", "America/Montevideo"],
  ["Uzbekistan UZ", "Asia/Samarkand Asia/Tashkent"],
  ["Vanuatu VU", "Pacific/Efate"],
  ["Venezuela VE", "America/Caracas"],
  ["Vietnam VN", "Asia/Ho_Chi_Minh Asia/Saigon"],
  ["Western Sahara EH", "Africa/El_Aaiun"],
  ["Yemen YE", "Asia/Aden"],
  ["Zambia ZM", "Africa/Lusaka"],
  ["Zimbabwe ZW", "Africa/Harare"],
];

const COUNTRY_BY_ZONE = new Map(
  ZONE_COUNTRIES.flatMap(([country, zones]) =>
    zones.split(" ").map((zone): [string, string] => [zone, country]),
  ),
);

export type SearchableZone = { value: string; label: string; search: string };

export function modernZoneName(zone: string): string {
  if ((MODERN_ZONE_NAMES[zone] ?? zone) === "Asia/Ho_Chi_Minh")
    return "Ho Chi Minh City";
  return (
    (MODERN_ZONE_NAMES[zone] ?? zone)
      .split("/")
      .slice(1)
      .join(" / ")
      .replace(/_/g, " ") || zone
  );
}

export function getTimeZoneChoices(zones?: string[]): SearchableZone[] {
  const supported = zones ??
    (
      Intl as unknown as {
        supportedValuesOf?: (key: string) => string[];
      }
    ).supportedValuesOf?.("timeZone") ?? [...COUNTRY_BY_ZONE.keys()];
  const seen = new Set<string>();
  return [...COMMON_TIME_ZONES.map(([zone]) => zone), ...supported]
    .flatMap((value): SearchableZone[] => {
      const modern = MODERN_ZONE_NAMES[value] ?? value;
      const country = COUNTRY_BY_ZONE.get(modern) ?? COUNTRY_BY_ZONE.get(value);
      if (!country || seen.has(modern)) return [];
      try {
        new Intl.DateTimeFormat("en-US", { timeZone: value });
      } catch {
        return [];
      }
      seen.add(modern);
      const city = modernZoneName(value);
      const examples = CITY_ROWS.filter(
        (row) => row[2] === modern || row[2] === value,
      ).flatMap(([name, region, , aliases]) => [
        name,
        region,
        ...(aliases ?? []),
      ]);
      const common =
        COMMON_TIME_ZONES.find(([zone]) => zone === modern)?.[1] ?? "";
      return [
        {
          value,
          label: `${city} (${country.replace(/ [A-Z]{2}$/, "")})`,
          search: normalize(
            [value, modern, city, country, common, ...examples].join(" "),
          ),
        },
      ];
    })
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function searchTimeZones(
  choices: SearchableZone[],
  query: string,
): SearchableZone[] {
  const words = normalize(query).split(" ").filter(Boolean);
  if (!words.length) return [];
  return choices
    .filter((choice) => words.every((word) => choice.search.includes(word)))
    .slice(0, 8);
}
