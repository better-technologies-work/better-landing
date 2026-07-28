"use client";

import { getYouTubeVideoId, getVimeoVideoId, type VideoSource } from "@/lib/video-utils";

type VideoPlayerProps = {
  videoUrl: string;
  videoSource?: VideoSource | null;
};

export default function VideoPlayer({ videoUrl, videoSource }: VideoPlayerProps) {
  const source = videoSource || 'upload';

  if (source === 'youtube') {
    const id = getYouTubeVideoId(videoUrl);
    if (!id) return null;
    return (
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}?modestbranding=1&rel=0`}
          className="w-full aspect-video"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title="YouTube video"
        />
      </div>
    );
  }

  if (source === 'vimeo') {
    const id = getVimeoVideoId(videoUrl);
    if (!id) return null;
    return (
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${id}`}
          className="w-full aspect-video"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title="Vimeo video"
        />
      </div>
    );
  }

  if (source === 'upload') {
    return (
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-black">
        <video
          src={videoUrl}
          controls
          className="w-full aspect-video object-contain"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
      Ver video
    </a>
  );
}
