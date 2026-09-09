export type PortableTextBlock = {
  _key?: string;
  _type?: string;
  children?: Array<{ text?: string }>;
  markDefs?: unknown[];
  style?: string;
  [field: string]: unknown;
};

export type ContentImage = Record<string, unknown>;
export type PortableTextValue = PortableTextBlock | PortableTextBlock[];
