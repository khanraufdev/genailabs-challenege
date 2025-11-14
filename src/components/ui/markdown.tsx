"use client";

import { Streamdown } from "streamdown";
import type { Components } from "react-markdown";
import type { MermaidConfig } from "mermaid";
import type { BundledLanguage } from "shiki";
import type { PluggableList } from "unified";
import type { HTMLAttributes, ReactNode } from "react";
import { CodeBlock } from "@/components/ai-elements/code-block";

type MarkdownProps = {
  content: string;
  isStreaming?: boolean;
  className?: string;
  shikiTheme?: [string, string];
  controls?: boolean | { table?: boolean; code?: boolean; mermaid?: boolean };
  components?: Components;
  mermaidConfig?: MermaidConfig;
  remarkPlugins?: PluggableList | null;
  rehypePlugins?: PluggableList | null;
};

const getLanguageFromClassName = (className?: string): BundledLanguage => {
  if (!className) return "tsx";
  const match = /language-([a-z0-9+#-]+)/i.exec(className);
  const lang = (match?.[1] || "tsx").toLowerCase();
  const map: Record<string, BundledLanguage> = {
    js: "javascript",
    ts: "typescript",
    tsx: "tsx",
    jsx: "jsx",
    md: "markdown",
    mdx: "mdx",
    py: "python",
    rb: "ruby",
    rs: "rust",
    csharp: "csharp",
    "c#": "csharp",
    sh: "bash",
    yml: "yaml",
    tf: "terraform",
    kt: "kotlin",
    hs: "haskell",
    go: "go",
    css: "css",
    scss: "scss",
    less: "less",
    sql: "sql",
    html: "html",
    xml: "xml",
    json: "json",
    java: "java",
    php: "php",
    cpp: "cpp",
    c: "c",
  };
  const resolved = map[lang] as BundledLanguage | undefined;
  return (resolved ?? ("tsx" as BundledLanguage)) as BundledLanguage;
};

export const Markdown = ({
  content,
  isStreaming = false,
  className,
  controls = true,
  components,
  mermaidConfig,
  remarkPlugins,
  rehypePlugins,
}: MarkdownProps) => {
  type CodeProps = HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    className?: string;
    children?: ReactNode;
  };
  const Code = (props: CodeProps) => {
    const { inline, className: cn, children, ...rest } = props || {};
    const raw = String(children ?? "");
    if (inline) return <code className={cn} {...rest}>{raw}</code>;
    const language = getLanguageFromClassName(typeof cn === "string" ? cn : "");
    return <CodeBlock code={raw} language={language} className="my-3" />;
  };

  const mergedComponents: Components = {
    code: Code,
    ...(components || {}),
  };

  return (
    <Streamdown
      className={className}
      isAnimating={isStreaming}
      controls={controls}
      components={mergedComponents}
      mermaidConfig={mermaidConfig}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {content}
    </Streamdown>
  );
};


