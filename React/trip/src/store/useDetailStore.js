import { create } from "zustand";
import { getDetail } from "@/api/detail";

export const useDetailStore = create((set) => ({
  detail: {},
  loading: false,
  setDetail: async (id) => {
    set({ loading: true });
    try {
      const res = await getDetail(id);
      set({
        loading: false,
        detail: res.data.data,
      });
    } catch (error) {
      console.error("获取详情失败:", error);
      set({
        loading: false,
        detail: {},
      });
    }
  },
}));

export default useDetailStore;
