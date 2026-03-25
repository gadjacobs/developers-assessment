import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  fetchFreelancerById,
  fetchTimeEntriesByWorklogId,
  fetchWorklogById,
} from "@/data/mockData"

export const Route = createFileRoute("/_layout/worklog/$worklogId")({
  component: WorklogDetailPage,
  head: () => ({
    meta: [
      {
        title: "Worklog Detail - WorkLog Dashboard",
      },
    ],
  }),
})

function WorklogDetailPage() {
  const { worklogId } = Route.useParams()
  const navigate = useNavigate()
  const [worklog, setWorklog] = useState<any>(null)
  const [freelancer, setFreelancer] = useState<any>(null)
  const [timeEntries, setTimeEntries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Client-side pagination per AGENTS.md
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const loadData = async () => {
      try {
        const wl = await fetchWorklogById(worklogId)
        if (!wl) {
          setError("Worklog not found.")
          return
        }
        setWorklog(wl)

        const fl = await fetchFreelancerById(wl.freelancer_id)
        setFreelancer(fl)

        const entries = await fetchTimeEntriesByWorklogId(worklogId)
        setTimeEntries(entries)
      } catch (err) {
        setError("Failed to load worklog details. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [worklogId])

  const totalPages = Math.max(1, Math.ceil(timeEntries.length / pageSize))
  const displayed = timeEntries.slice((page - 1) * pageSize, page * pageSize)

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
          <p className="text-sm text-muted-foreground">
            Loading worklog details...
          </p>
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
            className="mt-3 rounded-md bg-secondary px-4 py-2 text-sm text-secondary-foreground hover:bg-accent"
            onClick={() => navigate({ to: "/worklogs" })}
            aria-label="Go back to worklogs list"
          >
            Back to Worklogs
          </button>
        </div>
      </div>
    )
  }

  const billableHours = timeEntries
    .filter((te: any) => te.billable)
    .reduce((sum: number, te: any) => sum + te.hours, 0)
  const nonBillableHours = timeEntries
    .filter((te: any) => !te.billable)
    .reduce((sum: number, te: any) => sum + te.hours, 0)

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        onClick={() => navigate({ to: "/worklogs" })}
        aria-label="Go back to worklogs list"
      >
        ← Back to Worklogs
      </button>

      {/* Worklog Summary Header */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {worklog.task_name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {worklog.description}
            </p>
          </div>
          <span
            className={`inline-block rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusBadgeClasses(worklog.status)}`}
          >
            {worklog.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Freelancer</p>
            <p className="mt-1 text-sm font-medium">
              {freelancer?.name || "Unknown"}
            </p>
            <p className="text-xs text-muted-foreground">
              {freelancer?.email || ""}
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Total Hours</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              {worklog.total_hours.toFixed(1)}h
            </p>
            <p className="text-xs text-muted-foreground">
              {billableHours.toFixed(1)}h billable ·{" "}
              {nonBillableHours.toFixed(1)}h non-billable
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Total Amount</p>
            <p className="mt-1 text-lg font-semibold tabular-nums">
              ${worklog.total_amount.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              ${freelancer?.hourly_rate || 0}/hr rate
            </p>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">Created</p>
            {/* DateTime as raw UTC string per AGENTS.md */}
            <p className="mt-1 text-sm font-mono">{worklog.created_at}</p>
          </div>
        </div>
      </div>

      {/* Time Entries heading */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Time Entries ({timeEntries.length})
        </h2>
      </div>

      {/* Time Entries Table — feature-specific per AGENTS.md */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Start Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                End Time
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Description
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Billable
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((te: any) => (
              <tr
                key={te.id}
                className="border-b border-border transition-colors hover:bg-muted/30"
              >
                {/* DateTime as raw UTC string per AGENTS.md */}
                <td className="px-4 py-3 text-sm font-mono text-foreground">
                  {te.date}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                  {te.start_time}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                  {te.end_time}
                </td>
                <td className="px-4 py-3 text-right text-sm tabular-nums font-medium text-foreground">
                  {te.hours.toFixed(1)}h
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {te.description}
                </td>
                <td className="px-4 py-3 text-center">
                  {te.billable ? (
                    <span className="inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/30">
                      Yes
                    </span>
                  ) : (
                    <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border">
                      No
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {displayed.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No time entries found for this worklog.
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
