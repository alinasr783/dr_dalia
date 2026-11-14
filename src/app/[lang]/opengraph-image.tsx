import { ImageResponse } from "next/og";

export const alt =
  "عيادة د. داليا عبد الموجود زريع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isAr = lang !== "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "linear-gradient(135deg, #0F172A 0%, #0C4A6E 55%, #0284C7 100%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "24px",
                background: "linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 16px 36px rgba(14, 165, 233, 0.45)",
              }}
            >
              <svg
                width="50"
                height="50"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5 10C14.5 10 10 15.5 10 23C10 28.6 12.3 34 14.1 39.1C15.8 43.9 17.3 50.5 19.8 53C21.7 54.9 24.1 54.2 25.2 51.7C26.3 49.2 27.5 44 29.8 44H34.2C36.5 44 37.7 49.2 38.8 51.7C39.9 54.2 42.3 54.9 44.2 53C46.7 50.5 48.2 43.9 49.9 39.1C51.7 34 54 28.6 54 23C54 15.5 49.5 10 42.5 10C38.3 10 35.2 12.2 32 12.2C28.8 12.2 25.7 10 21.5 10Z"
                  fill="#FFFFFF"
                />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#38BDF8",
                  letterSpacing: "1px",
                }}
              >
                DR. DALIA DENTAL CLINIC
              </span>
              <span
                style={{
                  fontSize: "18px",
                  color: "#E2E8F0",
                }}
              >
                {isAr
                  ? "طب وجراحة وتجميل وزراعة الأسنان — الهرم، الجيزة"
                  : "Cosmetic Dentistry, Dental Implants & Orthodontics — Giza, Egypt"}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "12px 24px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              fontSize: "18px",
              fontWeight: 700,
              color: "#F8FAFC",
            }}
          >
            ★ 4.9 / 5.0
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: "54px",
              fontWeight: 800,
              lineHeight: 1.2,
              color: "#FFFFFF",
            }}
          >
            {isAr
              ? "عيادة د. داليا عبد الموجود زريع لطب وتجميل الأسنان"
              : "Dr. Dalia AbdElMougood Zariaa Dental Clinic"}
          </div>
          <div
            style={{
              fontSize: "26px",
              lineHeight: 1.5,
              color: "#CBD5E1",
            }}
          >
            {isAr
              ? "زراعة الأسنان الفورية • ابتسامة هوليود والفينير • تبييض الليزر • علاج الجذور بدون ألم"
              : "Dental Implants • Hollywood Smile & Veneers • Laser Whitening • Painless Root Canal"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#E2E8F0",
          }}
        >
          <span>📞 +20 101 857 1561</span>
          <span>📍 155 شارع الهرم — المطبعة، الجيزة</span>
          <span>🌐 drdaliadental.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
