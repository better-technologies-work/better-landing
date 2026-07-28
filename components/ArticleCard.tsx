"use client";

import { type VideoSource } from "@/lib/video-utils";

type ArticleCardProps = {
  title: string;
  description?: string;
  cover_url?: string;
  category?: string;
  slug?: string;
  post_url?: string;
  published_at: string;
  updated_at?: string;
  video_url?: string;
  video_source?: VideoSource | null;
  locale?: string;
  readMoreText?: string;
  publishedText?: string;
  updatedText?: string;
  noImageText?: string;
  noDescText?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default function ArticleCard({
  title,
  description,
  cover_url,
  category,
  slug,
  post_url,
  published_at,
  updated_at,
  video_url,
  locale = "en",
  readMoreText = "Read more →",
  publishedText = "Published",
  updatedText = "Updated",
  noImageText = "No image",
  noDescText = "",
}: ArticleCardProps) {
  const href = post_url?.startsWith("http")
    ? post_url
    : `/${locale === "en" ? "" : locale + "/"}blog/${slug}`;
  const isExternal = post_url?.startsWith("http");

  const cleanDescription = description ? stripHtml(description) : noDescText;

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col"
    >
      <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-slate-100">
        {cover_url ? (
          <img
            src={cover_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">
            {noImageText}
          </div>
        )}
        {category && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
            {category}
          </div>
        )}
        {video_url && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase flex items-center gap-1">
            <span>▶</span> Video
          </div>
        )}
      </div>
      <h3 className="font-black text-lg mb-3 uppercase text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-1">
        {cleanDescription}
      </p>
      <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:text-slate-900 transition-colors">
        {readMoreText}
      </span>
      <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
        <span>
          {publishedText}{" "}
          {new Date(published_at).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {updated_at && updated_at !== published_at && (
          <span className="text-blue-500">
            · {updatedText}{" "}
            {new Date(updated_at).toLocaleDateString(undefined, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </a>
  );
}
