"use client";

import { type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// 잔디 연도 선택 상자 - 값과 바뀔 때 할 일은 잔디 컴포넌트가 정함 (페이지 이동 없음)
type Props = {
  years: number[];
  value: string; // "" = 최근
  onChange: (year: string) => void;
  defaultLabel?: string;
  disabled?: boolean;
  lang?: Lang;
};

export default function YearSelector({ years, value, onChange, defaultLabel, disabled = false, lang = "ko" }: Props) {
  const t = useTranslations();
  defaultLabel ??= t("contrib.recentYear");
  return (
    <select
      aria-label={t("contrib.periodAria")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="text-xs bg-surface border border-line rounded-md px-2.5 py-1 text-foreground disabled:opacity-60"
    >
      <option value="">{defaultLabel}</option>
      {years.map((y) => (
        <option key={y} value={y}>
          {t("contrib.year", { y: String(y) })}
        </option>
      ))}
    </select>
  );
}
