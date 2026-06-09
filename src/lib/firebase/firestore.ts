import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
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
import type { Project, SiteSettings, AnalyticsEvent, DashboardStats, BlogPost, ContactMessage, Feedback, VisitorRecord, VisitorStats } from '@/types';

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
  const snap = await getDoc(ref);
  if (snap.exists()) {
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
  } else {
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() });
  }
};

export const initSiteSettings = async (data: Omit<SiteSettings, 'id' | 'updatedAt'>): Promise<void> => {
  const ref = doc(db, 'settings', 'main');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
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

// ─── BLOG ─────────────────────────────────────────────────────────────────────

const mapBlogDoc = (d: { id: string; data: () => Record<string, unknown> }): BlogPost => {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
  } as BlogPost;
};

export const getBlogPosts = async (publishedOnly = true): Promise<BlogPost[]> => {
  const constraints: QueryConstraint[] = [];
  if (publishedOnly) constraints.push(where('published', '==', true));
  constraints.push(orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(query(collection(db, 'blog'), ...constraints));
  return snapshot.docs.map(d => mapBlogDoc({ id: d.id, data: () => d.data() as Record<string, unknown> }));
};

export const getBlogPostBySlug = async (slug: string, publishedOnly = true): Promise<BlogPost | null> => {
  const constraints: QueryConstraint[] = [where('slug', '==', slug)];
  if (publishedOnly) constraints.push(where('published', '==', true));
  const snapshot = await getDocs(query(collection(db, 'blog'), ...constraints, limit(1)));
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return mapBlogDoc({ id: d.id, data: () => d.data() as Record<string, unknown> });
};

export const getBlogPostById = async (id: string): Promise<BlogPost | null> => {
  const ref = doc(db, 'blog', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapBlogDoc({ id: snap.id, data: () => snap.data() as Record<string, unknown> });
};

export const createBlogPost = async (data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const ref = await addDoc(collection(db, 'blog'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateBlogPost = async (id: string, data: Partial<BlogPost>): Promise<void> => {
  await updateDoc(doc(db, 'blog', id), { ...data, updatedAt: serverTimestamp() });
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'blog', id));
};

// ─── CONTACT MESSAGES ─────────────────────────────────────────────────────────

export const createContactMessage = async (
  data: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>
): Promise<void> => {
  await addDoc(collection(db, 'messages'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  const snapshot = await getDocs(
    query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt instanceof Timestamp
      ? d.data().createdAt.toDate().toISOString()
      : d.data().createdAt,
  })) as ContactMessage[];
};

export const markMessageRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'messages', id), { read: true });
};

export const deleteContactMessage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'messages', id));
};

// ─── FEEDBACKS ────────────────────────────────────────────────────────────────

export const submitFeedback = async (
  data: Omit<Feedback, 'id' | 'createdAt' | 'read'>
): Promise<void> => {
  await addDoc(collection(db, 'feedbacks'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
};

export const getFeedbacks = async (projectId?: string): Promise<Feedback[]> => {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];
  if (projectId) constraints.unshift(where('projectId', '==', projectId));
  const snapshot = await getDocs(query(collection(db, 'feedbacks'), ...constraints));
  return snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt instanceof Timestamp
      ? d.data().createdAt.toDate().toISOString()
      : d.data().createdAt,
  })) as Feedback[];
};

export const checkFeedbackExists = async (projectId: string, ipHash: string): Promise<boolean> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'feedbacks'),
      where('projectId', '==', projectId),
      where('ipHash', '==', ipHash),
      limit(1)
    )
  );
  return !snapshot.empty;
};

export const markFeedbackRead = async (id: string): Promise<void> => {
  await updateDoc(doc(db, 'feedbacks', id), { read: true });
};

export const deleteFeedback = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'feedbacks', id));
};

// ─── VISITORS ─────────────────────────────────────────────────────────────────

export const getVisitorStats = async (): Promise<VisitorStats> => {
  const ref = doc(db, 'stats', 'visitors');
  const snap = await getDoc(ref);
  if (!snap.exists()) return { totalVisits: 0, uniqueVisitors: 0 };
  return snap.data() as VisitorStats;
};

export const getRecentVisitors = async (limitCount = 50): Promise<VisitorRecord[]> => {
  const q = query(
    collection(db, 'visitors'),
    orderBy('lastVisit', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({
    ...d.data(),
    firstVisit: d.data().firstVisit instanceof Timestamp
      ? d.data().firstVisit.toDate().toISOString()
      : d.data().firstVisit,
    lastVisit: d.data().lastVisit instanceof Timestamp
      ? d.data().lastVisit.toDate().toISOString()
      : d.data().lastVisit,
  })) as VisitorRecord[];
};
