import type { ReactNode } from 'react'
import { ClimbFlow } from './ClimbFlow'

// HR Central as one screen: the chapter's heading (passed in as `intro`) and
// the climb from onboarding to hiring beneath it (see ClimbFlow), filling one
// screen. (TalentFlow, the earlier Campus → Company arc, can be swapped back in here.)

export function CampusToCompany({ intro }: { intro?: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-col">
      {intro}
      <div className="flex flex-1 flex-col justify-center px-6 py-6 md:px-10 md:py-1">
        <div className="mx-auto w-full max-w-[1320px]">
          <ClimbFlow />
        </div>
      </div>
    </div>
  )
}
