"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_TIME_ZONE, formatDateIn, formatDateTimeIn, todayIn } from "@/lib/time";

// 보는 사람 시간대 - 서버 · 하이드레이션 중엔 기본 시간대(Asia/Seoul), 하이드레이션 뒤 브라우저 시간대로
// useSyncExternalStore 의 서버 스냅샷을 쓰면 하이드레이션 불일치 없이 한 번 다시 그림 (같은 시간대면 화면 변화 없음)
const subscribe = () => () => {};
const viewerTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIME_ZONE;
const serverTimeZone = () => DEFAULT_TIME_ZONE;

// locale = 날짜 형식 언어(ko-KR "2026년 1월 26일" · en-US "Jan 26, 2026"), 시간대와는 별개
// 시간대 약어(KST 등)는 날짜 옆에 붙이지 않고 마우스를 올리면 보이는 전체 시각에만
// numeric = "2026-01-26" 모양(홈 최근 글처럼 좁은 자리) - 저장값을 앞 10글자로 자르면 UTC 날짜가 나와서 그 시간대 날짜로 계산
export default function LocalDate({ iso, className = "", locale = "ko-KR", numeric = false }: { iso: string; className?: string; locale?: string; numeric?: boolean }) {
  const timeZone = useSyncExternalStore(subscribe, viewerTimeZone, serverTimeZone);
  return (
    <time dateTime={iso} title={formatDateTimeIn(iso, timeZone, locale)} className={className}>
      {numeric ? todayIn(timeZone, new Date(iso)) : formatDateIn(iso, timeZone, locale)}
    </time>
  );
}
