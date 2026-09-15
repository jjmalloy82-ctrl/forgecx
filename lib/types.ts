export type Vertical = "data_center" | "power_plant";
export type ProjectStatus = "planning" | "active" | "punch_out" | "closed";
export type SystemStatus = "not_started" | "in_test" | "punch" | "accepted";
export type PunchSeverity = "A" | "B" | "C";
export type PunchStatus = "open" | "in_progress" | "closed";
export type ItpResult = "pending" | "pass" | "fail" | "na";
export type IstResult = "pending" | "pass" | "fail";

export type Project = {
  id: string;
  name: string;
  site: string;
  client: string;
  vertical: Vertical;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
};

export type System = {
  id: string;
  projectId: string;
  name: string;
  tag: string;
  discipline: string;
  status: SystemStatus;
  createdAt: string;
  updatedAt: string;
};

export type Punch = {
  id: string;
  projectId: string;
  systemId: string;
  number: number;
  title: string;
  description: string;
  severity: PunchSeverity;
  status: PunchStatus;
  owner: string;
  dueDate: string | null;
  evidenceNotes: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
};

export type ItpItem = {
  id: string;
  projectId: string;
  systemId: string;
  stepNumber: number;
  title: string;
  procedureRef: string;
  result: ItpResult;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type PunchRow = Punch & {
  systemTag: string;
  systemName: string;
  projectName: string;
};

export type SystemRow = System & {
  openPunches: number;
  aPunches: number;
  itpTotal: number;
  itpComplete: number;
};

export type DashboardStats = {
  projectCount: number;
  openPunches: number;
  aOpen: number;
  overdue: number;
  inProgress: number;
  closedPunches: number;
  itpPending: number;
  itpPass: number;
  itpTotal: number;
  istPending: number;
  istFail: number;
  istTotal: number;
};

export type IstGate = {
  id: string;
  projectId: string;
  stepNumber: number;
  title: string;
  result: IstResult;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type EvidenceFile = {
  id: string;
  punchId: string;
  originalName: string;
  mime: string;
  sizeBytes: number;
  createdAt: string;
};

export type PunchFilters = {
  projectId?: string;
  systemId?: string;
  severity?: PunchSeverity | "";
  status?: PunchStatus | "";
  owner?: string;
  q?: string;
};
