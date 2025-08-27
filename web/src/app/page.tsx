"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, ExternalLink } from "lucide-react";

const sampleCards = [
  { title: "프로젝트 A", description: "Next.js + Tailwind + shadcn UI 테스트", videoUrl: "https://via.placeholder.com/360x640.png?text=Video+1" },
  { title: "프로젝트 B", description: "릴스 스타일 스와이프 카드 UI", videoUrl: "https://via.placeholder.com/360x640.png?text=Video+2" },
  { title: "프로젝트 C", description: "AI 없이 UI만 테스트 중", videoUrl: "https://via.placeholder.com/360x640.png?text=Video+3" },
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1: 다음 카드, -1: 이전 카드

  const nextCard = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % sampleCards.length);
  };

  const prevCard = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length);
  };

  // 드래그 종료 시 카드 변경
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -100) nextCard();
    else if (info.offset.y > 100) prevCard();
  };

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") nextCard();
      if (e.key === "ArrowUp") prevCard();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-[360px] h-[640px] relative overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full cursor-grab"
          >
            {/* 카드 배경 */}
            <div className="relative w-full h-full bg-black rounded-xl overflow-hidden shadow-2xl">
              {/* 9:16 영상 박스 */}
              <img
                src={sampleCards[index].videoUrl}
                alt="영상 예시"
                className="w-full h-full object-cover"
              />

              {/* 카드 하단 정보 패널 */}
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-lg font-bold">{sampleCards[index].title}</h3>
                <p className="text-sm">{sampleCards[index].description}</p>
                {/* 액션 버튼 */}
                <div className="flex gap-4 mt-2">
                  <Button variant="ghost" className="p-2 rounded-full">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" className="p-2 rounded-full">
                    <Bookmark className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" className="p-2 rounded-full">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" className="p-2 rounded-full">
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
