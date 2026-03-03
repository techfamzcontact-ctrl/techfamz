export default function manifest() {
  return {
    name: "Techfamz — Engineering the Future of African Technology",
    short_name: "Techfamz",
    description:
      "A structured technology ecosystem for African developers, engineers, and companies.",
    start_url: "/",
    display: "standalone",
    background_color: "#060B18",
    theme_color: "#060B18",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
