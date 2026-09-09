# growth-finder-t3

T3 スタック学習用のプロジェクト。飲食店のスタッフ評価アプリ Growth Finder の簡易版。

## 技術スタック

- Next.js 15 (App Router)
- tRPC v11
- Prisma 6 (PostgreSQL / Docker)
- NextAuth v5 beta (現在は無効。認証は最後に実装予定)
- Tailwind CSS v4
- TypeScript

## 実装方針

### Tailwind CSS

v4 を使用。`tailwind.config.ts` は存在しない。設定は `src/styles/globals.css` の CSS 側にある。v3 向けの config ファイル作成や編集を提案しないこと。

### データ取得

tRPC 経由で行う。Prisma Client を直接 import しない。

- Server Component: `import { api } from "@/trpc/server"` の `api.xxx.yyy()`
- Client Component: `import { api } from "@/trpc/react"` の `api.xxx.yyy.useQuery()`

### 型定義

tRPC の戻り値は `AppRouter` 型から推論される。`type Staff = { ... }` のような独自の型定義を書かないこと。スキーマ変更時に UI が追従しなくなるため。

### 認証

現在 NextAuth は無効。すべて `publicProcedure` を使用する。`protectedProcedure` は使わない。

### 日時の扱い

タイムゾーンは Asia/Tokyo。`toISOString()` による日付整形は UTC 変換で 1 日ずれるため使用しない。

## Git

- コミットメッセージは日本語
- Conventional Commits のプレフィックスを付ける (feat / fix / chore / refactor / docs)
- 「なぜそうしたか」を書く。差分から読み取れることは書かない

## 制約

- 新しいライブラリを追加する場合は必ず事前に確認を取ること
- `generated/` は Prisma の生成物。Git 管理外
- ファイルの編集・削除はシェルコマンド（python3 -c、sed、cat > など）ではなく、通常のファイル編集で行うこと。差分をレビューできる形にする。
