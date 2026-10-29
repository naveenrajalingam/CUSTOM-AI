import { useEffect, useRef, useState } from 'react'
import { PenTool, RefreshCcw, Ruler, ScanSearch, Wrench, type LucideIcon } from 'lucide-react'
import { engineering } from '../content'
import { prefersReducedMotion, useInView } from '../lib/motion'
import { CadConsole } from './CadConsole'
import { Chapter } from './Chapter'
import { Emerge } from './Emerge'
import { ModuleDetails } from './ModuleDetails'
import { SectionGlow } from './SectionMarks'

// The AI Design Assistant chapter in one screen: its badge, heading, one line
// and its five operations (design, measure, analyse, fix, redesign: the icon
// row, each shown on hover) on the left, the robotic CAD console working beside them. While the section is on
// screen the console's stages play through on their own every 5 seconds (each
// stage sets the console's header line).

const { stages } = engineering
const STAGE_MS = 5000
const ICONS: LucideIcon[] = [PenTool, Ruler, ScanSearch, Wrench, RefreshCcw] // design, measure, analyse, fix, redesign

export function EngineeringStages() {
  const ref = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(0)
  const inView = useInView(ref, '0px')
  const playing = inView && !prefersReducedMotion()

  // advance every few seconds while playing
  useEffect(() => {
    if (!playing) return
    const id = window.setTimeout(() => setStage((s) => (s + 1) % stages.length), STAGE_MS)
    return () => window.clearTimeout(id)
  }, [playing, stage])

  return (
    <section ref={ref} aria-labelledby={`${engineering.id}-title`} className="relative">
      <SectionGlow accent="cyan" side="right" />
      <Chapter
        id={engineering.id}
        name={engineering.name}
        title={engineering.title}
        lede={engineering.lede}
        accent="cyan"
        wide="even"
        aside={
          <Emerge>
            <CadConsole stage={stage} />
          </Emerge>
        }
      >
        <ModuleDetails accent="cyan" autoplay={false} cards={engineering.steps.map((c, i) => ({ ...c, icon: ICONS[i] }))} />
      </Chapter>
    </section>
  )
}
