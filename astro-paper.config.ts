import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jgyunrobot.github.io/",
    title: "jgYunRobot",
    description: "윤정길의 개인 로봇 개발 노트. 직접 개발하는 제어기와 로봇 모션, Teleoperation·학습 실험을 기록합니다.",
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
