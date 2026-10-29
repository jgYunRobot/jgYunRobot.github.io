import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jgyunrobot.github.io/",
    title: "Project Nodus",
    description: "Project Nodus — 로봇 제어부터 Physical AI까지. 직접 만들고, 움직이고, 검증한 프로젝트의 기록.",
    author: "윤정길",
    profile: "https://jgyunrobot.github.io/about/",
    ogImage: "og.jpg",
    lang: "ko",
    timezone: "Asia/Seoul",
  },
  posts: { perPage: 6, perIndex: 5 },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "mail", url: "mailto:imim_0523@naver.com" },
  ],
  shareLinks: [],
});
