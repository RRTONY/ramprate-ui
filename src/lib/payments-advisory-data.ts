export interface PaymentsIndustry {
  id: string;
  label: string;
  risk: "Low" | "Low-Medium" | "Medium" | "Medium-High" | "High" | "Very High";
  avgTicket: string;
  fraudRate: string;
  topProcessors: string[];
}

export const PAYMENTS_INDUSTRIES: PaymentsIndustry[] = [
  { id: "ecommerce", label: "E-Commerce / Retail", risk: "Low-Medium", avgTicket: "$85", fraudRate: "0.9%", topProcessors: ["Stripe", "Braintree", "Adyen"] },
  { id: "saas", label: "SaaS / Software", risk: "Low", avgTicket: "$320", fraudRate: "0.4%", topProcessors: ["Stripe", "Recurly", "Chargebee"] },
  { id: "travel", label: "Travel & Hospitality", risk: "Medium-High", avgTicket: "$740", fraudRate: "1.8%", topProcessors: ["Adyen", "Worldpay", "Chase Paymentech"] },
  { id: "healthcare", label: "Healthcare / Telehealth", risk: "Low", avgTicket: "$215", fraudRate: "0.3%", topProcessors: ["Stripe", "Square", "PaySimple"] },
  { id: "gambling", label: "Online Gambling / iGaming", risk: "High", avgTicket: "$180", fraudRate: "3.2%", topProcessors: ["Nuvei", "PaySafe", "Skrill"] },
  { id: "crypto", label: "Crypto / Digital Assets", risk: "High", avgTicket: "$2,400", fraudRate: "2.1%", topProcessors: ["BitPay", "Nuvei", "PaySafe"] },
  { id: "cbd", label: "CBD / Hemp", risk: "High", avgTicket: "$95", fraudRate: "1.4%", topProcessors: ["PaymentCloud", "Durango", "Host Merchant"] },
  { id: "peptides", label: "Peptides / Research Chemicals", risk: "Very High", avgTicket: "$280", fraudRate: "4.1%", topProcessors: ["Payline", "eMerchant", "PaymentCloud"] },
  { id: "firearms", label: "Firearms / Ammunition", risk: "High", avgTicket: "$650", fraudRate: "1.1%", topProcessors: ["Durango", "PaymentCloud", "Maverick BankCard"] },
  { id: "adult", label: "Adult Content / Entertainment", risk: "Very High", avgTicket: "$35", fraudRate: "5.8%", topProcessors: ["PaySafe", "CCBill", "Epoch"] },
  { id: "forex", label: "Forex / Trading Platforms", risk: "High", avgTicket: "$5,200", fraudRate: "2.7%", topProcessors: ["Nuvei", "Worldpay", "ECOMMPAY"] },
  { id: "nutra", label: "Nutraceuticals / Supplements", risk: "Medium-High", avgTicket: "$68", fraudRate: "2.3%", topProcessors: ["PaymentCloud", "Durango", "SMB Global"] },
  { id: "subscription", label: "Subscription / Membership", risk: "Medium", avgTicket: "$42", fraudRate: "1.6%", topProcessors: ["Stripe", "Recurly", "Braintree"] },
  { id: "b2b", label: "B2B / Enterprise Services", risk: "Low", avgTicket: "$12,000", fraudRate: "0.2%", topProcessors: ["Adyen", "Stripe", "WEX"] },
  { id: "nonprofit", label: "Nonprofit / Impact", risk: "Low", avgTicket: "$125", fraudRate: "0.3%", topProcessors: ["Stripe", "PayPal", "Mightycause"] },
  { id: "marketplace", label: "Marketplace / Platform", risk: "Medium", avgTicket: "$220", fraudRate: "1.1%", topProcessors: ["Stripe Connect", "Adyen", "Braintree"] },
  { id: "logistics", label: "Logistics / Freight", risk: "Low", avgTicket: "$3,800", fraudRate: "0.4%", topProcessors: ["WEX", "Comdata", "EFS"] },
  { id: "education", label: "Education / EdTech", risk: "Low", avgTicket: "$890", fraudRate: "0.5%", topProcessors: ["Stripe", "TouchNet", "PayPal"] },
  { id: "real_estate", label: "Real Estate / PropTech", risk: "Low-Medium", avgTicket: "$8,500", fraudRate: "0.6%", topProcessors: ["Stripe", "PaySimple", "Yardi"] },
  { id: "media", label: "Media / Publishing / Streaming", risk: "Low-Medium", avgTicket: "$18", fraudRate: "1.2%", topProcessors: ["Stripe", "Braintree", "FastSpring"] },
  { id: "food", label: "Food & Beverage / Restaurants", risk: "Low", avgTicket: "$55", fraudRate: "0.7%", topProcessors: ["Square", "Toast", "Stripe"] },
  { id: "luxury", label: "Luxury Goods / High-Value Retail", risk: "Medium", avgTicket: "$4,200", fraudRate: "0.9%", topProcessors: ["Adyen", "Stripe", "Worldpay"] },
  { id: "insurance", label: "Insurance / InsurTech", risk: "Low", avgTicket: "$680", fraudRate: "0.3%", topProcessors: ["Stripe", "Braintree", "PaymentCloud"] },
  { id: "telecom", label: "Telecom / Wireless", risk: "Medium", avgTicket: "$95", fraudRate: "1.5%", topProcessors: ["Worldpay", "Adyen", "Fiserv"] },
  { id: "automotive", label: "Automotive / Dealer Services", risk: "Low", avgTicket: "$2,100", fraudRate: "0.4%", topProcessors: ["RouteOne", "Dealertrack", "Stripe"] },
];

