"use client";

import { useState } from "react";
import { Tag } from "@/design-system";
import { DEPARTMENTS, TEAM, type Department } from "@/data/team";
import { TeamCard } from "../blocks/TeamCard";

export function TeamDirectory() {
  const [department, setDepartment] = useState<Department | "All">("All");
  const visible = department === "All" ? TEAM : TEAM.filter((m) => m.department === department);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Department" className="flex flex-wrap gap-2">
        <Tag selected={department === "All"} onClick={() => setDepartment("All")} count={TEAM.length}>
          All
        </Tag>
        {DEPARTMENTS.map((d) => (
          <Tag
            key={d}
            selected={department === d}
            onClick={() => setDepartment(d)}
            count={TEAM.filter((m) => m.department === d).length}
          >
            {d}
          </Tag>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} people shown
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((member) => (
          <li key={member.id}>
            <TeamCard member={member} />
          </li>
        ))}
      </ul>
    </div>
  );
}
