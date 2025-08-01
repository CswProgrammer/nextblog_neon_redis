"use client";

import type { ChangeEventHandler, MouseEventHandler } from "react";
import type { Control, SubmitHandler } from "react-hook-form";

import { isNil, trim } from "lodash";
import Link from "next/link";
import { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";

import { generateLowerString } from "@/libs/utils";

import type { PostActionFormProps, PostActionFormRef, PostFormData } from "./types";

import { Details } from "../collapsible/details";
import { MdxEditor } from "../mdx/editor";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import { Textarea } from "../shadcn/ui/textarea";
import { usePostActionForm, usePostFormSubmitHandler } from "./hooks";

// 修复点1: 创建兼容类型
type CompatibleControl = Control<PostFormData>;

export const PostActionForm = forwardRef<PostActionFormRef, PostActionFormProps>((props, ref) => {
  // 修复点2: 移除泛型参数 (解决第一个错误)
  const form = usePostActionForm(
    props.type === "create" ? { type: props.type } : { type: props.type, item: props.item }
  );

  // 修复点3: 移除泛型参数并添加类型断言 (解决第二个错误)
  const submitHandler = usePostFormSubmitHandler(
    props.type === "create" ? { type: "create" } : { type: "update", id: props.item.id }
  ) as SubmitHandler<PostFormData>; // 添加类型断言

  const slugValue = form.watch("slug");
  const changeSlug: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => form.setValue("slug", e.target.value),
    [form]
  );

  const generateTitleSlug: MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!form.formState.isSubmitting) {
        const title = trim(form.getValues("title"), "");
        if (title) form.setValue("slug", generateLowerString(title));
      }
    },
    [form]
  );

  useEffect(() => {
    if (!isNil(props.setPedding)) props.setPedding(form.formState.isSubmitting);
  }, [form.formState.isSubmitting, props]);

  // 修复点4: 正确使用 useImperativeHandle
  useImperativeHandle(
    ref,
    () => ({
      save: () => {
        return form.handleSubmit(submitHandler)();
      },
    }),
    [form, submitHandler]
  );

  // 修复点5: 创建兼容的 control 类型
  const formControl = form.control as unknown as CompatibleControl;

  return (
    <Form {...form}>
      {/* 修复点6: 直接使用 submitHandler */}
      <form
        onSubmit={form.handleSubmit(submitHandler)}
        className="tw-flex tw-flex-auto tw-flex-col tw-space-y-8"
      >
        <FormField
          control={formControl}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>文章标题</FormLabel>
              <FormControl>
                <Input {...field} placeholder="请输入标题" disabled={form.formState.isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Details summary="可选字段">
          <FormField
            control={formControl}
            name="summary"
            render={({ field }) => (
              <FormItem className="tw-mt-2 tw-border-b tw-border-dashed tw-pb-1">
                <FormLabel>摘要简述</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入文章摘要"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>摘要会显示在文章列表页</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="tw-mt-2 tw-border-b tw-border-dashed tw-pb-1">
            <FormField
              control={formControl}
              name="slug"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>唯一URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={slugValue}
                      onChange={changeSlug}
                      placeholder="请输入唯一URL"
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    如果留空,则文章访问地址是id
                    <Link
                      className="tw-ml-5 tw-mr-1 tw-text-black dark:tw-text-white"
                      href="#"
                      onClick={generateTitleSlug}
                      aria-disabled={form.formState.isSubmitting}
                    >
                      [点此]
                    </Link>
                    自动生成slug(根据标题使用&apos;-&apos;连接字符拼接而成,中文字自动转换为拼音)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={formControl}
            name="keywords"
            render={({ field }) => (
              <FormItem className="tw-mt-2 tw-border-b tw-border-dashed tw-pb-1">
                <FormLabel>关键字</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="请输入关键字,用逗号分割(关键字是可选的)"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  关键字不会显示,仅在SEO时发挥作用.每个关键字之间请用英文逗号(,)分割
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={formControl}
            name="description"
            render={({ field }) => (
              <FormItem className="tw-mt-2 tw-border-b tw-border-dashed tw-pb-1">
                <FormLabel>文章描述 </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入文章描述"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormDescription>文章描述不会显示,仅在SEO时发挥作用</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </Details>
        <FormField
          control={formControl}
          name="body"
          render={({ field }) => (
            <FormItem className="tw-flex tw-flex-auto tw-flex-col">
              <FormLabel className="tw-mb-3">文章内容</FormLabel>
              <FormControl>
                <div className="tw-flex tw-flex-auto">
                  <MdxEditor
                    content={field.value}
                    setContent={field.onChange}
                    disabled={form.formState.isSubmitting}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});
