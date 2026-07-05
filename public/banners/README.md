# バナー設定

このフォルダのファイルを差し替えるだけで、サイト上の3つの広告枠を変更できます。

## ファイル構成

| ファイル | 用途 |
|---------|------|
| `config.json` | 各バナーの画像ファイル名・リンク先URL・代替テキスト |
| `square-sample.svg` | スクエアバナー用サンプル画像（300×300px） |
| `skyscraper-sample.svg` | スカイスクレイパー用サンプル画像（160×600px） |
| `skyscraper2-sample.svg` | スカイスクレイパー2用サンプル画像（160×600px） |
| `leaderboard-sample.svg` | 横長バナー用サンプル画像（728×90px） |

## 変更手順

1. 差し替えたいバナー画像をこのフォルダに置く（PNG / JPG / SVG など）
2. `config.json` の `image` にファイル名、`url` にリンク先を記入する
3. 以下をターミナルで実行して公開

プロジェクトフォルダへ移動:

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
```

ビルド＋デプロイ:

```bash
./deploy.sh
```

公開URL: [https://chiiki-okoshi-checker.surge.sh](https://chiiki-okoshi-checker.surge.sh)

### config.json の例

```json
{
  "square": {
    "image": "my-banner.png",
    "url": "https://example.com/",
    "alt": "バナーの説明"
  }
}
```

- `image` を空文字 `""` にすると、枠だけ表示されます
- `url` を空文字 `""` にすると、画像のみ表示（リンクなし）になります

## 表示位置

| キー | サイズ | 表示位置 |
|------|--------|----------|
| `square` | 300×300 | ヒーロー（タイトル横のイラスト付近） |
| `skyscraper` | 160×600 | 本文右側・上（XL画面以上） |
| `skyscraper2` | 160×600 | 本文右側・下（XL画面以上） |
| `leaderboard` | 728×90 | 免責文の下 |
