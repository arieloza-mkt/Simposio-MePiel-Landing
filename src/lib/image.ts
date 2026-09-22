export function withCloudinaryTransform(
  url: string | null | undefined,
  mode: "fill" | "fit" = "fill",
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com/image/upload/")) return url;

  const transform =
    mode === "fit"
      ? "c_fit,w_1920,q_auto,f_auto/"
      : "c_fill,w_1920,h_1080,q_auto,f_auto/";

  return url.replace("image/upload/", `image/upload/${transform}`);
}
