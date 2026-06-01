"use client";

import { useState } from "react";
import {
  ALL_ROOTS,
  QUALITIES,
  QUALITY_LABEL,
  QUALITY_SUFFIX,
  type ChordQuality,
} from "@/lib/music";
import { findForm } from "@/data/chord-forms";
import Fretboard from "@/components/Fretboard";

export default function Home() {
  const [stringRoot, setStringRoot] = useState<6 | 5 | 4>(6);
  const [quality, setQuality] = useState<ChordQuality>("maj");
  const [rootNote, setRootNote] = useState<string>("F");
  const [display, setDisplay] = useState<"degree" | "note">("degree");

  const form = findForm(stringRoot, quality);
  const chordSymbol = `${rootNote}${QUALITY_SUFFIX[quality]}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="mb-1 text-2xl font-bold text-amber-400">
        🎸 Guitar-chord
      </h1>
      <p className="mb-6 text-xs text-neutral-500">
        フレットボード上で形と度数で見るコードフォーム集
      </p>

      {/* 弦ルート（6弦/5弦） */}
      <div className="mb-3">
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
          ルートが乗る弦
        </div>
        <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-[3px]">
          {[6, 5, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStringRoot(s as 6 | 5 | 4)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                stringRoot === s
                  ? "bg-amber-400 text-black"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {s}弦ルート
            </button>
          ))}
        </div>
      </div>

      {/* クオリティ */}
      <div className="mb-3">
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
          コードクオリティ
        </div>
        <div className="flex flex-wrap gap-1.5">
          {QUALITIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuality(q)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                quality === q
                  ? "border-amber-400 bg-amber-400/20 text-amber-400"
                  : "border-neutral-700 text-neutral-300 hover:border-amber-400/60"
              }`}
            >
              {QUALITY_LABEL[q]}
            </button>
          ))}
        </div>
      </div>

      {/* ルート音 */}
      <div className="mb-4">
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-neutral-500">
          ルート音
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ALL_ROOTS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRootNote(r)}
              className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                rootNote === r
                  ? "border-amber-400 bg-amber-400 text-black"
                  : "border-neutral-700 text-neutral-200 hover:border-amber-400/60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 現在のコードと表示モード */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="font-mono text-3xl font-bold leading-none text-amber-400">
          {chordSymbol}
        </div>
        <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900 p-[3px]">
          <button
            type="button"
            onClick={() => setDisplay("degree")}
            className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${
              display === "degree"
                ? "bg-amber-400 text-black"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            度数
          </button>
          <button
            type="button"
            onClick={() => setDisplay("note")}
            className={`rounded-md px-2.5 py-1 text-[11px] transition-colors ${
              display === "note"
                ? "bg-amber-400 text-black"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            音名
          </button>
        </div>
      </div>

      {form ? (
        <Fretboard form={form} rootNote={rootNote} display={display} />
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-center text-sm text-neutral-500">
          フォーム未登録
        </div>
      )}

      <div className="mt-3 text-[10px] text-neutral-500">
        <span className="text-amber-400">●</span> ルート &nbsp;
        <span className="text-green-400">●</span> その他のコードトーン &nbsp;
        <span className="text-neutral-400">×</span> 弾かない弦
      </div>
    </div>
  );
}
