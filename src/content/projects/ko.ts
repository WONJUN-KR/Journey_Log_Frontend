import type { Project } from "@/lib/projects";

// 프로젝트 데이터 - 사진 · 영상 경로, 기술 스택, 링크, 상태. 프로젝트를 추가 · 삭제하면 PROJECT_SLUGS 도 같이
export const PROJECT_SLUGS = ["gotcha", "ai-auto-posting", "cos-house", "eureka-2021"] as const;
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export const PROJECTS_KO: (Project & { slug: ProjectSlug })[] = [
  {
    slug: "gotcha",
    title: "GOTCHA",
    subtitle: "가챠샵 지도 서비스 · App Store 출시",
    period: "2026.01 ~ 2026.11",
    role: "9인 팀(디자인 포함) · 풀스택",
    tagline: "근처 가챠샵을 지도에서 찾고, 리뷰와 제보로 함께 채워가는 서비스",
    features: [
      "지도에서 주변 가챠샵 찾기 - 핀을 누르면 미리보기, 이 지역 다시 검색",
      "매장 정보·리뷰 보고 즐겨찾기",
      "새 가챠샵 제보 - 지도에서 위치를 찍으면 주소가 자동으로",
      "새 소식 알림 받기",
    ],
    myPart: [
      "[FE] 홈 지도 탐색 - 핀 미리보기 바텀시트(3단 스냅), 뒤로가기 시 위치·줌 복원",
      "[FE] 제보 등록 흐름 전체, 마이페이지·내가 제보한 업체",
      "[FE+BE] 신고·차단, Web Push 알림(구독 화면 + 발송 서버)",
      "초기 세팅·GitHub Actions CI/CD, 웹 성능 최적화(Critical CSS·폰트·preconnect)",
    ],
    stack: ["Java", "TypeScript", "Spring Boot", "Next.js", "Capacitor", "Spring Security", "JPA", "React", "Tailwind CSS", "TanStack Query", "Zustand", "카카오맵", "PostgreSQL", "Redis", "Docker", "GitHub Actions", "AWS S3", "Vercel", "Sentry"],
    repos: [
      { label: "Frontend", url: "https://github.com/fcde-project9/GOTCHA-FE" },
      { label: "Backend", url: "https://github.com/fcde-project9/GOTCHA-BE" },
    ],
    thumbnail: "/projects/gotcha.png",
    mobileThumbPosition: "max-sm:object-center", // 휴대폰에서 썸네일을 납작하게 자를 때 가운데 G 마크가 잘리지 않게
    status: "released",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/gotcha/flow-1-first-launch.webm", mp4: "/projects/mockups/gotcha/flow-1-first-launch.mp4", poster: "/projects/mockups/gotcha/01-login.jpg", caption: "첫 실행 - 게스트 → 약관 → 알림 → 홈" },
        { webm: "/projects/mockups/gotcha/flow-2-find.webm", mp4: "/projects/mockups/gotcha/flow-2-find.mp4", poster: "/projects/mockups/gotcha/08-pin-preview.jpg", caption: "찾기 - 위치 검색 → 핀 미리보기 → 상세 · 리뷰" },
        { webm: "/projects/mockups/gotcha/flow-3-map.webm", mp4: "/projects/mockups/gotcha/flow-3-map.mp4", poster: "/projects/mockups/gotcha/13b-list-expanded.jpg", caption: "지도 탐색 - 재검색 → 목록 → 지도 유지" },
        { webm: "/projects/mockups/gotcha/flow-4-report.webm", mp4: "/projects/mockups/gotcha/flow-4-report.mp4", poster: "/projects/mockups/gotcha/16-report-form-filled.jpg", caption: "제보 - 위치 지정 → 중복 확인 → 정보 입력" },
      ],
      shots: [
        { src: "/projects/mockups/gotcha/01-login.jpg", caption: "첫 화면 - 소셜 로그인 · 게스트 둘러보기" },
        { src: "/projects/mockups/gotcha/04-home.jpg", caption: "홈 - 지도에 주변 가챠샵 핀 + 아래 목록(거리순)" },
        { src: "/projects/mockups/gotcha/06-search-typing.jpg", caption: "위치 검색 - 입력하는 대로 장소 자동완성" },
        { src: "/projects/mockups/gotcha/07-search-result.jpg", caption: "검색한 위치 주변 가챠샵 - 영업 중 · 거리 표시" },
        { src: "/projects/mockups/gotcha/08-pin-preview.jpg", caption: "핀 미리보기 - 주소 · 영업 시간 · 사진" },
        { src: "/projects/mockups/gotcha/09-detail.jpg", caption: "매장 상세 - 영업 정보 · 매장 사진 · 방문 리뷰" },
        { src: "/projects/mockups/gotcha/11-detail-reviews.jpg", caption: "방문 리뷰 - 사진과 함께" },
        { src: "/projects/mockups/gotcha/13b-list-expanded.jpg", caption: "목록을 끝까지 올려 주변 매장 한눈에" },
        { src: "/projects/mockups/gotcha/14-report-map.jpg", caption: "제보 - 위치를 찍으면 주소 자동 입력" },
        { src: "/projects/mockups/gotcha/15-report-duplicate.jpg", caption: "50m 안 중복 가챠샵 먼저 확인" },
        { src: "/projects/mockups/gotcha/16-report-form-filled.jpg", caption: "매장 정보 등록 - 매장명 · 위치 힌트 · 영업일" },
        { src: "/projects/mockups/gotcha/19-community.jpg", caption: "커뮤니티 - 갓챠일상 · 궁금해요 · 거래해요" },
      ],
    },
  },
  {
    slug: "ai-auto-posting",
    title: "AI Auto Posting",
    subtitle: "블로그 콘텐츠 자동 발행 플랫폼",
    period: "2025.11 ~ 2025.12",
    role: "6인 팀 · 풀스택",
    lead: true,
    tagline: "트렌드 키워드로 AI가 블로그 글을 쓰고, 연결한 블로그에 자동 발행",
    features: [
      "블로그 계정을 연결하고 발행 워크플로우 등록",
      "트렌드 키워드 수집 → AI 글 생성 → 자동 발행",
      "발행 기록·결과 확인",
    ],
    myPart: [
      "[리드] 주제 선정·역할 분배·일정 조율, 팀 협업 규칙 정립",
      "[BE] 관리자 통계 API - 사용자·포스팅·블로그 플랫폼별 발행 통계, AI 토큰 사용량",
      "[BE] 일별 통계 자동 집계 스케줄러, 통계 쿼리 최적화(ISO 주차 버그 수정)",
      "[BE] 관리자 사용자 관리(본인·관리자 정지 방지), 공통코드 관리",
      "[FE] 관리자 대시보드 추이 그래프·통계 테이블 페이징·공통코드 페이지",
    ],
    stack: ["Java", "TypeScript", "Spring Boot", "JPA", "RabbitMQ", "React", "PostgreSQL"],
    repos: [
      { label: "Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend" },
      { label: "Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend" },
    ],
    logo: "/projects/ocp.png",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/ai-auto-posting/flow-1-register-and-run.webm", mp4: "/projects/mockups/ai-auto-posting/flow-1-register-and-run.mp4", poster: "/projects/mockups/ai-auto-posting/02-workflow-settings.jpg", caption: "설정 → 테스트 실행 → 완료 → 등록" },
        { webm: "/projects/mockups/ai-auto-posting/flow-2-result.webm", mp4: "/projects/mockups/ai-auto-posting/flow-2-result.mp4", poster: "/projects/mockups/ai-auto-posting/05-generated-post.jpg", caption: "생성된 글 확인 → 단계별 실행 로그" },
      ],
      shots: [
        { src: "/projects/mockups/ai-auto-posting/01-home.jpg", caption: "메인" },
        { src: "/projects/mockups/ai-auto-posting/02-workflow-settings.jpg", caption: "워크플로우 설정 - 반복 규칙 · 카테고리" },
        { src: "/projects/mockups/ai-auto-posting/03-run-in-progress.jpg", caption: "테스트 실행 - 진행 중" },
        { src: "/projects/mockups/ai-auto-posting/04-run-completed.jpg", caption: "테스트 완료 - AI 글 생성 · 블로그 업로드 성공" },
        { src: "/projects/mockups/ai-auto-posting/05-generated-post.jpg", caption: "생성된 글 - 상품 · 키워드 · 본문" },
        { src: "/projects/mockups/ai-auto-posting/06-step-logs.jpg", caption: "실행 로그 - 크롤링 → AI 생성 → 포스팅" },
      ],
    },
  },
  {
    slug: "cos-house",
    title: "Co's House",
    subtitle: "인테리어 커뮤니티 + 쇼핑 플랫폼",
    period: "2025.09 ~ 2025.10",
    role: "5인 팀 · 풀스택",
    lead: true,
    tagline: "'오늘의 집'처럼 인테리어 이야기를 나누고 상품까지 사는 커머스",
    features: [
      "인테리어 상품 검색·구매(토스 결제)",
      "인테리어 커뮤니티 - 글·댓글",
      "구매 후기와 마이페이지",
    ],
    myPart: [
      "[리드] 주제 선정·역할 분배·일정 조율, 팀 협업 규칙 정립",
      "[BE] 마이페이지 - 회원정보 수정·구매 후기·회원 탈퇴",
      "[BE] 관리자 상품 관리·검색, 주문 관리",
      "[BE] 커뮤니티 댓글·게시글 수정",
      "화면(Thymeleaf)·CSS 리팩토링",
    ],
    stack: ["Java", "Spring Boot", "JPA", "Querydsl", "Thymeleaf", "MySQL"],
    repos: [{ label: "Repo", url: "https://github.com/WONJUN-KR/Co-s_House" }],
    logo: "/projects/coshouse.png",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/cos-house/shop-flow.webm", mp4: "/projects/mockups/cos-house/shop-flow.mp4", poster: "/projects/mockups/cos-house/03-shop.jpg", caption: "쇼핑 → 상품 상세 → 장바구니" },
        { webm: "/projects/mockups/cos-house/community-flow.webm", mp4: "/projects/mockups/cos-house/community-flow.mp4", poster: "/projects/mockups/cos-house/19-post-detail.jpg", caption: "집들이 목록 → 글 상세 → 댓글" },
      ],
      shots: [
        { src: "/projects/mockups/cos-house/01-home.jpg", caption: "메인" },
        { src: "/projects/mockups/cos-house/03-shop.jpg", caption: "쇼핑 - 카테고리 탭 · 상품 목록" },
        { src: "/projects/mockups/cos-house/04-product-detail.jpg", caption: "상품 상세 - 옵션 · 장바구니 / 구매" },
        { src: "/projects/mockups/cos-house/18-community.jpg", caption: "커뮤니티 - 집들이 목록" },
        { src: "/projects/mockups/cos-house/19-post-detail.jpg", caption: "집들이 상세 - 사진 슬라이드 · 댓글" },
        { src: "/projects/mockups/cos-house/14-mypage-reviews.jpg", caption: "마이페이지 - 내가 쓴 구매 후기" },
        { src: "/projects/mockups/cos-house/20-admin.jpg", caption: "관리자 대시보드" },
        { src: "/projects/mockups/cos-house/21-admin-products.jpg", caption: "관리자 상품 관리 · 검색" },
        { src: "/projects/mockups/cos-house/26-mobile-home.jpg", caption: "휴대폰 화면 (390px)" },
      ],
    },
  },
  {
    slug: "eureka-2021",
    title: "유레카 (2021)",
    subtitle: "여행 장소 공유 커뮤니티 · 2021 국비 과정 팀 프로젝트",
    period: "2021",
    role: "3인 팀 · 풀스택",
    tagline: "혼자 알기 아까운 여행지를 사진과 함께 공유하는 JSP 커뮤니티",
    features: [
      "지역(시·도 → 도시)·테마 메가 메뉴로 장소 찾기",
      "단계별 글쓰기 창: 카테고리 → 지역 → 누구와 → 세부 테마 → 사진 → 업로드",
      "이 달의 Best 픽 · 떠나기 좋은 도시 · 읽기 창",
    ],
    myPart: [
      "[2026 복원] DB 덤프 없이 DAO SQL로 스키마를 거꾸로 설계해 Oracle(docker)에 재구성",
      "[2026 복원] 코드에 박혀 있던 DB 접속 정보를 환경변수 설정으로 분리",
      "[2026 복원] Tomcat 9 + Oracle 한 줄 실행 스크립트, 화면 캡처 · 흐름 영상 정리",
    ],
    stack: ["Java", "Servlet", "JSP", "JDBC", "jQuery", "Oracle", "Tomcat"],
    repos: [{ label: "Repo", url: "https://github.com/WONJUN-KR/Eureka-2021" }],
    // 원본 배너 사진(흐림·어둡게) + 원본 흰색 헤더 로고로 합성한 썸네일
    thumbnail: "/projects/mockups/eureka-2021/thumb.jpg",
    status: "local",
    device: "laptop",
    mockup: {
      videos: [
        { webm: "/projects/mockups/eureka-2021/main-scroll.webm", mp4: "/projects/mockups/eureka-2021/main-scroll.mp4", poster: "/projects/mockups/eureka-2021/01-main-banner.jpg", caption: "메인 화면 - 배너 · 메뉴 · Best 픽" },
        { webm: "/projects/mockups/eureka-2021/write-flow.webm", mp4: "/projects/mockups/eureka-2021/write-flow.mp4", poster: "/projects/mockups/eureka-2021/14-write-modal.jpg", caption: "단계별 글쓰기 → 저장 → 읽기 창" },
      ],
      shots: [
        { src: "/projects/mockups/eureka-2021/01-main-banner.jpg", caption: "메인 배너" },
        { src: "/projects/mockups/eureka-2021/02-main-megamenu.jpg", caption: "지역·테마 메가 메뉴" },
        { src: "/projects/mockups/eureka-2021/04-main-bestpick.jpg", caption: "이 달의 Best 픽" },
        { src: "/projects/mockups/eureka-2021/05-main-recommend.jpg", caption: "떠나기 좋은 도시" },
        { src: "/projects/mockups/eureka-2021/08-boardlist.jpg", caption: "게시글 목록" },
        { src: "/projects/mockups/eureka-2021/10-read-popup.jpg", caption: "읽기 창" },
        { src: "/projects/mockups/eureka-2021/14-write-modal.jpg", caption: "단계별 글쓰기 창" },
      ],
    },
  },
];
