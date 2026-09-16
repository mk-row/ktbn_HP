# メンバー画像 生成プロンプト集

チビ全身＋武器・小物のポップなメンバー画像を PixAI で生成するためのプロンプト集。

出力先は `images/avatars/memberN.png`（`data/members.json` の `photo` フィールドが参照）。

---

## デザイン方針

- **チビ全身（3頭身）** ＋ 各自を象徴する**武器・小物**
- **白背景**。背景をキャラに焼き込まないことで、後から HTML 側でチームカラーを自由に敷ける
- 太い黒アウトライン＋フラット塗り＋高彩度。この絵柄は **Bubble Pop | Style** LoRA が担う

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
| **Bubble Pop \| Style** | **0.8** | 絵柄の主導権。シアンの輪郭・高彩度・太い線はこれの効果 |
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
| Seed | **1 人目が決まったら固定して全員に使い回す** |

### 一貫性を出す手順

1. まず Kuni を回して絵柄を決める
2. その **seed をメモして固定**し、残りは「個別差分タグ」だけ差し替える
3. それでも揃わない場合は、1 人目の完成画像を **i2i（強度 0.4〜0.5）** のベースにする

---

## 共通スタイルブロック

全員の先頭に固定で入れる。

```
masterpiece, best quality, very aesthetic, absurdres, newest,
(1boy:1.2), solo, male focus,
(chibi:1.2), (chibi proportions:1.2), 3 heads tall, full body, standing,
looking at viewer, dynamic pose,
flat color, vivid saturated colors, high contrast,
gaming streetwear, layered outfit, colorful sneakers,
white background, simple background,
soft drop shadow, centered composition
```

### 意図的に入れていないタグ

`sticker style` / `die cut sticker` / `white outline border` / `bold thick black outlines` / `cel shading`

