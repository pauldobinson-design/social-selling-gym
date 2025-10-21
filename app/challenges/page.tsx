"use client"

import { useState } from "react"
import { ChallengeCard } from "@/components/challenge-card"
import { mockChallenges } from "@/lib/mock-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ChallengesPage() {
  const [difficulty, setDifficulty] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")
  const [channels, setChannels] = useState<string[]>([])
  const [outcomes, setOutcomes] = useState<string[]>([])
  const [timeFilters, setTimeFilters] = useState<string[]>([])

  const filteredChallenges = mockChallenges.filter((challenge) => {
    if (difficulty !== "all" && challenge.difficulty !== difficulty) return false
    if (channels.length > 0 && challenge.channel && !channels.includes(challenge.channel)) return false
    if (outcomes.length > 0 && challenge.outcome && !outcomes.includes(challenge.outcome)) return false
    if (timeFilters.length > 0) {
      const time = Number.parseInt(challenge.estimatedTime || "0")
      const matchesTime = timeFilters.some((filter) => {
        if (filter === "≤10m") return time <= 10
        if (filter === "10-20m") return time > 10 && time <= 20
        if (filter === "20m+") return time > 20
        return false
      })
      if (!matchesTime) return false
    }
    return true
  })

  const toggleFilter = (value: string, filters: string[], setFilters: (f: string[]) => void) => {
    if (filters.includes(value)) {
      setFilters(filters.filter((f) => f !== value))
    } else {
      setFilters([...filters, value])
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Challenges</h1>
        <p className="mt-2 text-muted-foreground">Practise your social selling skills and earn XP</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Channel {channels.length > 0 && `(${channels.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by channel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={channels.includes("LinkedIn")}
              onCheckedChange={() => toggleFilter("LinkedIn", channels, setChannels)}
            >
              LinkedIn
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={channels.includes("Email")}
              onCheckedChange={() => toggleFilter("Email", channels, setChannels)}
            >
              Email
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={channels.includes("Calls")}
              onCheckedChange={() => toggleFilter("Calls", channels, setChannels)}
            >
              Calls
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Outcome {outcomes.length > 0 && `(${outcomes.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by outcome</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={outcomes.includes("Connect")}
              onCheckedChange={() => toggleFilter("Connect", outcomes, setOutcomes)}
            >
              Connect
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={outcomes.includes("Meeting")}
              onCheckedChange={() => toggleFilter("Meeting", outcomes, setOutcomes)}
            >
              Meeting
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={outcomes.includes("Nurture")}
              onCheckedChange={() => toggleFilter("Nurture", outcomes, setOutcomes)}
            >
              Nurture
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Time {timeFilters.length > 0 && `(${timeFilters.length})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by time</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={timeFilters.includes("≤10m")}
              onCheckedChange={() => toggleFilter("≤10m", timeFilters, setTimeFilters)}
            >
              ≤10 min
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={timeFilters.includes("10-20m")}
              onCheckedChange={() => toggleFilter("10-20m", timeFilters, setTimeFilters)}
            >
              10-20 min
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={timeFilters.includes("20m+")}
              onCheckedChange={() => toggleFilter("20m+", timeFilters, setTimeFilters)}
            >
              20+ min
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(channels.length > 0 || outcomes.length > 0 || timeFilters.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setChannels([])
              setOutcomes([])
              setTimeFilters([])
            }}
          >
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {filteredChallenges.map((challenge, index) => (
          <ChallengeCard key={challenge.id} challenge={challenge} delay={index * 0.05} />
        ))}
      </div>
    </main>
  )
}
