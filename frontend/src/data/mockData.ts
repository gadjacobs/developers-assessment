// Mock data layer for WorkLog Payment Dashboard
// Data-fetching functions return Promise<any> per AGENTS.md Type Safety rule

// --- Freelancers ---
const freelancers = [
  {
    id: "fl-001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    hourly_rate: 85,
  },
  {
    id: "fl-002",
    name: "Bob Martinez",
    email: "bob.martinez@email.com",
    hourly_rate: 95,
  },
  {
    id: "fl-003",
    name: "Catherine Lee",
    email: "catherine.lee@email.com",
    hourly_rate: 110,
  },
  {
    id: "fl-004",
    name: "David Okonkwo",
    email: "david.okonkwo@email.com",
    hourly_rate: 75,
  },
  {
    id: "fl-005",
    name: "Elena Rossi",
    email: "elena.rossi@email.com",
    hourly_rate: 120,
  },
  {
    id: "fl-006",
    name: "Frank Chen",
    email: "frank.chen@email.com",
    hourly_rate: 90,
  },
  {
    id: "fl-007",
    name: "Grace Nakamura",
    email: "grace.nakamura@email.com",
    hourly_rate: 100,
  },
]

// --- Time Entries ---
const timeEntries = [
  // Worklog wl-001 (Alice - API Gateway)
  {
    id: "te-001",
    worklog_id: "wl-001",
    date: "2024-11-04T00:00:00.000Z",
    start_time: "2024-11-04T09:00:00.000Z",
    end_time: "2024-11-04T12:30:00.000Z",
    hours: 3.5,
    description: "Implemented rate limiting middleware",
    billable: true,
  },
  {
    id: "te-002",
    worklog_id: "wl-001",
    date: "2024-11-05T00:00:00.000Z",
    start_time: "2024-11-05T10:00:00.000Z",
    end_time: "2024-11-05T14:00:00.000Z",
    hours: 4.0,
    description: "Added JWT validation layer",
    billable: true,
  },
  {
    id: "te-003",
    worklog_id: "wl-001",
    date: "2024-11-06T00:00:00.000Z",
    start_time: "2024-11-06T08:30:00.000Z",
    end_time: "2024-11-06T11:00:00.000Z",
    hours: 2.5,
    description: "Write unit tests for gateway endpoints",
    billable: true,
  },
  {
    id: "te-004",
    worklog_id: "wl-001",
    date: "2024-11-07T00:00:00.000Z",
    start_time: "2024-11-07T13:00:00.000Z",
    end_time: "2024-11-07T14:30:00.000Z",
    hours: 1.5,
    description: "Team standup and code review",
    billable: false,
  },

  // Worklog wl-002 (Bob - Database Migration)
  {
    id: "te-005",
    worklog_id: "wl-002",
    date: "2024-11-04T00:00:00.000Z",
    start_time: "2024-11-04T08:00:00.000Z",
    end_time: "2024-11-04T12:00:00.000Z",
    hours: 4.0,
    description: "Schema redesign for user tables",
    billable: true,
  },
  {
    id: "te-006",
    worklog_id: "wl-002",
    date: "2024-11-05T00:00:00.000Z",
    start_time: "2024-11-05T09:00:00.000Z",
    end_time: "2024-11-05T15:00:00.000Z",
    hours: 6.0,
    description: "Data migration script development",
    billable: true,
  },
  {
    id: "te-007",
    worklog_id: "wl-002",
    date: "2024-11-06T00:00:00.000Z",
    start_time: "2024-11-06T10:00:00.000Z",
    end_time: "2024-11-06T13:00:00.000Z",
    hours: 3.0,
    description: "Testing migration on staging environment",
    billable: true,
  },

  // Worklog wl-003 (Catherine - Frontend Dashboard)
  {
    id: "te-008",
    worklog_id: "wl-003",
    date: "2024-11-11T00:00:00.000Z",
    start_time: "2024-11-11T09:00:00.000Z",
    end_time: "2024-11-11T13:00:00.000Z",
    hours: 4.0,
    description: "Dashboard layout and component structure",
    billable: true,
  },
  {
    id: "te-009",
    worklog_id: "wl-003",
    date: "2024-11-12T00:00:00.000Z",
    start_time: "2024-11-12T10:00:00.000Z",
    end_time: "2024-11-12T16:00:00.000Z",
    hours: 6.0,
    description: "Charts and data visualization components",
    billable: true,
  },
  {
    id: "te-010",
    worklog_id: "wl-003",
    date: "2024-11-13T00:00:00.000Z",
    start_time: "2024-11-13T08:00:00.000Z",
    end_time: "2024-11-13T10:30:00.000Z",
    hours: 2.5,
    description: "Responsive design adjustments",
    billable: true,
  },
  {
    id: "te-011",
    worklog_id: "wl-003",
    date: "2024-11-14T00:00:00.000Z",
    start_time: "2024-11-14T14:00:00.000Z",
    end_time: "2024-11-14T16:00:00.000Z",
    hours: 2.0,
    description: "Cross-browser testing and fixes",
    billable: true,
  },

  // Worklog wl-004 (David - Payment Integration)
  {
    id: "te-012",
    worklog_id: "wl-004",
    date: "2024-11-18T00:00:00.000Z",
    start_time: "2024-11-18T09:00:00.000Z",
    end_time: "2024-11-18T12:00:00.000Z",
    hours: 3.0,
    description: "Stripe webhook handler setup",
    billable: true,
  },
  {
    id: "te-013",
    worklog_id: "wl-004",
    date: "2024-11-19T00:00:00.000Z",
    start_time: "2024-11-19T08:00:00.000Z",
    end_time: "2024-11-19T14:00:00.000Z",
    hours: 6.0,
    description: "Payment processing flow implementation",
    billable: true,
  },
  {
    id: "te-014",
    worklog_id: "wl-004",
    date: "2024-11-20T00:00:00.000Z",
    start_time: "2024-11-20T10:00:00.000Z",
    end_time: "2024-11-20T12:30:00.000Z",
    hours: 2.5,
    description: "Error handling and retry logic",
    billable: true,
  },

  // Worklog wl-005 (Elena - Search Service)
  {
    id: "te-015",
    worklog_id: "wl-005",
    date: "2024-11-04T00:00:00.000Z",
    start_time: "2024-11-04T09:30:00.000Z",
    end_time: "2024-11-04T17:00:00.000Z",
    hours: 7.5,
    description: "Elasticsearch indexing pipeline",
    billable: true,
  },
  {
    id: "te-016",
    worklog_id: "wl-005",
    date: "2024-11-05T00:00:00.000Z",
    start_time: "2024-11-05T09:00:00.000Z",
    end_time: "2024-11-05T13:00:00.000Z",
    hours: 4.0,
    description: "Query optimization and fuzzy matching",
    billable: true,
  },
  {
    id: "te-017",
    worklog_id: "wl-005",
    date: "2024-11-06T00:00:00.000Z",
    start_time: "2024-11-06T10:00:00.000Z",
    end_time: "2024-11-06T12:00:00.000Z",
    hours: 2.0,
    description: "Search results caching layer",
    billable: true,
  },
  {
    id: "te-018",
    worklog_id: "wl-005",
    date: "2024-11-07T00:00:00.000Z",
    start_time: "2024-11-07T14:00:00.000Z",
    end_time: "2024-11-07T15:30:00.000Z",
    hours: 1.5,
    description: "Documentation and API specs",
    billable: false,
  },

  // Worklog wl-006 (Frank - CI/CD Pipeline)
  {
    id: "te-019",
    worklog_id: "wl-006",
    date: "2024-11-11T00:00:00.000Z",
    start_time: "2024-11-11T08:00:00.000Z",
    end_time: "2024-11-11T12:00:00.000Z",
    hours: 4.0,
    description: "GitHub Actions workflow configuration",
    billable: true,
  },
  {
    id: "te-020",
    worklog_id: "wl-006",
    date: "2024-11-12T00:00:00.000Z",
    start_time: "2024-11-12T09:00:00.000Z",
    end_time: "2024-11-12T11:00:00.000Z",
    hours: 2.0,
    description: "Docker image build optimization",
    billable: true,
  },
  {
    id: "te-021",
    worklog_id: "wl-006",
    date: "2024-11-13T00:00:00.000Z",
    start_time: "2024-11-13T13:00:00.000Z",
    end_time: "2024-11-13T16:00:00.000Z",
    hours: 3.0,
    description: "Staging environment deployment pipeline",
    billable: true,
  },

  // Worklog wl-007 (Grace - Authentication System)
  {
    id: "te-022",
    worklog_id: "wl-007",
    date: "2024-11-18T00:00:00.000Z",
    start_time: "2024-11-18T09:00:00.000Z",
    end_time: "2024-11-18T13:00:00.000Z",
    hours: 4.0,
    description: "OAuth2 provider integration",
    billable: true,
  },
  {
    id: "te-023",
    worklog_id: "wl-007",
    date: "2024-11-19T00:00:00.000Z",
    start_time: "2024-11-19T10:00:00.000Z",
    end_time: "2024-11-19T15:00:00.000Z",
    hours: 5.0,
    description: "Session management and token refresh",
    billable: true,
  },
  {
    id: "te-024",
    worklog_id: "wl-007",
    date: "2024-11-20T00:00:00.000Z",
    start_time: "2024-11-20T08:00:00.000Z",
    end_time: "2024-11-20T10:00:00.000Z",
    hours: 2.0,
    description: "Security audit and penetration testing prep",
    billable: true,
  },

  // Worklog wl-008 (Alice - Notification System)
  {
    id: "te-025",
    worklog_id: "wl-008",
    date: "2024-11-18T00:00:00.000Z",
    start_time: "2024-11-18T09:00:00.000Z",
    end_time: "2024-11-18T12:00:00.000Z",
    hours: 3.0,
    description: "WebSocket event dispatcher",
    billable: true,
  },
  {
    id: "te-026",
    worklog_id: "wl-008",
    date: "2024-11-19T00:00:00.000Z",
    start_time: "2024-11-19T13:00:00.000Z",
    end_time: "2024-11-19T17:00:00.000Z",
    hours: 4.0,
    description: "Push notification service integration",
    billable: true,
  },
  {
    id: "te-027",
    worklog_id: "wl-008",
    date: "2024-11-20T00:00:00.000Z",
    start_time: "2024-11-20T09:00:00.000Z",
    end_time: "2024-11-20T11:00:00.000Z",
    hours: 2.0,
    description: "Email template rendering engine",
    billable: true,
  },

  // Worklog wl-009 (Bob - Reporting Module)
  {
    id: "te-028",
    worklog_id: "wl-009",
    date: "2024-11-25T00:00:00.000Z",
    start_time: "2024-11-25T08:00:00.000Z",
    end_time: "2024-11-25T12:00:00.000Z",
    hours: 4.0,
    description: "Report generation engine architecture",
    billable: true,
  },
  {
    id: "te-029",
    worklog_id: "wl-009",
    date: "2024-11-26T00:00:00.000Z",
    start_time: "2024-11-26T09:00:00.000Z",
    end_time: "2024-11-26T14:00:00.000Z",
    hours: 5.0,
    description: "CSV and PDF export functionality",
    billable: true,
  },
  {
    id: "te-030",
    worklog_id: "wl-009",
    date: "2024-11-27T00:00:00.000Z",
    start_time: "2024-11-27T10:00:00.000Z",
    end_time: "2024-11-27T12:00:00.000Z",
    hours: 2.0,
    description: "Scheduled report delivery setup",
    billable: true,
  },

  // Worklog wl-010 (Catherine - Mobile API)
  {
    id: "te-031",
    worklog_id: "wl-010",
    date: "2024-11-25T00:00:00.000Z",
    start_time: "2024-11-25T09:00:00.000Z",
    end_time: "2024-11-25T13:00:00.000Z",
    hours: 4.0,
    description: "REST API endpoint design for mobile app",
    billable: true,
  },
  {
    id: "te-032",
    worklog_id: "wl-010",
    date: "2024-11-26T00:00:00.000Z",
    start_time: "2024-11-26T10:00:00.000Z",
    end_time: "2024-11-26T16:00:00.000Z",
    hours: 6.0,
    description: "GraphQL schema and resolvers",
    billable: true,
  },

  // Worklog wl-011 (David - Infrastructure Monitoring)
  {
    id: "te-033",
    worklog_id: "wl-011",
    date: "2024-11-25T00:00:00.000Z",
    start_time: "2024-11-25T08:00:00.000Z",
    end_time: "2024-11-25T11:00:00.000Z",
    hours: 3.0,
    description: "Prometheus metrics collection setup",
    billable: true,
  },
  {
    id: "te-034",
    worklog_id: "wl-011",
    date: "2024-11-26T00:00:00.000Z",
    start_time: "2024-11-26T09:00:00.000Z",
    end_time: "2024-11-26T12:00:00.000Z",
    hours: 3.0,
    description: "Grafana dashboard configuration",
    billable: true,
  },
  {
    id: "te-035",
    worklog_id: "wl-011",
    date: "2024-11-27T00:00:00.000Z",
    start_time: "2024-11-27T13:00:00.000Z",
    end_time: "2024-11-27T15:30:00.000Z",
    hours: 2.5,
    description: "Alert rules and PagerDuty integration",
    billable: true,
  },

  // Worklog wl-012 (Elena - Data Pipeline)
  {
    id: "te-036",
    worklog_id: "wl-012",
    date: "2024-12-02T00:00:00.000Z",
    start_time: "2024-12-02T09:00:00.000Z",
    end_time: "2024-12-02T13:00:00.000Z",
    hours: 4.0,
    description: "Apache Kafka consumer group setup",
    billable: true,
  },
  {
    id: "te-037",
    worklog_id: "wl-012",
    date: "2024-12-03T00:00:00.000Z",
    start_time: "2024-12-03T10:00:00.000Z",
    end_time: "2024-12-03T16:00:00.000Z",
    hours: 6.0,
    description: "Stream processing with Flink integration",
    billable: true,
  },
  {
    id: "te-038",
    worklog_id: "wl-012",
    date: "2024-12-04T00:00:00.000Z",
    start_time: "2024-12-04T08:30:00.000Z",
    end_time: "2024-12-04T10:30:00.000Z",
    hours: 2.0,
    description: "Dead letter queue and error handling",
    billable: true,
  },

  // Worklog wl-013 (Frank - Load Testing)
  {
    id: "te-039",
    worklog_id: "wl-013",
    date: "2024-12-02T00:00:00.000Z",
    start_time: "2024-12-02T08:00:00.000Z",
    end_time: "2024-12-02T11:00:00.000Z",
    hours: 3.0,
    description: "k6 load test script development",
    billable: true,
  },
  {
    id: "te-040",
    worklog_id: "wl-013",
    date: "2024-12-03T00:00:00.000Z",
    start_time: "2024-12-03T09:00:00.000Z",
    end_time: "2024-12-03T12:00:00.000Z",
    hours: 3.0,
    description: "Performance bottleneck analysis",
    billable: true,
  },
  {
    id: "te-041",
    worklog_id: "wl-013",
    date: "2024-12-04T00:00:00.000Z",
    start_time: "2024-12-04T14:00:00.000Z",
    end_time: "2024-12-04T16:00:00.000Z",
    hours: 2.0,
    description: "Test report documentation",
    billable: false,
  },

  // Worklog wl-014 (Grace - API Documentation)
  {
    id: "te-042",
    worklog_id: "wl-014",
    date: "2024-12-02T00:00:00.000Z",
    start_time: "2024-12-02T09:00:00.000Z",
    end_time: "2024-12-02T12:00:00.000Z",
    hours: 3.0,
    description: "OpenAPI specification authoring",
    billable: true,
  },
  {
    id: "te-043",
    worklog_id: "wl-014",
    date: "2024-12-03T00:00:00.000Z",
    start_time: "2024-12-03T13:00:00.000Z",
    end_time: "2024-12-03T16:00:00.000Z",
    hours: 3.0,
    description: "Interactive API playground setup",
    billable: true,
  },

  // Worklog wl-015 (Alice - Caching Layer)
  {
    id: "te-044",
    worklog_id: "wl-015",
    date: "2024-12-09T00:00:00.000Z",
    start_time: "2024-12-09T08:00:00.000Z",
    end_time: "2024-12-09T12:00:00.000Z",
    hours: 4.0,
    description: "Redis cluster configuration",
    billable: true,
  },
  {
    id: "te-045",
    worklog_id: "wl-015",
    date: "2024-12-10T00:00:00.000Z",
    start_time: "2024-12-10T09:00:00.000Z",
    end_time: "2024-12-10T14:00:00.000Z",
    hours: 5.0,
    description: "Cache invalidation strategy implementation",
    billable: true,
  },
  {
    id: "te-046",
    worklog_id: "wl-015",
    date: "2024-12-11T00:00:00.000Z",
    start_time: "2024-12-11T10:00:00.000Z",
    end_time: "2024-12-11T12:00:00.000Z",
    hours: 2.0,
    description: "Cache hit rate monitoring",
    billable: true,
  },

  // Worklog wl-016 (Bob - User Management)
  {
    id: "te-047",
    worklog_id: "wl-016",
    date: "2024-12-09T00:00:00.000Z",
    start_time: "2024-12-09T09:00:00.000Z",
    end_time: "2024-12-09T13:00:00.000Z",
    hours: 4.0,
    description: "Role-based access control implementation",
    billable: true,
  },
  {
    id: "te-048",
    worklog_id: "wl-016",
    date: "2024-12-10T00:00:00.000Z",
    start_time: "2024-12-10T10:00:00.000Z",
    end_time: "2024-12-10T15:00:00.000Z",
    hours: 5.0,
    description: "User invitation and onboarding flow",
    billable: true,
  },

  // Worklog wl-017 (Elena - Audit Logging)
  {
    id: "te-049",
    worklog_id: "wl-017",
    date: "2024-12-09T00:00:00.000Z",
    start_time: "2024-12-09T08:30:00.000Z",
    end_time: "2024-12-09T12:30:00.000Z",
    hours: 4.0,
    description: "Audit trail event capture middleware",
    billable: true,
  },
  {
    id: "te-050",
    worklog_id: "wl-017",
    date: "2024-12-10T00:00:00.000Z",
    start_time: "2024-12-10T09:00:00.000Z",
    end_time: "2024-12-10T12:00:00.000Z",
    hours: 3.0,
    description: "Audit log search and filter UI",
    billable: true,
  },
  {
    id: "te-051",
    worklog_id: "wl-017",
    date: "2024-12-11T00:00:00.000Z",
    start_time: "2024-12-11T13:00:00.000Z",
    end_time: "2024-12-11T15:00:00.000Z",
    hours: 2.0,
    description: "Compliance report generation",
    billable: true,
  },

  // Worklog wl-018 (David - File Storage Service)
  {
    id: "te-052",
    worklog_id: "wl-018",
    date: "2024-12-16T00:00:00.000Z",
    start_time: "2024-12-16T09:00:00.000Z",
    end_time: "2024-12-16T13:00:00.000Z",
    hours: 4.0,
    description: "S3-compatible storage abstraction layer",
    billable: true,
  },
  {
    id: "te-053",
    worklog_id: "wl-018",
    date: "2024-12-17T00:00:00.000Z",
    start_time: "2024-12-17T10:00:00.000Z",
    end_time: "2024-12-17T14:00:00.000Z",
    hours: 4.0,
    description: "Multipart upload with progress tracking",
    billable: true,
  },
  {
    id: "te-054",
    worklog_id: "wl-018",
    date: "2024-12-18T00:00:00.000Z",
    start_time: "2024-12-18T08:00:00.000Z",
    end_time: "2024-12-18T10:00:00.000Z",
    hours: 2.0,
    description: "File type validation and virus scanning",
    billable: true,
  },
]

