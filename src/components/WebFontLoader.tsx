"use client";

import { useEffect } from "react";

// 웹폰트(제목·본문 페이퍼로지 + 대체 글꼴 Pretendard)를 '첫 페인트가 실제로 그려진 뒤'에 등록
//
// 왜: CSS @font-face 로 두면 페이퍼로지 3개(굵기당 약 158KB, 합계 약 474KB)가 VeryHigh 우선순위로 받아지고,
// 라이트하우스 휴대폰 시뮬레이션(Lantern)은 '관측 첫 페인트 전에 끝난 VeryHigh 요청'을 첫 화면 비용으로 계산함
// → 폰트가 첫 페인트보다 먼저 끝난 회차만 FCP 1.2초 → 4.3초, 점수 97 → 69 (운영 9회 중 4회, 조건과 점수 9/9 일치)
// window load 뒤로 미룬 #97 은 첫 페인트가 load 보다 늦는 회차(load 0.33초 · 첫 페인트 1.3초)에서 여전히 먼저 끝나 실패
// → 기준을 load 가 아니라 'first-contentful-paint' 기록으로 바꿔서, 폰트 요청이 첫 페인트 뒤에만 시작되게 함
//
// 실제 화면: 첫 페인트는 시스템 글꼴 → 받아지면 페이퍼로지로 바뀜(swap 과 같은 방향, 바뀌는 시점만 첫 페인트 뒤)
// 등록만 하고 load() 는 안 부름 - 화면에서 실제로 쓰는 굵기만 브라우저가 받음
const FAMILY = "Paperozi";
const BASE = "https://cdn.jsdelivr.net/gh/projectnoonnu/2408-3@1.0";
const WEIGHTS: [string, string][] = [
  ["400", "Paperlogy-4Regular"],
  ["500", "Paperlogy-5Medium"],
];
// first-contentful-paint 기록을 못 받는 브라우저 대비 - load 뒤 이 시간이 지나면 그냥 등록
const FALLBACK_MS = 3000;

function registerFonts() {
  // 클라이언트 이동 · 재마운트 때 중복 등록 방지
  if ([...document.fonts].some((f) => f.family.replace(/"/g, "") === FAMILY)) return;
  for (const [weight, file] of WEIGHTS) {
    document.fonts.add(new FontFace(FAMILY, `url("${BASE}/${file}.woff2") format("woff2")`, { weight, display: "swap" }));
  }
  // 본문 대체 글꼴 Pretendard(npm, unicode-range 조각 CSS) - 같이 미루지 않으면 페이퍼로지 대신 이 조각들이 첫 페인트 전에 끝남(#97 측정)
  import("pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css");
}

export default function WebFontLoader() {
  useEffect(() => {
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      registerFonts();
    };

    let observer: PerformanceObserver | undefined;
    let timer: number | undefined;
    const fallback = () => {
      timer = window.setTimeout(run, FALLBACK_MS);
    };

    if (performance.getEntriesByName("first-contentful-paint").length > 0) {
      run();
    } else if (typeof PerformanceObserver !== "undefined" && PerformanceObserver.supportedEntryTypes?.includes("paint")) {
      observer = new PerformanceObserver((list) => {
        if (list.getEntriesByName("first-contentful-paint").length > 0) run();
      });
      observer.observe({ type: "paint", buffered: true });
    }
    // 관찰이 안 되거나 기록이 끝내 안 오는 경우의 안전장치
    if (document.readyState === "complete") fallback();
    else window.addEventListener("load", fallback, { once: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("load", fallback);
      if (timer) window.clearTimeout(timer);
    };
  }, []);
  return null;
}
