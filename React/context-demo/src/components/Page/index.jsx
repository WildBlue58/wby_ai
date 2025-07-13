import Child from "../Child/index1";
import { useTheme } from "../../hooks/useTheme";

const Page = () => {
  const theme = useTheme();
  return (
    <>
      {theme}
      <Child />
    </>
  );
};

export default Page;
