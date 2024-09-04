import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testMatch: ["pomtest/test.test.ts"],
  use:{
    baseURL: "https://kanban-566d8.firebaseapp.com/",
    headless: false,
    screenshot: "on",
    video: "on",
    launchOptions:{ slowMo:1000}
  },
  retries:0,
  reporter: [["dot"], ["json", {outputFile: "jsonReports/jsonRepost.json"}], ["html", {open: "never"}]]
};

export default config;