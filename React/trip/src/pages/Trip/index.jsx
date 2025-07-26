import { useState, useEffect } from "react";
import useTitle from "@/hooks/useTitle";
import { chat } from "@/llm";

const Trip = () => {
  useEffect(() => {
    const fetchChat = async () => {
      const res = await chat([
        {
          role: "user",
          content: "重庆旅游推荐",
        },
      ]);
      console.log(res);
    };
    fetchChat();
  }, []);
  useTitle("旅游智能客服");
  return <div>Trip</div>;
};

export default Trip;
