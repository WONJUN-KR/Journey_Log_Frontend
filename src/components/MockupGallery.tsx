"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ArrowLeftRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { Mockup } from "@/lib/projects";
import SafeImage from "@/components/SafeImage";
import { type Lang } from "@/i18n";
import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

type Slide =
  | { kind: "video"; webm: string; mp4: string; poster: string; caption: string }
  | { kind: "shot"; src: string; caption: string };

// 슬라이드 순서: 첫 흐름 영상(전체 흐름) → 스크린샷 → 나머지 영상
function toSlides(mockup: Mockup): Slide[] {
  const [first, ...rest] = mockup.videos.map((v) => ({ kind: "video" as const, ...v }));
  const shots = mockup.shots.map((s) => ({ kind: "shot" as const, ...s }));
  return [...(first ? [first] : []), ...shots, ...rest];
}

const SWIPE_THRESHOLD = 50; // px - 이보다 짧게 밀면 넘기지 않음
// 짝 프로젝트 팝업으로 넘어갈 때 쓰는 이벤트 - detail 에 열 프로젝트 slug
const OPEN_EVENT = "mockup:open";

// 프로젝트 화면 둘러보기 - 썸네일을 버튼으로 감싸 먼저 그리고, 팝업(<dialog>)을 열 때 처음으로 슬라이드를 렌더해서 그때부터 받음
// → /projects 첫 로드에는 이미지·영상 요청이 0개 (페이지 무게·라이트하우스 점수 영향 없음)
// 슬라이드는 현재 장과 바로 옆 장만 이미지를 렌더(나머지는 빈 자리)하고, 영상은 현재 장일 때만 <video> 를 붙여 받고 재생
// 넘기기: ‹ › 버튼 · 키보드 ← → · 터치 스와이프, 위치는 오른쪽 위 'n / 전체' (하단 점은 장 수가 많으면 휴대폰에서 두 줄로 넘쳐서 뺌)
// prefers-reduced-motion 이면 슬라이드 전환 애니메이션 없음
export default function MockupGallery({ slug, title, mockup, children, lang = "ko" }: { slug: string; title: string; mockup: Mockup; children: ReactNode; lang?: Lang }) {
  const t = useTranslations();
  const ref = useRef<HTMLDialogElement>(null);
  const startX = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slides = toSlides(mockup);
  const last = slides.length - 1;
  const go = (i: number) => setIndex(Math.max(0, Math.min(last, i)));

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      trackEvent("mockup_open", { project: slug });
    }
    // 팝업이 열려 있는 동안 뒤 페이지 스크롤 고정
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, slug]);

  // 다른 카드의 팝업에서 '○○ 보기'를 누르면 이 팝업을 첫 장부터 열기
  useEffect(() => {
    const onOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== slug) return;
      setIndex(0);
      setOpen(true);
    };
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOpen);
  }, [slug]);

  // 지금 팝업을 닫고, 뒤 페이지도 짝 카드 위치로 옮긴 뒤 짝 팝업을 엶
  const openRelated = (target: string) => {
    ref.current?.close();
    document.getElementById(target)?.scrollIntoView({ block: "start" });
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: target }));
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") startX.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) go(index + (dx < 0 ? 1 : -1));
  };

  const current = slides[index];
  const navButton = "absolute top-1/2 -translate-y-1/2 z-10 rounded-lg border border-line bg-surface p-2 hover:bg-surface-hover transition-colors duration-150 disabled:opacity-0 max-sm:p-1.5";

  return (
    <>
      {/* 썸네일(children)을 감싼 버튼 - 누르면 팝업. 오른쪽 아래 배지는 항상 보여서 휴대폰(마우스 없음)에서도 누를 수 있다는 게 보임 */}
      <button
        type="button"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        aria-label={t("gallery.openAria", { title, shots: mockup.shots.length, videos: mockup.videos.length })}
        className="group/shot relative block w-full cursor-pointer rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        {children}
        <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-black/70 px-3.5 py-2 text-sm font-semibold text-white transition-colors duration-150 group-hover/shot:bg-black/85 max-sm:right-2 max-sm:bottom-2 max-sm:px-3 max-sm:py-1.5 max-sm:text-[13px]">
          <Play className="size-4 fill-current max-sm:size-3.5" />
          {t("gallery.open")}
          <span className="font-normal text-white/75">
            · {t("gallery.badgeShots", { n: mockup.shots.length })}{mockup.videos.length > 0 && ` · ${t("gallery.badgeVideos", { n: mockup.videos.length })}`}
          </span>
        </span>
      </button>

      <dialog
        ref={ref}
        aria-label={t("gallery.dialogAria", { title })}
        onClose={() => setOpen(false)}
        // 바깥(backdrop) 클릭으로 닫기 - dialog 자신이 클릭 대상이면 안쪽 내용이 아닌 바깥
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] rounded-2xl border border-line bg-surface p-0 text-foreground backdrop:bg-black/70"
      >
        {open && (
          <div className="flex flex-col gap-4 p-5 sm:p-8 max-sm:p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold max-sm:text-lg">{title}</h3>
                {mockup.note && <p className="text-sm text-muted max-sm:text-[13px]">{mockup.note}</p>}
                {mockup.related && (
                  <button
                    type="button"
                    onClick={() => openRelated(mockup.related!.slug)}
                    className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-lg border border-line bg-background px-3 py-1.5 text-sm font-semibold text-accent-2 transition-colors duration-150 hover:bg-surface-hover"
                  >
                    <ArrowLeftRight className="size-4 shrink-0" />
                    {mockup.related.label}
                  </button>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm tabular-nums text-muted" aria-live="polite">
                  {index + 1} / {slides.length}
                </span>
                <button
                  type="button"
                  onClick={() => ref.current?.close()}
                  aria-label={t("gallery.close")}
                  className="rounded-lg border border-line p-2 transition-colors duration-150 hover:bg-surface-hover"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className="overflow-hidden rounded-lg border border-line bg-background touch-pan-y"
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={() => {
                  startX.current = null;
                }}
              >
                <div
                  className="flex transition-transform duration-300 motion-reduce:transition-none"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((s, i) => (
                    <div
                      key={s.kind === "video" ? s.mp4 : s.src}
                      className="relative aspect-[16/10] w-full shrink-0"
                      aria-hidden={i !== index}
                    >
                      {/* 현재 장 ±1 만 렌더 - 멀리 있는 장은 빈 자리로 두어 받지 않음 */}
                      {Math.abs(i - index) <= 1 &&
                        (s.kind === "video" && i === index ? (
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            preload="auto"
                            className="size-full object-contain"
                          >
                            <source src={s.webm} type="video/webm" />
                            <source src={s.mp4} type="video/mp4" />
                          </video>
                        ) : (
                          <SafeImage
                            src={s.kind === "video" ? s.poster : s.src}
                            alt={s.caption}
                            fill
                            sizes="(max-width: 1024px) 100vw, 960px"
                            className="object-contain"
                          />
                        ))}
                      {s.kind === "video" && i !== index && (
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <Play className="size-12 rounded-full bg-black/50 p-3 text-white" />
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label={t("gallery.prev")} className={`${navButton} left-2`}>
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => go(index + 1)} disabled={index === last} aria-label={t("gallery.next")} className={`${navButton} right-2`}>
                <ChevronRight className="size-5" />
              </button>
            </div>

            <p className="inline-flex items-center gap-1.5 text-sm text-muted min-h-[1.5em]">
              {current.kind === "video" && <Play className="size-3.5 shrink-0 text-accent-2" />}
              {current.caption}
            </p>
          </div>
        )}
      </dialog>
    </>
  );
}
