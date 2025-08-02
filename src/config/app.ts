// src/config/app.ts
import type { AppConfig } from "@/libs/types";

// 使用逻辑确保值有效
const getBaseUrl = () => {
  // 优先使用环境变量
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 服务器环境使用 Vercel 提供的信息
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 开发环境默认
  return "http://localhost:3000";
};

const baseUrl = getBaseUrl();

export const appConfig: AppConfig = {
  baseUrl,
  // API 始终使用相对路径
  apiUrl: "/api", // 关键修复：使用相对路径
};
