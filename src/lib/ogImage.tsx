// 링크 미리보기(카톡·슬랙 등) 썸네일 그리기 - app/opengraph-image.tsx 가 씀 (빌드 때 1200x630 PNG)
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { Lang } from "@/i18n";

export const OG_SIZE = { width: 1200, height: 630 };

const BRAND = "WONJUN PORTFOLIO";
// tagline 은 줄 단위 배열
const TEXT: Record<Lang, { alt: string; name: string; tagline: string[]; taglineSize: number; sub: string }> = {
  ko: { alt: "오원준 포트폴리오 - 의료 IT 풀스택 개발자", name: "오원준", tagline: ["의료 IT 풀스택 개발자"], taglineSize: 68, sub: "CGM 의료기기 · Spring · Next.js · AWS" },
};
export const OG_ALT: Record<Lang, string> = { ko: TEXT.ko.alt };

// 이미지에 들어가는 글자만 Google Fonts 에서 잘라 받음 (satori 는 woff2 를 못 읽어서 ttf)
async function loadFont(weight: number, text: string): Promise<ArrayBuffer> {
  const css = await (
    await fetch(`https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(text)}`)
  ).text();
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("OG font not found");
  return (await fetch(url)).arrayBuffer();
}

export async function renderOgImage(lang: Lang): Promise<ImageResponse> {
  const { name: NAME, tagline: TAGLINE, taglineSize, sub: SUB } = TEXT[lang];
  const photo = await readFile(join(process.cwd(), "public/img/profile.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const allText = NAME + TAGLINE.join("") + SUB + BRAND;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 96px",
          background: "#e4e9f0",
          color: "#1e2a3b",
          fontFamily: "Noto Sans KR",
        }}
      >
        {/* 글자 칸은 폭을 정해 둠 - 길면 줄바꿈되고 사진은 그대로 (안 정하면 사진이 오른쪽 밖으로 밀림) */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <div style={{ fontSize: 30, fontWeight: 500, color: "#4b5565", marginBottom: 40 }}>{BRAND}</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: taglineSize, fontWeight: 500, lineHeight: 1.15, letterSpacing: -1.5 }}>
            {TAGLINE.map((line) => (
              <div key={line} style={{ whiteSpace: "nowrap" }}>{line}</div>
            ))}
          </div>
          <div style={{ fontSize: 44, fontWeight: 500, marginTop: 18 }}>{NAME}</div>
          <div style={{ fontSize: 28, fontWeight: 400, color: "#4b5565", marginTop: 28 }}>{SUB}</div>
        </div>
        <img
          src={photoSrc}
          alt=""
          width={320}
          height={320}
          style={{ flexShrink: 0, objectFit: "cover", objectPosition: "center 5%", borderRadius: 36, border: "2px solid rgba(30,42,59,0.08)" }}
        />
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Noto Sans KR", data: await loadFont(400, allText), weight: 400, style: "normal" },
        { name: "Noto Sans KR", data: await loadFont(500, allText), weight: 500, style: "normal" },
      ],
    },
  );
}
