"use client";

import { useState } from "react";
import Reels, { Card } from "./reels/Reels";

export default function MainPage() {
  const cards: Card[] = [
    {
      id: 1,
      title: "AI 프로젝트 A",
      description: "AI 요약 + UI 테스트",
      repo: "https://github.com/vercel/next.js",
      media: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      topics: ["nextjs", "tailwind", "shadcn-ui"],
    },
    {
      id: 2,
      title: "AI 프로젝트 B",
      description: "릴스 스타일 스와이프 카드 UI",
      repo: "https://github.com/framer/motion",
      media: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      topics: ["react", "framer-motion", "ui"],
    },
    {
      id: 3,
      title: "AI 프로젝트 C",
      description: "더미 영상 + 카드 UI 테스트",
      repo: "https://github.com/supabase/supabase",
      media: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      topics: ["typescript", "web", "frontend"],
    },
  ];

  const [view, setView] = useState<"all" | "liked" | "saved">("all");
  const [liked, setLiked] = useState<boolean[]>(cards.map(() => false));
  const [saved, setSaved] = useState<boolean[]>(cards.map(() => false));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${view === "all" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setView("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "liked" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setView("liked")}
        >
          Liked
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "saved" ? "bg-blue-600" : "bg-gray-700"}`}
          onClick={() => setView("saved")}
        >
          Saved
        </button>
      </div>

      <Reels
        cards={cards}
        filter={view === "all" ? undefined : view}
        liked={liked}
        saved={saved}
        toggleLike={setLiked}
        toggleSave={setSaved}
      />
    </div>
  );
}
