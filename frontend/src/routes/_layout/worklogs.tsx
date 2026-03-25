import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  fetchFreelancerNames,
  fetchWorklogsWithFreelancers,
} from "@/data/mockData"

export const Route = createFileRoute("/_layout/worklogs")({
  component: WorklogsPage,
  head: () => ({
    meta: [
      {
        title: "Worklogs - WorkLog Dashboard",
      },
    ],
  }),
})

function WorklogsPage() {
  const navigate = useNavigate()
  const [allWorklogs, setAllWorklogs] = useState<any[]>([])
  const [freelancerOptions, setFreelancerOptions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Client-side pagination per AGENTS.md
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Exclusive filter tabs per AGENTS.md — only one filter active at a time
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [freelancerFilter, setFreelancerFilter] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  // Selection for payment batch
  const [selectedWorklogIds, setSelectedWorklogIds] = useState<Set<string>>(
    new Set(),
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchWorklogsWithFreelancers()
        setAllWorklogs(data)
        const names = await fetchFreelancerNames()
        setFreelancerOptions(names)
      } catch (err) {
        setError("Failed to load worklogs. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Apply active filter
  const filteredWorklogs = allWorklogs.filter((wl: any) => {
    if (activeFilter === "status" && statusFilter !== "all") {
      if (wl.status !== statusFilter) return false
    }
    if (activeFilter === "freelancer" && freelancerFilter !== "all") {
      if (wl.freelancer_id !== freelancerFilter) return false
    }
    if (activeFilter === "dateRange" && (dateFrom || dateTo)) {
      const wlDate = new Date(wl.created_at)
      if (dateFrom && wlDate < new Date(dateFrom)) return false
      if (dateTo && wlDate > new Date(`${dateTo}T23:59:59.999Z`)) return false
    }
    return true
  })

  // Paginate
  const totalPages = Math.max(1, Math.ceil(filteredWorklogs.length / pageSize))
  const displayed = filteredWorklogs.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  // Selection handlers
  const toggleWorklog = (id: string) => {
    setSelectedWorklogIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedWorklogIds.size === filteredWorklogs.length) {
      setSelectedWorklogIds(new Set())
    } else {
      setSelectedWorklogIds(new Set(filteredWorklogs.map((wl: any) => wl.id)))
    }
  }

  const handleProcessPayment = () => {
    if (selectedWorklogIds.size === 0) return
    // Store selected IDs in sessionStorage for the payments page
    sessionStorage.setItem(
      "paymentWorklogIds",
      JSON.stringify(Array.from(selectedWorklogIds)),
    )
    navigate({ to: "/payments" })
  }

  // Reset page when filter changes
  const handleFilterTabChange = (filter: string) => {
    if (activeFilter === filter) {
      setActiveFilter(null)
    } else {
      setActiveFilter(filter)
    }
    setPage(1)
  }

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      case "approved":
        return "bg-blue-500/15 text-blue-400 border-blue-500/30"
      case "submitted":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading worklogs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="text-destructive">{error}</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-destructive px-4 py-2 text-sm text-white hover:bg-destructive/90"
            onClick={() => window.location.reload()}
            aria-label="Retry loading worklogs"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Worklogs</h1>
          <p className="text-sm text-muted-foreground">
            Review freelancer work logs and process payments
          </p>
        </div>
        {selectedWorklogIds.size > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            onClick={handleProcessPayment}
            aria-label="Process payment for selected worklogs"
          >
            Process Payment ({selectedWorklogIds.size})
          </button>
        )}
      </div>

      {/* Exclusive Filter Tabs — per AGENTS.md only one filter active at a time */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "status"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => handleFilterTabChange("status")}
            aria-label="Toggle status filter"
          >
            Status
          </button>
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "freelancer"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => handleFilterTabChange("freelancer")}
            aria-label="Toggle freelancer filter"
          >
            Freelancer
          </button>
          <button
            type="button"
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeFilter === "dateRange"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
            onClick={() => handleFilterTabChange("dateRange")}
            aria-label="Toggle date range filter"
          >
            Date Range
          </button>
        </div>

        {/* Filter dropdown content — shown only for the active filter tab */}
        {activeFilter === "status" && (
          <div className="mt-3 flex gap-2">
            {["all", "submitted", "approved", "paid"].map((s) => (
              <button
                key={s}
                type="button"
                className={`rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
                onClick={() => {
                  setStatusFilter(s)
                  setPage(1)
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {activeFilter === "freelancer" && (
          <div className="mt-3">
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={freelancerFilter}
              onChange={(e) => {
                setFreelancerFilter(e.target.value)
                setPage(1)
              }}
              aria-label="Select freelancer to filter"
            >
              <option value="all">All Freelancers</option>
              {freelancerOptions.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {activeFilter === "dateRange" && (
          <div className="mt-3 flex items-center gap-3">
            <label
              className="text-sm text-muted-foreground"
              htmlFor="date-from"
            >
              From
            </label>
            <input
              id="date-from"
              type="date"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
            />
            <label className="text-sm text-muted-foreground" htmlFor="date-to">
              To
            </label>
            <input
              id="date-to"
              type="date"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
            />
          </div>
        )}
      </div>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground">
        Showing {displayed.length} of {filteredWorklogs.length} worklogs
        {activeFilter && " (filtered)"}
      </div>

      {/* Worklogs Table — feature-specific per AGENTS.md, not a generic DataTable */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedWorklogIds.size === filteredWorklogs.length &&
                    filteredWorklogs.length > 0
                  }
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-border"
                  aria-label="Select all worklogs"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Task
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Freelancer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hours
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((wl: any) => (
              <tr
                key={wl.id}
                className="border-b border-border transition-colors hover:bg-muted/30 cursor-pointer"
                onClick={(e) => {
                  // Don't navigate if clicking checkbox
                  if ((e.target as HTMLElement).tagName === "INPUT") return
                  navigate({ to: `/worklog/${wl.id}` as any })
                }}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedWorklogIds.has(wl.id)}
                    onChange={() => toggleWorklog(wl.id)}
                    className="h-4 w-4 rounded border-border"
                    aria-label={`Select worklog ${wl.task_name}`}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">
                    {wl.task_name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                    {wl.description}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {wl.freelancer?.name || "Unknown"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${getStatusBadgeClasses(wl.status)}`}
                  >
                    {wl.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums text-foreground">
                  {wl.total_hours.toFixed(1)}h
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-foreground">
                  ${wl.total_amount.toFixed(2)}
                </td>
                {/* DateTime as raw UTC string per AGENTS.md */}
                <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                  {wl.created_at}
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No worklogs found matching the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client-side pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  p === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
                onClick={() => setPage(p)}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              disabled={page >= totalPages}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
