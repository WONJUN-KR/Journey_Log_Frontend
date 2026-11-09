import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // 개발 서버 왼쪽 아래 Next.js 표시(동그라미 버튼) 숨김 - 배포 화면엔 원래 안 나옴
  devIndicators: false,
  // CSS 를 <link> 대신 HTML 안 <style> 로 - 첫 화면이 CSS 파일 요청(렌더 차단)을 기다리지 않음
  // 느린 망에서 HTML → CSS 왕복 한 번이 통째로 사라짐. Tailwind 라 CSS 가 작아서(약 27KB, 압축 전송) HTML 증가가 감당할 만함
  // globalNotFound: 루트 레이아웃이 app/[locale] 아래라 proxy 를 안 거치는 주소의 404 는 app/global-not-found.tsx 가 받음
  experimental: { inlineCss: true, globalNotFound: true },
  // 이미지는 빌드 전에 scripts/optimize-images.mjs 가 크기별로 만들어 두고, 로더가 화면에 맞는 크기를 고름 (요청 때 서버 최적화 안 씀)
  images: { loader: "custom", loaderFile: "./src/lib/image-loader.ts" },
  // 이름이 바뀐 페이지의 예전 주소는 새 주소로 (about → resume, 로드맵 → 연혁)
  async redirects() {
    return [
      { source: "/about", destination: "/resume", permanent: true },
      { source: "/roadmap", destination: "/history", permanent: true },
      { source: "/roadmap/:slug", destination: "/history", permanent: true },
      // 글 상세는 네이버 원문으로 옮겨서, 예전 글 주소는 목록으로
      { source: "/log/:slug", destination: "/log", permanent: false },
      // 영어판을 내려서 예전 영어 주소(/en/...)는 같은 한국어 주소로
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

// next-intl: 요청별 언어 · 메시지 설정 파일(src/i18n/request.ts) 연결
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
