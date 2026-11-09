import type { CareerItem } from "@/lib/api";
import { monthIn, yearIn } from "@/lib/time";

// "2022.05 ~ 2024.04" / "2026.03 ~ 재직중" → 시작·끝 달 포함 개월 수 (잡사이트와 같은 셈법)
// 기준은 한국어 데이터의 기간 문자열
function careerMonths(period: string, now: Date): number {
  const m = period.match(/(\d{4})\.(\d{1,2})\s*~\s*(?:(\d{4})\.(\d{1,2})|재직중)/);
  if (!m) return 0;
  const start = Number(m[1]) * 12 + Number(m[2]);
  // 재직중은 사이트 기준 시간대(KST)의 이번 달까지 - 서버 시계(UTC) 기준이면 매월 1일 00~09시에 한 달 덜 셈
  const end = m[3] ? Number(m[3]) * 12 + Number(m[4]) : yearIn(undefined, now) * 12 + monthIn(undefined, now);
  return Math.max(0, end - start + 1);
}

// 경력 기간 합계 - 오늘 날짜 기준으로 자동 계산 (재직중이면 매달 늘어남). "2년 10개월"
export function totalCareerPeriod(careers: CareerItem[], now = new Date()): string {
  const total = careers.reduce((sum, c) => sum + careerMonths(c.period, now), 0);
  const years = Math.floor(total / 12);
  const months = total % 12;
  return [years && `${years}년`, months && `${months}개월`].filter(Boolean).join(" ") || "0개월";
}
