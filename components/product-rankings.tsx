"use client"

import { ProjectCard } from '@/components/project-card'

interface Project {
  id: string
  name: string
  tagline: string
  logo?: string | null
  website: string
  category: string
  tags: string[] | string
  mrr?: number | null
  isPromoted: boolean
  createdAt: Date | string
  points: number
  totalVoteCount?: number
  userVote?: number | null
  _count: {
    votes: number
    comments?: number
  }
  votes?: Array<{
    value: number
    userId: string
  }>
}

interface ProjectRankingsProps {
  todaysTop: Project[]
  todaysPromoted: Project[]
  yesterdaysTop: Project[]
  yesterdaysPromoted: Project[]
  weeklyTop: Project[]
  weeklyPromoted: Project[]
  monthlyTop: Project[]
  monthlyPromoted: Project[]
  userVotes: Record<string, number>
  onVote: (projectId: string, value: number) => void
}

export function ProjectRankings({
  todaysTop,
  todaysPromoted,
  yesterdaysTop,
  yesterdaysPromoted,
  weeklyTop,
  weeklyPromoted,
  monthlyTop,
  monthlyPromoted,
  userVotes,
  onVote,
}: ProjectRankingsProps) {
  const sections = [
    {
      title: "🔥 Today's Top 3",
      projects: todaysTop,
      showPromoted: false,
    },
    {
      title: "💎 Today's Promoted",
      projects: todaysPromoted,
      showPromoted: true,
    },
    {
      title: "🔥 Yesterday's Top 3",
      projects: yesterdaysTop,
      showPromoted: false,
    },
    {
      title: "💎 Yesterday's Promoted",
      projects: yesterdaysPromoted,
      showPromoted: true,
    },
    {
      title: "🔥 Weekly Top 3",
      projects: weeklyTop,
      showPromoted: false,
    },
    {
      title: "💎 Weekly Promoted",
      projects: weeklyPromoted,
      showPromoted: true,
    },
    {
      title: "🔥 Monthly Top 3",
      projects: monthlyTop,
      showPromoted: false,
    },
    {
      title: "💎 Monthly Promoted",
      projects: monthlyPromoted,
      showPromoted: true,
    },
  ]

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
          <div className="grid gap-4">
            {section.projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                userVote={userVotes[project.id]}
                onVote={onVote}
                showPromoted={section.showPromoted}
              />
            ))}
            {section.projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No projects found for this period.</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
