export type Repo = { label: string; url: string };

// 프로젝트 화면 둘러보기(팝업) - 로컬에서 띄워 찍은 스크린샷과 짧은 흐름 영상. 팝업을 열 때만 불러옴
export type MockupShot = { src: string; caption: string };
export type MockupVideo = { webm: string; mp4: string; poster: string; caption: string };
// related: 팝업 안에서 바로 넘어갈 짝 프로젝트 (예: 같은 서비스의 원본 ↔ 리빌드)
export type Mockup = { shots: MockupShot[]; videos: MockupVideo[]; note?: string; related?: { slug: string; label: string } };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  period: string;
  role: string;
  // 앱스토어식 소개: 사용자가 이걸로 뭘 할 수 있는지(tagline·features) → 내가 맡은 부분(myPart)
  tagline: string;
  features: string[];
  myPart: string[];
  // 순서: 언어 → 프레임워크 → 라이브러리 → DB → 인프라, 같은 종류 안에서는 백엔드 → 프론트엔드 (이력서 경력 스택과 같은 규칙)
  stack: string[];
  liveUrl?: string;
  repos: Repo[];
  thumbnail?: string;
  // 홈 휴대폰 카드(낮은 5:2)에서 썸네일 어디를 보여줄지 - 없으면 위쪽
  mobileThumbPosition?: string;
  logo?: string;
  pinned?: boolean;
  lead?: boolean; // 팀장 - projects 페이지에 '팀장' 배지
  // live = 운영 중 / released = 앱 배포(서버는 내려감) / local = 로컬 실행
  status: "live" | "released" | "local";
  device: "mobile" | "laptop";
  mockup?: Mockup;
};

import { PROJECTS_KO } from "@/content/projects/ko";

// 프로젝트 목록
export function getProjects(): Project[] {
  return PROJECTS_KO;
}
