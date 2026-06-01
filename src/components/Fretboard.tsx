"use client";

import {
  STANDARD_TUNING,
  intervalDegree,
  noteIndex,
  noteName,
  preferFlat,
} from "@/lib/music";
import type { ChordForm, FretOffset } from "@/data/chord-forms";

interface Props {
  form: ChordForm;
  rootNote: string;
  display: "degree" | "note";
}

// ルート音と弦から開放時のフレット差を出し、必要に応じてオクターブを上げて
// すべての押弦フレットが 1 以上に収まるように調整する（可動フォーム前提）
function computeRootFret(
  rootNote: string,
  stringRoot: 6 | 5,
  voicing: ChordForm["voicing"],
): number {
  const stringIdx = stringRoot === 6 ? 0 : 1; // tuning index
  const openNote = noteIndex(STANDARD_TUNING[stringIdx]);
  const rootIdx = noteIndex(rootNote);
  let fret = (((rootIdx - openNote) % 12) + 12) % 12;
  const offsets = voicing.filter((v): v is number => typeof v === "number");
  const minOffset = offsets.length ? Math.min(...offsets) : 0;
  // 押弦フレットがすべて 0 以上（開放弦は許可）になるまで 1 オクターブずつ上に移動
  while (fret + minOffset < 0) fret += 12;
  return fret;
}

export default function Fretboard({ form, rootNote, display }: Props) {
  const NUM_FRETS = 15;
  const fretWidth = 52;
  const stringSpacing = 28;
  const padX = 36;
  const padY = 36;
  const width = padX * 2 + fretWidth * NUM_FRETS;
  const height = padY * 2 + stringSpacing * 5;
  const useFlats = preferFlat(rootNote);

  const rootFret = computeRootFret(rootNote, form.stringRoot, form.voicing);
  // displayOrder: 上から下へ表示する弦の tuning index 配列
  // tuning[5] = 1弦(高E), tuning[0] = 6弦(低E)。上が高音弦になるよう [5,4,3,2,1,0]
  const displayOrder = [5, 4, 3, 2, 1, 0];

  const inlayFrets = [3, 5, 7, 9, 12, 15];
  const doubleInlayFrets = [12];

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        style={{ minWidth: width }}
      >
        {/* 指板背景 */}
        <rect
          x={padX}
          y={padY - 8}
          width={fretWidth * NUM_FRETS}
          height={stringSpacing * 5 + 16}
          fill="#1a1a1d"
          rx={4}
        />
        {/* インレイ */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1)
          .filter((f) => inlayFrets.includes(f))
          .map((f) => {
            const cx = padX + fretWidth * (f - 0.5);
            const cy = padY + (stringSpacing * 5) / 2;
            if (doubleInlayFrets.includes(f)) {
              return (
                <g key={f}>
                  <circle cx={cx} cy={cy - stringSpacing} r={4} fill="#3a3a3e" />
                  <circle cx={cx} cy={cy + stringSpacing} r={4} fill="#3a3a3e" />
                </g>
              );
            }
            return <circle key={f} cx={cx} cy={cy} r={4} fill="#3a3a3e" />;
          })}
        {/* ナット */}
        <rect
          x={padX - 4}
          y={padY - 8}
          width={6}
          height={stringSpacing * 5 + 16}
          fill="#e5e5e5"
        />
        {/* フレット線 */}
        {Array.from({ length: NUM_FRETS + 1 }, (_, i) => (
          <line
            key={i}
            x1={padX + fretWidth * i}
            y1={padY - 8}
            x2={padX + fretWidth * i}
            y2={padY + stringSpacing * 5 + 8}
            stroke="#6a6a6e"
            strokeWidth={i === 0 ? 0 : 2}
          />
        ))}
        {/* 弦 */}
        {displayOrder.map((sIdx, row) => (
          <line
            key={sIdx}
            x1={padX}
            y1={padY + stringSpacing * row}
            x2={padX + fretWidth * NUM_FRETS}
            y2={padY + stringSpacing * row}
            stroke="#cccccc"
            strokeWidth={0.8 + (5 - row) * 0.3}
            opacity={0.85}
          />
        ))}
        {/* フレット番号 */}
        {Array.from({ length: NUM_FRETS }, (_, i) => i + 1).map((f) => (
          <text
            key={f}
            x={padX + fretWidth * (f - 0.5)}
            y={padY + stringSpacing * 5 + 20}
            textAnchor="middle"
            fontSize={9}
            fill="#7a7a7e"
            fontFamily="monospace"
          >
            {f}
          </text>
        ))}
        {/* 押弦・ミュート */}
        {displayOrder.map((sIdx, row) => {
          const cy = padY + stringSpacing * row;
          const entry: FretOffset = form.voicing[sIdx];
          if (entry === "X") {
            return (
              <text
                key={`x-${sIdx}`}
                x={padX - 16}
                y={cy + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={700}
                fill="#888"
                fontFamily="monospace"
              >
                ×
              </text>
            );
          }
          const fret = rootFret + entry;
          const cx =
            fret === 0 ? padX - 16 : padX + fretWidth * (fret - 0.5);
          const openNote = noteIndex(STANDARD_TUNING[sIdx]);
          const noteIdx = (openNote + fret) % 12;
          const rootIdx = noteIndex(rootNote);
          const interval = (((noteIdx - rootIdx) % 12) + 12) % 12;
          const degree = intervalDegree(interval, form.quality);
          const isRoot = degree === "R";
          return (
            <g key={`n-${sIdx}`}>
              <circle
                cx={cx}
                cy={cy}
                r={12}
                fill={isRoot ? "#e6b800" : "#4ade80"}
                stroke={isRoot ? "#fff" : "#1a1a1d"}
                strokeWidth={isRoot ? 1.5 : 1}
              />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill={isRoot ? "#1a1a1d" : "#0b0b0c"}
                fontFamily="monospace"
              >
                {display === "degree"
                  ? degree
                  : noteName(noteIdx, useFlats)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
