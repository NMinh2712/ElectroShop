"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Comment } from "@/lib/types"
import { mockComments as initialComments } from "@/lib/mock-data"

interface CommentsContextType {
  comments: Comment[]
  addComment: (comment: Comment) => void
  deleteComment: (commentId: string) => void
  getProductComments: (productId: string) => Comment[]
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined)

export function CommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<Comment[]>(initialComments)

  const addComment = (comment: Comment) => {
    setComments([...comments, comment])
  }

  const deleteComment = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId))
  }

  const getProductComments = (productId: string) => {
    return comments.filter((c) => c.productId === productId)
  }

  return (
    <CommentsContext.Provider value={{ comments, addComment, deleteComment, getProductComments }}>
      {children}
    </CommentsContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentsContext)
  if (!context) {
    throw new Error("useComments must be used within CommentsProvider")
  }
  return context
}
