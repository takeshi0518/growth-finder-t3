# growth-finder-t3

飲食店のスタッフ評価を記録・管理するアプリケーション。T3 スタックの学習を目的として作成した簡易版です。

既存の [Growth Finder](https://github.com/takeshi0518/growth-finder)（Next.js + Supabase）を、T3 スタックで再構築したものにあたります。機能は最小限に絞り、tRPC・Prisma・App Router の連携を理解することを主眼としています。

## 技術スタック

| 領域           | 使用技術                                 |
| -------------- | ---------------------------------------- |
| フレームワーク | Next.js 15 (App Router)                  |
| API            | tRPC v11                                 |
| ORM            | Prisma 6                                 |
| データベース   | PostgreSQL (Docker)                      |
| スタイリング   | Tailwind CSS v4                          |
| 認証           | NextAuth v5 beta（配線のみ、現在は無効） |
| 言語           | TypeScript                               |

`create-t3-app@7.40.0` で生成した構成をベースにしています。

## セットアップ

### 必要なもの

- Node.js 22 以上
- Docker

### 手順

```bash
# 依存関係のインストール
npm install

# 環境変数の用意
cp .env.example .env
```

`.env` の `AUTH_SECRET` が空の場合は生成します。

```bash
npx auth secret
```

データベースを起動します。`DATABASE_URL` のパスワードが初期値の場合、スクリプトがランダムな値を生成して `.env` を書き換えます。

```bash
./start-database.sh
```

スキーマを反映し、シードデータを投入します。

```bash
npm run db:push
npx prisma db seed
```

開発サーバーを起動します。

```bash
npm run dev
```

http://localhost:3000 で確認できます。

## 主なコマンド

| コマンド             | 内容                                                   |
| -------------------- | ------------------------------------------------------ |
| `npm run dev`        | 開発サーバーの起動                                     |
| `npm run db:start`   | DB起動                                                 |
| `npm run db:stop`    | DB停止                                                 |
| `npm run db:push`    | スキーマを DB に反映（マイグレーション履歴は作らない） |
| `npm run db:studio`  | Prisma Studio の起動                                   |
| `npx prisma db seed` | シードデータの投入                                     |
| `npm run typecheck`  | 型チェック                                             |
| `npm run lint`       | ESLint                                                 |

## 実装済みの機能

- スタッフの一覧表示・詳細表示・登録
- 評価の入力（6 項目 × 3 カテゴリ、5 段階）
- 下書き保存と確定の切り替え
- 確定時の未評価チェック
- 評価状態のバッジ表示（未作成 / 下書き / 確定済み）

評価期間は現在年月（`YYYY-MM`）を自動で使用します。

## データモデル

Staff ──< Evaluation ──< EvaluationScore

- `Staff` — 評価対象のスタッフ
- `Evaluation` — スタッフ × 期間で一意。下書き / 確定の状態を持つ
- `EvaluationScore` — 評価項目ごとのスコア

評価項目のマスタテーブルは持たず、`src/lib/evaluation-items.ts` の定数として定義しています。スコア行は項目名・カテゴリ・満点をコピーして保持するスナップショット方式です。

## 主な設計判断

### 評価項目のマスタを持たない

マスタテーブルを用意すると、項目名の変更や削除が過去の評価表示に影響します。人事評価は記録として後から変わってはならないため、スコア行が項目情報をコピーして保持する方式を採用しました。

代償として項目の CRUD 機能はなく、項目定義の変更はコードの修正が必要です。

### スコアの更新は全削除して作り直す

保存時に `deleteMany` で既存スコアを全削除し、`createMany` で作り直します。`upsert` をループする案と比較した結果、スコア行の `id` を単独で参照する場面がないため、単純な方を選びました。

削除と作成の間で失敗するとスコアが全消失するため、評価本体の `upsert` を含めて `$transaction` で囲んでいます。

### 日付は `@db.Date` を使う

入社日は「瞬間」ではなく「日付」であり、時刻を持つとタイムゾーンによる解釈のずれが生じます。PostgreSQL の `date` 型を使い、時刻を格納する場所自体をなくしています。

表示時は `toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", ... })` を使用します。`toISOString()` は UTC 変換で日付がずれるため使いません。

### `z.coerce.date()` を使わない

`z.coerce.date()` は空文字列を数値 `0` として解釈し、`1970-01-01` に変換します。エラーにならず、もっともらしい値が生成されるため、外部入力の検証には適しません。`z.string().transform()` で明示的に変換しています。

## 意図的に省いた部分

学習目的に対して新規性が薄い、または工数に見合わないと判断した機能です。

| 機能                       | 理由                                                            |
| -------------------------- | --------------------------------------------------------------- |
| スタッフの更新・削除       | `create` とほぼ同じ形になり、学習上の新規性が薄い               |
| 評価結果の一覧・詳細表示   | 入力機能で tRPC とリレーションの理解は達成したため              |
| 認証（NextAuth）           | 配線のみ残し、有効化は未実施。`src/env.js` に TODO コメントあり |
| 評価項目の CRUD            | マスタを持たない設計のため                                      |
| 評価期間の選択             | 現在年月を自動使用。過去の評価は開けない                        |
| マルチテナント             | 簡易版のため組織の概念を持たない                                |
| サーバー側の未評価チェック | クライアント側のみ実装。本来は両方必要                          |

## 認証を有効化する場合

1. `src/env.js` の `AUTH_DISCORD_ID` / `AUTH_DISCORD_SECRET` から `.optional()` を外す
2. Discord Developer Portal で認証情報を取得し `.env` に設定
3. `publicProcedure` を `protectedProcedure` に置き換える

## AI 支援開発について

Codex を用いた開発の練習を兼ねています。`AGENTS.md` にプロジェクト固有の前提を記述しており、実際に問題が発生した項目を追記していく運用としています。

tRPC のルーターと Prisma スキーマは手で記述し、UI の実装を Codex に委譲する分担としました。
