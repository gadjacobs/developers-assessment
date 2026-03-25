import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { fetchFreelancers, fetchWorklogs } from "@/data/mockData"
import useAuth from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - WorkLog Dashboard",
      },
    ],
  }),
})

function Dashboard() {
  const { user: currentUser } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const worklogs = await fetchWorklogs()
        const freelancers = await fetchFreelancers()

        const totalAmount = worklogs.reduce(
          (sum: number, wl: any) => sum + wl.total_amount,
          0,
        )
        const pendingWorklogs = worklogs.filter(
          (wl: any) => wl.status === "submitted" || wl.status === "approved",
        )
        const pendingAmount = pendingWorklogs.reduce(
          (sum: number, wl: any) => sum + wl.total_amount,
          0,
        )
        const paidWorklogs = worklogs.filter((wl: any) => wl.status === "paid")

        setStats({
          totalWorklogs: worklogs.length,
          totalFreelancers: freelancers.length,
          totalAmount,
          pendingCount: pendingWorklogs.length,
          pendingAmount,
          paidCount: paidWorklogs.length,
        })
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Hi, {currentUser?.full_name || currentUser?.email} 👋
        </h1>
        <p className="text-muted-foreground">
          Welcome to the WorkLog Payment Dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Worklogs
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            {stats.totalWorklogs}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            across {stats.totalFreelancers} freelancers
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Pending Review
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-amber-400">
            {stats.pendingCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ${stats.pendingAmount.toFixed(2)} pending
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Paid
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-emerald-400">
            {stats.paidCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">settled worklogs</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Earnings
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
            ${stats.totalAmount.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">all time</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:bg-muted/50"
          onClick={() => navigate({ to: "/worklogs" })}
          aria-label="View all worklogs"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 text-xl transition-transform group-hover:scale-110">
            📋
          </div>
          <div>
            <p className="font-semibold text-foreground">View Worklogs</p>
            <p className="text-sm text-muted-foreground">
              Review freelancer work logs and time entries
            </p>
          </div>
        </button>
        <button
          type="button"
          className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 text-left transition-all hover:border-primary/50 hover:bg-muted/50"
          onClick={() => navigate({ to: "/payments" })}
          aria-label="Process payments"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-xl transition-transform group-hover:scale-110">
            💳
          </div>
          <div>
            <p className="font-semibold text-foreground">Process Payments</p>
            <p className="text-sm text-muted-foreground">
              Select worklogs and issue payment batches
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}
