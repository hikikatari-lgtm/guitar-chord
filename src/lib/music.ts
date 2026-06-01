// 音楽理論ユーティリティ：音名・度数・スタンダードチューニング

export const NOTES_SHARP = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
] as const;

export const NOTES_FLAT = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
] as const;

// 標準チューニング 6→1 弦（index 0 = 6弦 low E, index 5 = 1弦 high E）
export const STANDARD_TUNING = ["E", "A", "D", "G", "B", "E"] as const;

export function noteIndex(name: string): number {
  const s = NOTES_SHARP.indexOf(name as (typeof NOTES_SHARP)[number]);
  if (s >= 0) return s;
  const f = NOTES_FLAT.indexOf(name as (typeof NOTES_FLAT)[number]);
  if (f >= 0) return f;
  return 0;
}

export function noteName(idx: number, preferFlat = false): string {
  const i = ((idx % 12) + 12) % 12;
  return preferFlat ? NOTES_FLAT[i] : NOTES_SHARP[i];
}

const FLAT_ROOTS = new Set(["F", "Bb", "Eb", "Ab", "Db", "Gb"]);
export function preferFlat(root: string): boolean {
  return FLAT_ROOTS.has(root);
}

// 表記揺れを抑えるための表示用ルート一覧（フラット系をデフォルト）
export const ALL_ROOTS = [
  "C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B",
] as const;

// ─── コードクオリティ ──────────────────────────────
export type ChordQuality = "maj" | "min" | "maj7" | "7" | "m7" | "dim7" | "m7b5";

export const QUALITIES: ChordQuality[] = [
  "maj", "min", "maj7", "7", "m7", "dim7", "m7b5",
];

export const QUALITY_LABEL: Record<ChordQuality, string> = {
  maj: "メジャー",
  min: "マイナー",
  maj7: "M7",
  "7": "7",
  m7: "m7",
  dim7: "dim7",
  m7b5: "m7(♭5)",
};

// "Cm7", "F#dim7" のようなコードシンボルを作るための接尾辞
export const QUALITY_SUFFIX: Record<ChordQuality, string> = {
  maj: "",
  min: "m",
  maj7: "M7",
  "7": "7",
  m7: "m7",
  dim7: "dim7",
  m7b5: "m7(♭5)",
};

// 半音差（0..11）をコードクオリティの度数表記に変換
export function intervalDegree(semitones: number, quality: ChordQuality): string {
  const s = ((semitones % 12) + 12) % 12;
  switch (s) {
    case 0: return "R";
    case 3: return "♭3";
    case 4: return "3";
    case 6: return "♭5";
    case 7: return "5";
    case 9: return quality === "dim7" ? "♭♭7" : "6";
    case 10: return "♭7";
    case 11: return "7";
    default: return String(s);
  }
}
