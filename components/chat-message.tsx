"use client"

import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: {
    sender: "user" | "bot"
    text: string
    final: boolean
  }
  isLast: boolean
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.sender === "user"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex gap-3 max-w-[80%]", isUser ? "flex-row-reverse" : "flex-row")}>
        <div
          className={cn(
            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
            isUser ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser ? "bg-blue-500 text-white" : "bg-white border border-slate-200 shadow-sm",
          )}
        >
          {isUser ? (
            <p className="text-sm">{message.text}</p>
          ) : (
            <div className="prose prose-sm">
              {message.text && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({ node, children, ...props }) => (
                      <p className="text-sm leading-relaxed text-slate-700 mb-2 last:mb-0" {...props}>{children}</p>
                    ),
                    a: ({ node, href, children, ...props }) => (
                      <a 
                        href={href || '#'} 
                        className="text-blue-600 underline" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                    code: ({ node, inline, children, ...props }: { node?: any; inline?: boolean; children?: React.ReactNode; [prop: string]: any }) => (
                      <code className="bg-slate-100 px-1 py-0.5 rounded text-sm text-slate-800" {...props}>
                        {children}
                      </code>
                    ),
                    pre: ({ node, children, ...props }) => (
                      <pre className="bg-slate-100 p-2 rounded text-xs overflow-x-auto my-2 text-slate-800" {...props}>
                        {children}
                      </pre>
                    ),
                    ul: ({ node, children, ...props }) => (
                      <ul className="list-disc pl-5 my-2 text-sm" {...props}>{children}</ul>
                    ),
                    ol: ({ node, children, ...props }) => (
                      <ol className="list-decimal pl-5 my-2 text-sm" {...props}>{children}</ol>
                    ),
                    li: ({ node, children, ...props }) => (
                      <li className="mb-1 text-slate-700" {...props}>{children}</li>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
            </div>
          )}

          {!message.final && isLast && (
            <motion.div className="mt-1 flex space-x-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-slate-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0 }}
              />
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-slate-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.2 }}
              />
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-slate-300"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, delay: 0.4 }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}