import useTitle from "@/hooks/useTitle";
import { Button } from "react-vant";
import { showToast } from "@/components/Toast/toastController";

const Home = () => {
  useTitle("奶龙首页");
  return (
    <>
      <Button type="primary" onClick={() => showToast(5, 2, 0)}>
        点击
      </Button>
    </>
  );
};

export default Home;
