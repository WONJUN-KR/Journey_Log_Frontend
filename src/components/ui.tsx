import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import type { Tag } from "@/lib/api";
import { type Lang } from "@/i18n";
import { useTranslations } from "next-intl";

// 페이지 공용 UI 조각 - 색은 globals.css 토큰만 사용

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group inline-flex w-fit items-center gap-1.5 text-sm text-muted hover:text-foreground">
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
      {label}
    </Link>
  );
}

export function TagList({ tags }: { tags: Tag[] }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span key={tag.id} className="text-xs text-accent-2">
          #{tag.name}
        </span>
      ))}
    </div>
  );
}

export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded bg-surface text-muted">
      {children}
    </span>
  );
}

// 휴대폰 접기·펼치기 버튼 - 본문 글자와 구분되게 한 단계 밝은 면 + 테두리
// data-more-toggle 을 붙이면 접을 때 펼쳤던 화면 위치로 돌아감(components/MoreToggleScrollRestore)
export const MOBILE_TOGGLE =
  "inline-flex w-fit cursor-pointer select-none items-center gap-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 hover:text-foreground";

// 휴대폰 접기 묶음 - 바깥 상자에 group/more 를 주고 버튼(MobileMoreToggle)을 하나만 두면
// 안쪽의 MOBILE_OPEN_ONLY 붙은 것들이 그 버튼 하나로 같이 펼쳐지고 접힘 (JS 없이 체크박스 + :has). sm 이상은 항상 펼침
export const MOBILE_OPEN_ONLY = "max-sm:hidden max-sm:group-has-[:checked]/more:flex";
export const MOBILE_OPEN_ONLY_ITEM = "max-sm:hidden max-sm:group-has-[:checked]/more:list-item";
export const MOBILE_OPEN_ONLY_INLINE = "max-sm:hidden max-sm:group-has-[:checked]/more:inline";

// htmlFor 를 주면 같은 체크박스를 여는 버튼을 위·아래 두 군데 둘 수 있음 (체크박스는 MobileMoreInput 으로 앞에 한 번)
// more · less 를 안 주면 언어별 기본 문구(자세히 보기 · 접기 / More · Less)
export function MobileMoreToggle({ more, less, htmlFor, className = "", lang = "ko" }: {
  more?: string;
  less?: string;
  htmlFor?: string;
  className?: string;
  lang?: Lang;
}) {
  const t = useTranslations();
  more ??= t("toggle.more");
  less ??= t("toggle.less");
  // 체크박스가 버튼 안에 있으면 peer, 밖(htmlFor)에 있으면 바깥 group/more 의 :has 로 글자·화살표를 바꿈
  const [moreCls, lessCls, iconCls] = htmlFor
    ? ["group-has-[:checked]/more:hidden", "hidden group-has-[:checked]/more:inline", "group-has-[:checked]/more:rotate-180"]
    : ["peer-checked:hidden", "hidden peer-checked:inline", "peer-checked:rotate-180"];
  return (
    <label htmlFor={htmlFor} data-more-toggle="" className={`sm:hidden ${MOBILE_TOGGLE} ${className}`}>
      {!htmlFor && <input type="checkbox" className="peer sr-only" />}
      <span className={moreCls}>{more}</span>
      <span className={lessCls}>{less}</span>
      <ChevronDown className={`size-3.5 transition-transform ${iconCls}`} />
    </label>
  );
}

// sm 이상은 항상 펼쳐져 있고 이 체크박스를 여는 버튼(label)도 숨겨져서, 체크박스도 같이 숨김(sm:hidden)
// 안 숨기면 이름 없는 체크박스가 키보드 · 스크린리더에 그대로 잡힘 (라이트하우스 접근성 'label' 감점)
export function MobileMoreInput({ id }: { id: string }) {
  return <input id={id} type="checkbox" className="peer sr-only sm:hidden" />;
}

// 기술 칩 - 휴대폰은 바깥 group/more 버튼('자세히 보기')으로 같이 펼쳐짐
export function StackChips({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${MOBILE_OPEN_ONLY}`}>
      {items.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm text-muted">{children}</span>
  );
}

// 영어 작은 라벨(eyebrow)은 넘길 때만 보임
export function SectionHeader({ eyebrow, title, href, linkLabel }: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1 text-sm text-muted transition-colors duration-150 hover:text-foreground shrink-0"
        >
          {linkLabel}
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}

// 각 페이지 제목 - 상단 메뉴가 지금 페이지를 이미 보여 줘서 화면에는 안 그림(이력서처럼 본문부터 시작).
// 스크린 리더 · 검색엔진용 h1 만 남김. sr-only 는 absolute 라 부모 flex 간격(gap)을 차지하지 않음
export function PageHeader({ title }: { title: string }) {
  return <h1 className="sr-only">{title}</h1>;
}
