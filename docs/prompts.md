# メンバー画像 生成プロンプト集

ポップなキャライラスト風のメンバーアバターを PixAI で生成するためのプロンプト集。
出力先は `images/avatars/memberN.jpg`（`data/members.json` の `avatar` フィールドが参照）。

---

## 生成設定

| 項目 | 値 |
|---|---|
| サービス | [PixAI.art](https://pixai.art/) |
| モデル | Illustrious 系（PixAI 内で「Illustrious」検索）／代替: Animagine 系 |
| サイズ | 1024 × 1024（アバター用 1:1） |
| Steps | 28〜30 |
| CFG Scale | 5〜6（Illustrious 系は低めが正解） |
| Sampler | Euler a |
| Seed | **1 人目が決まったら固定して使い回す** |

### 一貫性を出す手順

1. まず 1 人目を回して絵柄を決める
2. その **seed をメモして固定**し、残りは「個別差分タグ」だけ差し替える
3. それでも揃わない場合は、1 人目の完成画像を **i2i（強度 0.4〜0.5）** のベースにする

---

## 共通スタイルブロック

全員の先頭に固定で入れる。ここが絵柄の統一を担う。

```
masterpiece, best quality, very aesthetic, absurdres, newest,
1boy, solo, upper body, bust shot, looking at viewer, confident smirk,
flat color, cel shading, bold thick outlines, clean lineart,
vivid saturated colors, high contrast, anime key visual,
esports team member portrait, gaming streetwear, black hoodie, gaming headset around neck,
simple background, bold two-tone geometric background, diagonal stripes,
rim light, dramatic lighting, slight low angle, centered composition
```

## ネガティブプロンプト

全員共通。

```
lowres, worst quality, low quality, jpeg artifacts, blurry, sketch, unfinished,
realistic, photorealistic, 3d render, photo,
soft shading, watercolor, muted colors, pastel colors, desaturated,
bad hands, bad anatomy, extra fingers, missing fingers, extra limbs,
text, watermark, signature, logo, username, artist name,
multiple views, 2boys, cropped head, out of frame,
busy background, cluttered background, detailed background, scenery
```

---

## 個別差分タグ

共通スタイルブロックの `1boy, solo,` の直後に挿入する。

| # | 名前 | ロール | 差分タグ |
|---|---|---|---|
| 1 | kuni | リーダー | `black short hair, golden eyes, captain armband, red and white background, crossed arms, leader aura` |
| 2 | DarkBlade | 副リーダー | `dark blue hair, glasses, blue eyes, calm expression, navy blue background, holding tablet` |
| 3 | CrimsonFang | メンバー | `spiky red hair, sharp red eyes, fanged grin, crimson background, sniper scope` |
| 4 | VoidStrike | メンバー | `white hair, undercut, purple eyes, tactical vest, purple background, serious expression` |
| 5 | BloodMoon | メンバー | `long black hair, red streaked hair, red eyes, dark red background, fantasy coat` |
| 6 | NightRaven | メンバー | `black wolf cut hair, feather earring, indigo background, hood up, mysterious smile` |
| 7 | IronClaw | メンバー | `muscular, buzz cut, orange eyes, fingerless gloves, clenched fist, orange background` |
| 8 | ScarletWolf | メンバー | `scarlet hair, wolf ears hood, pink background, energetic grin, splatter pattern` |
| 9 | PhantomEdge | メンバー | `silver hair, half-closed violet eyes, cool expression, violet background, chess piece` |
| 10 | GhostByte | メンバー | `green hair, round glasses, relaxed smile, lime green background, pixel blocks` |
| 11 | ToxicFlame | メンバー | `neon green hair, face mask, toxic green background, smoke effect, mischievous eyes` |
| 12 | AbyssKnight | メンバー | `long dark hair, black coat, grey blue background, stoic expression, ash particles` |
| 13 | SerialKiller_G | メンバー | `blond hair, baseball cap backwards, khaki background, military jacket, cocky grin` |
| 14 | ChaosReaper | メンバー | `short silver hair, balaclava around neck, black and red background, sharp glare` |

---

## 完成形の例（#2 DarkBlade）

```
masterpiece, best quality, very aesthetic, absurdres, newest,
1boy, solo, dark blue hair, glasses, blue eyes, calm expression, navy blue background, holding tablet,
upper body, bust shot, looking at viewer,
flat color, cel shading, bold thick outlines, clean lineart,
vivid saturated colors, high contrast, anime key visual,
esports team member portrait, gaming streetwear, black hoodie, gaming headset around neck,
simple background, bold two-tone geometric background, diagonal stripes,
rim light, dramatic lighting, slight low angle, centered composition
```

---

## 調整メモ

| やりたいこと | 対処 |
|---|---|
| もっとポップに | `pop art, bold flat shapes, comic style` を追加（`chibi` は入れない） |
| もっとクールに | `high contrast lighting, cinematic, dark tone` を追加し背景色を暗くする |
| 女性キャラにする | `1boy` → `1girl`、ネガティブの `2boys` → `2girls` |
| 背景が描き込まれすぎる | ネガティブに `(complex background:1.3)` を追加 |
| 絵柄が揃わない | seed 固定に加えて i2i（強度 0.4〜0.5）でベース画像に寄せる |

---

## メンバーを追加するとき

1. 上の「個別差分タグ」の表に行を足して、髪型・髪色・目の色・小物・背景色を他と被らないように決める
2. 共通スタイルブロック＋固定 seed で生成
3. 1024px 以上で書き出して `images/avatars/memberN.jpg` に配置
4. `data/members.json` に同じ `id` / `avatar` パスでエントリを追加

---

## 注意

- **肖像権**: 実在メンバーの顔を寄せる場合は、非商用であっても本人の同意を取ること
- **商用利用**: 現在 `shop.html` は DEMO 表示（購入機能なし）のため非商用。物販・広告・スポンサーを入れる場合は、使用するモデルと PixAI の利用規約で商用可否を確認すること
- **モデルのライセンス**: Illustrious 系などのモデルは配布元ごとに商用可否が異なるため、使う前にモデルページで確認すること
