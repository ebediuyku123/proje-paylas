import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import { EMPTY_DASHBOARD_STATS } from './defaults';
import type { Project, SiteSettings, AnalyticsEvent, DashboardStats } from '@/types';

const mapProjectDoc = (d: { id: string; data: () => Record<string, unknown> }): Project => {
  const data = d.data();
  const createdAt = data.createdAt instanceof Timestamp
    ? data.createdAt.toDate().toISOString()
    : (data.createdAt as string);
  const updatedAt = data.updatedAt instanceof Timestamp
    ? data.updatedAt.toDate().toISOString()
    : (data.updatedAt as string);

  return { id: d.id, ...data, createdAt, updatedAt } as Project;
};

// ─── PROJECTS ────────────────────────────────────────────────────────────────

export const getProjects = async (filters?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  limitCount?: number;
}): Promise<Project[]> => {
  const constraints: QueryConstraint[] = [];

  if (filters?.published !== undefined) {
    constraints.push(where('published', '==', filters.published));
  }
  if (filters?.featured !== undefined) {
    constraints.push(where('featured', '==', filters.featured));
  }
  if (filters?.category) {
    constraints.push(where('category', '==', filters.category));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  if (filters?.limitCount) {
    constraints.push(limit(filters.limitCount));
  }

  const q = query(collection(db, 'projects'), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapProjectDoc);
};

export const getProjectBySlug = async (
  slug: string,
  options?: { publishedOnly?: boolean }
): Promise<Project | null> => {
  const publishedOnly = options?.publishedOnly ?? true;
  const constraints: QueryConstraint[] = [where('slug', '==', slug)];

  if (publishedOnly) {
    constraints.push(where('published', '==', true));
  }

  const q = query(collection(db, 'projects'), ...constraints, limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return mapProjectDoc(snapshot.docs[0]);
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  const ref = doc(db, 'projects', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return mapProjectDoc({ id: snapshot.id, data: () => snapshot.data() as Record<string, unknown> });
};

export const createProject = async (
  data: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'downloadCount'>
): Promise<string> => {
  const ref = await addDoc(collection(db, 'projects'), {
    ...data,
    viewCount: 0,
    downloadCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  const ref = doc(db, 'projects', id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', id));
};

export const incrementViewCount = async (id: string): Promise<void> => {
  const ref = doc(db, 'projects', id);
  await updateDoc(ref, { viewCount: increment(1) });
};

export const incrementDownloadCount = async (id: string): Promise<void> => {
  const ref = doc(db, 'projects', id);
  await updateDoc(ref, { downloadCount: increment(1) });
};

export const getAllSlugs = async (): Promise<string[]> => {
  const q = query(collection(db, 'projects'), where('published', '==', true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data().slug as string);
};

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  const ref = doc(db, 'settings', 'main');
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as SiteSettings;
};

export const updateSiteSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const ref = doc(db, 'settings', 'main');
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
};

export const initSiteSettings = async (data: Omit<SiteSettings, 'id' | 'updatedAt'>): Promise<void> => {
  const ref = doc(db, 'settings', 'main');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const { setDoc } = await import('firebase/firestore');
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
};

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export const recordAnalyticsEvent = async (
  event: Omit<AnalyticsEvent, 'id' | 'timestamp'>
): Promise<void> => {
  await addDoc(collection(db, 'analytics'), {
    ...event,
    timestamp: serverTimestamp(),
  });
};

export const getAnalyticsEvents = async (limitCount = 100): Promise<AnalyticsEvent[]> => {
  const q = query(
    collection(db, 'analytics'),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    timestamp: d.data().timestamp instanceof Timestamp
      ? d.data().timestamp.toDate().toISOString()
      : d.data().timestamp,
  })) as AnalyticsEvent[];
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export const getDashboardStats = async (options?: { includeDrafts?: boolean }): Promise<DashboardStats> => {
  const includeDrafts = options?.includeDrafts ?? false;
  const constraints: QueryConstraint[] = [];

  if (!includeDrafts) {
    constraints.push(where('published', '==', true));
  }

  const snapshot = constraints.length
    ? await getDocs(query(collection(db, 'projects'), ...constraints))
    : await getDocs(collection(db, 'projects'));

  let totalViews = 0;
  let totalDownloads = 0;
  let published = 0;
  let featured = 0;
  let drafts = 0;

  snapshot.docs.forEach((d) => {
    const data = d.data();
    totalViews += data.viewCount ?? 0;
    totalDownloads += data.downloadCount ?? 0;
    if (data.published) published++;
    else drafts++;
    if (data.featured) featured++;
  });

  return {
    totalProjects: snapshot.size,
    totalViews,
    totalDownloads,
    publishedProjects: published,
    featuredProjects: featured,
    draftProjects: drafts,
  };
};

// ─── SAFE WRAPPERS (server pages — no auth context) ──────────────────────────

export async function safeGetProjects(
  filters?: Parameters<typeof getProjects>[0]
): Promise<Project[]> {
  try {
    return await getProjects(filters);
  } catch (error) {
    console.error('safeGetProjects failed:', error);
    return [];
  }
}

export async function safeGetSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await getSiteSettings();
  } catch (error) {
    console.error('safeGetSiteSettings failed:', error);
    return null;
  }
}

export async function safeGetDashboardStats(): Promise<DashboardStats> {
  try {
    return await getDashboardStats();
  } catch (error) {
    console.error('safeGetDashboardStats failed:', error);
    return EMPTY_DASHBOARD_STATS;
  }
}

export async function safeGetProjectBySlug(slug: string): Promise<Project | null> {
  try {
    return await getProjectBySlug(slug, { publishedOnly: true });
  } catch (error) {
    console.error('safeGetProjectBySlug failed:', error);
    return null;
  }
}
