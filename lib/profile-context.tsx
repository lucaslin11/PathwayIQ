/**
 * ProfileContext — stores the computed quiz result in localStorage so it
 * persists across page refreshes and is accessible from any page.
 *
 * Shape stored:
 *   type        — "STEM Innovator" | "Creative Visionary" | "People Champion" | "Business Leader"
 *   pathway     — human-readable pathway label
 *   scores      — { stem, creative, social, business } raw point totals
 *   total       — sum of all points (used for % calculations)
 *   completedAt — ISO timestamp
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileScores {
  stem:     number;
  creative: number;
  social:   number;
  business: number;
}

export interface StoredProfile {
  type:         string;
  pathway:      string;
  color:        string;
  bg:           string;
  scores:       ProfileScores;
  total:        number;
  majorCluster: 'STEM' | 'Business' | 'Creative' | 'Social';
  collegeType:  'research' | 'arts' | 'business' | 'liberal-arts' | 'public';
  bucket?:      'stem' | 'creative' | 'social' | 'business'; // stable key for i18n
  completedAt:  string;
}

interface ProfileContextValue {
  profile:      StoredProfile | null;
  saveProfile:  (p: Omit<StoredProfile, 'completedAt'>) => void;
  clearProfile: () => void;
}

// ─── Storage key ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'pathwayiq_profile';

function loadFromStorage(): StoredProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredProfile) : null;
  } catch {
    return null;
  }
}

function saveToStorage(p: StoredProfile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // storage unavailable — silently ignore
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProfileContext = createContext<ProfileContextValue>({
  profile:      null,
  saveProfile:  () => {},
  clearProfile: () => {},
});

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StoredProfile | null>(loadFromStorage);

  const saveProfile = useCallback((p: Omit<StoredProfile, 'completedAt'>) => {
    const full: StoredProfile = { ...p, completedAt: new Date().toISOString() };
    saveToStorage(full);
    setProfile(full);
  }, []);

  const clearProfile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
