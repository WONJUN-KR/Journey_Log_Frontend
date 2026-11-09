import type { RoadmapItem } from "@/lib/api";
import { HISTORY_KO } from "@/content/history/ko";

// 언어별 연혁 - period(YYYY.MM)로 연도별로 묶여 최신이 위로
export function getHistory(): RoadmapItem[] {
  return HISTORY_KO;
}
