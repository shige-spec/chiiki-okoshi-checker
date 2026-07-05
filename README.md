# 地域おこし協力隊 地域要件 判定ツール

転出地（住民票のある自治体）と転入地（移住先）を選ぶだけで、特別交付税措置の対象かどうかを ○△▲□× の5段階で判定するWebアプリ。

## 機能

- 全国1,741自治体の地域要件区分データ
- 総務省 10×10 マトリクスによる ○△▲□× 判定
- △/▲/□ 判定時の**条件不利区域チェック**（751自治体分の区域データ）
- 判定根拠の説明表示

## 開発

プロジェクトフォルダへ移動:

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
```

依存関係のインストール:

```bash
npm install
```

ローカル開発サーバー:

```bash
npm run dev
```

ブラウザ: [http://localhost:3000](http://localhost:3000)

## 公開

Surge と Vercel を**並行運用**します。どちらも同じソースからビルドされ、内容は同一です。

**方針:** 独自ドメインを Vercel に移した後も、Surge（`chiiki-okoshi-checker.surge.sh`）は削除せず残します。予備URL・既存リンクの維持用です。

| 環境 | 用途 | コマンド |
|------|------|----------|
| Surge | 常時公開（移行後も維持） | `./deploy.sh` |
| Vercel | 独自ドメイン・本番候補 | `./deploy-vercel.sh` |
| 両方 | 更新を一括反映 | `./deploy-all.sh` |

### Surge（常時維持）

プロジェクトフォルダへ移動:

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
```

ビルド＋デプロイ:

```bash
./deploy.sh
```

初回のみ Surge ログインが必要な場合:

```bash
npx surge login
```

公開URL: [https://chiiki-okoshi-checker.surge.sh](https://chiiki-okoshi-checker.surge.sh)

Vercel に独自ドメインを付けた後も、この Surge URL は残したまま運用します。

### Vercel（独自ドメイン移行用）

初回セットアップ（Vercel CLI ログイン）:

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
npx vercel login
```

本番デプロイ:

```bash
./deploy-vercel.sh
```

プレビューデプロイ（本番以外の確認用）:

```bash
./deploy-vercel.sh --preview
```

デプロイ後の公開URL:

- 本番: [https://chiiki-okoshi-checker.vercel.app](https://chiiki-okoshi-checker.vercel.app)
- 管理: [https://vercel.com/besidz/chiiki-okoshi-checker](https://vercel.com/besidz/chiiki-okoshi-checker)

#### 独自ドメインを付ける場合（将来）

1. [Vercel Dashboard](https://vercel.com/dashboard) → 対象プロジェクト → **Settings** → **Domains**
2. 使いたいドメイン（例: `checker.example.com`）を追加
3. 表示される DNS 設定（CNAME または A レコード）をドメイン管理画面に反映
4. 反映後、Vercel 側で SSL が自動発行されます
5. **Surge は削除せず残す**（`./deploy.sh` で引き続き更新可能）

#### 両方に一括デプロイ

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
./deploy-all.sh
```

#### GitHub 連携（任意）

リポジトリを Vercel にインポートすると、`main` への push で自動デプロイできます。  
Framework Preset: **Next.js**、Root Directory: プロジェクトルート、`vercel.json` はそのまま利用できます。

## データ更新

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
npm run generate-data
```

- 自治体区分: Locasumo 公開ページ（総務省令和4年4月1日資料ベース）
- 条件不利区域: 総務省 PDF `000063379.pdf`
- マトリクス: 総務省 PDF `000847999.pdf`

## 免責

非公式の目安判定です。最終判断は受入自治体・総務省への確認が必要です。
