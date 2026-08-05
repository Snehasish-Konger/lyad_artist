import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Typography-only mark — the initials, set in the site's own palette. No
 *  separate logo asset to keep in sync with the wordmark. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#221e19",
          color: "#fdfcfa",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: -0.5,
        }}
      >
        SK
      </div>
    ),
    size,
  );
}
