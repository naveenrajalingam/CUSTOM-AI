import type { ReactNode } from 'react'
import { TwoJourneys } from './TwoJourneys'

// HR Central: the chapter's heading (passed in as `intro`), then the two
// journeys, Campus to Hire and Hire to Fire, on slides you swipe between
// (see TwoJourneys). (ClimbFlow, the climb, and TalentFlow, the
// earlier Campus → Company arc, can be swapped back in here.)

export function CampusToCompany({ intro }: { intro?: ReactNode }) {
  return (
    <div>
      {intro}
      <div className="px-6 pt-14 pb-16 md:px-10 md:pt-16 md:pb-20">
        <div className="mx-auto w-full max-w-[1320px]">
          <TwoJourneys />
        </div>
      </div>
    </div>
  )
}
