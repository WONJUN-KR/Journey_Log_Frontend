"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";

// next/image + 로딩 중엔 원형 스피너, 로드 완료 시 스피너 fade-out · 이미지 fade-in 크로스페이드(0.5초)
// 스피너 오버레이는 이미지 형제로 absolute 배치 → 부모가 relative 여야 함 (fill 이미지는 원래 그럼)
// 열악한 환경 대비 (graceful degradation)
//  - JS 미실행: opacity 0 시작과 오버레이는 hydration 뒤에만 붙으므로 SSR 이미지는 그대로 보임
//  - hydration 지연: 그 사이 이미 로드된 이미지(img.complete)는 페이드 없이 바로 표시
//  - preload(LCP 후보): opacity 0 으로 시작하면 LCP 가 밀려서 페이드 없이, 스피너만 이미지 뒤(아래 레이어)에 둠
//  - 로드 실패(onError): 스피너를 계속 돌리지 않고 fallback 아이콘 - 무한 스피너는 "기다리면 뜬다"로 오해하게 만듦
// src 는 public 경로 문자열 (srcset 용 크기별 파일은 lib/image-loader 가 고름)
export default function SafeImage({ src, alt, className = "", onLoad, preload, ...rest }: ImageProps & { src: string }) {
  const ref = useRef<HTMLImageElement>(null);
  // mounted: hydration 완료 / done: 이미지 로드 완료 / fade: 크로스페이드 적용 여부
  const [view, setView] = useState({ mounted: false, done: false, fade: false });
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    const already = !!img && img.complete && img.naturalWidth > 0;
    setView({ mounted: true, done: already, fade: !preload && !already });
  }, [preload]);
  const { mounted, done, fade } = view;

  if (failed) {
    return (
      <span role="img" aria-label={alt} className="flex size-full items-center justify-center bg-surface text-muted/50">
        <ImageOff className="size-6" />
      </span>
    );
  }
  // 원형 스피너 - 굵은 stroke + round linecap(페이퍼로지 획 느낌). 트랙 surface-hover, 인디케이터 회색, 컨테이너의 45%·최대 56px
  // 0.3초 뒤에 나타남 - 빠르게 뜨는 이미지에선 안 보이고 느린 네트워크에서만 보임
  const spinner = (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-surface ${
        fade ? `transition-opacity duration-300 ${done ? "opacity-0" : "opacity-100"}` : ""
      }`}
    >
      <span className="flex w-[min(56px,45%)] aspect-square animate-spinner-in">
        <svg viewBox="0 0 48 48" className="size-full motion-safe:animate-spin [animation-duration:0.9s]">
          <circle cx="24" cy="24" r="19" fill="none" className="stroke-surface-hover" strokeWidth="6" />
          <circle cx="24" cy="24" r="19" fill="none" className="stroke-muted" strokeWidth="6" strokeLinecap="round" strokeDasharray="36 120" />
        </svg>
      </span>
    </span>
  );
  return (
    <>
      {/* preload: 스피너를 이미지 아래 레이어에 - 이미지가 그려지면 그대로 덮음 */}
      {mounted && preload && !done && spinner}
      <Image
        ref={ref}
        src={src}
        alt={alt}
        preload={preload}
        className={`${className} ${fade ? `transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}` : ""}`}
        onLoad={(e) => {
          setView((v) => ({ ...v, done: true }));
          onLoad?.(e);
        }}
        onError={() => setFailed(true)}
        {...rest}
      />
      {/* 그 외: 스피너 오버레이를 위에 두고 fade-out */}
      {fade && spinner}
    </>
  );
}
