import type { SkillItem } from "@/lib/api";
import { groupSkillsByKind } from "@/lib/about";
import { Chip, MOBILE_OPEN_ONLY, MobileMoreToggle } from "@/components/ui";
import { type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// Resume 역량 목록 - 키 순서대로 그림
const SKILL_GROUPS: { key: string; label: string }[] = [
  { key: "backend", label: "Backend" },
  { key: "frontend", label: "Frontend" },
  { key: "infra", label: "DevOps" },
];

// 분야를 위에서 아래로 쌓고, 분야 안에서는 세부 묶음을 한 줄씩 (이름 | 칩)
// 휴대폰은 언어 칩 + '외 N개'만 보이고 '전체 보기'로 펼침 → 분야별 칩 (세부 묶음 이름은 생략, 순서는 묶음 순서 그대로)
export default function SkillGroups({ skills, lang = "ko" }: { skills: Record<string, SkillItem[]>; lang?: Lang }) {
  const t = useTranslations();
  const groups = SKILL_GROUPS.filter((g) => skills[g.key]?.length);
  // 대표 = 언어만 분야 순서대로 (Backend → Frontend → DevOps) - 각 분야 첫 묶음이 언어(kind 이름은 언어마다 달라서 첫 묶음으로 판단)
  const preview = groups.flatMap((g) => skills[g.key].filter((x) => x.kind === skills[g.key][0]?.kind).map((x) => x.name));
  const total = groups.reduce((n, g) => n + skills[g.key].length, 0);
  return (
    <>
    <div className="group/more flex flex-col gap-3 sm:hidden">
      <div className="flex flex-wrap items-center gap-1.5 group-has-[:checked]/more:hidden">
        {preview.map((name) => (
          <Chip key={name}>{name}</Chip>
        ))}
        <span className="text-xs text-muted">{t("resume.skillsMore", { n: total - preview.length })}</span>
      </div>
      <div className={`flex-col gap-4 ${MOBILE_OPEN_ONLY}`}>
        {groups.map((g) => (
          <div key={g.key} className="flex flex-col gap-2">
            <span className="text-sm font-semibold">{g.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {groupSkillsByKind(skills[g.key]).flatMap((k) => k.items).map((x) => (
                <Chip key={x.name}>{x.name}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
      <MobileMoreToggle more={t("toggle.all")} lang={lang} />
    </div>
    <div className="flex flex-col gap-8 max-sm:hidden">
      {groups.map((g) => (
        <div key={g.key} className="flex flex-col gap-3">
          <span className="text-sm font-semibold">{g.label}</span>
          {groupSkillsByKind(skills[g.key]).map((k) => (
            <div key={k.kind ?? "all"} className={`grid grid-cols-1 sm:grid-cols-[110px_1fr] items-start gap-x-4 gap-y-1.5`}>
              {k.kind ? <span className="pt-1 text-xs text-muted">{k.kind}</span> : <span className="hidden sm:block" />}
              <div className="flex flex-wrap gap-2">
                {k.items.map((s) => (
                  <Chip key={s.name}>{s.name}</Chip>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}