// --- Worklogs ---
// Amounts are calculated from time entries * freelancer hourly rate
const worklogs = [
  {
    id: "wl-001",
    task_name: "API Gateway Implementation",
    description:
      "Build and configure the main API gateway with rate limiting and authentication",
    freelancer_id: "fl-001",
    status: "paid",
    created_at: "2024-11-04T08:00:00.000Z",
    total_hours: 11.5,
    total_amount: 977.5, // 11.5 * 85
  },
  {
    id: "wl-002",
    task_name: "Database Migration v2",
    description: "Redesign and migrate user tables to new normalized schema",
    freelancer_id: "fl-002",
    status: "paid",
    created_at: "2024-11-04T07:30:00.000Z",
    total_hours: 13.0,
    total_amount: 1235.0, // 13 * 95
  },
  {
    id: "wl-003",
    task_name: "Frontend Dashboard Redesign",
    description:
      "Complete redesign of the admin dashboard with new charts and responsive layout",
    freelancer_id: "fl-003",
    status: "approved",
    created_at: "2024-11-11T08:45:00.000Z",
    total_hours: 14.5,
    total_amount: 1595.0, // 14.5 * 110
  },
  {
    id: "wl-004",
    task_name: "Payment Integration - Stripe",
    description:
      "Integrate Stripe payment processing with webhook handlers and retry logic",
    freelancer_id: "fl-004",
    status: "approved",
    created_at: "2024-11-18T08:30:00.000Z",
    total_hours: 11.5,
    total_amount: 862.5, // 11.5 * 75
  },
  {
    id: "wl-005",
    task_name: "Search Service Overhaul",
    description: "Rebuild search infrastructure with Elasticsearch and caching",
    freelancer_id: "fl-005",
    status: "paid",
    created_at: "2024-11-04T09:00:00.000Z",
    total_hours: 15.0,
    total_amount: 1800.0, // 15 * 120
  },
  {
    id: "wl-006",
    task_name: "CI/CD Pipeline Setup",
    description:
      "Configure GitHub Actions, Docker builds, and staging deployment",
    freelancer_id: "fl-006",
    status: "approved",
    created_at: "2024-11-11T07:45:00.000Z",
    total_hours: 9.0,
    total_amount: 810.0, // 9 * 90
  },
  {
    id: "wl-007",
    task_name: "Authentication System Upgrade",
    description: "Implement OAuth2 providers and improve session management",
    freelancer_id: "fl-007",
    status: "submitted",
    created_at: "2024-11-18T08:15:00.000Z",
    total_hours: 11.0,
    total_amount: 1100.0, // 11 * 100
  },
  {
    id: "wl-008",
    task_name: "Notification System",
    description: "Build real-time WebSocket notifications and email templates",
    freelancer_id: "fl-001",
    status: "submitted",
    created_at: "2024-11-18T08:45:00.000Z",
    total_hours: 9.0,
    total_amount: 765.0, // 9 * 85
  },
  {
    id: "wl-009",
    task_name: "Reporting Module",
    description:
      "Build report generation engine with CSV/PDF export capabilities",
    freelancer_id: "fl-002",
    status: "submitted",
    created_at: "2024-11-25T07:30:00.000Z",
    total_hours: 11.0,
    total_amount: 1045.0, // 11 * 95
  },
  {
    id: "wl-010",
    task_name: "Mobile API Layer",
    description:
      "Design and implement REST/GraphQL API endpoints for mobile app",
    freelancer_id: "fl-003",
    status: "approved",
    created_at: "2024-11-25T08:30:00.000Z",
    total_hours: 10.0,
    total_amount: 1100.0, // 10 * 110
  },
  {
    id: "wl-011",
    task_name: "Infrastructure Monitoring",
    description:
      "Set up Prometheus, Grafana dashboards, and PagerDuty alerting",
    freelancer_id: "fl-004",
    status: "submitted",
    created_at: "2024-11-25T07:45:00.000Z",
    total_hours: 8.5,
    total_amount: 637.5, // 8.5 * 75
  },
  {
    id: "wl-012",
    task_name: "Data Pipeline Architecture",
    description:
      "Build Kafka-based event pipeline with Flink stream processing",
    freelancer_id: "fl-005",
    status: "approved",
    created_at: "2024-12-02T08:30:00.000Z",
    total_hours: 12.0,
    total_amount: 1440.0, // 12 * 120
  },
  {
    id: "wl-013",
    task_name: "Load Testing Suite",
    description: "Develop k6 load tests and performance analysis framework",
    freelancer_id: "fl-006",
    status: "submitted",
    created_at: "2024-12-02T07:45:00.000Z",
    total_hours: 8.0,
    total_amount: 720.0, // 8 * 90
  },
  {
    id: "wl-014",
    task_name: "API Documentation Portal",
    description: "Create OpenAPI specifications and interactive API playground",
    freelancer_id: "fl-007",
    status: "approved",
    created_at: "2024-12-02T08:45:00.000Z",
    total_hours: 6.0,
    total_amount: 600.0, // 6 * 100
  },
  {
    id: "wl-015",
    task_name: "Caching Layer Implementation",
    description: "Deploy Redis cluster with intelligent cache invalidation",
    freelancer_id: "fl-001",
    status: "submitted",
    created_at: "2024-12-09T07:30:00.000Z",
    total_hours: 11.0,
    total_amount: 935.0, // 11 * 85
  },
  {
    id: "wl-016",
    task_name: "User Management System",
    description: "Implement RBAC and user onboarding workflows",
    freelancer_id: "fl-002",
    status: "approved",
    created_at: "2024-12-09T08:30:00.000Z",
    total_hours: 9.0,
    total_amount: 855.0, // 9 * 95
  },
  {
    id: "wl-017",
    task_name: "Audit Logging System",
    description:
      "Build comprehensive audit trail with search and compliance reports",
    freelancer_id: "fl-005",
    status: "submitted",
    created_at: "2024-12-09T08:00:00.000Z",
    total_hours: 9.0,
    total_amount: 1080.0, // 9 * 120
  },
  {
    id: "wl-018",
    task_name: "File Storage Service",
    description:
      "S3-compatible storage with multipart upload and file scanning",
    freelancer_id: "fl-004",
    status: "submitted",
    created_at: "2024-12-16T08:30:00.000Z",
    total_hours: 10.0,
    total_amount: 750.0, // 10 * 75
  },
]

