import SearchBox from "@/components/SearchBox";

const Search = () => {
  // api 请求
  // 单向数据流
  // 反复生成 useCallback
  const handleQuery = (keyword) => {
    console.log(keyword);
  };
  return (
    <div>
      <SearchBox onQuery={handleQuery} />
    </div>
  );
};

export default Search;
