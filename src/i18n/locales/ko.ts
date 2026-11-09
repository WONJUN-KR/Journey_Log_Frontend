// 짧은 UI 문구 (한국어, next-intl 메시지) - 키는 점으로 이어 부름: t("home.greeting", { name })
// 형식은 ICU 메시지: {name} 자리 채움, 따옴표로 {} 를 감쌀 땐 '' 두 개(한 개는 이스케이프로 읽힘)
export const ko = {
  site: {
    name: "오원준 포트폴리오",
    description: "의료 IT 풀스택 개발자",
  },
  nav: {
    logoSuffix: " · PORTFOLIO",
    resume: "Resume",
    projects: "Projects",
    log: "Log",
    history: "History",
  },
  lang: {
    switch: {
      short: "EN",
      label: "English 버전으로 보기",
    },
  },
  meta: {
    resume: {
      title: "이력서",
      description: "경력 기술서",
    },
    projects: {
      title: "포트폴리오",
      description: "개인 프로젝트",
    },
    log: {
      title: "기록",
      description: "기술 블로그",
    },
    history: {
      title: "연혁",
      description: "연혁",
    },
    series: {
      description: "기술 블로그 시리즈 ''{name}'' - 글 {count}편을 순서대로 모아 봅니다.",
    },
  },
  notFound: {
    title: "페이지를 찾을 수 없어요",
    body: "주소가 바뀌었거나 없는 페이지예요.",
    home: "홈으로",
  },
  home: {
    taglineFallback: "풀스택 개발자",
    greeting: "{name}",
    contact: "연락하기",
    stat: {
      career: "경력",
      careerBasis: "UXN 재직 중",
    },
    experience: {
      title: "경력",
      link: "이력서 보기",
    },
    projects: {
      title: "포트폴리오",
      link: "프로젝트 모두 보기",
    },
    log: {
      title: "기록",
      link: "모든 글",
    },
    activity: {
      title: "활동",
    },
    cta: {
      title: "메일로 연락 주세요",
      body: "궁금한 점이나 제안이 있다면 편하게 연락 주세요.",
    },
  },
  status: {
    live: "운영 중",
    released: "앱 배포",
  },
  projects: {
    title: "포트폴리오",
    pinnedAria: "대표 프로젝트로 고정",
    pinned: "대표",
    lead: "팀장",
    features: "핵심 기능",
    myPart: "내가 맡은 부분",
    live: "라이브 보기",
  },
  gallery: {
    open: "화면 둘러보기",
    badgeShots: "{n}장",
    badgeVideos: "영상 {n}",
    openAria: "{title} 화면 둘러보기 - 스크린샷 {shots}장 · 영상 {videos}개",
    dialogAria: "{title} 화면 둘러보기",
    close: "닫기",
    prev: "이전",
    next: "다음",
  },
  toggle: {
    more: "자세히 보기",
    less: "접기",
    all: "전체 보기",
  },
  stack: {
    count: "기술 스택 {n}개",
  },
  resume: {
    pdf: "PDF 저장",
    pdfFile: "{name}_이력서",
    info: {
      career: "총 경력",
      currentAt: "{company} 재직 중",
      field: "전문 분야",
      fieldValue: "의료 IT (CGM)",
      fieldSub: "혈당 데이터 서비스",
      education: "최종 학력",
      educationValue: "대학교(4년) 졸업",
      educationSub: "정보통신학과",
      certs: "자격증",
      certsMore: "외 {n}개",
    },
    coverLetterEyebrow: "Cover Letter",
    coverLetter: "자기소개서",
    readAll: "전체 읽기",
    skills: "역량",
    skillsMore: "외 {n}개",
    experience: "경력",
    training: "교육",
    education: "학력",
    region: "지역 {v}",
    gpa: "학점 {v}",
    certifications: "자격증",
    etc: "취업 우대사항",
    military: "병역",
    portfolio: "포트폴리오",
    portfolioCount: "총 {n}건",
    teamSize: "팀 {n}명",
  },
  evidence: {
    aria: "측정 근거 보기",
    method: "방식",
    env: "환경",
    when: "시기",
  },
  history: {
    title: "연혁",
    other: "기타",
    current: "재직 중",
  },
  contrib: {
    recentYear: "최근 1년",
    recentMonths: "최근 {n}개월",
    year: "{y}년",
    periodAria: "잔디 기간 선택",
    unavailable: "잔디 데이터를 불러올 수 없습니다.",
    tooltip: "{date} - {n}건",
    unit: "건",
    combined: "(개인 + 회사 계정 합산)",
  },
  log: {
    title: "기록",
    seriesHeading: "시리즈",
    filterClear: "필터 해제",
    filterBy: "이 시리즈로 필터",
    countShort: "{n}개",
    countSuffix: "의 글",
    updatedPrefix: "",
    updatedSuffix: " 업데이트",
    filtered: "{n}개의 글",
    all: "전체 {n}개의 글",
    search: "제목, 내용, 태그로 검색",
    clearSeries: "시리즈 해제",
    empty: "아직 글이 없습니다.",
    noMatch: "조건에 맞는 글이 없어요.",
    pagesAria: "페이지",
    prevPages: "이전 10페이지",
    nextPages: "다음 10페이지",
    page: "{n}페이지",
  },
  series: {
    back: "기록으로",
    count: "{n}개 글",
    newest: "최신 순",
    oldest: "오래된 순",
  },
};

// 영어 사전이 따라야 하는 모양 - 키는 같고 값은 아무 문자열
export type Messages<T = typeof ko> = { [K in keyof T]: T[K] extends string ? string : Messages<T[K]> };
