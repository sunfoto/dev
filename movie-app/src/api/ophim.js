import axios from "axios";

const api = axios.create({
  baseURL: "https://ophim1.com/v1/api",
});

export const getNewMovies = async () => {
  const res = await api.get("/danh-sach/phim-moi");
  return res.data;
};

export const getSeriesMovies = async () => {
  const res = await api.get("/danh-sach/phim-bo");
  return res.data;
};

export const getSingleMovies = async () => {
  const res = await api.get("/danh-sach/phim-le");
  return res.data;
};

export const searchMovies = async (keyword) => {
  const res = await api.get(`/tim-kiem?keyword=${keyword}`);
  return res.data;
};

export const getMovieDetail = async (slug) => {
  const res = await api.get(`/phim/${slug}`);
  return res.data;
};