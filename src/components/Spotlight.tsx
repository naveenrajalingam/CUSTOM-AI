/** A soft light under the pointer, in the section's colour. The card sets --mx/--my (see trackSpot). */
export function Spotlight({ color }: { color: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      style={{
        background: `radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, ${color} 16%, transparent), transparent 65%)`,
      }}
    />
  )
}
