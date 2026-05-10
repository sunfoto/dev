import axios from "axios";

const api = axios.create({
  baseURL: "https://ophim1.com/v1/api",
});

let categoriesCache = null;
let categoriesRequest = null;

const withCdn = (payload) => {
  const cdnBase = payload?.APP_DOMAIN_CDN_IMAGE || "https://img.ophim.live";
  const dataCdnBase = payload?.data?.APP_DOMAIN_CDN_IMAGE;
  const imageCdnBase = dataCdnBase || cdnBase;

  if (Array.isArray(payload?.data?.items)) {
    payload.data.items = payload.data.items.map((item) => ({
      ...item,
      __cdn: imageCdnBase,
    }));
  }
  if (payload?.data?.item) {
    payload.data.item = {
      ...payload.data.item,
      __cdn: imageCdnBase,
    };
  }
  if (!payload?.data?.pagination && payload?.data?.params?.pagination) {
    payload.data.pagination = payload.data.params.pagination;
  }
  if (payload?.data?.pagination && !payload.data.pagination.totalPages) {
    const totalItems = Number(payload.data.pagination.totalItems || 0);
    const perPage = Number(payload.data.pagination.totalItemsPerPage || 0);

    payload.data.pagination.totalPages =
      totalItems > 0 && perPage > 0 ? Math.ceil(totalItems / perPage) : 1;
  }
  return payload;
};

export const getNewMovies = async (params = {}) => {
  const res = await api.get("/danh-sach/phim-moi", { params });
  return withCdn(res.data);
};

export const getSeriesMovies = async (params = {}) => {
  const res = await api.get("/danh-sach/phim-bo", { params });
  return withCdn(res.data);
};

export const getSingleMovies = async (params = {}) => {
  const res = await api.get("/danh-sach/phim-le", { params });
  return withCdn(res.data);
};

export const getHome = async () => {
  const res = await api.get("/home");
  return res.data;
};

export const getListMovies = async (slug, params = {}) => {
  const res = await api.get(`/danh-sach/${slug}`, { params });
  return withCdn(res.data);
};

export const getCategoryMovies = async (slug, params = {}) => {
  const res = await api.get(`/the-loai/${slug}`, { params });
  return withCdn(res.data);
};

export const getCategories = async () => {
  if (categoriesCache) {
    return categoriesCache;
  }
  if (!categoriesRequest) {
    categoriesRequest = api.get("/the-loai").then((res) => {
      const items = Array.isArray(res.data?.data)
        ? res.data.data
        : res.data?.data?.items;
      categoriesCache = Array.isArray(items) ? items : [];
      return categoriesCache;
    });
  }

  try {
    return await categoriesRequest;
  } finally {
    categoriesRequest = null;
  }
};

export const searchMovies = async (keyword, params = {}) => {
  const res = await api.get("/tim-kiem", {
    params: { keyword, ...params },
  });
  return withCdn(res.data);
};

export const getMovieDetail = async (slug) => {
  const res = await api.get(`/phim/${slug}`);
  return withCdn(res.data);
};
