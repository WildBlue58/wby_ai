// 请求
import { create } from "zustand";
import { getRepos, getRepoList } from "../api/repo";

export const useReposStore = create((set) => ({
  repos: [],
  loading: false,
  error: null,
  fetchRepos: async (owner, repo) => {
    // 业务
    set({ loading: true, error: null });
    try {
      const response = await getRepoList("WildBlue58");
      set({ repos: response.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
