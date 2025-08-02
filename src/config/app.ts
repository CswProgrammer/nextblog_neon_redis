// src/config/app.ts
import type { AppConfig } from "@/libs/types";
export const appConfig: AppConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://nextblog-neon-stylelintfix-lzvp.vercel.app",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
};
