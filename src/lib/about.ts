import type { AboutContent, SkillItem } from "@/lib/api";
import { ABOUT_KO, HOME_HIGHLIGHTS_KO } from "@/content/about/ko";

export { totalCareerPeriod } from "@/lib/career";

// 스킬을 kind 별로 묶음 (처음 나온 순서 유지, kind 없으면 한 덩어리)
export function groupSkillsByKind(items: SkillItem[]): { kind?: string; items: SkillItem[] }[] {
  const groups: { kind?: string; items: SkillItem[] }[] = [];
  for (const s of items) {
    const g = groups.find((x) => x.kind === s.kind);
    if (g) g.items.push(s);
    else groups.push({ kind: s.kind, items: [s] });
  }
  return groups;
}

export function getAbout(): AboutContent {
  return ABOUT_KO;
}

// 홈 숫자 카드 - 커밋 수 대신 결과 지표 (basis = 근거 한 줄)
export function getHomeHighlights(): { label: string; value: string; basis: string }[] {
  return HOME_HIGHLIGHTS_KO;
}
