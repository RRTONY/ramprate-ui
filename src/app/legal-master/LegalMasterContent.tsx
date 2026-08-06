"use client";

import { useState } from "react";
import Link from "next/link";

type Track = {
  track: string;
  title: string;
  items: string[];
  deadline: string;
};

type Attorney = {
  attorney: string;
  portal: string;
  tracks: Track[];
};

type ImmediateAction = {
  label: string;
  owner: string;
  deadline: string;
};

type PortalDirectoryEntry = {
  name: string;
  url: string;
};

export default function LegalMasterContent({
  allMatters,
  immediateActions,
  portalDirectory,
}: {
  allMatters: Attorney[];
  immediateActions: ImmediateAction[];
  portalDirectory: PortalDirectoryEntry[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalItems = allMatters.reduce(
    (acc, a) => acc + a.tracks.reduce((acc2, t) => acc2 + t.items.length, 0),
    0,
  );
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <main className="min-h-screen pt-24 pb-20 px-5 bg-white text-black">
      <div
        className="max-w-[1100px] mx-auto"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* ── Header ── */}
        <div className="flex justify-between items-start flex-wrap gap-4 pb-6 mb-9 border-b-2 border-black">
          <div>
            <div
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Master Legal CRM
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mt-1 text-gray-600">
              Tony Greenberg · Admin View · All Attorneys · All Matters
            </div>
          </div>
          <div className="text-right text-sm leading-loose text-gray-600">
            <div>
              <strong className="text-black">Last updated:</strong> March 17,
              2026
            </div>
            <div>
              <strong className="text-black">Attorneys:</strong> Adam Zaffos ·
              Henry Jannol · Josh Bykowski
            </div>
            <div>
              <strong className="text-black">Progress:</strong> {checkedCount} /{" "}
              {totalItems} items closed
            </div>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mb-9">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            <span>Overall Completion</span>
            <span>{Math.round((checkedCount / totalItems) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${(checkedCount / totalItems) * 100}%` }}
            />
          </div>
        </div>

        {/* ── Immediate Actions ── */}
        <div
          className="mb-1 text-xl sm:text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Immediate Action Items
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          Time-sensitive - track completion here
        </div>
        <div className="rounded border border-gray-300 overflow-hidden mb-10">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="border-b-2 border-black bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500 w-10">
                  Done
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Action
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Owner
                </th>
                <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
                  Deadline
                </th>
              </tr>
            </thead>
            <tbody>
              {immediateActions.map((a, i) => {
                const key = `action-${i}`;
                const done = checked[key];
                return (
                  <tr
                    key={i}
                    className={`${i < immediateActions.length - 1 ? "border-b border-gray-200" : ""} ${done ? "bg-gray-50" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={!!done}
                        onChange={() => toggle(key)}
                        className="w-4 h-4 accent-black cursor-pointer"
                      />
                    </td>
                    <td
                      className={`px-4 py-3 ${done ? "line-through text-gray-400" : ""}`}
                    >
                      {a.label}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {a.owner}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap font-semibold">
                      {a.deadline}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Attorney Sections ── */}
        {allMatters.map((attorney) => (
          <div key={attorney.attorney} className="mb-14">
            <div className="flex items-center justify-between mb-1">
              <div
                className="text-xl sm:text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {attorney.attorney}
              </div>
              <Link
                href={attorney.portal}
                target="_blank"
                className="text-xs font-bold uppercase tracking-wide underline text-gray-500 hover:text-black"
              >
                View Portal →
              </Link>
            </div>
            <div className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-500">
              {attorney.tracks.length} tracks · portal: ramprate.com
              {attorney.portal}
            </div>

            <div className="space-y-4">
              {attorney.tracks.map((track) => {
                const trackChecked = track.items.filter(
                  (_, i) => checked[`${attorney.attorney}-${track.track}-${i}`],
                ).length;
                return (
                  <div
                    key={track.track}
                    className="rounded border border-gray-300 border-l-4 border-l-black bg-gray-50 overflow-hidden"
                  >
                    <div className="px-5 pt-4 pb-3 border-b border-gray-200 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="inline-block text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-black text-white mr-3">
                          {track.track}
                        </span>
                        <span
                          className="font-bold text-sm"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {track.title}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-bold text-black">
                          {trackChecked}/{track.items.length}
                        </span>{" "}
                        closed ·{" "}
                        <span className="font-semibold">
                          Deadline: {track.deadline}
                        </span>
                      </div>
                    </div>
                    <ul className="px-5 py-3 space-y-2">
                      {track.items.map((item, i) => {
                        const key = `${attorney.attorney}-${track.track}-${i}`;
                        const done = checked[key];
                        return (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm py-1.5 border-b border-gray-200 last:border-0"
                          >
                            <input
                              type="checkbox"
                              checked={!!done}
                              onChange={() => toggle(key)}
                              className="mt-0.5 w-4 h-4 accent-black cursor-pointer shrink-0"
                            />
                            <span
                              className={
                                done ? "line-through text-gray-400" : ""
                              }
                            >
                              {item}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* ── Portal Directory ── */}
        <hr className="border-t border-gray-200 my-9" />
        <div
          className="mb-1 text-xl sm:text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Portal Directory
        </div>
        <div className="text-xs font-bold uppercase tracking-widest mb-4 text-gray-500">
          Each attorney sees only their own portal - access codes are managed
          outside this page and shared with each attorney directly
        </div>
        <div className="rounded border border-gray-300 overflow-hidden">
          <table
            className="w-full text-sm"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr className="border-b-2 border-black bg-gray-50">
                {["Attorney", "Portal URL", "Link"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portalDirectory.map((row, i) => (
                <tr
                  key={i}
                  className={i < portalDirectory.length - 1 ? "border-b border-gray-200" : ""}
                >
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {row.url}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={row.url}
                      target="_blank"
                      className="text-xs font-bold underline hover:text-gray-600"
                    >
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-16 pt-5 text-center text-xs leading-loose border-t border-gray-200 text-gray-500">
          CONFIDENTIAL - Master Admin View · Tony Greenberg Only · RampRate Inc.
          · March 17, 2026
        </div>
      </div>
    </main>
  );
}
