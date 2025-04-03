"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatMessage } from "@/components/chat-message"
import { ChatInput } from "@/components/chat-input"
import { ToolResponse } from "@/components/tool-response"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  const [messages, setMessages] = useState<
    Array<{
      sender: "user" | "bot"
      text: string
      final: boolean
    }>
  >([])
  const [input, setInput] = useState("")
  const [toolResponse, setToolResponse] = useState("")
  const [thinkingOpen, setThinkingOpen] = useState(true)
  const ws = useRef<WebSocket | null>(null)
  const latestMsgRef = useRef<HTMLDivElement | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    ws.current = new WebSocket(`wss://chat.dpu.openscholar.in/ws/chat/room1`)

    ws.current.onopen = () => {
      console.log("Connected to server")
      setIsConnected(true)
    }

    ws.current.onmessage = (event) => {
      try {
        const { response, type } = JSON.parse(event.data)

        if (type === "text") {
          // Process the received text by properly converting escaped newlines to actual newlines
          const processedText = response.replace(/\\n/g, "\n");
          
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last && last.sender === "bot" && !last.final) {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...last,
                text: processedText,
                final: false,
              }
              return updated
            } else {
              return [...prev, { sender: "bot", text: processedText, final: false }]
            }
          })
        } else if (type === "tool") {
          // Also process tool responses to handle escaped newlines
          const processedToolResponse = response.replace(/\\n/g, "\n");
          setToolResponse((prev) => prev + processedToolResponse)
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err)
      }
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
      setIsConnected(false)
    }

    return () => {
      ws.current?.close()
    }
  }, [])

  useEffect(() => {
    latestMsgRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, { sender: "user", text: input, final: true }])
    ws.current?.send(JSON.stringify({ message: input }))
    setInput("")
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-800 text-white p-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h1 className="text-lg font-medium">AI Chat Assistant</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"}`}></div>
            <span className="text-xs text-slate-300">{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        {/* Tool Response */}
        {toolResponse && (
          <ToolResponse
            toolResponse={toolResponse}
            isOpen={thinkingOpen}
            onToggle={() => setThinkingOpen((prev) => !prev)}
          />
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px] bg-slate-50">
          <AnimatePresence initial={false}>
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                className="flex flex-col items-center justify-center h-full text-slate-400 text-sm"
              >
                <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                <p>No messages yet. Start a conversation!</p>
              </motion.div>
            ) : (
              messages.map((msg, idx) => <ChatMessage key={idx} message={msg} isLast={idx === messages.length - 1} />)
            )}
          </AnimatePresence>
          <div ref={latestMsgRef} />
        </div>

        {/* Input Area */}
        <ChatInput input={input} setInput={setInput} sendMessage={sendMessage} isConnected={isConnected} />
      </div>
    </div>
  )
}

