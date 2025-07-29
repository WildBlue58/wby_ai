import { create } from "zustand";
import { getDetail } from "@/api/detail";

const useDetailStore = create((set) => ({
  detail: {
    title: "",
    price: 0,
    desc: "",
    images: [
      {
        alt: "",
        url: "https://dummyimage.com/300x200/79f291/fff&text=%E5%9B%BE%E7%89%87",
      },
    ],
  },
  loading: false,
  setDetail: async (id) => {
    set({ loading: true });
    const res = await getDetail(id);
    set({
      loading: false,
      detail: res.data,
    });
  },
}));

export default useDetailStore;
