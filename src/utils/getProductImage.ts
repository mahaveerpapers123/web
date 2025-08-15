export const getProductImage = (item: any) => {
  const placeholder = "/images/placeholder.png"; // public/images/placeholder.png
  const imageUrl = item?.imgs?.thumbnails?.[0];

  if (!imageUrl || imageUrl.trim() === "") {
    return placeholder;
  }

  // Optional: fallback if domain is correct but file likely missing
  if (imageUrl.includes("/uploads/") && imageUrl.endsWith(".jpeg") === false) {
    return placeholder;
  }

  return imageUrl;
};
