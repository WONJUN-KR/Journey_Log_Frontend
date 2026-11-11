// 링크 미리보기(카톡·슬랙 등) 썸네일 그리기 - app/opengraph-image.tsx 가 씀 (빌드 때 1200x630 PNG)
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Lang } from "@/i18n";

export const OG_SIZE = { width: 1200, height: 630 };

// 명함의 연락처 자리 - 주소 모양만으로 무엇인지 보여서 라벨 없이 값만
const CONTACTS = ["wonjun.page", "dnjswns0010@naver.com", "github.com/WONJUN-KR"];
// tagline 은 줄 단위 배열
const TEXT: Record<Lang, { alt: string; name: string; tagline: string[]; taglineSize: number; sub: string }> = {
  ko: { alt: "오원준 포트폴리오 - 의료 IT 풀스택 개발자", name: "오원준", tagline: ["의료 IT 풀스택 개발자"], taglineSize: 68, sub: "연속혈당측정(CGM) 웹 서비스" },
};
export const OG_ALT: Record<Lang, string> = { ko: TEXT.ko.alt };

// 사이트와 같은 페이퍼로지(SIL OFL 1.1) - satori 는 woff2 를 못 읽어서 ttf 로 바꿔 assets/fonts 에 둠 (빌드 때만 읽음)
const loadFont = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

export async function renderOgImage(lang: Lang): Promise<ImageResponse> {
  const { name: NAME, tagline: TAGLINE, taglineSize, sub: SUB } = TEXT[lang];
  const photo = await readFile(join(process.cwd(), "public/img/profile.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  // 명함 배치 - 왼쪽 사진(명함의 로고 자리), 오른쪽 이름 · 직함 / 연락처 / 맨 아래 하는 일
  // 연락처는 사이트에 이미 공개된 것만(전화번호 · 회사 메일 · 주소는 넣지 않음)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 96,
          padding: "0 128px",
          background: "#e4e9f0",
          color: "#1e2a3b",
          fontFamily: "Paperozi",
        }}
      >
        <img
          src={photoSrc}
          alt=""
          width={300}
          height={300}
          style={{ flexShrink: 0, objectFit: "cover", objectPosition: "center 5%", borderRadius: 20, border: "2px solid rgba(30,42,59,0.08)" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1.1 }}>{NAME}</div>
          <div style={{ fontSize: 30, fontWeight: 400, color: "#4b5565", marginTop: 16 }}>{TAGLINE.join(" ")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 48, fontSize: 26, color: "#4b5565" }}>
            {CONTACTS.map((value) => (
              <div key={value}>{value}</div>
            ))}
          </div>
          <div style={{ fontSize: 26, fontWeight: 500, marginTop: 48 }}>{SUB}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Paperozi", data: await loadFont("Paperlogy-4Regular.ttf"), weight: 400, style: "normal" },
        { name: "Paperozi", data: await loadFont("Paperlogy-5Medium.ttf"), weight: 500, style: "normal" },
      ],
    },
  );
}