export interface PaymentsProcessor {
  name: string;
  bestFor: string;
  avgRate: string;
  minVolume: string;
}

export const PAYMENTS_PROCESSORS: PaymentsProcessor[] = [
  { name: "Stripe", bestFor: "SaaS, E-Commerce, Marketplaces", avgRate: "2.9% + $0.30", minVolume: "$0" },
  { name: "Adyen", bestFor: "Enterprise, Global, Omnichannel", avgRate: "Interchange + $0.11", minVolume: "$10M+" },
  { name: "Braintree (PayPal)", bestFor: "Marketplaces, Mobile", avgRate: "2.59% + $0.49", minVolume: "$0" },
  { name: "Worldpay (FIS)", bestFor: "Retail, Global Enterprise", avgRate: "Interchange + margins", minVolume: "$1M+" },
  { name: "Chase Paymentech", bestFor: "Mid-Market, Retail", avgRate: "Interchange+", minVolume: "$500K+" },
  { name: "Fiserv / First Data", bestFor: "POS, Retail, Banks", avgRate: "Interchange+", minVolume: "$1M+" },
  { name: "Square", bestFor: "SMB, Food, Retail", avgRate: "2.6% + $0.10", minVolume: "$0" },
  { name: "Nuvei", bestFor: "iGaming, Crypto, High-Risk", avgRate: "Custom", minVolume: "$500K+" },
  { name: "PaySafe", bestFor: "iGaming, Adult, High-Risk", avgRate: "Custom", minVolume: "$1M+" },
  { name: "Checkout.com", bestFor: "Enterprise, FinTech, Global", avgRate: "Custom", minVolume: "$5M+" },
  { name: "Recurly", bestFor: "Subscriptions, SaaS", avgRate: "2.9% + $0.30 + platform", minVolume: "$0" },
  { name: "Chargebee", bestFor: "SaaS Subscriptions", avgRate: "Platform fee + gateway", minVolume: "$0" },
  { name: "PaymentCloud", bestFor: "High-Risk, CBD, Nutra", avgRate: "Custom (3-5%)", minVolume: "$0" },
  { name: "Durango Merchant", bestFor: "High-Risk, Firearms, CBD", avgRate: "Custom (3-6%)", minVolume: "$0" },
  { name: "CCBill", bestFor: "Adult, Subscriptions", avgRate: "3.9% + gateway fee", minVolume: "$0" },
  { name: "WEX", bestFor: "Fleet, B2B, Logistics", avgRate: "Custom", minVolume: "$5M+" },
  { name: "FastSpring", bestFor: "SaaS, Software, Global", avgRate: "5.9% or custom", minVolume: "$0" },
  { name: "Stax (Fattmerchant)", bestFor: "High Volume SMB", avgRate: "$99/mo + interchange", minVolume: "$0" },
  { name: "Helcim", bestFor: "B2B, Low Volume", avgRate: "Interchange + 0.3%", minVolume: "$0" },
  { name: "ECOMMPAY", bestFor: "Europe, Forex, High-Risk", avgRate: "Custom", minVolume: "$1M+" },
  { name: "Spreedly", bestFor: "Gateway Orchestration", avgRate: "Platform fee", minVolume: "$0" },
  { name: "Primer.io", bestFor: "Orchestration, Enterprise", avgRate: "Custom", minVolume: "$5M+" },
  { name: "Payoneer", bestFor: "Cross-Border, B2B", avgRate: "3% + FX", minVolume: "$0" },
  { name: "Authorize.net", bestFor: "SMB, Legacy Integration", avgRate: "2.9% + $0.30 + $25/mo", minVolume: "$0" },
  { name: "Bambora / Worldline", bestFor: "Canada, Nordic, Enterprise", avgRate: "Custom", minVolume: "$500K+" },
];

export const PAYMENTS_SECTIONS = [
  "Qualification & Contact",
  "Business Profile & Strategy",
  "Processing Volume & History",
  "Technical Infrastructure",
  "Risk, Compliance & Licensing",
  "Fraud & Chargeback Profile",
  "Partnership Preferences",
];
