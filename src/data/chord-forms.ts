// 6弦ルート / 5弦ルートのコードフォーム（各7種類）
// voicing は低音弦 → 高音弦の順：[6弦, 5弦, 4弦, 3弦, 2弦, 1弦]
// 各値はルートフレットからのオフセット。"X" はミュート。

import type { ChordQuality } from "@/lib/music";

export type FretOffset = number | "X";

export interface ChordForm {
  stringRoot: 6 | 5;
  quality: ChordQuality;
  voicing: [FretOffset, FretOffset, FretOffset, FretOffset, FretOffset, FretOffset];
}

export const FORMS: ChordForm[] = [
  // ── 6弦ルート ───────────────────────────────
  { stringRoot: 6, quality: "maj",  voicing: [0, 2, 2, 1, 0, 0] }, // E-shape
  { stringRoot: 6, quality: "min",  voicing: [0, 2, 2, 0, 0, 0] }, // Em-shape
  { stringRoot: 6, quality: "maj7", voicing: [0, "X", 1, 1, 0, "X"] }, // R-7-3-5 シェル
  { stringRoot: 6, quality: "7",    voicing: [0, 2, 0, 1, 0, 0] }, // E7-shape
  { stringRoot: 6, quality: "m7",   voicing: [0, "X", 0, 0, 0, 0] }, // R-X-♭7-♭3-5-R（5弦ミュート）
  { stringRoot: 6, quality: "dim7", voicing: [0, "X", -1, 0, -1, "X"] }, // R-X-♭♭7-♭3-♭5-X
  { stringRoot: 6, quality: "m7b5", voicing: [0, "X", 0, 0, -1, "X"] }, // R-X-♭7-♭3-♭5-X
  // ── 5弦ルート ───────────────────────────────
  { stringRoot: 5, quality: "maj",  voicing: ["X", 0, 2, 2, 2, 0] }, // A-shape
  { stringRoot: 5, quality: "min",  voicing: ["X", 0, 2, 2, 1, 0] }, // Am-shape
  { stringRoot: 5, quality: "maj7", voicing: ["X", 0, 2, 1, 2, 0] }, // R-5-7-3-5 フル5音（1弦まで）
  { stringRoot: 5, quality: "7",    voicing: ["X", 0, 2, 0, 2, 0] }, // A7-shape
  { stringRoot: 5, quality: "m7",   voicing: ["X", 0, 2, 0, 1, 0] }, // Am7-shape
  { stringRoot: 5, quality: "dim7", voicing: ["X", 0, 1, -1, 1, "X"] }, // R-♭5-♭♭7-♭3
  { stringRoot: 5, quality: "m7b5", voicing: ["X", 0, 1, 0, 1, "X"] }, // R-♭5-♭7-♭3
];

export function findForm(stringRoot: 6 | 5, quality: ChordQuality): ChordForm | undefined {
  return FORMS.find((f) => f.stringRoot === stringRoot && f.quality === quality);
}
