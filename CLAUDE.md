# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wikipedia記事からAIを使用して学習教材（3行サマリ + 10問の○×問題）を自動生成するデモアプリケーション。
社会人の自習をサポートし、受動的な読書から能動的な問題解決型学習への転換を促進する。

## Development Commands

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start

# リンター実行
npm run lint

# テスト実行
npm run test

# テスト（ウォッチモード）
npm run test:watch
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19 + Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Architecture

```
app/                    # Next.js App Router (pages, layouts, API routes)
├── api/                # Backend API Routes (route.ts)
├── (auth)/             # Route group for authenticated pages
├── layout.tsx          # Root layout
└── page.tsx            # Home page (URL input)

components/             # Reusable UI components (stateless)
lib/                    # Business logic and utilities
├── auth/               # Basic authentication
├── openai/             # OpenAI API client (summary, questions)
├── wikipedia/          # Wikipedia API client
├── session/            # In-memory session management
└── utils/              # Utility functions

types/                  # Shared TypeScript type definitions
├── learning-material.ts  # LearningMaterial, QuizQuestion
├── learning-session.ts   # LearningSession, Answer, SessionResult
├── auth.ts               # Authentication types
└── common.ts             # Shared types (QuizChoice, SessionStatus)

contexts/               # React Context (auth state, quiz session)
hooks/                  # Custom React hooks
__tests__/              # Tests (unit/, integration/)
```

### Dependency Rules

- `app/` → `lib/`, `components/`, `types/`
- `components/` → `types/` (UI only, no business logic)
- `lib/` → `types/` (no React imports)
- `lib/` → NOT `app/`, NOT `components/`

## Domain Models

### LearningMaterial (教材)
- Wikipedia URLから生成
- 3行サマリ + 10問の○×問題を含む
- インメモリのみ（永続化なし）

### LearningSession (学習セッション)
- 問題回答の状態管理
- 正解/不正解フィードバック
- 結果集計（正答数、正答率）

## Coding Conventions

- **Components**: PascalCase (`QuizCard.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase, no `I` prefix
- **Test files**: `*.test.ts(x)`

## TypeScript Configuration

- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`
- `verbatimModuleSyntax: true`

## Testing

```bash
# 単一テスト実行
npm run test -- __tests__/unit/example.test.ts

# パターンマッチでテスト実行
npm run test -- --grep "test name"
```

- テスト設定: `vitest.config.ts`
- セットアップ: `vitest.setup.ts`
- 環境: jsdom
