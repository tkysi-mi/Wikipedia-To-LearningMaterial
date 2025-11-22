# 実装タスクリスト

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000001-{スラッグ}/c-implementation.md
  - 作成方法: /b-003-CreateTaskImplementation ワークフローで作成
  - 実行方法: /c-001-ImplementTask ワークフローで各ステップを実行
  - 前提条件: a-definition.md と b-research.md が作成済みであること
  - 関連ドキュメント:
    - a-definition.md (タスク定義ドキュメント)
    - b-research.md (リサーチドキュメント)

このドキュメントの目的:
  - 実装作業を段階的に分割して管理
  - 進捗の可視化とチーム共有
  - 各ステップの成果物を明確化
  - 実装漏れの防止

更新タイミング:
  - 実装開始前にフェーズ分割を計画
  - 各ステップ完了時にチェック（/c-001-ImplementTask が自動更新）
  - 新たな作業が発覚した際に追加
  - レビュー指摘事項を反映
-->

---

## フェーズ 1: 依存関係のインストール

<!--
目的: プロジェクトが正しくビルド・実行できるように必要な npm パッケージをインストールする。
ベストプラクティス: `npm ci` を使用し lockfile で確実にインストール。CI 環境でも同様に実行できるようにする。
-->

**完了条件:**
- `npm install` がエラーなく完了し `node_modules` が生成される。
- `npm run lint` がエラーなしで通過する。
- `npm run test` が全テストをパスする。

### ステップ

- [x] **ステップ 1:** Next.js + TypeScript のコア依存関係インストール
  - **成果物:** `package.json` に `next`, `react`, `react-dom`, `typescript` が追加される。
  - **詳細:** `npm install next react react-dom typescript -D` を実行し、`tsconfig.json` が生成される。

- [x] **ステップ 2:** Tailwind CSS と PostCSS の設定
  - **成果物:** `tailwind.config.ts`, `postcss.config.cjs`, `globals.css` が作成され、`package.json` に `tailwindcss`, `postcss`, `autoprefixer` が追加される。
  - **詳細:** `npm install -D tailwindcss@latest postcss@latest autoprefixer@latest` → `npx tailwindcss init -p`。

- [x] **ステップ 3:** ESLint と Prettier の導入
  - **成果物:** `eslint.config.mjs`, `prettier.config.cjs` が作成され、`package.json` に `eslint`, `eslint-config-next`, `prettier`, `eslint-plugin-prettier`, `eslint-config-prettier` が追加される。
  - **詳細:** `npm install -D eslint eslint-config-next prettier eslint-plugin-prettier eslint-config-prettier`。

- [x] **ステップ 4:** Vitest と Testing Library のセットアップ
  - **成果物:** `vitest.config.ts`, `vitest.setup.ts` が作成され、`package.json` に `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event` が追加される。
  - **詳細:** `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event`。

- [x] **ステップ 5:** CI 用 GitHub Actions ワークフロー作成
  - **成果物:** `.github/workflows/ci.yml` が作成され、依存関係インストール、Lint、テストが自動実行される。
  - **詳細:** `npm ci`、`npm run lint`、`npm run test -- --coverage` を実行するジョブを定義。

---

## フェーズ 2: ディレクトリ構造の作成

<!--
目的: `02-repository-structure.md` に記載されたディレクトリ構造をプロジェクトルートに作成する。
ベストプラクティス: 各フォルダに README または `.keep` ファイルを入れて空ディレクトリが Git に保持されるようにする。
-->

**完了条件:**
- `docs/project/04-design/02-repository-structure.md` に記載された全ディレクトリがプロジェクトルートに存在する。
- 各ディレクトリに最低限のプレースホルダー（`README.md` または `.keep`）が配置されている。

### ステップ

- [x] **ステップ 1:** `app/` ディレクトリ作成
  - **成果物:** `app/` とサブディレクトリ `app/layout.tsx`, `app/page.tsx` が作成される。

- [x] **ステップ 2:** `components/` ディレクトリ作成
  - **成果物:** `components/` とプレースホルダー `components/README.md` が作成される。

- [x] **ステップ 3:** `lib/` ディレクトリ作成
  - **成果物:** `lib/` と `lib/README.md` が作成される。

- [x] **ステップ 4:** `types/` ディレクトリ作成
  - **成果物:** `types/` と `types/README.md` が作成される。

- [x] **ステップ 5:** `contexts/` ディレクトリ作成
  - **成果物:** `contexts/` と `contexts/README.md` が作成される。

- [x] **ステップ 6:** `hooks/` ディレクトリ作成
  - **成果物:** `hooks/` と `hooks/README.md` が作成される。

- [x] **ステップ 7:** `__tests__/` ディレクトリ作成
  - **成果物:** `__tests__/unit/` と `__tests__/integration/` が作成され、各フォルダに `.keep` を配置。

- [x] **ステップ 8:** `public/` ディレクトリ作成
  - **成果物:** `public/` と `public/README.md` が作成される。

- [x] **ステップ 9:** `.github/workflows/` ディレクトリの整備（CI 用以外のテンプレートが必要なら追加）
  - **成果物:** 必要に応じて `ci.yml` 以外のワークフローファイルを配置。

---

## フェーズ 3: 検証・ドキュメント更新

<!--
目的: 依存関係とディレクトリ構造が正しく機能することをローカルと CI で検証し、README を更新する。
-->

**完了条件:**
- `npm run dev` で開発サーバーが起動し、`app/` のデフォルトページが表示される。
- CI が全ステップを通過し、`build` が成功する。
- `README.md` にセットアップ手順とディレクトリ構造の概要が記載されている。

### ステップ

- [x] **ステップ 1:** ローカルで `npm run dev` を実行し、ページが表示されることを確認。
- [x] **ステップ 2:** GitHub Actions が成功することをプッシュして確認。
- [x] **ステップ 3:** `README.md` に依存関係インストール手順、ディレクトリ構造図（Mermaid）を追記。

---

## 受け入れ基準

- すべての依存関係が正しくインストールされ、`npm run lint` と `npm run test` がエラーなしで完了する。
- `02-repository-structure.md` に記載された全ディレクトリがプロジェクトに存在し、プレースホルダーが配置されている。
- CI が成功し、`README.md` に最新のセットアップ手順が反映されている。

---

## メモ

- 将来的に UI コンポーネント（shadcn/ui）や API エンドポイントを追加する際は、既存のディレクトリ構造に従って新規フォルダを作成する。
- 依存関係バージョンは `package.json` の `dependencies` と `devDependencies` に固定し、`npm ci` で再現性を確保する。
