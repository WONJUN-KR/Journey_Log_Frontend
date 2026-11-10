import type { AboutContent } from "@/lib/api";
import { totalCareerPeriod } from "@/lib/career";

// 이력서 데이터 - 홈(/)과 Resume(/resume)이 함께 씀
// 경력 · 학력 id 가 언어끼리 안 맞으면 빌드 때 경고(lib/about.ts) - 항목을 추가 · 삭제하면 en.ts 도 같이

// 홈 숫자 카드 - 커밋 수 대신 결과 지표. 아래 careers 문구에 있는 숫자만 씀 (basis = 근거 한 줄)
export const HOME_HIGHLIGHTS_KO: { label: string; value: string; basis: string }[] = [
  { label: "신규 구축", value: "3개", basis: "혈당·센서·회의록 도구" },
  { label: "무중단 배포", value: "3개 서비스", basis: "blue/green 전환 · 헬스체크" },
  { label: "AWS 이전", value: "2건", basis: "혈당 서비스 · 파생 서비스" },
];

// 이력서 데이터 - 홈(/)과 Resume(/resume)이 함께 씀. DB 대신 코드로 관리해서 수정 이력이 커밋으로 남음
export const ABOUT_KO: AboutContent = {
  profile: {
    name: "오원준",
    tagline: "의료 IT 풀스택 개발자",
    email: "dnjswns0010@naver.com",
    region: "경기 시흥",
    // 읽을 때마다 careers 기간으로 계산
    get careerPeriod() {
      return totalCareerPeriod(ABOUT_KO.careers);
    },
    isEmployed: true,
    contacts: {
      githubPersonal: "https://github.com/WONJUN-KR",
      blog: "https://blog.naver.com/wonjun13_",
      linkedin: "https://www.linkedin.com/in/wonjun1013/",
    },
    intro:
      "연속혈당측정(CGM) 의료기기 기업에서 의료 데이터 기반 웹 서비스와 사내 실험 데이터 플랫폼을 프론트엔드부터 백엔드·인프라까지 담당하고 있습니다. " +
      "온프레미스 서비스의 AWS 이전, CI/CD 및 무중단 배포 체계 구축, 레거시 시스템 보안 정비를 주도했습니다.",
  },
  careers: [
    {
      id: "uxn",
      logo: "/logos/uxn.jpg",
      company: "(주)유엑스엔",
      position: "연구소",
      role: "풀스택 개발",
      period: "2026.03 ~ 재직중",
      isCurrent: true,
      summary: "연속혈당측정 의료기기 웹 서비스·사내 데이터 플랫폼·IoT 플랫폼 6개 프로젝트 동시 담당 (개발부터 인프라·배포까지)",
      projects: [
        {
          title: "환자용 연속혈당 모니터링 서비스 - AWS 이전·배포 전담, 관리자 콘솔 신규 구축",
          period: "2026.04 ~ 진행중",
          details: [
            {
              text: "온프레미스 서비스를 AWS(EC2·RDS)로 이전하고, 34만여 행의 테이블별 행 수를 대조해 이전 결과 확인",
              evidence: {
                method: "기존 서버 정지 → 최종 DB 동기화 → 도메인 전환 → 동작 확인. 정지~확인 약 2분 44초(명령 출력 시각 기준, DNS TTL 때문에 사용자별로 더 길 수 있음), 10개 테이블 행 수 일치",
                env: "운영",
                when: "2026.08",
              },
            },
            {
              text: "키를 서버에 두지 않는 CI/CD와 nginx blue/green 무중단 배포 - dev 첫 전환에서 외부 점검 236회 실패 0 확인 후 운영 적용",
              evidence: {
                method: "배포가 도는 동안 0.5초마다 로그인 API 호출, 정상 응답이 아니면 실패로 셈",
                env: "dev 서버",
                when: "2026.09",
              },
            },
            {
              text: "일일 리포트의 반복 조회를 정리해 쿼리 29회 → 3회",
              evidence: {
                method: "구간별 측정으로 반복 쿼리를 찾아 반복문 안의 같은 조회를 밖으로 꺼냄",
                env: "로컬 환경 + 운영 DB",
                when: "2026.08",
              },
            },
            "웹·앱 혈당 계산 규칙을 통일해 일치율 약 40% → 100%",
            "사용자·기기·권한 관리 콘솔 신규 구축, 권한 체계를 코드 기반으로 무중단 전환",
            "시간 저장은 UTC, React 화면은 사용자 현지 시간으로 전환 - jest + jsdom 골든 테스트로 한국 시간 화면 동일 확인",
            "주기적 데이터 처리 스케줄러·FCM 푸시 출시, 처리 로직 교체 시 저장값 전수 재계산·일치 검증",
          ],
        },
        {
          title: "사내 센서 실험 데이터 분석 플랫폼 - 형상관리·보안·배포 체계 최초 구축",
          period: "2026.04 ~ 진행중",
          details: [
            {
              text: "세션마다 돌던 서브쿼리를 한 번의 집계로 바꿔 목록 조회 20초 → 0.6초",
              evidence: {
                method: "세션마다 돌던 서브쿼리(52회 풀스캔)를 사용자별 한 번 집계(CTE)로 바꾸고 실제 쓰는 쿼리 그대로 실행 시간 비교",
                env: "로컬 서버 + 운영 DB 읽기 전용 연결",
                when: "2026.08",
              },
            },
            {
              text: "테스트 게이트·헬스체크·자동 롤백을 갖춘 무중단 배포 구축, 테스트 0개 → 211개",
              evidence: {
                method: "pytest 전체 실행 211 passed (DB를 가짜로 바꾼 단위·계약 테스트 중심). 첫 테스트 커밋 전엔 테스트 파일 0개",
                env: "로컬 · 배포 파이프라인에서도 매번 실행",
                when: "2026.10",
              },
            },
            {
              text: "골든 마스터 테스트로 응답을 비교하며 중복 코드 정리(차트 함수 6개 → 1개, SQL 7벌 → 1벌)",
              evidence: {
                method: "고치기 전 그래프 20 + CSV 7개 응답 요약 저장 → 고친 뒤 대조, 27개 모두 일치",
                env: "로컬 서버 + dev DB",
                when: "2026.09 · 지금도 배포마다 실행",
              },
            },
            "접근제어를 관찰 → 차단 2단계로 도입, 첫 차단에서 막힌 앱 호출은 로그로 찾아 롤백 후 보완",
            "레거시 Flask 플랫폼에 형상관리·코드 리뷰 체계 도입",
            "센서 데이터 가공 파이프라인과 비교 차트 화면 구축, 그래프·CSV 결과 일치 검증",
            "해외 기기 시간대 처리 - 저장은 UTC, 화면은 보는 사람의 브라우저 시간으로(목록·차트·CSV 전체 적용)",
          ],
        },
        {
          title: "연속혈당 파생 서비스 - 단독 구축·AWS 이관·운영",
          period: "2026.06 ~ 진행중",
          details: [
            "온프레미스 서비스를 AWS로 단독 이관, 무중단 배포 첫 전환에서 점검 225회 실패 0",
            "단위 테스트 15개 → 119개로 보강, 작성 중 운영 코드 문제 8건 발견",
            "기존 서비스를 복제한 당일 저장소 분리·Docker 배포·HTTPS까지 라이브",
            "단일 세션과 10초 이내 강제 로그아웃, Google·Kakao 로그인 구현",
            "중복 이메일 계정 방지(fail-closed 로그인 + DB partial unique index)",
          ],
        },
        {
          title: "고객사 IoT 기기 연동 웹 플랫폼 - 웹뷰·백엔드 개발",
          period: "2026.04 ~ 진행중",
          details: [
            "기기·서버·웹뷰를 잇는 WebSocket 실시간 통신 구축",
            "Tailwind 전환으로 인라인 스타일 167개 → 31개, 접근성 20곳 수정, 다국어 지원",
          ],
        },
        {
          title: "센서 감도표 관리 도구 - 단독 개발",
          period: "2026.04 ~ 진행중",
          details: [
            "저장소 생성부터 배포까지 단독 구축, 버전 이력과 CSV·엑셀 일괄 등록 구현",
            "동시 업로드 중복 생성을 DB 단에서 차단, QA 12건 해결",
            "대량 갱신은 ROLLBACK 드라이런으로 먼저 검증 후 커밋, 전극별 감도표·모바일 화면 추가",
          ],
        },
        {
          title: "기타",
          period: "2026.04 ~",
          details: [
            "사내 회의록 정리 도구 신규 구축, 무중단 교체 중 연속 요청 3,298건 전부 성공",
            "팀 문서 저장소 신설, PR 컨벤션 정립 후 기존 PR 386개 정리, 6개 프로젝트 인수인계 문서 작성",
          ],
        },
      ],
      // 순서: 언어 → 프레임워크 → 라이브러리 → DB → 인프라, 같은 종류 안에서는 백엔드 → 프론트엔드 (projects.ts 스택과 같은 규칙)
      stack: [
        "Java", "Python", "TypeScript", "JavaScript",
        "Spring Boot", "Flask", "Next.js",
        "Spring Security", "JPA", "FCM", "React", "Tailwind CSS", "Zustand", "ApexCharts",
        "PostgreSQL", "AWS", "Docker", "nginx", "GitHub Actions",
      ],
      sortOrder: 1,
    },
    {
      id: "sangsang",
      logo: "/logos/sangs.jpg",
      company: "상상스토리(주)",
      position: "연구소",
      role: "풀스택 개발",
      period: "2022.03 ~ 2024.04",
      region: "서울",
      resignReason: "학업",
      summary: "Spring 기반 웹 시스템 3건 개발·운영 (포털, LMS, 시설물 관리) (2022.03~04 수습 2개월은 사업소득, 2022.05 병역특례 편입과 함께 정규 전환)",
      projects: [
        {
          title: "사내 포털 및 접근권한 관리 시스템 개발",
          period: "2022.05 ~ 2023.08",
          details: [
            "eGovFramework 기반 포털 시스템 신규 구축",
            "Spring Security 활용 RBAC 기반 권한 관리 및 인증 시스템 설계·구현",
          ],
        },
        {
          title: "LMS 및 시설물 관리 시스템 고도화",
          period: "2023.08 ~ 2024.04",
          details: [
            "SQL Injection, XSS 등 보안 취약점 60건 전수 점검·개선",
            "웹 접근성 WAX Scanner 70 → 90점 개선 (KWCAG 인증 획득)",
            "법무부 솔로몬로 포탈, LMS, 시설물 관리 시스템 개발 및 성능 최적화",
            "N+1 문제 해결을 위한 쿼리 튜닝",
            "RESTful API 설계 및 로그/통계 대시보드 구현",
          ],
        },
      ],
      stack: [
        "Java", "JavaScript",
        "Spring Framework", "Spring Boot", "eGovFramework",
        "Spring Security", "MyBatis", "JSP", "jQuery",
        "Oracle", "MySQL", "Linux(CentOS)", "Docker",
      ],
      sortOrder: 2,
    },
  ],
  educations: [
    {
      id: "nile",
      school: "국가평생교육진흥원 (4년제)",
      department: "정보통신학과",
      period: "2022.05 ~ 2024.02",
      status: "편입/졸업",
      region: "서울",
      gpa: "3.75 / 4.5",
      sortOrder: 1,
    },
    {
      id: "bucheon",
      school: "부천대학교 (2·3년제)",
      department: "정보통신학과",
      period: "2019.03 ~ 2021.02",
      status: "졸업",
      region: "경기",
      gpa: "3.49 / 4.5",
      projects: [
        "스마트멀티탭 - IoT 기반 에너지 절약 솔루션 개발 및 안드로이드 앱 연동",
      ],
      sortOrder: 2,
    },
  ],
  trainings: [
    {
      org: "커널아카데미",
      course: "AI 융합 백엔드 개발 부트캠프",
      period: "2025.06 ~ 2025.12",
      learned: [
        "Java", "HTML5", "CSS3", "JavaScript", "TypeScript", "Spring Boot", "JSP", "React",
        "JPA", "jQuery", "AI API", "Oracle", "MySQL", "PostgreSQL",
      ],
      projects: [
        "AI Auto Posting (6인 팀, 2025.11 ~ 2025.12) - AI 블로그 콘텐츠 생성·자동 업로드 파이프라인(Spring Boot + React). 관리자 통계 API·일별 자동 집계 스케줄러·공통코드 관리, 관리자 대시보드 차트·통계 페이징 담당",
        "Youth Compass (5인 팀, 2025.10 ~ 2025.11) - 청년 금융·주택 정책 AI 상담 챗봇(React + Spring Boot + FastAPI·LangGraph RAG). 백엔드 초기 설정과 DTO·Entity·Service·Controller 계층 구성, 사용자 정보 수정 API, FAQ 탭 UI 담당",
        "Co's House (5인 팀, 2025.09 ~ 2025.10) - 인테리어 커뮤니티·쇼핑 통합 플랫폼(Spring Boot). 마이페이지(회원정보 수정·리뷰·탈퇴), 관리자 상품·주문 관리, 커뮤니티 댓글 담당",
      ],
      sortOrder: 1,
    },
    {
      org: "중앙 HTA",
      course: "웹 콘텐츠 개발을 위한 응용SW엔지니어링 양성과정",
      period: "2021.07 ~ 2022.01",
      learned: ["Java", "Oracle", "JSP", "HTML5", "CSS3", "JavaScript", "jQuery", "Spring"],
      projects: [
        "농구팀 사이트 (5인 팀, 2021.12 ~ 2022.01, 파이널 프로젝트) - 팀 소개, 공지사항, 질문 기능 + 관리자 페이지",
        "숨겨진 명소 알리기 사이트 (4인 팀, 2021.10 ~ 2021.11, 두 번째 프로젝트) - 명소 등록/파일 업로드 공유형 웹사이트",
        "대중교통 통합 예약 어플 (5인 팀, 2021.08 ~ 2021.09, 첫 프로젝트) - 좌석 예약·취소·결제 기능 통합",
      ],
      sortOrder: 2,
    },
  ],
  certifications: [
    { name: "정보처리기사", issuer: "한국산업인력공단", acquiredAt: "2023.06" },
    { name: "SQLD (SQL 개발자)", issuer: "한국데이터베이스진흥센터", acquiredAt: "2024.04" },
    { name: "네트워크관리사 2급", issuer: "한국정보통신자격협회", acquiredAt: "2023.10" },
    { name: "정보처리산업기사", issuer: "한국산업인력공단", acquiredAt: "2021.08" },
  ],
  // 키 순서대로 그려짐: 백엔드 → 프론트엔드 → DevOps. 분야 안에서는 kind(언어·프레임워크·라이브러리·데이터베이스) 순서대로 묶음
  skills: {
    backend: [
      { name: "Java", kind: "언어" },
      { name: "Python", kind: "언어" },
      { name: "Spring Boot", kind: "프레임워크" },
      { name: "Spring Framework", kind: "프레임워크" },
      { name: "Flask", kind: "프레임워크" },
      { name: "eGovFramework", kind: "프레임워크" },
      { name: "Spring Security", kind: "라이브러리" },
      { name: "JPA", kind: "라이브러리" },
      { name: "MyBatis", kind: "라이브러리" },
      { name: "JSP", kind: "라이브러리" },
      { name: "PostgreSQL", kind: "데이터베이스" },
      { name: "Oracle", kind: "데이터베이스" },
      { name: "MySQL", kind: "데이터베이스" },
    ],
    frontend: [
      { name: "TypeScript", kind: "언어" },
      { name: "JavaScript", kind: "언어" },
      { name: "Next.js", kind: "프레임워크" },
      { name: "React", kind: "라이브러리" },
      { name: "Tailwind CSS", kind: "라이브러리" },
      { name: "Zustand", kind: "라이브러리" },
      { name: "jQuery", kind: "라이브러리" },
    ],
    infra: [
      { name: "AWS (EC2·RDS·S3·SSM)", kind: "클라우드·서버" },
      { name: "Linux", kind: "클라우드·서버" },
      { name: "systemd", kind: "클라우드·서버" },
      { name: "nginx", kind: "웹 서버" },
      { name: "Caddy", kind: "웹 서버" },
      { name: "GitHub Actions", kind: "CI/CD·배포" },
      { name: "Docker", kind: "CI/CD·배포" },
    ],
  },
  portfolios: [
    { title: "GOTCHA Frontend", url: "https://github.com/fcde-project9/GOTCHA-FE", period: "2026.01 ~ 2026.11", teamSize: 9 },
    { title: "GOTCHA Backend", url: "https://github.com/fcde-project9/GOTCHA-BE", period: "2026.01 ~ 2026.11", teamSize: 9 },
    { title: "AI Auto Posting Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend", period: "2025.11.17 ~ 2025.12.26" },
    { title: "AI Auto Posting Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend", period: "2025.11.17 ~ 2025.12.26" },
    { title: "Co's House (5인 팀)", url: "https://github.com/WONJUN-KR/Co-s_House", period: "2025.09.05 ~ 2025.10.26", teamSize: 5 },
  ],
  military: { status: "군필", type: "산업기능요원", period: "2022.05 ~ 2024.04" },
  coverLetter: `## CGM 의료기기 서비스 풀스택 개발자

연속혈당측정(CGM) 의료기기 기업에서 의료 데이터 기반 웹 서비스와 사내 실험 데이터 플랫폼을 개발·운영하고 있습니다. 환자용 혈당 모니터링 서비스, 센서 실험 데이터 분석 플랫폼, 파생 서비스, 고객사 IoT 플랫폼, 감도표 관리 도구, 사내 회의록 정리 도구까지 여섯 개 프로젝트를 동시에 담당하며 React·Next.js 화면부터 Spring Boot·Flask 서버, AWS 인프라와 배포까지 직접 맡아 왔습니다.

### Blue/Green 무중단 배포 및 AWS 이전

수동으로 이뤄지던 배포를 자동화하기 위해 저장소별로 GitHub Actions 파이프라인을 만들고, 서버에 키를 두지 않도록 OIDC와 SSM으로 배포를 연결했습니다. 배포 전에는 테스트 게이트를, 배포 후에는 헬스체크와 자동 롤백을 두었고, nginx 업스트림을 바꾸는 blue/green 방식으로 무중단 배포를 구현했습니다. dev 첫 전환에서 0.5초 간격으로 외부 점검 236회를 돌려 실패 0건을 확인했고, 운영과 같은 구성의 검증 환경도 함께 만들어 운영에 영향 없이 검증할 수 있게 했습니다.

온프레미스 서비스 두 개를 AWS(EC2·RDS)로 옮길 때는 "정지 → 최종 동기화 → DNS 전환" 순서의 런북을 먼저 작성했습니다. 혈당 서비스는 34만여 행의 테이블별 행 수를 대조해 이전 결과를 확인했습니다.

### 레거시 리팩터링 및 쿼리 최적화

사내 실험 데이터 플랫폼에 형상관리를 도입하고 코드를 위험도 순으로 정리한 뒤, 접근제어와 보안 체계를 정비했습니다. 차단은 먼저 로그만 남기는 관찰 단계로 실제 호출 경로를 확인한 뒤 적용했고, 첫 차단에서 막힌 앱 호출은 로그로 찾아 롤백한 뒤 경로를 보완했습니다. 테스트를 0개에서 211개로 늘리고, 골든 마스터 테스트로 27개 응답 요약이 같은지 확인하면서 중복 차트 함수와 SQL을 하나로 합쳤습니다. 20초 걸리던 목록 조회는 상관 서브쿼리를 CTE로 바꿔 0.6초로 줄였습니다.

### 프론트엔드 신규 구축 및 실시간 통신 설계

React로 사용자·기기·권한을 관리하는 관리자 콘솔을 처음부터 만들었고, Next.js로 고객사 IoT 기기의 웹뷰를 개발하며 기기·서버·화면을 잇는 실시간 통신을 설계했고, 다국어 지원과 Tailwind 전환으로 인라인 스타일 81% 정리까지 맡았습니다. 서버의 시간 저장 방식을 UTC로 바꿀 때는 jest 골든 테스트로 한국 사용자 화면이 바뀌지 않았음을 확인한 뒤 배포했습니다.

### 데이터 기반 원인 분석 및 정합성 검증

그래프가 주기적으로 비는 문제의 원인이 처음 추정과 다르다는 것을 데이터로 확인하고, 웹과 앱의 계산 규칙 차이를 찾아 결과 일치율을 약 40%에서 100%로 맞췄습니다. 운영 데이터를 바꿀 때는 백업과 드라이런, 전수 대조를 먼저 합니다. 데이터 처리 로직을 교체할 때도 저장값을 전부 다시 계산한 뒤 결과가 모두 일치하는지 확인하고 마무리했습니다.

의료 데이터는 한 행도 잃어서는 안 되고, 서비스는 멈추지 않아야 한다고 생각합니다. 화면부터 서버, 배포까지 전 과정을 이해하는 개발자로서 사용자가 믿고 쓰는 서비스를 끝까지 책임지겠습니다.`,
};
