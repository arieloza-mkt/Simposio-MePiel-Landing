export function withCloudinaryTransform(
  url: string | null | undefined,
  mode: "fill" | "fit" = "fill",
  shape: "rect" | "square" = "rect",
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com/image/upload/")) return url;

  const dims = shape === "square" ? "w_1200,h_1200" : "w_1920,h_1080";
  const crop = mode === "fit" ? "c_fit" : "c_fill";

  const transform = `${crop},${dims},q_60,f_auto,dpr_auto/`;

  return url.replace("image/upload/", `image/upload/${transform}`);
}
