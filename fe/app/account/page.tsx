"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { mockOrders } from "@/lib/mock-data"
import { Package, UserIcon, LogOut, ChevronRight } from "lucide-react"

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your account</h1>
          <Link href="/auth/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
        <Footer />
      </>
    )
  }

  const userOrders = mockOrders.filter((o) => o.userId === user.id)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div>
              <Card className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {user.name.charAt(0)}
                  </div>
                  <h2 className="font-bold text-lg">{user.name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded w-fit mx-auto">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-4">
                  <Link
                    href="/account/profile"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon size={18} />
                      <span>Profile</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center justify-between p-2 hover:bg-muted rounded transition"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={18} />
                      <span>Orders</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between p-2 hover:bg-muted rounded transition text-primary font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon size={18} />
                        <span>Admin Panel</span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                  {user.role === "staff" && (
                    <Link
                      href="/admin"
                      className="flex items-center justify-between p-2 hover:bg-muted rounded transition text-primary font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon size={18} />
                        <span>Staff Dashboard</span>
                      </div>
                      <ChevronRight size={16} />
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between p-2 hover:bg-muted rounded transition text-destructive mt-2 pt-4 border-t"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut size={18} />
                      <span>Logout</span>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* User Info */}
              <Card className="p-6 mb-8">
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Full Name</label>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Member Since</label>
                    <p className="font-semibold">{user.createdAt.toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>

              {/* Orders */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Recent Orders ({userOrders.length})</h2>
                {userOrders.length === 0 ? (
                  <p className="text-muted-foreground">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">${order.total}</p>
                            <div
                              className={`text-xs font-semibold px-2 py-1 rounded w-fit mt-1 ${
                                order.status === "delivered"
                                  ? "bg-accent/10 text-accent"
                                  : order.status === "shipped"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-muted-foreground">
                              {item.productName} x{item.quantity}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
