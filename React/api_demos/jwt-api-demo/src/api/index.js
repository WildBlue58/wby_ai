import axios from "./config";

// todos接口
export const getTodos = () => {
  return axios.get("/api/todos");
};

// repos接口
export const getRepos = () => {
  return axios.get("/repos");
};
