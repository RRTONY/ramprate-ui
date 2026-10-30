import ConnectFrame from "./ConnectFrame";

export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const tag =
    first(query.event) || first(query.e) || first(query.utm_campaign) || "";
  const src =
    "/connect-form.html" + (tag ? "?event=" + encodeURIComponent(tag) : "");
  return <ConnectFrame src={src} />;
}
