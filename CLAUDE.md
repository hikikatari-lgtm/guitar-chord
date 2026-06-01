# Guitar-chord

ギタリストのコードアイデアをフレットボード上で「形」と「度数」で見るアプリ。
6弦ルート / 5弦ルートそれぞれにベーシックな7種類（maj, min, M7, 7, m7, dim7, m7♭5）を
登録し、ルート音を切り替えるとフォームがそのフレット位置に移動して各音に度数ラベルを付ける。

## 技術スタック
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Vercel デプロイ（GitHub連携、mainにpushで自動デプロイ）

## プロジェクト構成
```
src/
  app/
    layout.tsx            # ルートレイアウト
    page.tsx              # メインページ（全UI／クライアントコンポーネント）
  components/
    Fretboard.tsx         # SVGフレットボード（ルートフレットに自動配置、度数/音名トグル）
  data/
    chord-forms.ts        # 14フォームのデータ（ここを編集すれば即反映）
  lib/
    music.ts              # 音名・度数・スタンダードチューニング
```

## コードフォームの追加・編集

`src/data/chord-forms.ts` を編集する。各フォームは:

```ts
{
  stringRoot: 6,                 // 6 か 5
  quality: "maj",                // "maj"|"min"|"maj7"|"7"|"m7"|"dim7"|"m7b5"
  voicing: [0, 2, 2, 1, 0, 0],   // 6弦→1弦の順。ルートフレットからのオフセット。"X" はミュート。
}
```

- `voicing` の index: `[6弦, 5弦, 4弦, 3弦, 2弦, 1弦]`（低音→高音）
- 値 0 はルートフレットそのもの、2 はルートフレット +2、`"X"` はそのままミュート
- 負の値（例 `-1`）も可。ただし最低押弦フレットが 0 にならないよう、`Fretboard` 側でオクターブ自動シフトされる
- 度数は `voicing` と `quality` から自動計算（`src/lib/music.ts:intervalDegree`）

## デプロイ
`git push origin main` で Vercel が自動デプロイ。

## 関連プロジェクト
- chord-lab: https://chord-lab-ten.vercel.app （コード進行＋ジャズ／ブルース）
- key-lab: https://key-lab-kappa.vercel.app （ピアノ・バッキング＋スケール）
- fret-lab: ギターのスケール可視化（兄弟プロジェクト）

@AGENTS.md
