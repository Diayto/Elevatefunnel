import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Стратегическая сессия | Elevate Interns";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background: "linear-gradient(145deg, #01071d 0%, #000000 45%, #001a3d 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#3D9EFF",
            marginBottom: 24,
          }}
        >
          Elevate.Interns
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
            background: "linear-gradient(180deg, #ffffff 0%, #8eb8ff 100%)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Стратегическая сессия
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 28,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.72)",
            maxWidth: 820,
          }}
        >
          Международные стажировки, разбор профиля и пошаговый план для студентов
        </div>
      </div>
    ),
    { ...size },
  );
}
