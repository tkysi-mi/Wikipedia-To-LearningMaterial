# Wikipedia To Learning Material

Wikipediaの記事を、AIを活用してインタラクティブな学習教材に変換するデモアプリケーションです。

## プロジェクト概要

Wikipedia記事のURLを入力すると、OpenAI APIが自動的に以下を生成します：

- **3行サマリ**: 記事の要点を簡潔に要約
- **10問の○×問題**: 記事の理解度を確認する問題

受動的な読書から能動的な問題解決型学習への転換を支援し、知識の定着を促進します。

## 技術スタック

| レイヤー         | 技術                  | バージョン |
| ---------------- | --------------------- | ---------- |
| フロントエンド   | Next.js (App Router)  | 16.x       |
| 言語             | TypeScript            | 5.x        |
| UIフレームワーク | React                 | 19.x       |
| スタイリング     | Tailwind CSS          | 3.x        |
| UIコンポーネント | shadcn/ui             | -          |
| API連携          | OpenAI SDK            | 6.x        |
| テスト           | Vitest                | 4.x        |
| テスト（React）  | React Testing Library | 16.x       |
| ランタイム       | Node.js               | 20.x LTS   |
| デプロイ         | Railway               | -          |

詳細は [`docs/project/04-design/01-tech-stack.md`](docs/project/04-design/01-tech-stack.md) を参照してください。

## セットアップ

### 前提条件

- Node.js (v20.x LTS 推奨)
- npm
- OpenAI APIキー

### インストール手順

1. **リポジトリのクローン**

   ```bash
   git clone https://github.com/tkysi-mi/Wikipedia-To-LearningMaterial.git
   cd Wikipedia-To-LearningMaterial
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **環境変数の設定**

   ```bash
   cp .env.example .env.local
   ```

   `.env.local`を編集し、以下を設定：

   ```env
   AUTH_PASSWORD=your-password-here
   OPENAI_API_KEY=sk-your-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **開発サーバーの起動**

   ```bash
   npm run dev
   ```

   [http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

### 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# テスト実行
npm run test

# テスト（watch モード）
npm run test:watch

# Lint チェック
npm run lint

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm start
```

## ディレクトリ構造

```text
.
├── app/                    # Next.js App Router (ページ・API Routes)
│   ├── (auth)/            # 認証済みページグループ
│   ├── api/               # API Routes
│   └── login/             # ログインページ
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/ui コンポーネント
│   ├── ErrorMessage.tsx
│   ├── LoadingSpinner.tsx
│   ├── SummaryDisplay.tsx
│   └── UrlInputForm.tsx
├── contexts/             # React Context
│   └── AuthContext.tsx
├── lib/                  # ビジネスロジック
│   ├── openai/          # OpenAI API連携
│   ├── wikipedia/       # Wikipedia API連携
│   └── utils/           # ユーティリティ
├── types/               # TypeScript型定義
│   ├── common.ts
│   ├── learning-material.ts
│   └── learning-session.ts
├── __tests__/           # テスト
├── docs/                # プロジェクトドキュメント
│   ├── project/         # 要件定義・設計ドキュメント
│   └── tasks/           # タスク管理ドキュメント
└── public/              # 静的ファイル
```

## ドキュメント

プロジェクトの詳細なドキュメントは `docs/` ディレクトリにあります：

### 要件定義

- [システム概要](docs/project/01-requirements/01-system-overview.md)
- [ユーザーストーリー](docs/project/01-requirements/05-user-stories.md)

### 設計

- [技術スタック](docs/project/04-design/01-tech-stack.md)
- [リポジトリ構造](docs/project/04-design/02-repository-structure.md)
- [データ構造](docs/project/04-design/04-data-structures.md)
- [API仕様](docs/project/04-design/05-api-spec.md)

### タスク管理

- [Task 000001: プロジェクトセットアップ](docs/tasks/task000001-set-up-project/)
- [Task 000003: コア機能実装](docs/tasks/task000003-implement-core-features/)

## 使い方（現在の機能）

1. **ログイン**: 設定したパスワードでログイン
2. **Wikipedia URL入力**: 日本語または英語のWikipedia記事URLを入力
3. **サマリ生成**: AIが記事を3行で要約（処理に20-30秒かかります）
4. **サマリ表示**: 記事のタイトルとサマリが表示されます

> **注**: ○×問題機能は現在実装中です（Phase 5）

## ライセンス

ISC

## リポジトリ

- GitHub: [tkysi-mi/Wikipedia-To-LearningMaterial](https://github.com/tkysi-mi/Wikipedia-To-LearningMaterial)
- Issues: [GitHub Issues](https://github.com/tkysi-mi/Wikipedia-To-LearningMaterial/issues)
