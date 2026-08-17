"use client";

import { useMemo, useState } from "react";
import { JOBS, NICHES } from "../data/jobs";
import { NOREPLY_JOBS } from "../data/noreply-jobs";

const ALL_JOBS = [
  ...JOBS.map((j) => ({ ...j, roleTypes: j.roleTypes || [j.roleType] })),
  ...NOREPLY_JOBS,
];

const ROLE_TYPES = [
  "DM Setter",
  "Phone Setter",
  "Closer",
  "Setter → Closer",
  "Full-Cycle Rep",
  "CSM",
  "Sales Manager",
];

const PAY_STRUCTURES = [
  "Commission Only",
  "Base + Commission",
  "Hourly + Commission",
];

const LEAD_FLOWS = ["Inbound / Warm", "Outbound / Cold", "Mixed"];

const OTE_BUCKETS = [
  { label: "Any OTE", min: 0 },
  { label: "$50K+ / yr", min: 50000 },
  { label: "$100K+ / yr", min: 100000 },
  { label: "$150K+ / yr", min: 150000 },
  { label: "$200K+ / yr", min: 200000 },
  { label: "$300K+ / yr", min: 300000 },
];

const fmt = (n) => (n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${n}`);

export default function Home() {
  const [search, setSearch] = useState("");
  const [roles, setRoles] = useState([]);
  const [niches, setNiches] = useState([]);
  const [subNiches, setSubNiches] = useState([]);
  const [pays, setPays] = useState([]);
  const [flows, setFlows] = useState([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minOte, setMinOte] = useState(0);
  const [sort, setSort] = useState("newest");
  const [expanded, setExpanded] = useState(null);
  const [openNiches, setOpenNiches] = useState([]);
  const [visible, setVisible] = useState(50);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const clearAll = () => {
    setSearch("");
    setRoles([]);
    setNiches([]);
    setSubNiches([]);
    setPays([]);
    setFlows([]);
    setRemoteOnly(false);
    setMinOte(0);
    setVisible(50);
  };

  const filtered = useMemo(() => {
    let out = ALL_JOBS.filter((j) => {
      if (roles.length && !j.roleTypes.some((r) => roles.includes(r)))
        return false;
      if (
        (niches.length || subNiches.length) &&
        !niches.includes(j.niche) &&
        !subNiches.includes(j.subNiche)
      )
        return false;
      if (pays.length && !pays.includes(j.payStructure)) return false;
      if (flows.length && !flows.includes(j.leadFlow)) return false;
      if (remoteOnly && !j.remote) return false;
      if (minOte && j.oteMax < minOte) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = [
          j.title,
          j.company,
          j.niche,
          j.subNiche,
          j.description,
          j.location,
          ...(j.tags || []),
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    if (sort === "ote-desc") out.sort((a, b) => b.oteMax - a.oteMax);
    if (sort === "ote-asc")
      out.sort((a, b) => (a.oteMin || Infinity) - (b.oteMin || Infinity));
    if (sort === "newest")
      out.sort(
        (a, b) => (a.postedDaysAgo ?? 0) - (b.postedDaysAgo ?? 0)
      );
    return out;
  }, [search, roles, niches, subNiches, pays, flows, remoteOnly, minOte, sort]);

  const countRole = (r) =>
    ALL_JOBS.filter((j) => j.roleTypes.includes(r)).length;
  const countBy = (key, val) => ALL_JOBS.filter((j) => j[key] === val).length;

  const withOte = ALL_JOBS.filter((j) => j.oteMax > 0);
  const avgOte = Math.round(
    withOte.reduce((s, j) => s + (j.oteMin + j.oteMax) / 2, 0) /
      withOte.length /
      1000
  );
  const nicheCount = new Set(ALL_JOBS.map((j) => j.subNiche)).size;
  const remoteCount = ALL_JOBS.filter((j) => j.remote).length;

  const shown = filtered.slice(0, visible);

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="logo">
            HighTicket<span>Board</span>
          </div>
          <a
            className="topbar-cta"
            href="mailto:reachtimchao@gmail.com?subject=Post%20a%20job%20on%20HighTicket%20Board"
          >
            Post a Job
          </a>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-badge">
          Updated August 2026 · {ALL_JOBS.length} live offers
        </div>
        <h1>
          The job board for <em>setters &amp; closers</em> in high-ticket sales
        </h1>
        <p>
          DM setting, phone setting, closing, full-cycle and CSM seats across
          coaching, info products, agencies, finance and more — with on-target
          earnings, offer revenue, and niche for every listing.
        </p>

        <div className="stats">
          <div className="stat">
            <div className="num">{ALL_JOBS.length}</div>
            <div className="lbl">Live offers</div>
          </div>
          <div className="stat">
            <div className="num">${avgOte}K</div>
            <div className="lbl">Average posted OTE / yr</div>
          </div>
          <div className="stat">
            <div className="num">{nicheCount}</div>
            <div className="lbl">Niches represented</div>
          </div>
          <div className="stat">
            <div className="num">{remoteCount}</div>
            <div className="lbl">Fully remote seats</div>
          </div>
        </div>

        <div className="insights">
          <h3>📊 What the market is paying right now</h3>
          <div className="insights-grid">
            <div>
              <b>DM setters</b>
              $2K–$7K/mo posted OTE typical; top DM seats on big personal
              development and trading offers post $10K–$12K/mo.
            </div>
            <div>
              <b>Phone setters</b>
              $3K–$10K/mo typical. Fractional-CFO, finance and biz-coaching
              offers post the highest setter OTEs ($13K–$30K/mo).
            </div>
            <div>
              <b>Closers</b>
              $8K–$20K/mo is the fat middle. 10–20% commission on $5K–$15K
              offers, mostly commission-only.
            </div>
            <div>
              <b>Top seats</b>
              $40K–$100K/mo posted ceilings: Medicare/insurance, biz
              acquisition, trading education, and holistic health at
              $1M+/mo revenue.
            </div>
          </div>
        </div>
      </section>

      <main className="container board">
        <aside className="filters">
          <div className="filter-group">
            <h4>Role Type</h4>
            {ROLE_TYPES.map((r) => (
              <label className="chk" key={r}>
                <input
                  type="checkbox"
                  checked={roles.includes(r)}
                  onChange={() => toggle(roles, setRoles, r)}
                />
                {r}
                <span className="count">{countRole(r) || ""}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Niche</h4>
            {Object.entries(NICHES).map(([niche, subs]) => (
              <div key={niche}>
                <label className="chk">
                  <input
                    type="checkbox"
                    checked={niches.includes(niche)}
                    onChange={() => toggle(niches, setNiches, niche)}
                  />
                  {niche}
                  <span className="count">{countBy("niche", niche) || ""}</span>
                  <button
                    className="niche-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      toggle(openNiches, setOpenNiches, niche);
                    }}
                  >
                    {openNiches.includes(niche) ? "▲" : "▼"}
                  </button>
                </label>
                {openNiches.includes(niche) && (
                  <div className="subniche-list">
                    {subs.map((s) => (
                      <label className="chk" key={s}>
                        <input
                          type="checkbox"
                          checked={subNiches.includes(s)}
                          onChange={() => toggle(subNiches, setSubNiches, s)}
                        />
                        {s}
                        <span className="count">
                          {countBy("subNiche", s) || ""}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h4>Minimum OTE</h4>
            <select
              className="ote-select"
              value={minOte}
              onChange={(e) => setMinOte(Number(e.target.value))}
            >
              {OTE_BUCKETS.map((b) => (
                <option key={b.label} value={b.min}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h4>Pay Structure</h4>
            {PAY_STRUCTURES.map((p) => (
              <label className="chk" key={p}>
                <input
                  type="checkbox"
                  checked={pays.includes(p)}
                  onChange={() => toggle(pays, setPays, p)}
                />
                {p}
                <span className="count">
                  {countBy("payStructure", p) || ""}
                </span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Lead Flow</h4>
            {LEAD_FLOWS.map((f) => (
              <label className="chk" key={f}>
                <input
                  type="checkbox"
                  checked={flows.includes(f)}
                  onChange={() => toggle(flows, setFlows, f)}
                />
                {f}
                <span className="count">{countBy("leadFlow", f) || ""}</span>
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Location</h4>
            <label className="chk">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={() => setRemoteOnly(!remoteOnly)}
              />
              Remote only
              <span className="count">{remoteCount}</span>
            </label>
          </div>

          <button className="clear-btn" onClick={clearAll}>
            Clear all filters
          </button>
        </aside>

        <section>
          <div className="list-head">
            <input
              className="search"
              placeholder="Search offers, companies, niches…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="ote-desc">Highest OTE</option>
              <option value="ote-asc">Lowest OTE</option>
            </select>
          </div>

          <div className="result-count">
            {filtered.length} offer{filtered.length === 1 ? "" : "s"} matching
          </div>

          <div className="job-list">
            {filtered.length === 0 && (
              <div className="empty">
                No offers match those filters — try clearing a few.
              </div>
            )}
            {shown.map((j) => (
              <article
                className="job-card"
                key={j.id}
                onClick={() => setExpanded(expanded === j.id ? null : j.id)}
              >
                <div className="job-top">
                  <div>
                    <div className="job-title">{j.title}</div>
                    <div className="job-company">
                      {j.company} · {j.location}
                    </div>
                  </div>
                  <div className="ote">
                    {j.oteMax > 0 ? (
                      <>
                        <div className="amt">
                          {j.oteDisplay
                            ? j.oteDisplay
                            : `${fmt(j.oteMin)} – ${fmt(j.oteMax)}`}
                        </div>
                        <div className="lbl">
                          {j.oteLabel || "posted OTE / yr"}
                        </div>
                      </>
                    ) : (
                      <div className="lbl">OTE not posted</div>
                    )}
                  </div>
                </div>

                <div className="badges">
                  {j.roleTypes.map((r) => (
                    <span className="badge role" key={r}>
                      {r}
                    </span>
                  ))}
                  <span className="badge niche">{j.subNiche}</span>
                  {j.payStructure && (
                    <span className="badge pay">{j.payStructure}</span>
                  )}
                  {j.remote && <span className="badge remote">Remote</span>}
                  {j.leadFlow && (
                    <span className="badge plain">{j.leadFlow}</span>
                  )}
                  {j.tags &&
                    j.tags
                      .filter((t) => t === "New" || t.startsWith("Doing"))
                      .map((t) => (
                        <span className="badge plain" key={t}>
                          {t}
                        </span>
                      ))}
                </div>

                {expanded === j.id && (
                  <div
                    className="job-details"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>{j.description}</p>
                    {(j.commission || j.pricePoint || j.experience) && (
                      <div className="detail-grid">
                        {j.commission && (
                          <div className="detail-item">
                            <div className="k">Commission</div>
                            <div className="v">{j.commission}</div>
                          </div>
                        )}
                        {j.pricePoint && (
                          <div className="detail-item">
                            <div className="k">Offer Price Point</div>
                            <div className="v">{j.pricePoint}</div>
                          </div>
                        )}
                        {j.experience && (
                          <div className="detail-item">
                            <div className="k">Experience</div>
                            <div className="v">{j.experience}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {j.requirements && j.requirements.length > 0 && (
                      <ul className="reqs">
                        {j.requirements.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                    <div className="job-actions">
                      <a
                        className="apply-btn"
                        href={j.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Apply / View Listing →
                      </a>
                      <span className="source-note">
                        Source: {j.source} · {j.postedNote}
                      </span>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>

          {filtered.length > visible && (
            <button
              className="clear-btn"
              style={{ marginTop: 18 }}
              onClick={() => setVisible(visible + 50)}
            >
              Show {Math.min(50, filtered.length - visible)} more of{" "}
              {filtered.length - visible} remaining
            </button>
          )}
        </section>
      </main>

      <footer>
        <div className="container">
          <div>
            HighTicketBoard — built for setters, closers &amp; sales reps.
          </div>
          <div className="disclaimer">
            Compensation figures are as posted by hiring companies on public
            job boards and are not guaranteed. Always verify offer details,
            commission structure, and lead flow directly with the company
            before accepting a role.
          </div>
        </div>
      </footer>
    </>
  );
}
