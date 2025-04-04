"use client"

import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  sendMessage: () => void
  isConnected: boolean
}

export function ChatInput({ input, setInput, sendMessage, isConnected }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="border-t border-slate-200 p-4 bg-white">
      <div className="flex gap-2 items-center">
        <Textarea
          ref={textareaRef}
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[40px] max-h-[200px] focus-visible:ring-blue-500 resize-none overflow-y-auto"
          disabled={!isConnected}
        />
        <Button
          onClick={sendMessage}
          disabled={!isConnected || !input.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Send className="h-4 w-4 mr-1" />
          Send
        </Button>
      </div>
      {!isConnected && (
        <p className="text-xs text-red-500 mt-2">Disconnected from server. Please check your connection.</p>
      )}
    </div>
  )
}

