import { create } from 'zustand';
import type { RoleKey, User, Service, Professional } from '../types';
import { SEED_DATA } from '../services/api';

interface WizardDefaults {
  service: Service | null;
  professional: Professional | null;
}

interface AppStoreState {
  role: RoleKey;
  user: User;
  page: string;
  authenticated: boolean;
  sidebarOpen: boolean;
  backendMode: 'node' | 'github-pages-local';
  toastMsg: string;
  wizardDefaults: WizardDefaults | null;
  bootLoading: boolean;
  loaderText: string;
  tabSwitching: boolean;
  progressKey: number;

  setRole: (role: RoleKey) => void;
  setUser: (user: User) => void;
  setPage: (page: string) => void;
  setAuthenticated: (auth: boolean) => void;
  setSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setBackendMode: (mode: 'node' | 'github-pages-local') => void;
  setWizardDefaults: (defaults: WizardDefaults | null) => void;
  setBootLoading: (loading: boolean) => void;
  setLoaderText: (text: string) => void;
  setTabSwitching: (switching: boolean) => void;
  incrementProgressKey: () => void;
  showToast: (msg: string) => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  role: 'student',
  user: SEED_DATA.users[0],
  page: 'dashboard',
  authenticated:
    typeof window !== 'undefined' &&
    sessionStorage.getItem('rootSessionReact') === 'active',
  sidebarOpen: false,
  backendMode: 'node',
  toastMsg: '',
  wizardDefaults: null,
  bootLoading: true,
  loaderText: 'Iniciando plataforma Root · TdeA...',
  tabSwitching: false,
  progressKey: 0,

  setRole: (role) => set({ role }),
  setUser: (user) => set({ user }),
  setPage: (page) => set({ page }),
  setAuthenticated: (authenticated) => set({ authenticated }),
  setSidebarOpen: (open) =>
    set((state) => ({
      sidebarOpen: typeof open === 'function' ? open(state.sidebarOpen) : open
    })),
  setBackendMode: (backendMode) => set({ backendMode }),
  setWizardDefaults: (wizardDefaults) => set({ wizardDefaults }),
  setBootLoading: (bootLoading) => set({ bootLoading }),
  setLoaderText: (loaderText) => set({ loaderText }),
  setTabSwitching: (tabSwitching) => set({ tabSwitching }),
  incrementProgressKey: () =>
    set((state) => ({ progressKey: state.progressKey + 1 })),
  showToast: (msg) => {
    set({ toastMsg: msg });
    setTimeout(() => {
      set((state) => (state.toastMsg === msg ? { toastMsg: '' } : {}));
    }, 2800);
  }
}));
