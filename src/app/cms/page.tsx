import AdminContentConsole from "@/app/flow/admin/content/AdminContentConsole";

export default function RampRateCmsPage() {
  return (
    <AdminContentConsole
      apiBase="/api/cms"
      includeMemberManagement
      returnHref="/"
      returnLabel="View RampRate site"
    />
  );
}
