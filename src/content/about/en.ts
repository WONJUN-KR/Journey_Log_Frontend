import type { AboutContent } from "@/lib/api";
import { totalCareerPeriod } from "@/lib/career";
import { ABOUT_KO } from "./ko";

// 이력서 데이터 (영어) - ko.ts 와 같은 타입, 항목 수 · 순서는 달라도 됨. 비운 섹션(빈 배열 · 빈 문자열 · military 없음)은 화면에서 숨김
// 경력 합계(profile.careerPeriod)는 한국어 기간으로 계산해 영어로 표시 - 여기 period 문자열은 'Mar 2026 – Present' 처럼 자유롭게
// 경력 · 학력 id 는 ko 와 같게 (로고 · 누락 경고에 씀). 숫자는 ko 문구와 같아야 함

// 홈 숫자 카드 - 커밋 수 대신 결과 지표. 아래 careers 문구에 있는 숫자만 씀 (basis = 근거 한 줄)
export const HOME_HIGHLIGHTS_EN: { label: string; value: string; basis: string }[] = [
  { label: "Built from scratch", value: "3 tools", basis: "Glucose, sensor, notes" },
  { label: "Zero-downtime", value: "3 services", basis: "Blue/green cutovers, health checks" },
  { label: "AWS migrations", value: "2", basis: "Glucose and derived services" },
];

