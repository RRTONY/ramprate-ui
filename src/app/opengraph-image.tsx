import { ImageResponse } from "next/og";

export const alt = "RampRate technology advisory";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background:
          "linear-gradient(135deg, #071426 0%, #0b3472 55%, #0e7490 100%)",
        color: "#f8fbff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "68px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
        <div
          style={{
            alignItems: "center",
            background: "#38bdf8",
            borderRadius: "22px",
            color: "#071426",
            display: "flex",
            fontSize: "52px",
            fontWeight: 800,
            height: "86px",
            justifyContent: "center",
            width: "86px",
          }}
        >
          R
        </div>
        <div
          style={{ fontSize: "38px", fontWeight: 700, letterSpacing: "0.06em" }}
        >
          RAMPRATE
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            color: "#7dd3fc",
            fontSize: "25px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Technology advisory
        </div>
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            letterSpacing: "-0.045em",
            lineHeight: 1.05,
          }}
        >
          Where relationships become revenue.
        </div>
      </div>
      <div
        style={{
          color: "#bae6fd",
          display: "flex",
          fontSize: "24px",
          justifyContent: "space-between",
        }}
      >
        <span>Data centers · telecom · cloud</span>
        <span>Since 2000</span>
      </div>
    </div>,
    size,
  );
}
