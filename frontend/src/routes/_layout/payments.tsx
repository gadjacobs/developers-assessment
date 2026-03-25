import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { fetchFreelancerById, fetchWorklogById } from "@/data/mockData"

export const Route = createFileRoute("/_layout/payments")({
  component: PaymentsPage,
  head: () => ({
    meta: [
      {
        title: "Payment Review - WorkLog Dashboard",
      },
    ],
  }),
})

function PaymentsPage() {
  const navigate = useNavigate()
  const [worklogs, setWorklogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track excluded worklogs and freelancers
  const [excludedWorklogIds, setExcludedWorklogIds] = useState<Set<string>>(
    new Set(),
  )
  const [excludedFreelancerIds, setExcludedFreelancerIds] = useState<
    Set<string>
  >(new Set())

  // Payment confirmation state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedIds = sessionStorage.getItem("paymentWorklogIds")
        if (!storedIds) {
          setError(
            "No worklogs selected for payment. Please go back and select worklogs.",
          )
          setIsLoading(false)
          return
        }

        const worklogIds = JSON.parse(storedIds) as string[]
        const worklogPromises = worklogIds.map(async (id: string) => {
          const wl = await fetchWorklogById(id)
          if (wl) {
            const fl = await fetchFreelancerById(wl.freelancer_id)
            return { ...wl, freelancer: fl }
          }
          return null
        })

        const results = await Promise.all(worklogPromises)
        setWorklogs(results.filter(Boolean))
      } catch (err) {
        setError("Failed to load payment data. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Group worklogs by freelancer
  const groupedByFreelancer: Record<string, any[]> = {}
  for (const wl of worklogs) {
    const fId = wl.freelancer_id
    if (!groupedByFreelancer[fId]) {
      groupedByFreelancer[fId] = []
    }
    groupedByFreelancer[fId].push(wl)
  }

  // Calculate totals for included worklogs
  const includedWorklogs = worklogs.filter(
    (wl: any) =>
      !excludedWorklogIds.has(wl.id) &&
      !excludedFreelancerIds.has(wl.freelancer_id),
  )
  const totalAmount = includedWorklogs.reduce(
    (sum: number, wl: any) => sum + wl.total_amount,
    0,
  )
  const totalHours = includedWorklogs.reduce(
    (sum: number, wl: any) => sum + wl.total_hours,
    0,
  )
  const uniqueFreelancers = new Set(
    includedWorklogs.map((wl: any) => wl.freelancer_id),
  )

  const toggleWorklogExclusion = (id: string) => {
    setExcludedWorklogIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleFreelancerExclusion = (freelancerId: string) => {
    setExcludedFreelancerIds((prev) => {
      const next = new Set(prev)
      if (next.has(freelancerId)) {
        next.delete(freelancerId)
      } else {
        next.add(freelancerId)
      }
      return next
    })
  }

  const handleConfirmPayment = () => {
    setShowConfirmDialog(false)
    setPaymentConfirmed(true)
    // Clear session storage
    sessionStorage.removeItem("paymentWorklogIds")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Loading payment details...
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
            aria-label="Go back to worklogs"
          >
            Back to Worklogs
          </button>
        </div>
      </div>
    )
  }

  // Payment confirmed success state
  if (paymentConfirmed) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Payment Confirmed!
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            ${totalAmount.toFixed(2)} has been processed for{" "}
            {includedWorklogs.length} worklogs across {uniqueFreelancers.size}{" "}
            freelancers.
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate({ to: "/worklogs" })}
            aria-label="Return to worklogs"
          >
            Return to Worklogs
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
          <button
            type="button"
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => navigate({ to: "/worklogs" })}
            aria-label="Go back to worklogs"
          >
            ← Back to Worklogs
          </button>
          <h1 className="text-2xl font-bold tracking-tight">Payment Review</h1>
          <p className="text-sm text-muted-foreground">
            Review and confirm payment for selected worklogs
          </p>
        </div>
        <button
          type="button"
          disabled={includedWorklogs.length === 0}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setShowConfirmDialog(true)}
          aria-label="Confirm payment"
        >
          Confirm Payment
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Amount
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            ${totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Worklogs Included
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            {includedWorklogs.length}
            <span className="ml-1 text-sm font-normal text-muted-foreground">
              / {worklogs.length}
            </span>
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Freelancers
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            {uniqueFreelancers.size}
          </p>
          <p className="text-xs text-muted-foreground">
            {totalHours.toFixed(1)}h total
          </p>
        </div>
      </div>

      {/* Worklogs grouped by freelancer */}
      <div className="space-y-4">
        {Object.entries(groupedByFreelancer).map(
          ([freelancerId, freelancerWorklogs]) => {
            const freelancer = freelancerWorklogs[0]?.freelancer
            const isFreelancerExcluded = excludedFreelancerIds.has(freelancerId)

            const freelancerTotal = freelancerWorklogs
              .filter(
                (wl: any) =>
                  !excludedWorklogIds.has(wl.id) && !isFreelancerExcluded,
              )
              .reduce((sum: number, wl: any) => sum + wl.total_amount, 0)

            return (
              <div
                key={freelancerId}
                className={`rounded-lg border bg-card transition-opacity ${
                  isFreelancerExcluded
                    ? "border-border/50 opacity-50"
                    : "border-border"
                }`}
              >
                {/* Freelancer header */}
                <div className="flex items-center justify-between border-b border-border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                      {freelancer?.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("") || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {freelancer?.name || "Unknown Freelancer"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {freelancer?.email || ""} · $
                        {freelancer?.hourly_rate || 0}/hr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold tabular-nums text-foreground">
                      ${freelancerTotal.toFixed(2)}
                    </p>
                    <button
                      type="button"
                      className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                        isFreelancerExcluded
                          ? "border-amber-500/30 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                          : "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      }`}
                      onClick={() => toggleFreelancerExclusion(freelancerId)}
                      aria-label={
                        isFreelancerExcluded
                          ? `Re-include ${freelancer?.name}`
                          : `Exclude ${freelancer?.name} from payment`
                      }
                    >
                      {isFreelancerExcluded
                        ? "Re-include freelancer"
                        : "Exclude freelancer"}
                    </button>
                  </div>
                </div>

                {/* Freelancer's worklogs */}
                <div className="divide-y divide-border">
                  {freelancerWorklogs.map((wl: any) => {
                    const isExcluded =
                      excludedWorklogIds.has(wl.id) || isFreelancerExcluded
                    return (
                      <div
                        key={wl.id}
                        className={`flex items-center justify-between p-4 transition-opacity ${
                          isExcluded && !isFreelancerExcluded
                            ? "opacity-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={!isExcluded}
                            disabled={isFreelancerExcluded}
                            onChange={() => toggleWorklogExclusion(wl.id)}
                            className="h-4 w-4 rounded border-border"
                            aria-label={`${isExcluded ? "Include" : "Exclude"} worklog ${wl.task_name}`}
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {wl.task_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {wl.total_hours.toFixed(1)}h · {wl.status}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium tabular-nums text-foreground">
                          ${wl.total_amount.toFixed(2)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          },
        )}
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-foreground">
              Confirm Payment
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are about to process a payment of{" "}
              <span className="font-semibold text-foreground">
                ${totalAmount.toFixed(2)}
              </span>{" "}
              for {includedWorklogs.length} worklogs across{" "}
              {uniqueFreelancers.size} freelancers.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted"
                onClick={() => setShowConfirmDialog(false)}
                aria-label="Cancel payment"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                onClick={handleConfirmPayment}
                aria-label="Confirm and process payment"
              >
                Confirm & Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
