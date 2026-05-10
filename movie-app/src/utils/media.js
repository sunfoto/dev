export function buildPosterUrl(url, cdnBase = "https://img.ophim.live") {
  if (!url || typeof url !== "string") {
    return "";
  }
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  if (url.startsWith("movies/")) {
    return `${cdnBase}/${url}`;
  }
  if (!url.includes("/")) {
    return `${cdnBase}/uploads/movies/${url}`;
  }
  const normalized = url.startsWith("/") ? url : `/${url}`;
  if (normalized.startsWith("/uploads") || normalized.startsWith("/images")) {
    return `${cdnBase}${normalized}`;
  }
  return `${cdnBase}${normalized}`;
}
