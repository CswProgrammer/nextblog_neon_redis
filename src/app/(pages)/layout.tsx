// src/app/(pages)/layout.tsx
import type { Metadata } from "next";
import type { FC, PropsWithChildren, ReactNode } from "react";
import Head from "next/head"; // 导入 Head 组件

import { Auth } from "../_components/auth/provider";
import { Header } from "../_components/header";
import "./global.css";
import { Toaster } from "../_components/shadcn/ui/toaster";
import Theme from "../_components/theme";
import $styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "编程突围",
  description: "这里是编程突围官网",
};

const AppLayout: FC<PropsWithChildren<{ modal: ReactNode }>> = ({ children, modal }) => (
  <Auth>
    <Theme>
      {/* 添加 viewport meta 标签 */}
      <Head>
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1, viewport-fit=cover" 
        />
      </Head>
      
      <div className={$styles.layout}>
        <Header />
        {children}
      </div>
      {modal}
      <Toaster />
    </Theme>
  </Auth>
);

export default AppLayout;