// 이력서 데이터 - 홈(/en)과 Resume(/en/resume)이 함께 씀
export const ABOUT_EN: AboutContent = {
  profile: {
    name: "WonJun Oh",
    tagline: "Health IT full-stack developer",
    email: "dnjswns0010@naver.com",
    region: "Siheung, South Korea",
    // 읽을 때마다 careers 기간으로 계산
    get careerPeriod() {
      return totalCareerPeriod(ABOUT_KO.careers, "en");
    },
    isEmployed: true,
    contacts: {
      githubPersonal: "https://github.com/WONJUN-KR",
      blog: "https://blog.naver.com/wonjun13_",
      linkedin: "https://www.linkedin.com/in/wonjun1013/",
    },
    intro:
      "Full-stack developer at a continuous glucose monitoring (CGM) medical device company, owning healthcare web services and an internal experiment data platform from frontend to backend and infrastructure. " +
      "Led the AWS migration of on-premises services, built CI/CD with zero-downtime deployment, and hardened security on legacy systems.",
  },
  careers: [
    {
      id: "uxn",
      logo: "/logos/uxn.jpg",
      company: "UXN Co., Ltd.",
      position: "R&D",
      role: "Full-stack Developer",
      period: "Mar 2026 – Present",
      isCurrent: true,
      summary: "Handle 6 concurrent projects end to end: CGM web services, a data platform, and an IoT platform",
      projects: [
        {
          title: "Patient CGM Monitoring Service: AWS migration, deployments, and a new admin console",
          period: "Apr 2026 – Present",
          details: [
            {
              text: "Migrated on-premises servers to AWS (EC2, RDS): row counts checked on 10 tables (hundreds of thousands of rows), about 2 min 44 s from stop to login check, automated certificate renewal",
              evidence: {
                method: "Stopped the old server → final DB sync → domain cutover → login check. About 2 min 44 s from stop to confirmation (may be longer per user due to DNS TTL); row counts matched on 10 tables",
                env: "Production (live cutover)",
                when: "Aug 2026",
              },
            },
            {
              text: "Built keyless CI/CD (GitHub Actions + OIDC + SSM) and nginx blue/green zero-downtime deploys at no extra cost; verified 0 failures in 236 external checks on the first dev cutover before rolling out to production",
              evidence: {
                method: "Called the login API every 0.5 s during deployment; any non-OK response counted as a failure",
                env: "Dev server (same setup as production)",
                when: "Sep 2026",
              },
            },
            {
              text: "Cut report queries from 29 to 3",
              evidence: {
                method: "Timed each stage to find the repeated queries, then moved the lookup out of the loop",
                env: "Local backend + remote DB tunnel (high-latency setup)",
                when: "Aug 2026",
              },
            },
            "Found why web and app results differed, raising the match rate from about 40% to 100%",
            "Built an admin console from scratch (users, devices, permissions) and migrated permission strings to code-based RBAC with zero downtime",
            "Migrated timestamps to UTC storage with local-time display in React, with zero downtime: 0 rows needing correction in the cutover window and 0 changes to Korean screens in golden tests",
          ],
        },
        {
          title: "Internal Sensor Experiment Data Platform: first version control, security, and deployment setup",
          period: "Apr 2026 – Present",
          details: [
            {
              text: "Cut list loading from 20 s to 0.6 s by rewriting correlated subqueries as a CTE",
              evidence: {
                method: "Replaced a per-session subquery (52 full scans) with a single per-user aggregate (CTE) and timed the exact production query before and after",
                env: "Local server + read-only connection to the production DB (not a copy)",
                when: "Aug 2026",
              },
            },
            {
              text: "Built CI/CD with a test gate, health checks, and automatic rollback on failure, plus blue/green zero-downtime deploys; grew tests from 0 to 211",
              evidence: {
                method: "Full pytest run: 211 passed (mostly unit and contract tests with a mocked DB). 0 test files before the first test commit",
                env: "Local (mock config, no DB access), and on every pipeline run",
                when: "Oct 2026",
              },
            },
            {
              text: "Refactored while keeping output identical under golden master tests (chart functions 6 → 1, SQL variants 7 → 1, 373 lines of dead code removed)",
              evidence: {
                method: "Saved response summaries for 20 charts + 7 CSVs before the change and compared after: all 27 matched",
                env: "Local server + dev DB (copy of production data)",
                when: "Sep 2026, still run on every deploy",
              },
            },
            "Tightened access control and session security in two phases (monitor, then block); found app calls hit by the first block through logs, rolled back, then fixed those paths",
            "Introduced version control and code review to a legacy Flask platform",
            "Built a sensor data pipeline and ApexCharts comparison views (up to 10 overlaid lines), with a 100% match on chart and CSV output",
          ],
        },
        {
          title: "CGM Spin-off Service: solo build, AWS migration, and operations",
          period: "Jun 2026 – Present",
          details: [
            "Migrated the service from on-premises to AWS solo (DNS cutover); 0 failures in 225 checks on the first blue/green cutover",
            "Grew unit tests from 15 to 119, finding 8 production defects along the way, and wrote a 45-item test design document",
            "Implemented single-session login with real-time forced logout within 10 s, Google and Kakao OAuth, and UTC storage with local-time display",
            "Prevented duplicate email accounts with fail-closed login and a DB partial unique index",
          ],
        },
        {
          title: "Client IoT Device Web Platform: webview and backend development",
          period: "Apr 2026 – Present",
          details: [
            "Built real-time device ↔ server ↔ webview communication over WebSocket",
            "Cut inline styles from 167 to 31 (-81%) by moving to Tailwind, fixed 20 accessibility issues (div → button), and added multilingual support",
          ],
        },
        {
          title: "Sensitivity Table Tool (solo)",
          period: "Apr 2026 – Present",
          details: [
            "Built the tool solo from repository setup to deployment, with version history, UPSERT saves, and bulk CSV (RFC 4180) and Excel imports",
            "Made concurrent uploads atomic with PostgreSQL ON CONFLICT to stop duplicate records; resolved 12 QA issues",
            "Validated bulk updates with ROLLBACK dry runs before committing; added per-electrode sensitivity tables and mobile views",
          ],
        },
        {
          title: "Other",
          period: "Apr 2026 – Present",
          details: [
            "Built an internal meeting-notes tool (FastAPI + React) with 0 failures in 3,298 requests during a zero-downtime swap; set PR conventions and cleaned up 386 PRs",
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
      company: "Sangsang Story Co., Ltd.",
      position: "R&D",
      role: "Full-stack Developer",
      period: "Mar 2022 – Apr 2024",
      region: "Seoul",
      resignReason: "To pursue studies",
      summary: "Developed and operated 3 Spring-based web systems (portal, LMS, facility management)",
      projects: [
        {
          title: "Internal Portal and Access Management System",
          period: "May 2022 – Aug 2023",
          details: [
            "Built a new portal system on eGovFramework",
            "Designed and implemented RBAC authorization and authentication with Spring Security",
          ],
        },
        {
          title: "LMS and Facility System Upgrades",
          period: "Aug 2023 – Apr 2024",
          details: [
            "Audited and fixed all 60 security vulnerabilities, including SQL injection and XSS",
            "Raised the WAX Scanner accessibility score from 70 to 90, earning KWCAG certification",
            "Developed and optimized the Ministry of Justice Solomon Law portal, an LMS, and a facility management system",
            "Fixed N+1 queries through query tuning",
            "Designed RESTful APIs and built log and statistics dashboards",
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
      school: "Academic Credit Bank (NILE)",
      department: "Bachelor's in ICT",
      period: "May 2022 – Feb 2024",
      status: "Graduated (transfer)",
      region: "Seoul",
      gpa: "3.75/4.5",
      sortOrder: 1,
    },
    {
      id: "bucheon",
      school: "Bucheon University",
      department: "Associate in ICT",
      period: "Mar 2019 – Feb 2021",
      status: "Graduated",
      region: "Gyeonggi",
      gpa: "3.49/4.5",
      projects: [
        "Smart power strip: IoT energy-saving solution with an Android companion app",
      ],
      sortOrder: 2,
    },
  ],
  trainings: [
    {
      org: "Kernel Academy",
      course: "AI Backend Development Bootcamp",
      period: "Jun – Dec 2025",
      learned: [
        "Java", "HTML5", "CSS3", "JavaScript", "TypeScript", "Spring Boot", "JSP", "React",
        "JPA", "jQuery", "AI API", "Oracle", "MySQL", "PostgreSQL",
      ],
      projects: [
        "AI Auto Posting (team of 6, Nov – Dec 2025): AI blog content generation and auto-upload pipeline (Spring Boot + React). Built admin statistics APIs, a daily aggregation scheduler, and common code management, plus admin dashboard charts and paginated stats",
        "Youth Compass (team of 5, Oct – Nov 2025): AI chatbot for youth finance and housing policy (React + Spring Boot + FastAPI, LangGraph RAG). Set up the backend and its DTO, entity, service, and controller layers; built the profile update API and the FAQ tab UI",
        "Co's House (team of 5, Sep – Oct 2025): interior community and shopping platform (Spring Boot). Built My Page (profile edits, reviews, account deletion), admin product and order management, and community comments",
      ],
      sortOrder: 1,
    },
    {
      org: "Joongang HTA",
      course: "Applied Software Engineering for Web Content Development",
      period: "Jul 2021 – Jan 2022",
      learned: ["Java", "Oracle", "JSP", "HTML5", "CSS3", "JavaScript", "jQuery", "Spring"],
      projects: [
        "3 team projects (teams of 4–5, Aug 2021 – Jan 2022): basketball team site, travel spot sharing site, and transit booking app",
      ],
      sortOrder: 2,
    },
  ],
  certifications: [
    { name: "Engineer Information Processing", short: "Info Processing Engineer", issuer: "HRD Korea", acquiredAt: "Jun 2023" },
    { name: "SQL Developer (SQLD)", short: "SQLD", issuer: "Korea Data Agency", acquiredAt: "Apr 2024" },
    { name: "Network Administrator Level 2", short: "Network Admin L2", issuer: "ICQA", acquiredAt: "Oct 2023" },
    { name: "Industrial Engineer Information Processing", short: "Info Processing Industrial Eng.", issuer: "HRD Korea", acquiredAt: "Aug 2021" },
  ],
  // 키 순서대로 그려짐: 백엔드 → 프론트엔드 → DevOps. 분야 안에서는 kind(언어·프레임워크·라이브러리·데이터베이스) 순서대로 묶음
  skills: {
    backend: [
      { name: "Java", kind: "Languages" },
      { name: "Python", kind: "Languages" },
      { name: "Spring Boot", kind: "Frameworks" },
      { name: "Spring Framework", kind: "Frameworks" },
      { name: "Flask", kind: "Frameworks" },
      { name: "eGovFramework", kind: "Frameworks" },
      { name: "Spring Security", kind: "Libraries" },
      { name: "JPA", kind: "Libraries" },
      { name: "MyBatis", kind: "Libraries" },
      { name: "JSP", kind: "Libraries" },
      { name: "PostgreSQL", kind: "Databases" },
      { name: "Oracle", kind: "Databases" },
      { name: "MySQL", kind: "Databases" },
    ],
    frontend: [
      { name: "TypeScript", kind: "Languages" },
      { name: "JavaScript", kind: "Languages" },
      { name: "Next.js", kind: "Frameworks" },
      { name: "React", kind: "Libraries" },
      { name: "Tailwind CSS", kind: "Libraries" },
      { name: "Zustand", kind: "Libraries" },
      { name: "jQuery", kind: "Libraries" },
    ],
    infra: [
      { name: "AWS (EC2, RDS, S3, SSM)", kind: "Cloud & servers" },
      { name: "Linux", kind: "Cloud & servers" },
      { name: "systemd", kind: "Cloud & servers" },
      { name: "nginx", kind: "Web servers" },
      { name: "Caddy", kind: "Web servers" },
      { name: "GitHub Actions", kind: "CI/CD" },
      { name: "Docker", kind: "CI/CD" },
    ],
  },
  portfolios: [
    { title: "GOTCHA Frontend", url: "https://github.com/fcde-project9/GOTCHA-FE", period: "Jan – Nov 2026", teamSize: 9 },
    { title: "GOTCHA Backend", url: "https://github.com/fcde-project9/GOTCHA-BE", period: "Jan – Nov 2026", teamSize: 9 },
    { title: "AI Auto Posting Backend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Backend", period: "Nov – Dec 2025" },
    { title: "AI Auto Posting Frontend", url: "https://github.com/WONJUN-KR/AI-Auto-Posting-Frontend", period: "Nov – Dec 2025" },
    { title: "Co's House", url: "https://github.com/WONJUN-KR/Co-s_House", period: "Sep – Oct 2025", teamSize: 5 },
  ],
  military: { status: "Completed", type: "Industrial Technical Personnel", period: "May 2022 – Apr 2024" },
  coverLetter: `## Full-stack developer for CGM medical device services

Full-stack developer at a continuous glucose monitoring (CGM) medical device company, running six projects at once, from React and Next.js frontends to Spring Boot and Flask backends, AWS infrastructure, and deployment.

Built keyless CI/CD with blue/green zero-downtime deploys at no extra cost, and moved two on-premises services to AWS; the glucose service cut over in about 2 min 44 s with row counts checked. On a legacy data platform, grew tests from 0 to 211 and cut a 20-second query to 0.6 seconds.

Guided by one rule: never lose a row of medical data, and never let the service go down. Backs up, dry-runs, and fully reconciles before changing production data.`,
};
