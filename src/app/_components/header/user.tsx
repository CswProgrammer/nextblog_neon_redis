"use client";

import { isNil } from "lodash";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, type MouseEventHandler, Suspense, useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/shadcn/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/shadcn/ui/dropdown-menu";
import { cn } from "@/app/_components/shadcn/utils";
import { fetchApi } from "@/libs/api";
import { deleteCookie } from "@/libs/cookies";
import { ACCESS_TOKEN_COOKIE_NAME } from "@/libs/token";

import { useAuth, useSetAuth } from "../auth/hooks";
import { useToast } from "../shadcn/hooks/use-toast";
import { Button as CNButton } from "../shadcn/ui/button";
import UserAvatar from "./avatar.jpg";
import $styles from "./ user.module.css";

export const LoginButton: FC<{ iconBtn?: boolean }> = ({ iconBtn }) => {
  return (
    <CNButton
      asChild
      className={cn("tw-ml-auto tw-justify-end", {
        "focus-visible:!tw-ring-0": !iconBtn,
        "tw-rounded-sm": !iconBtn,
      })}
      variant={iconBtn ? "outline" : "default"}
      size={iconBtn ? "icon" : "default"}
    >
      <Link href="/auth/login">
        <User />
        {!iconBtn && "登录"}
      </Link>
    </CNButton>
  );
};

export const UserAction: FC<{ iconBtn?: boolean }> = ({ iconBtn }) => {
  const auth = useAuth();
  const setAuth = useSetAuth();
  const router = useRouter();
  const { toast } = useToast();
  const loginOut: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        const res = await fetchApi(async (c) => c.api.auth.logout.$post());
        if (res.ok) {
          deleteCookie(ACCESS_TOKEN_COOKIE_NAME);
          setAuth(null);
          router.push("/auth/login");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "服务器错误,请重试！",
          description: (error as Error).message,
        });
      }
    },
    [toast]
  );
  return (
    <div className={cn($styles.user)}>
      {isNil(auth) ? (
        <Suspense>
          <LoginButton iconBtn={iconBtn} />
        </Suspense>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Avatar className={$styles.avatar}>
              <AvatarImage src={UserAvatar.src} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="tw-w-56 tw-text-center tw-text-stone-500">
            <DropdownMenuLabel className="tw-justify-center">我的账户</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="#" onClick={loginOut}>
                退出登录
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
