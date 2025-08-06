import "./App.css";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import BlankLayout from "@/components/BlankLayout";
import Loading from "@/components/Loading";
import Toast from "@/components/Toast";

const Home = lazy(() => import("@/pages/Home"));
const Search = lazy(() => import("@/pages/Search"));
const Discount = lazy(() => import("@/pages/Discount"));
const Collection = lazy(() => import("@/pages/Collection"));
const Trip = lazy(() => import("@/pages/Trip"));
const Account = lazy(() => import("@/pages/Account"));
const Detail = lazy(() => import("@/pages/Detail"));
const WaterfallDemo = lazy(() => import("@/pages/WaterfallDemo"));
const Coze = lazy(() => import("./pages/Coze/index.jsx"));
const Article = lazy(() => import("./pages/Article"));
const ArticleNew = lazy(() => import("./pages/Article/ArticleNew"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* 带有 TabBar 的 Layout MainLayout 包裹的页面 */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/discount" element={<Discount />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/trip" element={<Trip />} />
            <Route path="/account" element={<Account />} />
          </Route>
          {/* 空白 的 Layout BlankLayout 包裹的页面 */}
          <Route element={<BlankLayout />}>
            <Route path="/search" element={<Search />} />
            <Route path="/article" element={<Article />}>
              <Route path="new" element={<ArticleNew />} />
            </Route>
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/waterfall-demo" element={<WaterfallDemo />} />
            <Route path="/coze" element={<Coze />} />
          </Route>
        </Routes>
      </Suspense>
      <Toast />
    </>
  );
}

export default App;
