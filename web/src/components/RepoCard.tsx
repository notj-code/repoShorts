import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

interface RepoCardProps {
  id: string
  name: string
  description: string
  stars: number
  language: string
  html_url: string
  summary?: string
  userId: string
  onAction?: () => void
}

export default function RepoCard({ id, name, description, stars, language, html_url, summary, userId, onAction }: RepoCardProps) {
  const [aiVideo, setAiVideo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAction = async (action: "like" | "skip") => {
    await supabase.from("user_actions").insert({
      user_id: userId,
      repository_id: id,
      action: action
    })
    if (onAction) onAction()
  }

  const fetchAiVideo = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("ai_contents")
      .select("*")
      .eq("repository_id", id)
      .eq("type", "video")
      .limit(1)
      .single()

    if (data) setAiVideo(data.content)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto my-4">
      <CardHeader><CardTitle>{name}</CardTitle></CardHeader>
      <CardContent>
        <p>{summary || description}</p>
        <p className="mt-2 text-sm text-gray-500">{language} • ⭐ {stars}</p>
        {aiVideo && (
          <video src={aiVideo} controls className="w-full mt-2 rounded" />
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <Button onClick={() => handleAction("skip")}>Skip</Button>
        <Button onClick={() => handleAction("like")}>Like</Button>
        <Button onClick={() => window.open(html_url, "_blank")}>View on GitHub</Button>
        <Button onClick={fetchAiVideo} disabled={loading}>
          {loading ? "Loading..." : "View AI Video"}
        </Button>
      </CardFooter>
    </Card>
  )
}
