export default [
  {
    url: "/api/todos",
    method: "get",
    response: () => {
      const todos = [
        {
          id: 1,
          title: "💖乡乡",
          completed: false,
        },
        {
          id: 2,
          title: "乡乡💖",
          completed: true,
        },
      ];
      return {
        code: 0, // 没有错误
        message: "success",
        data: todos,
      };
    },
  },
  {
    url: "/repos",
    method: "get",
    response: () => {
      const repos = [
        {
          id: 695370163,
          title: "❤️乡乡",
          description: "Forever love",
        },
        {
          id: 152578450,
          title: "💖乡乡",
          description: "Love forever",
        },
      ];
    //   return {
    //     code: 0, // 没有错误
    //     message: "success",
    //     data: repos,
    //   };
      return repos;
    },
  },
];
