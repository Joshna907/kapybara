import { create } from "zustand";

interface PostDraft {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: File | null;
  isDragging: boolean;
}

interface PostStore {
  draft: PostDraft;
  setDraft: (partial: Partial<PostDraft>) => void;
  resetDraft: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  draft: {
    title: "",
    slug: "",
    excerpt: "",
    content: "# Hello World\nWrite your post in **Markdown**...",
    date: "",
    author: "",
    image: null,
    isDragging: false,
  },
  setDraft: (partial) => set((state) => ({ draft: { ...state.draft, ...partial } })),
  resetDraft: () => set({
    draft: {
      title: "",
      slug: "",
      excerpt: "",
      content: "# Hello World\nWrite your post in **Markdown**...",
      date: "",
      author: "",
      image: null,
      isDragging: false,
    },
  }),
}));