これらは **Bubble Pop | Style がすでに担当している**。プロンプトで重ねて指定すると輪郭が
潰れるため入れない。`flat color` だけは chibi_anime のソフトな塗りに対抗する目的で残している。

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
sign, holding sign, banner, placard, signboard, speech bubble,
falling petals, confetti, floating particles, flower petals,
bad hands, bad anatomy, extra fingers, missing fingers, extra limbs, extra arms,
text, letters, english text, garbled text, watermark, signature, logo, username,
multiple views, 2boys, cropped, out of frame,
background, scenery, detailed background, cluttered background
```

各ブロックの目的:

| ブロック | 目的 |
|---|---|
| `soft shading` 〜 `kawaii` | chibi_anime が持ち込む甘い絵柄を抑える |
| `1girl, female, long hair girl` | chibi_anime が女性寄りのため、男性キャラに固定する |
| `nsfw` 〜 `cleavage` | NSFW モデルを使うための保険 |
| `sign` 〜 `speech bubble` | chibi_anime のサンプルに看板が多く、文字が湧きやすい |
| `falling petals` 〜 `flower petals` | 同上。白背景を保つため |

---

## 個別差分タグ

共通スタイルブロックの `male focus,` の直後に挿入する。
チビ体型は小物が大きいほど映えるため、武器には `oversized` を付けられるものは付けている。

### 1. Kuni — 精神的支柱・冷静・リーダー

```
black hair, center parted hair, golden eyes, calm confident smile,
goalkeeper gloves, holding kebab wrap,
dark red bomber jacket, black cargo pants, dark wine red sneakers,
captain armband, one hand on hip, confident standing pose,
dark blood red color scheme, wine red accents,
```

- テーマカラー「血便カラー」は**ダークレッド／ワインレッド**として解釈。Shibao の鮮やかな赤と
  差別化するため、彩度を落とした暗い赤で固定する
- 腕章に文字が湧きやすい。出たらネガティブを `(letters:1.3)` に上げる

### 2. cokemaru. — ほめ上手・優しそう

```
light brown hair, soft drooping eyes, gentle warm smile,
holding oversized fishing rod over shoulder, slingshot tucked in belt,
blue fishing vest, white hoodie underneath, beige shorts, blue sneakers,
bucket hat, giving thumbs up, relaxed friendly pose,
bright blue color scheme, sky blue accents,
```

- 見た目の指定がなかったため、性格から**たれ目＋やわらかい茶髪**で構成
- 釣り竿を主武器、パチンコは腰に挿す配置。チビ体型で小物を両手に持たせると手が破綻するため

### 3. JJINN — 中二病・切り込み隊長

```
black hair, long bangs, sharp cyan eyes, smug grin, eyepatch,
dual wielding, black katana, glowing cyan katana, crossed swords pose,
all black outfit, black long coat, black gloves, black boots,
dramatic chuunibyou stance, cyan glowing effects,
black color scheme, cyan glow accents,
```

- 全身黒は白背景でシルエットが潰れるため、**シアンの発光**を差し色にして輪郭を立たせている
- 眼帯が不要なら `eyepatch` を削除

### 4. Kakizaki — やさしい・かっこいい・穏やか

```
white hair, calm gentle eyes, serene smile,
holding shuriken, throwing pose,
white ninja hoodie, white scarf, grey joggers, white sneakers,
relaxed ninja stance,
white and silver color scheme, light grey shadow accents,
```

- 白＋手裏剣の組み合わせから**現代風の忍者**に振っている
- 白背景に白衣装だと輪郭が埋もれるため、グレーを影色として必ず入れること

### 5. Nayamei — かっこいい

```
dark skin, short curly black hair, green eyes, cool confident smirk,
holding glowing blue spellbook, blue magic particles,
green and yellow flag cape with blue circle,
green and yellow tracksuit jacket, black pants, green sneakers,
green and yellow color scheme,
```

- ブラジル国旗は `brazilian flag` と書くと**中央の文字と星が確実に崩れる**ため、
  最初から形で指定する書き方にしている
- 国旗としてはっきり認識させたい場合は `brazilian flag cape` に戻せるが、文字化けは避けられない。
  完璧を狙うならその部分だけ後から手で描き足すのが早い

### 6. Reo — 男が惚れる男・人情熱い

```
blond hair, swept back hair, warm brown eyes, big hearty grin,
hugging oversized plush loch ness monster doll,
yellow varsity jacket, white t-shirt, denim pants, yellow sneakers,
open hearted pose,
bright yellow color scheme, golden accents,
```

- ネッシーが出ない場合のフォールバック: `green plush dinosaur doll, long neck`

### 7. Rowmine — ムードメーカー・すかしてる

```
purple hair, half-closed eyes, teasing smirk, head tilt,
holding oversized sniper rifle over shoulder,
purple hooded jacket, black tactical pants, purple sneakers,
peace sign, laid back pose,
purple color scheme, violet accents,
```

- 「すかしてる」感は `half-closed eyes` ＋ `teasing smirk` ＋ `head tilt` の 3 点セットで出る

### 8. Shibao feat.借金的帝王 — すぐキレる・思い切りがいい

```
bright red spiky hair, fierce red eyes, angry shouting expression, fang,
explorer goggles on forehead, holding handgun,
red explorer jacket, brown leather belt, khaki cargo shorts, red boots,
aggressive pose, leaning forward,
bright red color scheme, orange accents,
```

- 1 人だけ怒り顔にすることで、並べたときのアクセントになる
- ゴーグルは額に乗せる配置にして顔を隠さないようにしている

---

## そのまま貼れる完成形（Kuni／1 人目テスト用）

```
masterpiece, best quality, very aesthetic, absurdres, newest,
(1boy:1.2), solo, male focus,
black hair, center parted hair, golden eyes, calm confident smile,
goalkeeper gloves, holding kebab wrap,
dark red bomber jacket, black cargo pants, dark wine red sneakers,
captain armband, one hand on hip, confident standing pose,
dark blood red color scheme, wine red accents,
(chibi:1.2), (chibi proportions:1.2), 3 heads tall, full body, standing,
looking at viewer, dynamic pose,
flat color, vivid saturated colors, high contrast,
gaming streetwear, layered outfit, colorful sneakers,
white background, simple background,
soft drop shadow, centered composition
```

---

## テーマカラーの配分

| 暗赤 | 青 | 黒+シアン | 白 | 緑 | 黄 | 紫 | 赤 |
|---|---|---|---|---|---|---|---|
| Kuni | cokemaru. | JJINN | Kakizaki | Nayamei | Reo | Rowmine | Shibao |

被りなし。並べたときに色が均等に散る配分になっている。
メンバー追加時はこの表を見て未使用の色を割り当てること。

---

## 出力を見てからの調整表

| 症状 | 対処 |
|---|---|
| 頭身が縮まらない | chibi_anime を 0.45 → 0.6 |
| 塗りが柔らかい／線が細い | chibi_anime を 0.45 → 0.35、`flat color` を `(flat color:1.2)` |
| シアンの輪郭が消えた | Bubble Pop を 0.8 → 0.9 |
| 顔が女寄りになる | `(1boy:1.4), (male focus:1.2)` に強める |
| 看板・吹き出しが湧く | ネガティブを `(sign:1.4), (holding sign:1.4)` |
| 白背景が灰色／模様が入る | `(white background:1.3), pure white background` |
| 手足が崩れる | アップスケール強度を上げる。それでもダメなら `(perfect hands:1.1)` |
| 武器が消える／2 つ出ない | 主武器だけ持たせ、もう一方は `tucked in belt` `on back` で装備扱いにする |
| 背景に物が湧く | ネガティブに `(detailed background:1.4)` を追加 |

---

## 生成後：カード枠に合わせる

832 × 1216（2:3）はカード枠の 3:4 より縦長なため、そのまま配置すると
`object-fit: cover` で**上下が切れる**（＝チビの足元と頭が飛ぶ）。
左右に余白を足して 3:4 に整えてから配置する。

```bash
# 1 枚ずつ
magick member1.png -gravity center -background none -extent 912x1216 member1_card.png

