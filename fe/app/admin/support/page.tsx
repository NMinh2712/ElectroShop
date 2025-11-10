"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { AdminLayout } from "@/components/admin-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, MessageSquare, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react"

export default function AdminSupportPage() {
  const { user } = useAuth()
  const [supportTickets, setSupportTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [responseText, setResponseText] = useState("")

  useEffect(() => {
    if (user?.roleId === 1 || user?.roleId === 2) {
      // Placeholder for when support ticket API endpoints are added
      setLoading(false)
    }
  }, [user])

  if (!user || (user.roleId !== 1 && user.roleId !== 2)) {
    return (
      <AdminLayout>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        </div>
      </AdminLayout>
    )
  }

  const open = supportTickets.filter((t) => t.status === "open").length
  const resolved = supportTickets.filter((t) => t.status === "closed").length

  const selectedTicket = supportTickets.find((t) => t.id === selectedTicketId)

  return (
    <AdminLayout>
      <div className="p-8">
        <Link href="/admin" className="flex items-center gap-2 text-primary hover:underline mb-4">
          <ChevronLeft size={18} />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-8">Support Tickets</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold">{supportTickets.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-primary">{open}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-accent">{resolved}</p>
              </div>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <Card className="lg:col-span-1 overflow-hidden">
              <div className="max-h-96 overflow-y-auto">
                {supportTickets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No support tickets.</div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-muted border-b sticky top-0">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold text-sm">Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportTickets.map((ticket) => (
                        <tr
                          key={ticket.id}
                          onClick={() => setSelectedTicketId(ticket.id)}
                          className={`border-b cursor-pointer transition ${
                            selectedTicketId === ticket.id ? "bg-primary/10" : "hover:bg-muted/50"
                          }`}
                        >
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold line-clamp-2">{ticket.subject}</p>
                            <span
                              className={`inline-block text-xs font-semibold px-2 py-1 rounded mt-2 ${
                                ticket.status === "open"
                                  ? "bg-primary/10 text-primary"
                                  : ticket.status === "in-progress"
                                    ? "bg-yellow-500/10 text-yellow-600"
                                    : "bg-accent/10 text-accent"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>

            {/* Ticket Details */}
            {selectedTicket && (
              <Card className="lg:col-span-2 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                    <p className="text-sm text-muted-foreground">{selectedTicket.createdAt?.toLocaleDateString()}</p>
                  </div>
                  <Select value={selectedTicket.status}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Customer Message:</p>
                    <p className="text-sm text-muted-foreground">{selectedTicket.message}</p>
                  </div>

                  {selectedTicket.responses?.map((response: string, idx: number) => (
                    <div key={idx} className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                      <p className="text-sm font-semibold mb-2 text-primary">Staff Response:</p>
                      <p className="text-sm">{response}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Textarea
                    placeholder="Type your response..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={3}
                  />
                  <Button className="w-full">
                    <Send size={16} className="mr-2" />
                    Send Response
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
