import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "@/context/GlobalContext";
import { getRepos } from "@/api/repos";

export const useRepos = (id) => {
  const { state, dispatch } = useContext(GlobalContext);
  useEffect(() => {
    console.log("----------");
    (async () => {
      dispatch({ type: "FETCH_START" });
      try {
        const res = await getRepos(id);
        // console.log(res);
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({ type: "FETCH_ERROR", payload: error.message });
      }
    })();
  }, []);
  return state;
};