// --- Payment Batches ---
const paymentBatches = [
  {
    id: "pb-001",
    created_at: "2024-11-15T10:00:00.000Z",
    date_range_start: "2024-11-01T00:00:00.000Z",
    date_range_end: "2024-11-10T23:59:59.000Z",
    total_amount: 4012.5,
    status: "completed",
    worklog_ids: ["wl-001", "wl-002", "wl-005"],
  },
  {
    id: "pb-002",
    created_at: "2024-11-30T10:00:00.000Z",
    date_range_start: "2024-11-11T00:00:00.000Z",
    date_range_end: "2024-11-30T23:59:59.000Z",
    total_amount: 0,
    status: "pending",
    worklog_ids: [],
  },
]

// --- Data-fetching functions ---
// Return Promise<any> per AGENTS.md Type Safety rule

export const fetchFreelancers = async (): Promise<any> => {
  return freelancers
}

export const fetchFreelancerById = async (id: string): Promise<any> => {
  return freelancers.find((f) => f.id === id) || null
}

export const fetchWorklogs = async (): Promise<any> => {
  return worklogs
}

export const fetchWorklogById = async (id: string): Promise<any> => {
  return worklogs.find((w) => w.id === id) || null
}

export const fetchTimeEntriesByWorklogId = async (
  worklogId: string,
): Promise<any> => {
  return timeEntries.filter((te) => te.worklog_id === worklogId)
}

export const fetchAllTimeEntries = async (): Promise<any> => {
  return timeEntries
}

export const fetchPaymentBatches = async (): Promise<any> => {
  return paymentBatches
}

// Utility: get worklogs with freelancer info attached
export const fetchWorklogsWithFreelancers = async (): Promise<any> => {
  return worklogs.map((wl) => ({
    ...wl,
    freelancer: freelancers.find((f) => f.id === wl.freelancer_id) || null,
  }))
}

// Utility: get unique freelancer names for filter dropdown
export const fetchFreelancerNames = async (): Promise<any> => {
  return freelancers.map((f) => ({ id: f.id, name: f.name }))
}
