import * as yup from "yup";
import { RAMPRATE_SYSTEM_PROMPT } from "@/lib/ramprate-knowledge";

export type AdvisoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type AdvisoryRequest = {
  question: string;
  history: AdvisoryMessage[];
};

const messageSchema: yup.ObjectSchema<AdvisoryMessage> = yup.object({
  role: yup
    .mixed<AdvisoryMessage["role"]>()
    .oneOf(["user", "assistant"])
    .required(),
  content: yup.string().trim().min(1).max(4_000).required(),
});

const advisoryRequestSchema: yup.ObjectSchema<AdvisoryRequest> = yup.object({
  question: yup.string().trim().min(2).max(2_000).required(),
  history: yup.array(messageSchema).max(6).default([]).required(),
});

type BuiltInResponse = {
  choices?: Array<{ message?: { content?: string | null } }>;
};

type BuiltInCompletionOptions = {
  system: string;
  messages: AdvisoryMessage[];
  maxCompletionTokens: number;
};

const FALLBACK_ANSWER =
  "I could not complete that advisory request right now. Please try again, or contact the RampRate team for direct guidance.";

export async function parseAdvisoryRequest(
  input: unknown,
): Promise<AdvisoryRequest> {
  return advisoryRequestSchema.validate(input, {
    abortEarly: false,
    stripUnknown: true,
  });
}

export async function askRampRate(
  request: AdvisoryRequest,
  requestFn: typeof fetch = fetch,
): Promise<string> {
  return invokeBuiltInCompletion(
    {
      system: `${RAMPRATE_SYSTEM_PROMPT}\n\nProvide concise, practical enterprise advisory context. Do not claim access to confidential client data. Do not give legal, tax, investment, or medical advice; recommend consulting an appropriately qualified professional when those matters arise.`,
      messages: [
        ...request.history,
        { role: "user", content: request.question },
      ],
      maxCompletionTokens: 700,
    },
    requestFn,
  );
}

export async function invokeBuiltInCompletion(
  options: BuiltInCompletionOptions,
  requestFn: typeof fetch = fetch,
): Promise<string> {
  const baseUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error("The built-in AI runtime is not configured.");
  }

  const response = await requestFn(`${baseUrl}/v1/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      max_completion_tokens: options.maxCompletionTokens,
      messages: [
        {
          role: "system",
          content: options.system,
        },
        ...options.messages,
      ],
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    throw new Error(`Built-in AI request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as BuiltInResponse;
  const answer = payload.choices?.[0]?.message?.content?.trim();
  return answer || FALLBACK_ANSWER;
}

export { FALLBACK_ANSWER };
