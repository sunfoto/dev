import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

const Categories = lazy(() => import("./page/Categories"));
const CategoryDetail = lazy(() => import("./page/CategoryDetail"));
const Detail = lazy(() => import("./page/Detail"));
const Home = lazy(() => import("./page/Home"));
const List = lazy(() => import("./page/List"));
const Search = lazy(() => import("./page/Search"));

const routeFallback = (
  <main className="mx-auto w-full max-w-6xl px-4 py-8">
    <div className="movie-grid">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="movie-skeleton" />
      ))}
    </div>
  </main>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={routeFallback}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="list/:slug" element={<List />} />
            <Route path="list/:slug/page/:page" element={<List />} />
            <Route path="search" element={<Search />} />
            <Route path="the-loai" element={<Categories />} />
            <Route path="the-loai/:slug" element={<CategoryDetail />} />
            <Route path="the-loai/:slug/page/:page" element={<CategoryDetail />} />
            <Route path="movie/:slug" element={<Detail />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
