import { permanentRedirect } from "next/navigation";

/**
 * The former Thinking archive is now represented by RampRate's journey on
 * the About page. Individual `/thinking/[slug]` articles remain addressable.
 */
export default function ThinkingPage() {
  permanentRedirect("/about#journey");
}
