import { ROLES_PREVIEW } from "@/lib/roles";

export default function PreviewBar() {
  if (!ROLES_PREVIEW) return null;
  return (
    <div className="mb-8 rounded-md border border-gold bg-[oklch(0.95_0.06_85)] px-4 py-3 text-center text-sm font-semibold text-ink">
      PREVIEW ONLY. Not public. Draft roles are visible on this page.
    </div>
  );
}
