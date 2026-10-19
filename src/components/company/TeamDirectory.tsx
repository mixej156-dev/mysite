"use client";

import { useState } from "react";
import { Tag } from "@/design-system";
import { DEPARTMENTS, TEAM, type Department } from "@/data/team";
import { TeamCard } from "../blocks/TeamCard";

/* Leadership has its own row above; the directory lists everyone else */
const PEOPLE = TEAM.filter((m) => m.department !== "Leadership");
const FILTERS = DEPARTMENTS.filter((d) => d !== "Leadership");

export function TeamDirectory() {
  const [department, setDepartment] = useState<Department | "All">("All");
  const visible = department === "All" ? PEOPLE : PEOPLE.filter((m) => m.department === department);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Department" className="flex flex-wrap gap-2">
        <Tag selected={department === "All"} onClick={() => setDepartment("All")} count={PEOPLE.length}>
          All
        </Tag>
        {FILTERS.map((d) => (
          <Tag
            key={d}
            selected={department === d}
            onClick={() => setDepartment(d)}
            count={PEOPLE.filter((m) => m.department === d).length}
          >
            {d}
          </Tag>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} people shown
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-6">
        {visible.map((member) => (
          <li key={member.id}>
            <TeamCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}
