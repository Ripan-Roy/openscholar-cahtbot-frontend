"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Lightbulb } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeKatex from "rehype-katex"

interface ToolResponseProps {
  toolResponse: string
  isOpen: boolean
  onToggle: () => void
}

export function ToolResponse({ toolResponse, isOpen, onToggle }: ToolResponseProps) {
  return (
    <div className="bg-amber-50 border-b border-amber-200 p-3">
      <button className="text-amber-800 font-medium text-sm flex items-center gap-1.5 w-full" onClick={onToggle}>
        <Lightbulb className="h-4 w-4" />
        <span>AI analysis</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="tool-response"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-white border border-amber-200 rounded-lg text-xs max-h-60 overflow-y-auto text-slate-700 prose prose-sm">
              {toolResponse && (
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    p: ({ node, children, ...props }) => (
                      <p className="text-sm leading-relaxed mb-2 last:mb-0" {...props}>{children}</p>
                    ),
                    h1: ({ node, children, ...props }) => (
                      <h1 className="text-lg font-bold mt-4 mb-2" {...props}>{children}</h1>
                    ),
                    h2: ({ node, children, ...props }) => (
                      <h2 className="text-md font-bold mt-3 mb-2" {...props}>{children}</h2>
                    ),
                    h3: ({ node, children, ...props }) => (
                      <h3 className="text-sm font-bold mt-3 mb-1" {...props}>{children}</h3>
                    ),
                    ul: ({ node, children, ...props }) => (
                      <ul className="list-disc pl-5 my-2" {...props}>{children}</ul>
                    ),
                    ol: ({ node, children, ...props }) => (
                      <ol className="list-decimal pl-5 my-2" {...props}>{children}</ol>
                    ),
                    li: ({ node, children, ...props }) => (
                      <li className="mb-1" {...props}>{children}</li>
                    ),
                    code: ({ node, inline, children, ...props }) => (
                      inline ? 
                      <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800" {...props}>{children}</code> :
                      <code className="block" {...props}>{children}</code>
                    ),
                  }}
                >
                  {toolResponse}
                </ReactMarkdown>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}