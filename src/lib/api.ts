const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export type Tag = {
  id: number;
  name: string;
};

export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  tags: Tag[];
};

export type PostDetail = PostListItem & {
  content: string;
  createdAt: string;
  updatedAt: string;
};

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
    ...init,
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function getPosts(): Promise<PostListItem[]> {
  return fetchJson<PostListItem[]>("/api/posts");
}

export async function getPost(slug: string): Promise<PostDetail | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // slug already decoded
  }
  const url = `${API_BASE}/api/posts/${encodeURIComponent(decoded)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json() as Promise<PostDetail>;
}

export type SeriesListItem = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  postsCount: number;
  updatedAt: string | null;
};

export type SeriesPostItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  seriesIndex: number | null;
  tags: Tag[];
};

export type SeriesDetail = SeriesListItem & {
  posts: SeriesPostItem[];
};

export async function getSeriesList(): Promise<SeriesListItem[]> {
  return fetchJson<SeriesListItem[]>("/api/series");
}

export async function getSeries(slug: string): Promise<SeriesDetail | null> {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // slug already decoded
  }
  const url = `${API_BASE}/api/series/${encodeURIComponent(decoded)}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${url} failed: ${res.status}`);
  return res.json() as Promise<SeriesDetail>;
}
