# メンバー画像 生成プロンプト集

チビ全身＋武器・小物のメンバー画像を PixAI で生成するためのプロンプト集。

出力先は `images/avatars/memberN.png`（`data/members.json` の `photo` フィールドが参照）。

---

## デザイン方針

- **チビ全身（3頭身）** ＋ 各自を象徴する**武器・装備**
- **黒背景＋ネオン発光**。サイトが黒基調（カード下部に `rgba(7,7,7,.92)` のグラデ）のため、
  暗い画像のほうが馴染む。実際、黒背景で生成した JJINN が最も良い仕上がりだった
- キャラの識別は**服の色ではなく発光色**で行う（後述）

### 発光色の割り当て

新しいキャラ設定では服の色が被る（黒系 3 人、緑 2 人、赤系 3 人）。
黒背景では服の色が沈むため、**ネオンの発光色を 8 人すべて別にして識別性を確保する**。

| メンバー | 発光色 | 根拠 |
|---|---|---|
| Kuni | 深紅／ワインレッド | テーマカラー（血便カラー） |
| Cokemaru | アイスブルー | テーマカラー青。照準の赤は一点アクセント |
| JJINN | シアン | 完成済みの基準画像 |
| Kakizaki | ライムグリーン | 装甲の発光ライン（設定通り） |
| Nayamei | イエロー | 緑は Kakizaki に譲り、ブラジルの黄を主にする |
| Reo | パープル／マゼンタ | 服が無彩色のため発光で差別化 |
| Rowmine | ゴールド | 白＋ゴールド基調 |
| Shibao | オレンジレッド | 炎のモチーフ |

メンバー追加時はこの表を見て未使用の発光色を割り当てること。

---

## 環境

### モデル

