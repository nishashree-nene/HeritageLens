import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Profile } from '../types';

interface AppStore {
  language: Language; setLanguage: (l: Language) => void;
  user: Profile | null; setUser: (u: Profile | null) => void;
  favorites: string[];
  addFavorite: (id: string) => void; removeFavorite: (id: string) => void; isFavorite: (id: string) => boolean;
  demoMode: boolean; setDemoMode: (v: boolean) => void;
  visitedSites: string[]; addVisit: (id: string) => void;
  quizScores: Record<string, number>; setQuizScore: (qid: string, score: number) => void;
  points: number; addPoints: (n: number) => void;
  earnedBadges: string[]; earnBadge: (id: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
      user: null,
      setUser: (user) => set({ user }),
      favorites: [],
      addFavorite: (id) => {
        if (!get().favorites.includes(id)) {
          set((s) => ({ favorites: [...s.favorites, id] }));
          get().addPoints(5);
        }
      },
      removeFavorite: (id) => set((s) => ({ favorites: s.favorites.filter((f) => f !== id) })),
      isFavorite: (id) => get().favorites.includes(id),
      demoMode: true,
      setDemoMode: (demoMode) => set({ demoMode }),
      visitedSites: [],
      addVisit: (id) => {
        if (!get().visitedSites.includes(id)) {
          set((s) => ({ visitedSites: [...s.visitedSites, id] }));
          get().addPoints(10);
          if (!get().earnedBadges.includes('badge-001')) get().earnBadge('badge-001');
        }
      },
      quizScores: {},
      setQuizScore: (qid, score) => {
        set((s) => ({ quizScores: { ...s.quizScores, [qid]: score } }));
        get().addPoints(score * 2);
        if (!get().earnedBadges.includes('badge-003')) get().earnBadge('badge-003');
      },
      points: 0,
      addPoints: (n) => set((s) => ({ points: s.points + n })),
      earnedBadges: [],
      earnBadge: (id) => {
        if (!get().earnedBadges.includes(id)) set((s) => ({ earnedBadges: [...s.earnedBadges, id] }));
      },
    }),
    { name: 'heritagelens-store' }
  )
);
