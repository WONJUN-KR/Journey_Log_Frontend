import type { RoadmapItem } from "@/lib/api";

// 연혁(History) 데이터 - 노션·DB 동기화 대신 코드로 관리 (수정 이력이 커밋으로 남음). period(YYYY.MM)로 연도별로 묶여 최신이 위로
export const HISTORY_KO: RoadmapItem[] = [
  { id: 20, slug: "bucheon-univ-start", title: "부천대학교 입학", description: "정보통신학과 입학", period: "2019.03", story: null, status: "LEARNED", targetDate: null, sortOrder: 1 },
  { id: 19, slug: "bucheon-univ-grad", title: "부천대학교 졸업", description: "전문학사 졸업", period: "2021.02", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 2 },
  { id: 17, slug: "hta-backend-bootcamp", title: "중앙 HTA 백엔드 과정", description: "국비 백엔드 부트캠프", period: "2021.07", story: null, status: "LEARNED", targetDate: null, sortOrder: 4 },
  { id: 16, slug: "jeongsan-sanup-pass", title: "정보처리산업기사 취득", description: "한국산업인력공단", period: "2021.08", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 5 },
  { id: 21, slug: "hta-complete", title: "중앙 HTA 수료", description: "웹 콘텐츠 개발을 위한 응용SW엔지니어링 양성과정", period: "2022.01", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 5 },
  { id: 15, slug: "sangsang-join", title: "상상스토리 입사", description: "첫 회사, 풀스택 개발 신입", period: "2022.03", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 6 },
  { id: 14, slug: "credit-bank-start", title: "학점은행제 시작", description: "학사 학위 준비", period: "2022.05", story: null, status: "LEARNED", targetDate: null, sortOrder: 7 },
  { id: 13, slug: "jeongsan-gisa", title: "정보처리기사 취득", description: "한국산업인력공단", period: "2023.06", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 8 },
  { id: 11, slug: "network-admin", title: "네트워크 관리사 2급", description: "한국정보통신자격협회", period: "2023.10", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 10 },
  { id: 10, slug: "credit-bank-grad", title: "학점은행제 졸업", description: "학사 학위 취득", period: "2024.02", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 11 },
  { id: 9, slug: "sqld-pass", title: "SQLD 취득", description: "한국데이터베이스진흥센터", period: "2024.04", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 12 },
  { id: 8, slug: "sangsang-leave", title: "상상스토리 퇴사", description: "첫 회사 퇴사", period: "2024.04", story: null, status: "LEARNED", targetDate: null, sortOrder: 13 },
  { id: 5, slug: "compuzone-join", title: "컴퓨존 입사", description: "두 번째 회사 합류", period: "2024.12", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 16 },
  { id: 4, slug: "compuzone-leave", title: "컴퓨존 퇴사", description: "두 번째 회사 퇴사", period: "2025.04", story: null, status: "LEARNED", targetDate: null, sortOrder: 17 },
  { id: 3, slug: "kernel-academy", title: "커널아카데미", description: "커널아카데미 수강", period: "2025.06", story: null, status: "LEARNED", targetDate: null, sortOrder: 18 },
  { id: 22, slug: "kernel-academy-complete", title: "커널아카데미 수료", description: "AI 융합 백엔드 개발 부트캠프", period: "2025.12", story: null, status: "SUCCEEDED", targetDate: null, sortOrder: 18 },
  { id: 2, slug: "uxn-join", title: "UXN 입사", description: "연속혈당측정(CGM) 의료기기 기업 · 풀스택 개발", period: "2026.03", story: null, status: "IN_PROGRESS", targetDate: null, sortOrder: 19 },
];
