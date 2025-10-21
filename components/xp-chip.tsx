import { Award } from "lucide-react"

interface XPChipProps {
  xp: number
  level: number
}

export function XPChip({ xp, level }: XPChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
      <Award className="h-4 w-4" />
      <span>
        Level {level} · {xp} XP
      </span>
    </div>
  )
}
