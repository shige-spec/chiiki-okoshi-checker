# Vercel デプロイ設定

Surge（`deploy.sh`）とは独立した Vercel 用の設定です。  
**Vercel に独自ドメインを移した後も、Surge は削除せず残します。**

## 運用方針

| 環境 | URL 例 | 扱い |
|------|--------|------|
| Surge | `chiiki-okoshi-checker.surge.sh` | 移行後も常時維持 |
| Vercel | 独自ドメイン / `*.vercel.app` | 本番・メインドメイン候補 |

更新時は `./deploy-all.sh` で両方に反映するか、必要な方だけ `./deploy.sh` / `./deploy-vercel.sh` を実行してください。

## 公開URL

- 本番: [https://chiiki-okoshi-checker.vercel.app](https://chiiki-okoshi-checker.vercel.app)
- 管理: [https://vercel.com/besidz/chiiki-okoshi-checker](https://vercel.com/besidz/chiiki-okoshi-checker)

## 初回デプロイ

```bash
cd /Users/kurashigeyoshihiro/src/chiiki-okoshi-checker
npx vercel login
./deploy-vercel.sh
```

## ファイル

| ファイル | 役割 |
|---------|------|
| `vercel.json` | Vercel のビルド設定 |
| `deploy-vercel.sh` | Vercel 本番デプロイ |
| `deploy-all.sh` | Surge + Vercel 一括デプロイ |
| `deploy-vercel-history.log` | Vercel デプロイ履歴（自動生成） |

## 独自ドメイン

Vercel Dashboard → Project → Settings → Domains から追加してください。  
DNS 反映後、HTTPS は Vercel が自動で設定します。

Surge 側の設定変更や削除は不要です。両方の URL が同時に有効な状態を維持できます。
