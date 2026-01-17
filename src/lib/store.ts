import { create } from 'zustand';

interface FormState {
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  reset: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  isSubmitting: false,
  error: null,
  success: false,

  setSubmitting: (submitting) => set({ isSubmitting: submitting }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
  reset: () => set({ isSubmitting: false, error: null, success: false }),
}));

// User/Portifolio Store
interface Project {
  id: number;
  title: string;
  featured: boolean;
}

interface PortifolioStore {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  removeProject: (id: number) => void;
}

export const usePortifolioStore = create<PortifolioStore>((set) => ({
  projects: [],
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project],
  })),
  
  removeProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
  })),
}));
