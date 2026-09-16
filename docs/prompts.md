# メンバー画像 生成プロンプト集

チビ全身＋武器・小物のポップなステッカー調メンバー画像を PixAI で生成するためのプロンプト集。

出力先は `images/avatars/memberN.png`（`data/members.json` の `photo` フィールドが参照）。

---

## デザイン方針

- **チビ全身（3頭身）** ＋ 各自を象徴する**武器・小物**
- **白背景のステッカー調**（切り抜き想定）。背景をキャラに焼き込まないことで、後から HTML 側でチームカラーを自由に敷ける
- 太い黒アウトライン＋フラット塗り＋高彩度

---

## 生成設定

| 項目 | 値 |
|---|---|
| サービス | [PixAI.art](https://pixai.art/) |
| モデル | Illustrious 系（PixAI 内で「Illustrious」検索）／代替: Animagine 系 |
| サイズ | **768 × 1024（3:4）** — カード枠 `.player__frame { aspect-ratio: 3/4 }` に合わせた |
| Steps | 30 |
| CFG Scale | 5〜6（Illustrious 系は低めが正解） |
| Sampler | Euler a |
| Seed | **1 人目が決まったら固定して全員に使い回す** |

> **Kuni だけ注意**: リーダーはキャプテンカード枠に入り、そこだけ `aspect-ratio: 5/4`（横長）になる。
> 3:4 で生成したものが上下トリミングされるので、**頭上と足元の余白を多めに取った構図**で出すこと。

### 一貫性を出す手順

1. まず 1 人目を回して絵柄を決める
2. その **seed をメモして固定**し、残りは「個別差分タグ」だけ差し替える
3. それでも揃わない場合は、1 人目の完成画像を **i2i（強度 0.4〜0.5）** のベースにする

---

## 共通スタイルブロック

全員の先頭に固定で入れる。ここが絵柄の統一を担う。

```
masterpiece, best quality, very aesthetic, absurdres, newest,
1boy, solo, chibi, chibi proportions, 3 heads tall, full body, standing,
looking at viewer, dynamic pose,
flat color, cel shading, bold thick black outlines, clean lineart,
vivid saturated colors, high contrast,
sticker style, die cut sticker, white outline border,
gaming streetwear, layered outfit, colorful sneakers,
white background, simple background,
soft drop shadow, centered composition
```

## ネガティブプロンプト

全員共通。

```
lowres, worst quality, low quality, jpeg artifacts, blurry, sketch, unfinished,
realistic, photorealistic, 3d render, photo,
realistic proportions, adult proportions, 8 heads tall, tall, long legs,
soft shading, watercolor, muted colors, pastel colors, desaturated,
bad hands, bad anatomy, extra fingers, missing fingers, extra limbs, extra arms,
text, letters, english text, garbled text, watermark, signature, logo, username,
multiple views, 2boys, cropped, out of frame,
background, scenery, detailed background, cluttered background
```

---

## 個別差分タグ

共通スタイルブロックの `1boy, solo,` の直後に挿入する。

### 1. Kuni — 精神的支柱・冷静・リーダー

```
black hair, center parted hair, golden eyes, calm confident smile,
wearing goalkeeper gloves, holding kebab wrap in one hand,
dark red bomber jacket, black cargo pants, dark wine red sneakers,
captain armband, standing confidently, one hand on hip,
dark blood red color scheme, wine red accents,
```

- テーマカラー「血便カラー」は**ダークレッド／ワインレッド**として解釈。Shibao の鮮やかな赤と差別化するため、彩度を落とした暗い赤で固定する
- 腕章に文字が湧きやすい。出たらネガティブの `letters` の重みを `(letters:1.3)` に上げる

### 2. cokemaru. — ほめ上手・優しそう

```
light brown hair, soft drooping eyes, gentle warm smile,
holding fishing rod over shoulder, slingshot tucked in belt,
blue fishing vest, white hoodie underneath, beige shorts, blue sneakers,
bucket hat, relaxed friendly pose, giving thumbs up,
bright blue color scheme, sky blue accents,
```

- 見た目の指定がなかったため、性格から**たれ目＋やわらかい茶髪**で構成
- 釣り竿を主武器、パチンコは腰に挿す配置。チビ体型で小物を両手に持たせると手が破綻するため

### 3. JJINN — 中二病・切り込み隊長

```
black long bangs hair, sharp cyan eyes, smug grin, eyepatch,
dual wielding swords, black katana in right hand, glowing cyan katana in left hand,
all black outfit, black long coat, black gloves, black boots,
chuunibyou pose, dramatic stance, cyan glowing effects,
black color scheme, cyan glow accents,
```

- 全身黒は白背景でシルエットが潰れるため、**シアンの発光**を差し色にして輪郭を立たせている
- 眼帯が不要なら `eyepatch` を削除

### 4. Kakizaki — やさしい・かっこいい・穏やか

```
white hair, calm gentle eyes, serene smile,
holding shuriken between fingers, throwing pose,
white modern ninja hoodie, white scarf, grey joggers, white sneakers,
relaxed ninja stance,
white and silver color scheme, light grey accents,
```

- 白＋手裏剣の組み合わせから**現代風の忍者**に振っている
- 白背景に白衣装だと輪郭が埋もれるため、グレーを影色として必ず入れること

### 5. Nayamei — かっこいい

```
dark skin, short curly black hair, green eyes, cool confident smirk,
holding glowing blue spellbook in one hand, brazilian flag cape draped over shoulders,
green and yellow tracksuit jacket, black pants, green sneakers,
magic blue glowing particles,
green and yellow color scheme,
```

- ブラジル国旗は**中央の文字と星が高確率で崩れる**。形を優先するなら `brazilian flag cape` を
  `green and yellow flag cape with blue circle` に置き換える
- 完璧を狙う場合は、その部分だけ後から手で描き足すのが早い

### 6. Reo — 男が惚れる男・人情熱い

```
blond hair, swept back hair, warm brown eyes, big hearty grin,
hugging plush loch ness monster doll under arm,
yellow varsity jacket, white t-shirt, denim pants, yellow sneakers,
open hearted pose, fist bump gesture,
bright yellow color scheme, golden accents,
```

- ネッシーが出ない場合のフォールバック: `green plush dinosaur doll, long neck`

### 7. Rowmine — ムードメーカー・すかしてる

```
purple hair, half-closed eyes, teasing smirk, slightly tilted head,
holding sniper rifle over shoulder,
purple hooded jacket, black tactical pants, purple sneakers,
laid back pose, peace sign,
purple color scheme, violet accents,
```

- 「すかしてる」感は `half-closed eyes` ＋ `teasing smirk` ＋ `slightly tilted head` の 3 点セットで出る

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

## テーマカラーの配分

| 暗赤 | 青 | 黒+シアン | 白 | 緑 | 黄 | 紫 | 赤 |
|---|---|---|---|---|---|---|---|
| Kuni | cokemaru. | JJINN | Kakizaki | Nayamei | Reo | Rowmine | Shibao |

被りなし。並べたときに色が均等に散る配分になっている。メンバー追加時はこの表を見て未使用の色を割り当てること。

---

## 調整メモ

| やりたいこと | 対処 |
|---|---|
| もっとポップに | `pop art, bold flat shapes, comic style` を追加 |
| 頭身が高くなる | `(chibi:1.3), (3 heads tall:1.2)` に重み付け |
| 武器が消える／2 つ出ない | 主武器だけ持たせ、もう一方は `tucked in belt` `on back` で装備扱いにする |
| 背景に物が湧く | ネガティブに `(detailed background:1.4)` を追加 |
| 白背景が灰色になる | `(white background:1.3), pure white background` に強める |
| 絵柄が揃わない | seed 固定に加えて i2i（強度 0.4〜0.5）でベース画像に寄せる |

---

## メンバーを追加するとき

1. 「テーマカラーの配分」表を見て、未使用の色を割り当てる
2. 上の書式で個別差分タグを作る（髪型・髪色・目の色・武器/小物・服・ポーズ・カラースキーム）
3. 共通スタイルブロック＋固定 seed で 768 × 1024 で生成
4. 白背景を切り抜いて `images/avatars/memberN.png` に配置
5. `data/members.json` にエントリを追加（`photo` パスを忘れずに）
6. 新しいゲームタイトルを `games` に入れる場合、`js/render.js` の `GENRES` にも追加しないとジャンル絞り込みに出ない

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
- **商用利用**: 現在 `shop.html` は DEMO 表示（購入機能なし）のため非商用。物販・広告・スポンサーを入れる場合は、使用するモデルと PixAI の利用規約で商用可否を確認すること
- **モデルのライセンス**: Illustrious 系などのモデルは配布元ごとに商用可否が異なるため、使う前にモデルページで確認すること
