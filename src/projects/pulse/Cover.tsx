import { BarChart3, CheckCircle2, FolderKanban, LayoutDashboard, Settings, Users } from 'lucide-react'

const rows = [
  { id: 'TSK-1042', t: 'Onboarding flow — final review', s: 'In review', c: '#8B8BFF' },
  { id: 'TSK-1039', t: 'Billing page empty states', s: 'In progress', c: '#F5B544' },
  { id: 'TSK-1035', t: 'Export analytics as CSV', s: 'Done', c: '#3DD6A5' },
  { id: 'TSK-1031', t: 'Team permissions matrix', s: 'Blocked', c: '#FF7A6B' },
]

/** Home-page preview: tilted dashboard window built from UI primitives. */
export default function PulseCover() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0E1015] font-['Inter_Variable'] [perspective:1400px]">
      <div aria-hidden className="absolute -right-[20%] -top-[30%] size-[80%] rounded-full bg-[#8B8BFF]/20 blur-[80px]" />
      <div className="absolute left-[8%] top-[10%] w-[118%] origin-top-left rounded-[10px] border border-white/10 bg-[#161922] shadow-[0_50px_100px_rgba(0,0,0,0.6)] transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] [transform:rotateX(14deg)_rotateY(-16deg)_rotateZ(3deg)] group-hover/cover:[transform:rotateX(8deg)_rotateY(-9deg)_rotateZ(1.5deg)]">
        <div className="flex">
          <div className="flex w-[9%] flex-col items-center gap-[1.6vw] border-r border-white/5 py-[3%] text-[#959AAB]">
            <span className="grid size-[1.8vw] min-h-4 min-w-4 place-items-center rounded-[5px] bg-[#8B8BFF] text-[clamp(7px,0.7vw,11px)] font-bold text-[#0E1015]">P</span>
            {[LayoutDashboard, FolderKanban, CheckCircle2, BarChart3, Users, Settings].map((I, i) => (
              <I key={i} className={i === 0 ? 'size-[1.1vw] min-h-3 min-w-3 text-[#E9EBF2]' : 'size-[1.1vw] min-h-3 min-w-3'} strokeWidth={1.6} />
            ))}
          </div>
          <div className="flex-1 p-[2.6%]">
            <p className="text-[clamp(8px,0.95vw,15px)] font-semibold text-[#E9EBF2]">Overview</p>
            <div className="mt-[3%] grid grid-cols-3 gap-[2%]">
              {[
                ['Active projects', '12', '+2'],
                ['Tasks done (wk)', '48', '+9'],
                ['On track', '87%', ''],
              ].map(([l, v, d]) => (
                <div key={l} className="rounded-[6px] border border-white/5 bg-[#1C2030] p-[6%]">
                  <p className="text-[clamp(5px,0.55vw,9px)] uppercase tracking-wider text-[#959AAB]">{l}</p>
                  <p className="mt-[8%] text-[clamp(11px,1.7vw,26px)] font-semibold tabular-nums text-[#E9EBF2]">
                    {v} {d && <span className="text-[0.45em] font-medium text-[#3DD6A5]">{d}</span>}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-[3%] grid grid-cols-[1.6fr_1fr] gap-[2%]">
              <div className="rounded-[6px] border border-white/5 bg-[#1C2030] p-[4%]">
                <p className="text-[clamp(5px,0.6vw,9px)] text-[#959AAB]">Completed tasks · 12 weeks</p>
                <svg viewBox="0 0 300 100" className="mt-[4%] w-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pc-a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#8B8BFF" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#8B8BFF" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[25, 50, 75].map((y) => (
                    <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#fff" strokeOpacity="0.05" />
                  ))}
                  <path d="M0 80 C30 74 45 62 70 64 S120 40 150 46 S200 24 230 30 S275 12 300 14 L300 100 L0 100Z" fill="url(#pc-a)" />
                  <path d="M0 80 C30 74 45 62 70 64 S120 40 150 46 S200 24 230 30 S275 12 300 14" fill="none" stroke="#8B8BFF" strokeWidth="2" />
                </svg>
              </div>
              <div className="grid place-items-center rounded-[6px] border border-white/5 bg-[#1C2030] p-[4%]">
                <svg viewBox="0 0 42 42" className="w-[62%]">
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#2A2F42" strokeWidth="5" />
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#3DD6A5" strokeWidth="5" strokeDasharray="52 48" strokeDashoffset="25" />
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#8B8BFF" strokeWidth="5" strokeDasharray="28 72" strokeDashoffset="73" />
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F5B544" strokeWidth="5" strokeDasharray="14 86" strokeDashoffset="45" />
                </svg>
              </div>
            </div>
            <div className="mt-[3%] overflow-hidden rounded-[6px] border border-white/5">
              {rows.map((r) => (
                <div key={r.id} className="flex items-center gap-[3%] border-b border-white/5 bg-[#1A1D28] px-[3%] py-[1.6%] last:border-0">
                  <span className="font-['IBM_Plex_Mono'] text-[clamp(5px,0.55vw,9px)] text-[#959AAB]">{r.id}</span>
                  <span className="flex-1 truncate text-[clamp(6px,0.7vw,11px)] text-[#E9EBF2]">{r.t}</span>
                  <span className="rounded-full px-[1.2%] py-[0.4%] text-[clamp(5px,0.55vw,9px)]" style={{ color: r.c, background: `${r.c}22` }}>
                    {r.s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
