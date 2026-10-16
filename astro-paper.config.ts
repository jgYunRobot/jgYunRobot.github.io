import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jgyunrobot.github.io/",
    title: "jgYunRobot",
    description: "윤정길의 개인 로봇 개발 노트. Nodus, 로봇 모션, Teleoperation과 Physical AI 실험을 기록합니다.",
    author: "윤정길",
    profile: "https://github.com/jgYunRobot",
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
    { name: "github", url: "https://github.com/jgYunRobot" },
    { name: "mail", url: "mailto:imim_0523@naver.com" },
  ],
  shareLinks: [],
});
