"use client";

import { useEffect } from "react";

// 휴대폰 접기 · 펼치기 버튼 공통 - 접으면 펼쳤던 그 화면 위치로 되돌림
// 대상: data-more-toggle 이 붙은 <label>(체크박스 토글: MobileMoreToggle · 자기소개서 '전체 읽기') 과 <summary>(<details>)
// 버튼 위쪽 내용이 줄어들면 스크롤 위치는 그대로라 버튼이 화면 위로 사라지고 다음 구역이 보임
// → 펼칠 때 window.scrollY 를 그 체크박스 · details 에 기억했다가, 접힌 뒤 다음 프레임에 그 위치로 scrollTo
// 접힌 모양은 펼치기 전과 같아서 화면이 그대로 복원됨. 기억한 값이 없으면(새로고침 뒤 등) 버튼이 화면 속 같은 자리에 오도록 보정
// 위치 이동은 scrollTo(x, y) 숫자 인자로 - behavior: 'instant' 는 옛 Safari 가 모르는 값이라 옵션 객체를 쓰지 않음 (사이트에 smooth 스크롤 설정 없음)
// 문서에 클릭 리스너 하나만 둠(버튼마다 클라이언트 컴포넌트를 만들지 않음) - layout 에 한 번 마운트
const openedAt = new WeakMap<Element, number>();

export default function MoreToggleScrollRestore() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // 체크박스를 품은 label 은 클릭 한 번에 label → 안쪽 input 순서로 click 이 두 번 옴 → input 에서 온 두 번째는 무시
      if (e.target instanceof HTMLInputElement) return;
      const toggle = (e.target as Element | null)?.closest?.("[data-more-toggle]");
      if (!toggle) return;
      // 상태를 가진 요소: label → 연결된 체크박스, summary → 바깥 details
      const target = toggle instanceof HTMLLabelElement ? toggle.control : toggle.parentElement;
      const isOpen = target instanceof HTMLInputElement ? target.checked : target instanceof HTMLDetailsElement ? target.open : null;
      if (!target || isOpen === null) return;
      if (!isOpen) {
        openedAt.set(target, window.scrollY);
        return;
      }
      const saved = openedAt.get(target);
      const before = toggle.getBoundingClientRect().top;
      // 기본 동작(체크 해제 · details 닫힘)으로 다시 그려진 다음 프레임에 위치 복원
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (saved !== undefined) window.scrollTo(0, saved);
          else window.scrollBy(0, toggle.getBoundingClientRect().top - before);
          openedAt.delete(target);
        }),
      );
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
