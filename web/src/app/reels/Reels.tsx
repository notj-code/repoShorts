"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Heart, Bookmark, Share2, Github } from "lucide-react";

export type Card = {
  id: number;
  title: string;
  description: string;
  repo: string;
  topics: string[];
  media: string;
};

interface ReelsProps {
  cards: Card[];
  filter?: "liked" | "saved";
  liked: boolean[];
  saved: boolean[];
  toggleLike: (cb: (prev: boolean[]) => boolean[]) => void;
  toggleSave: (cb: (prev: boolean[]) => boolean[]) => void;
}

export default function Reels({ cards, filter, liked, saved, toggleLike, toggleSave }: ReelsProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 60;
  const DRAG_THRESHOLD = 80;

  // 항상 배열로 초기화
  const filteredCards =
    filter === "liked"
      ? cards.filter((_, i) => liked[i])
      : filter === "saved"
      ? cards.filter((_, i) => saved[i])
      : cards || [];

  // hook 호출 순서 항상 동일
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleNavigation(1);
      if (e.key === "ArrowUp") handleNavigation(-1);
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 30) handleNavigation(1);
      if (e.deltaY < -30) handleNavigation(-1);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onWheel);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
    };
  }, [filteredCards]);

  const handleNavigation = (dir: 1 | -1) => {
    if (filteredCards.length === 0) return;
    setDirection(dir);
    setIndex((prev) => (prev + dir + filteredCards.length) % filteredCards.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStartY(e.touches[0].clientY);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (diff > SWIPE_THRESHOLD) handleNavigation(1);
    if (diff < -SWIPE_THRESHOLD) handleNavigation(-1);
    setTouchStartY(null);
  };

  const onDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y < -DRAG_THRESHOLD) handleNavigation(1);
    if (info.offset.y > DRAG_THRESHOLD) handleNavigation(-1);
  };

  const shareCard = (idx: number) => {
    const card = filteredCards[idx];
    if (!card) return;
    if (navigator.share) navigator.share({ title: card.title, text: card.description, url: card.repo });
    else alert("공유 기능을 지원하지 않는 브라우저입니다.");
  };
  const goToRepo = (idx: number) => {
    const card = filteredCards[idx];
    if (!card) return;
    window.open(card.repo, "_blank");
  };

  // current undefined 체크
  const current = filteredCards[index];
  if (!current || filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white gap-4">
        <p>{filter === "liked" ? "좋아요 누른 카드가 없습니다." : "저장한 카드가 없습니다."}</p>
        <p className="text-sm opacity-70">탭을 변경하거나 새로운 카드를 스와이프해보세요!</p>
      </div>
    );
  }

  return (
    <div
      className="w-[360px] h-[640px] relative overflow-hidden rounded-xl mx-auto mt-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-sm text-white z-10">
        {index + 1} / {filteredCards.length}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current.id}
          custom={direction}
          initial={{ opacity: 0, y: direction === 1 ? 200 : -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: direction === 1 ? -200 : 200 }}
          transition={{ duration: 0.35 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={onDragEnd}
          className="absolute inset-0 cursor-grab"
        >
          <video src={current.media} className="w-full h-full object-cover" autoPlay loop muted playsInline />

          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="text-lg font-bold">{current.title}</h3>
            <p className="text-sm opacity-90">{current.description}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {current.topics.map((t) => (
                <span key={t} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 text-white">
            <button
              onClick={() =>
                toggleLike((prev) => prev.map((v, i) => (i === cards.indexOf(current) ? !v : v)))
              }
              className="p-3 bg-black/50 rounded-full hover:bg-red-500 transition"
            >
              <Heart
                color={liked[cards.indexOf(current)] ? "red" : "white"}
                size={24}
                fill={liked[cards.indexOf(current)] ? "red" : "transparent"}
              />
            </button>

            <button
              onClick={() =>
                toggleSave((prev) => prev.map((v, i) => (i === cards.indexOf(current) ? !v : v)))
              }
              className="p-3 bg-black/50 rounded-full hover:bg-yellow-500 transition"
            >
              <Bookmark
                color={saved[cards.indexOf(current)] ? "yellow" : "white"}
                size={24}
                fill={saved[cards.indexOf(current)] ? "yellow" : "transparent"}
              />
            </button>

            <button onClick={() => shareCard(index)} className="p-3 bg-black/50 rounded-full hover:bg-blue-500 transition">
              <Share2 color="white" size={24} />
            </button>

            <button onClick={() => goToRepo(index)} className="p-3 bg-black/50 rounded-full hover:bg-green-500 transition">
              <Github color="white" size={24} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
