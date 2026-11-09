import type { MetadataRoute } from "next";
import { getSeriesList } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

// 검색엔진용 주소 목록
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const series = await getSeriesList();
  const paths = ["/", "/resume", "/projects", "/log", "/history", ...series.map((s) => `/series/${s.slug}`)];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
