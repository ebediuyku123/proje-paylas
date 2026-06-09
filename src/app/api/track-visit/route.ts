import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, collection, addDoc } from 'firebase/firestore';

// Hash IP with daily salt for privacy (GDPR compliant - no raw IP stored)
function hashIp(ip: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return createHash('sha256').update(ip + today + 'bytehub-salt').digest('hex').slice(0, 16);
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '0.0.0.0'
  );
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const ipHash = hashIp(ip);
    const userAgent = req.headers.get('user-agent') || '';
    const { page = '/' } = await req.json().catch(() => ({}));

    // Store visit in Firestore
    const visitorRef = doc(db, 'visitors', ipHash);
    const visitorSnap = await getDoc(visitorRef);

    const now = new Date().toISOString();

    if (!visitorSnap.exists()) {
      // New unique visitor
      await setDoc(visitorRef, {
        ipHash,
        firstVisit: serverTimestamp(),
        lastVisit: serverTimestamp(),
        visitCount: 1,
        userAgent,
        pages: [page],
      });
    } else {
      // Returning visitor
      await updateDoc(visitorRef, {
        lastVisit: serverTimestamp(),
        visitCount: increment(1),
      });
    }

    // Increment global visitor counter
    const counterRef = doc(db, 'stats', 'visitors');
    const counterSnap = await getDoc(counterRef);
    if (!counterSnap.exists()) {
      await setDoc(counterRef, { totalVisits: 1, uniqueVisitors: 1 });
    } else {
      await updateDoc(counterRef, {
        totalVisits: increment(1),
        uniqueVisitors: visitorSnap.exists() ? counterSnap.data().uniqueVisitors : increment(1),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('track-visit error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