# 8 人分まとめて
for i in $(seq 1 8); do
  magick member$i.png -gravity center -background none -extent 912x1216 images/avatars/member$i.png
done
```

> **Kuni だけ注意**: リーダーはキャプテンカード枠に入り、そこだけ `aspect-ratio: 5/4`（横長）
> になる。3:4 に整えた画像がさらに上下トリミングされるので、**頭上と足元の余白を多めに取った
> 構図**で生成しておくこと。

---

## メンバーを追加するとき

1. 「テーマカラーの配分」表を見て、未使用の色を割り当てる
2. 上の書式で個別差分タグを作る（髪型・髪色・目の色・武器/小物・服・ポーズ・カラースキーム）
3. 共通スタイルブロック＋固定 seed で 832 × 1216 で生成
4. 白背景を切り抜き、912 × 1216 にパディングして `images/avatars/memberN.png` に配置
5. `data/members.json` にエントリを追加（`photo` パスを忘れずに）
6. 新しいゲームタイトルを `games` に入れる場合、`js/render.js` の `GENRES` にも追加しないと
   ジャンル絞り込みに出ない

---

## サイト側の未対応事項

画像が揃ったら以下の対応が必要:

- `css/components.css` の `.player__art` に `filter: grayscale(.35) contrast(1.05)` がかかっており、
  **ビビッドな色がくすむ**（現状はホバー時のみ色が戻る）。ポップ路線なら外す
- `.player__frame::before` の下部グラデーションが濃く、**全身チビの足元が黒く潰れる**。
  グラデーションの開始位置を下げる必要がある
- 白背景のまま配置すると暗いカード上で浮くため、**背景を透過 PNG で書き出す**か、
  カード側にチームカラーの下地を敷く

---

## 注意

- **肖像権**: 実在メンバーをモデルにする場合は、非商用であっても本人の同意を取ること
- **商用利用**: 現在 `shop.html` は DEMO 表示（購入機能なし）のため非商用。物販・広告・スポンサーを
  入れる場合は、使用するモデル・LoRA と PixAI の利用規約で商用可否を確認すること
- **モデル／LoRA のライセンス**: WAI-NSFW-illustrious-SDXL、Bubble Pop | Style、XL - chibi_anime は
  それぞれ配布元ごとに商用可否が異なるため、使う前に各モデルページで確認すること