| 項目 | 値 |
|---|---|
| サービス | [PixAI.art](https://pixai.art/) |
| モデル | **WAI-NSFW-illustrious-SDXL v14.0** |

Illustrious-XL ベースのため、以下の Danbooru タグ形式のプロンプトがそのまま効く。
名称に NSFW と入るが汎用のアニメモデルで、SFW も問題なく出る（ネガティブに保険は入れてある）。

### LoRA

| LoRA | 強度 | 役割 |
|---|---|---|
| **Bubble Pop \| Style** | **0.8** | 絵柄の主導権。太い線・高彩度・発光表現はこれの効果 |
| **XL - chibi_anime** | **0.45** | 頭身だけ借りる |

> **chibi_anime を上げすぎないこと。** このLoRAは「柔らかい塗り・細い線・淡い色」の
> かわいい系絵柄を持ち込むため、強度を上げると Bubble Pop のポップさを打ち消す。
> 0.4〜0.5 から始めて、頭身が足りないときだけ 0.6 まで上げる。
> 2枚の合計が 1.5 を超えると絵柄が崩れる。

### 生成設定

| 項目 | 値 |
|---|---|
| サイズ | **832 × 1216**（SDXL 公式推奨のポートレート） |
| Steps | 30 |
| CFG Scale | 5.5 |
| Sampler | Euler a |
| アップスケール | **ON** — チビ全身は顔も手も小さくなり破綻しやすいため必須 |
| **基準 seed** | **`6020238319554270`**（JJINN の基準画像のもの） |

**この設定は全員で 1 ミリも変えないこと。** バラつきの最大要因は seed ではなく、
生成設定と共通ブロックの揺れ。共通スタイルブロックは手打ちせずコピペする。

### seed について

seed は「初期ノイズの乱数」でしかなく、**プロンプトが違えば同じ seed でも別の絵が出る**。
絵柄を決めているのは主にモデルと LoRA なので、seed の寄与は大きくない。

| 一貫性への影響 | |
|---|---|
| モデル + LoRA + 強度 | ★★★★★ |
| プロンプトの共通部分 | ★★★★☆ |
| 生成設定（CFG/Steps/Sampler/解像度） | ★★★☆☆ |
| seed | ★★☆☆☆ |

seed を揃えると構図・ポーズ・カメラ距離が似る副次効果があるので、基準 seed
`6020238319554270` を全員に使い回すこと自体は損がない。ただしそれだけで揃うとは期待しないこと。

この seed は**基準画像である JJINN を生成したときのもの**。同じ seed に JJINN の
プロンプトと上記の生成設定を組み合わせれば、基準画像をいつでも再現できる。
絵柄が迷走したときはここに戻ること。

どうしても浮く個体は、**基準画像を i2i（強度 0.5）のベースにして流し直す**のが最終手段。
ただしポーズまで引き継ぐため乱用しない。

---

## 共通スタイルブロック

全員の先頭に固定で入れる。

```
masterpiece, best quality, very aesthetic, absurdres, newest,
(1boy:1.2), solo, male focus,
(chibi:1.2), (chibi proportions:1.2), 3 heads tall,
full body, entire body visible, head to toe, full figure, standing,
looking at viewer, dynamic pose,
flat color, vivid saturated colors, high contrast,
neon glow, rim light, glowing outline,
(black background:1.3), (simple background:1.3), dark background,
centered composition
```

### 意図的に入れていないタグ

- `sticker style` / `die cut sticker` / `white outline border` / `bold thick black outlines` / `cel shading`
  → **Bubble Pop | Style がすでに担当している**。重ねて指定すると輪郭が潰れる
- `〜 color scheme` / `〜 accents`
  → **背景まで支配して黒背景指定に競り勝ってしまう**。服・髪・小物の色は個別に指定済みなので不要。
  実際にこのタグが原因で背景が不揃いになった経緯がある
- `all black outfit` の `all`
  → 画面全体に効いてしまう。`black long coat` のように部位で指定する

---

## ネガティブプロンプト

全員共通。

```
lowres, worst quality, low quality, jpeg artifacts, blurry, sketch, unfinished,
realistic, photorealistic, 3d render, photo,
realistic proportions, adult proportions, 8 heads tall, tall, long legs,
soft shading, thin lineart, pastel colors, muted colors, desaturated, blush stickers, moe, kawaii,
1girl, female, long hair girl,
nsfw, nude, revealing clothes, cleavage,
white background, bright background, colored background, gradient background,
sign, holding sign, banner, placard, signboard, speech bubble,
sparkle, sparkles, star (symbol), glitter, twinkle, falling petals, confetti,
bad hands, bad anatomy, extra fingers, missing fingers, extra limbs, extra arms,
text, letters, english text, garbled text, watermark, signature, logo, username,
multiple views, 2boys, multiple boys, mascot character, cropped, out of frame,
scenery, detailed background, cluttered background
```

各ブロックの目的:

| ブロック | 目的 |
|---|---|
| `soft shading` 〜 `kawaii` | chibi_anime が持ち込む甘い絵柄を抑える |
| `1girl, female, long hair girl` | chibi_anime が女性寄りのため、男性キャラに固定する |
| `nsfw` 〜 `cleavage` | NSFW モデルを使うための保険 |
| `white background` 〜 `gradient background` | 黒背景を保つ |
| `sign` 〜 `speech bubble` | chibi_anime は看板を出しやすく、文字が湧く |
| `sparkle` 〜 `confetti` | Bubble Pop が出す星のキラキラを消す |
| `mascot character` | 隅に小さいキャラが湧くのを防ぐ |

> **注意**: `sparkle` を強く効かせると、JJINN の `cyan glowing effects` や
> Nayamei の発光演出も一緒に消えることがある。「発光」と「キラキラ粒子」は
> 別の言葉で書き分けること（`glowing aura` は残り、`sparkle` は消える）。

---

## 個別差分タグ

共通スタイルブロックの `male focus,` の直後に挿入する。

### 1. Kuni — 精神的支柱・冷静・リーダー

```
black hair, center parted hair, forehead partly visible, sharp golden eyes,
smug confident grin, cocky smile, unshakable aura,
dark crimson long coat, black inner shirt, black tapered pants, dark red sneakers,
resting heavy machine gun on shoulder, belt fed LMG, oversized dark red machine gun,
ammo belt hanging, dark red goalkeeper gloves hanging from belt,
standing still, feet planted firmly, one foot resting on a soccer ball,
looking at viewer, calm commanding presence, leader aura,
full body with margin, space above head and below feet,
deep crimson neon glow, wine red rim light,
```

- 他の 7 人が全員動いているポーズなので、**Kuni だけ動かない**ことで格を出す。
  `standing still, feet planted firmly` は削らないこと
- **LMG を肩に担ぐ**のが主役。「重い銃を軽々」で余裕とドヤ顔が両立する。
  `ammo belt hanging` の垂れた弾帯が縦のラインを作り、チビ体型に情報量を足す
- キーパー設定は**足元のボールと腰に下げたグローブ**で表現する。手を銃に専念させるため、
  グローブは装備扱いに降格している
- ロングコートは 8 人で Kuni だけ。黒背景でシルエットが伸びて大きく見える
- 「血便カラー」は**ダークレッド／ワインレッド**として解釈。Shibao の鮮やかな赤と差別化するため
  彩度を落とした暗い赤で固定する
- **`full body with margin, space above head and below feet` は Kuni 専用**。
  リーダーはキャプテンカード枠（`aspect-ratio: 5/4` の横長）に入り、
  3:4 に整えた画像がさらに上下トリミングされるため、余白を多めに取る必要がある
- 腕章は廃止。文字が湧くうえ、肩に担いだ腕で隠れるため
- ケバブも廃止。手が塞がって LMG と両立しないため（要素は 3 つまでが鉄則）

### 2. Cokemaru — 静かな精密狙撃手

```
black hair, long bangs covering one eye, sharp emotionless eye,
monocle targeting device over one eye, thin red targeting line,
charcoal grey long tech coat, side slit on one side, tight black innerwear,
forearms exposed, fingerless gloves, reinforced draw hand,
holding matte black precision slingshot, steel ball holders inside coat,
minimal decoration, small Y shaped emblem on chest,
slim tight silhouette, quiet precise standing pose,
ice blue neon glow, thin red accent light,
```

- 設定: 無駄のないタイトなシルエット。装飾は最小限で「削ぎ落とした鋭さ」を見た目で語る
- 前腕を出すのは引き手の精密さを見せるため。`forearms exposed` は必ず残す
- 胸の Y 字エンブレムは文字ではなく記号なので比較的崩れにくいが、
  崩れたら `small emblem on chest` に落とす
- 照準ラインの赤は**一点だけ**。増やすと発光色のアイスブルーと喧嘩する

### 3. JJINN — 中二病・切り込み隊長 ／ **基準画像**

```
black hair, long bangs, sharp cyan eyes, smug grin, eyepatch,
dual wielding, black katana, glowing cyan katana, crossed swords pose,
black long coat, black gloves, black boots,
dramatic chuunibyou stance, cyan glowing effects,
cyan neon glow, cyan rim light,
```

- **この 8 人で最も良く出た個体。絵柄・頭身・発光の基準はこれに合わせる**
- 黒背景に黒衣装でシルエットが潰れないよう、**シアンの発光**が輪郭を担っている
- 旧版の `all black outfit` は画面全体を黒く塗る副作用があったため `black long coat` に変更済み

### 4. Kakizaki — サイボーグ忍者

```
cyborg ninja, mechanical body, slim green armored body, armor plating,
silver full face visor, faceless masked helmet, no visible face,
glowing lime green LED lines running from head down the back,
katana and wakizashi sheathed on back, holding shuriken,
japanese motif fused with sci-fi mecha design,
green and grey silver color, sleek slim armor,
ready ninja stance,
lime green neon glow, silver rim light,
```

- 設定: 人間だった体を機械化改造されたサイボーグ忍者。和のモチーフと SF メカの融合
- **緑の発光ラインが頭部から背中に走るのがトレードマーク**。ここは最優先で出す
- 顔はシルバーのフェイスバイザーで完全に覆われる。モデルは顔を描こうとするので、
  出てしまったら `(full face visor:1.3), (faceless:1.2)` に強める
- 背中に日本刀（龍刀）と脇差の 2 本。チビ体型だと背中の得物は潰れやすいので、
  出なければ `two swords on back` に簡略化する

### 5. Nayamei — 陽気なブラジル系フロントライナー

```
dark skin, curly dark brown hair, two block haircut,
bright cheerful smile, friendly confident eyes,
sunglasses resting on forehead, single face paint stripe on cheek,
sleeveless tech jersey, tactical vest, bare arms,
sports jersey with number 11,
holding assault rifle with green and yellow custom paint, sling strap,
fingerless gloves, wristband, high top sneakers,
lively energetic pose,
yellow neon glow, green rim light,
```

- 設定: 陽気なムードメーカー。ブラジル感は**国旗そのものではなくサッカー文化で表現する**
- **`brazilian flag` は使わない**。中央の文字と星が確実に崩れるうえ、ネガティブの `text` と
  正面衝突する。ジャージのナンバリングと緑＋黄の配色で十分伝わる
- 背番号 11 もテキスト扱いなので崩れるか消える可能性が高い。消えても問題ない要素として扱う
- 星＋弧のエンブレムは、崩れるリスクが高いので**プロンプトには入れず後から重ねる**

### 6. Reo — 知的で冷酷

```
black hair, swept back hair, forehead fully exposed,
cross mark on forehead, narrow calm eyes, cold intellectual expression,
black long coat, fur trimmed collar, fur trimmed cuffs, heavy coat,
necklace, earrings, silver accessories,
holding open grimoire in one hand, glowing purple magic book, ancient tome,
other hand raised, glowing purple runes floating around raised hand,
purple light from the pages, calm composed standing pose,
purple neon glow, magenta rim light,
```

- 設定: 前髪を上げておでこを出し、**額の中央に十字架のマーク**。落ち着いた無彩色でまとめる
- 額の十字が最重要の識別要素。出なければ `(cross mark on forehead:1.3)` に強める
- 毛皮あしらいの重厚なコートは `fur trimmed collar` が効きやすい
- **魔導書は片手持ち、もう片方の手を掲げてルーンを光らせる**。両手とも仕事をさせることで
  「何もしていない感」を消す
- 額の十字＋魔導書でエクソシスト寄りにまとまり、「知的で冷酷」と噛み合う
- 8 人で唯一、**発光に光源の必然性がある**（本のページとルーンが光る）。
  他の 7 人はリムライトだけなので、これ自体が差別化になる
- `magic circle` は入れないこと。背景に巨大な魔法陣が湧いて `simple background` と衝突する。
  `glowing runes` に留める
- 無彩色の衣装なので、黒背景では**パープルの発光だけが識別の手がかり**になる。
  発光を弱くしすぎないこと

### 7. Rowmine — 華のあるエーススナイパー

```
bright blond hair, swept bangs, face fully visible,
inner hair color streak, red eyes, glowing red pupils,
sharp upturned eyes, provocative smirk, handsome face,
gaming earphones, glowing LED earphones, neckband headset,
white and gold tech wear, tight jacket, one sleeve rolled up,
fingerless gloves,
holding long sniper rifle, white and gold custom paint, glowing scope,
confident relaxed standing pose,
gold neon glow, red accent light,
```

- 設定: 実力を隠さない「見せる」タイプ。ややアイドル寄りのキメたシルエット
- **前髪を流して顔を出す**のが自信の表れ。`face fully visible` は残す
  （Cokemaru の片目隠れと対になる要素）
- 光るゲーミングイヤホンが「音を支配してる」感を出すキーアイテム
- 8 人で唯一の**明るい基調**（白＋ゴールド）。黒背景で最も映えるので、
  他が沈んで見えるときの基準にできる
- 構えは片膝をつかず立ち撃ちで余裕を見せる

### 8. Shibao feat.借金的帝王 — 熱血・沸点低い

```
spiky flaming red hair, upswept messy spiky hair, orange gradient hair tips,
sharp upturned angry eyes, fierce grin, fang, thick eyebrows,
bandage on cheek,
street military outfit, jacket hanging off one shoulder, rolled up sleeves,
red and black outfit, flame pattern, lightning motif, skull studs,
black tank top innerwear, wristband, fingerless gloves,
holding compact SMG, red and black custom paint, flame stickers,
hip fire pose, leaning forward, aggressive charging stance,
orange red neon glow, orange rim light,
```

- 設定: 前のめりで攻撃的、常に動いてる躍動シルエット。肩をいからせたけんか腰の立ち姿
- **毛先だけオレンジのグラデ**が炎感の要。`orange gradient hair tips` は必ず残す
- 頬の絆創膏と八重歯が「やんちゃだけど憎めない」を作るパーツ。削らないこと
- ジャケットを片方だけ肩に引っかける荒さが性格を語る。`jacket hanging off one shoulder`
- 8 人で唯一の怒り顔。並べたときのアクセントになる
- 番号 07 の燃える書体はテキストなので**プロンプトには入れない**。必要なら後から重ねる

---

## そのまま貼れる完成形（JJINN／基準画像の再現用）

seed `6020238319554270` ＋ 上記の生成設定と組み合わせること。

```
masterpiece, best quality, very aesthetic, absurdres, newest,
(1boy:1.2), solo, male focus,
black hair, long bangs, sharp cyan eyes, smug grin, eyepatch,
dual wielding, black katana, glowing cyan katana, crossed swords pose,
black long coat, black gloves, black boots,
dramatic chuunibyou stance, cyan glowing effects,
cyan neon glow, cyan rim light,
(chibi:1.2), (chibi proportions:1.2), 3 heads tall,
full body, entire body visible, head to toe, full figure, standing,
looking at viewer, dynamic pose,
flat color, vivid saturated colors, high contrast,
neon glow, rim light, glowing outline,
(black background:1.3), (simple background:1.3), dark background,
centered composition
```

---

## 出力を見てからの調整表

| 症状 | 対処 |
|---|---|
| 頭身が縮まらない | chibi_anime を 0.45 → 0.6 |
| 塗りが柔らかい／線が細い | chibi_anime を 0.45 → 0.35、`flat color` を `(flat color:1.2)` |
| 発光が弱い／輪郭が沈む | Bubble Pop を 0.8 → 0.9、`(neon glow:1.2), (rim light:1.2)` |
| 背景が白や単色になる | `(black background:1.5)`、ネガティブを `(white background:1.4)` |
| 顔が女寄りになる | `(1boy:1.4), (male focus:1.2)` に強める |
| 看板・吹き出しが湧く | ネガティブを `(sign:1.4), (holding sign:1.4)` |
| 星のキラキラが出る | ネガティブを `(sparkle:1.4), (sparkles:1.4)` |
| 隅に小さいキャラが湧く | `(solo:1.3)`、ネガティブに `(mascot character:1.3)` |
| 手足が崩れる | アップスケール強度を上げる。それでもダメなら `(perfect hands:1.1)` |
| 武器が消える／2 つ出ない | 主武器だけ持たせ、もう一方は `on back` `tucked in belt` で装備扱いにする |
| 引き／寄りがバラつく | `full body, entire body visible, head to toe` が消えていないか確認 |

---

## 生成後：カード枠に合わせる

832 × 1216（2:3）はカード枠の 3:4 より縦長なため、そのまま配置すると
`object-fit: cover` で**上下が切れる**（＝チビの足元と頭が飛ぶ）。
左右に黒の余白を足して 3:4 に整えてから配置する。

```bash
# 1 枚ずつ
magick member3.png -gravity center -background black -extent 912x1216 member3_card.png

# 8 人分まとめて
for i in $(seq 1 8); do
  magick member$i.png -gravity center -background black -extent 912x1216 images/avatars/member$i.png
done
```

> **黒背景の副次的なメリット**: 切り抜きが不要になる。そのままカードに貼れるため、
> 発光している髪の縁を透過処理する手間が消える。

> **Kuni だけ注意**: リーダーはキャプテンカード枠に入り、そこだけ `aspect-ratio: 5/4`（横長）
> になる。3:4 に整えた画像がさらに上下トリミングされるので、**頭上と足元の余白を多めに取った
> 構図**で生成しておくこと。

---

## メンバーを追加するとき

1. 「発光色の割り当て」表を見て、未使用の発光色を割り当てる
2. 上の書式で個別差分タグを作る
   （髪型・髪色・目・顔の特徴 → 服 → 武器/装備 → ポーズ → 発光色）
3. 共通スタイルブロック＋基準 seed で 832 × 1216 で生成
4. 912 × 1216 に黒でパディングして `images/avatars/memberN.png` に配置
5. `data/members.json` にエントリを追加（`photo` パスを忘れずに）
6. 新しいゲームタイトルを `games` に入れる場合、`js/render.js` の `GENRES` にも追加しないと
   ジャンル絞り込みに出ない

### 特徴の伝え方のコツ

JJINN が最も良く出たのは、**設定の解像度が高かったから**。キャラを立てるには
以下の粒度で決めておくと、そのままタグに落とせる。

- 全体シルエット（タイト／躍動／重厚 など）
- 頭・顔（髪型・髪色・目つき・顔の一点特徴）
- 服装（上／インナー／小物・装飾）
- 武器・手元（主武器・持ち方・グローブ）
- 発光色・記号
- 立ち姿に出る性格

**文字・数字・国旗・エンブレムは画像生成では必ず崩れる**ため、プロンプトに入れず
後から重ねる前提で設計すること。

---

## サイト側の未対応事項

画像が揃ったら以下の対応が必要:

- `css/components.css` の `.player__art` に `filter: grayscale(.35) contrast(1.05)` がかかっており、
  **ネオンの発色がくすむ**（現状はホバー時のみ色が戻る）。この路線なら外す
- `.player__frame::before` の下部グラデーションが濃く、**全身チビの足元が黒く潰れる**。
  黒背景の画像とは馴染むが、足元の情報量は失われるためグラデーションの開始位置を下げる

---

## 注意

- **肖像権**: 実在メンバーをモデルにする場合は、非商用であっても本人の同意を取ること
- **商用利用**: 現在 `shop.html` は DEMO 表示（購入機能なし）のため非商用。物販・広告・スポンサーを
  入れる場合は、使用するモデル・LoRA と PixAI の利用規約で商用可否を確認すること
- **モデル／LoRA のライセンス**: WAI-NSFW-illustrious-SDXL、Bubble Pop | Style、XL - chibi_anime は
  それぞれ配布元ごとに商用可否が異なるため、使う前に各モデルページで確認すること
