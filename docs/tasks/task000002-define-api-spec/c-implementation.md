# 実装タスクリスト

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000002-define-api-spec/c-implementation.md
  - 作成方法: /b-003-CreateTaskImplementation ワークフローで作成
  - 実行方法: /c-001-ImplementTask ワークフローで各ステップを実行
  - 前提条件: a-definition.md と b-research.md が作成済みであること
  - 関連ドキュメント:
    - a-definition.md (タスク定義ドキュメント)
    - b-research.md (リサーチドキュメント)
-->

---

## フェーズ 1: API仕様書の作成

<!--
目的: ドメインモデルに基づき、詳細なAPI仕様書を作成する。
-->

**完了条件:**
- `docs/project/04-design/05-api-spec.md` が作成されている。
- 全てのAPIエンドポイントが定義され、リクエスト/レスポンス形式が記述されている。

### ステップ

- [x] **ステップ 1: ファイル作成と基本構造の定義**
  - **成果物:** `docs/project/04-design/05-api-spec.md` (移動済み)
  - **詳細:** 共通仕様（ベースURL、認証方式、エラーレスポンス形式）を記述する。

- [x] **ステップ 2: 認証APIの定義**
  - **成果物:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` の定義
  - **詳細:** リクエスト/レスポンスのJSONスキーマを定義する。

- [x] **ステップ 3: 教材生成APIの定義**
  - **成果物:** `POST /api/materials` の定義
  - **詳細:** Wikipedia URLを受け取り、生成された教材データ（サマリ、問題リスト）を返す仕様を定義する。

- [x] **ステップ 4: 学習セッションAPIの定義**
  - **成果物:** `POST /api/sessions`, `POST /api/sessions/{id}/answers`, `GET /api/sessions/{id}/result` の定義
  - **詳細:** セッション開始、回答送信、結果取得の仕様を定義する。

- [x] **ステップ 5: レビューと整合性チェック**
  - **成果物:** 修正済みの仕様書
  - **詳細:** ドメインモデルのCommand/Eventとの対応を確認し、ユビキタス言語の整合性をチェックする。

---

## 受け入れ基準

- [x] ドメインモデルのすべてのCommandとQueryをカバーするAPIエンドポイントが定義されている
- [x] リクエストとレスポンスのデータ構造（JSONスキーマ）が明確になっている
- [x] エラーハンドリング（4xx, 5xx）とステータスコードのルールが定義されている
- [x] `docs/project/04-design/05-api-spec.md` が作成されている

---

## メモ

- 仕様書は `docs/project/05-api/01-api-spec.md` から `docs/project/04-design/05-api-spec.md` に移動しました。
