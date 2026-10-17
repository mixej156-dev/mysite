/* Fictional team and open roles for the prototype. No real people. */

export type Department = "Leadership" | "Engineering" | "Validator operations" | "Security" | "Operations";

export type TeamMember = { id: string; name: string; role: string; department: Department };

export const DEPARTMENTS: Department[] = ["Leadership", "Engineering", "Validator operations", "Security", "Operations"];

export const TEAM: TeamMember[] = [
  { id: "lena", name: "Lena Marsh", role: "Chief Executive Officer", department: "Leadership" },
  { id: "omar", name: "Omar Haddad", role: "Chief Technology Officer", department: "Leadership" },
  { id: "ines", name: "Ines Varga", role: "Head of Research", department: "Leadership" },
  { id: "tomasz", name: "Tomasz Wren", role: "Staff Engineer, Protocols", department: "Engineering" },
  { id: "keiko", name: "Keiko Arai", role: "Frontend Engineer", department: "Engineering" },
  { id: "dev", name: "Dev Raman", role: "Backend Engineer, Rewards", department: "Engineering" },
  { id: "sara", name: "Sara Lindqvist", role: "Validator Operations Lead", department: "Validator operations" },
  { id: "mateo", name: "Mateo Ruiz", role: "Site Reliability Engineer", department: "Validator operations" },
  { id: "ade", name: "Ade Okafor", role: "Head of Security", department: "Security" },
  { id: "nora", name: "Nora Brandt", role: "Security Engineer", department: "Security" },
  { id: "felix", name: "Felix Osei", role: "Head of Client Operations", department: "Operations" },
  { id: "priya", name: "Priya Nair", role: "Compliance Manager", department: "Operations" },
];

export type Role = {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: "Remote" | "Hybrid" | "On-site";
};

export const OPEN_ROLES: Role[] = [
  { id: "sre", title: "Site Reliability Engineer", department: "Validator operations", location: "Europe", type: "Remote" },
  { id: "be", title: "Senior Backend Engineer, Ledger", department: "Engineering", location: "Lisbon", type: "Hybrid" },
  { id: "fe", title: "Product Designer", department: "Engineering", location: "Europe or Americas", type: "Remote" },
  { id: "sec", title: "Detection Engineer", department: "Security", location: "Berlin", type: "Hybrid" },
  { id: "ops", title: "Client Operations Specialist", department: "Operations", location: "Singapore", type: "On-site" },
];
