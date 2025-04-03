"use client"

import type { KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  sendMessage: () => void
  isConnected: boolean
}

export function ChatInput({ input, setInput, sendMessage, isConnected }: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="border-t border-slate-200 p-4 bg-white">
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 focus-visible:ring-blue-500"
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

