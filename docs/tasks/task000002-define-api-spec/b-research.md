# リサーチドキュメント

<!--
このドキュメントについて:
  - 格納場所: docs/tasks/task000002-define-api-spec/b-research.md
  - 作成方法: /b-002-CreateTaskResearch ワークフローで作成
  - 前提条件: a-definition.md が作成済みであること
  - 関連ドキュメント:
    - a-definition.md (タスク定義ドキュメント)
    - c-implementation.md (実装タスクリスト)
-->

---

## 1. ベストプラクティス

| トピック | ベストプラクティス | 参考リンク |
|---------|-------------------|-----------|
| API設計 | RESTfulなリソース設計（名詞をURIに、動詞をHTTPメソッドに） | [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) |
| 認証 | HttpOnly Cookieを使用したセッション管理（XSS対策） | [OWASP Session Management](https://owasp.org/www-project-cheat-sheets/cheatsheets/Session_Management_Cheat_Sheet.html) |
| エラー処理 | 統一されたエラーレスポンス形式と適切なHTTPステータスコードの使用 | [RFC 7807](https://tools.ietf.org/html/rfc7807) |
| Next.js | Route Handlersを使用したAPI実装 | [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) |

---

## 2. 既存の実装・ライブラリ

| 名前 | 種類 | 採用可否 | 理由 |
|------|------|---------|------|
| Next.js API Routes | Framework | 採用 | プロジェクトの技術スタックとして選定済み。サーバーレス関数として動作し、スケーラブル。 |
| Zod | Library | 推奨 | リクエストバリデーションと型推論に有用。今回は依存関係を増やさないため手動検証とするが、複雑化したら導入検討。 |

---

## 3. 技術的なリスクと対策

| リスク | 影響度 | 対策 |
|-------|--------|------|
| インメモリデータの消失 | High | サーバー再起動やデプロイでデータが消える。デモ用途と割り切り、永続化は行わない。クライアント側でセッション切れを検知し、再ログイン/再生成を促すUXにする。 |
| 教材生成のタイムアウト | Medium | OpenAI APIの応答待ちでタイムアウトする可能性がある。Railwayのタイムアウト設定を確認し、必要に応じて長めに設定する。将来的にはStreaming対応を検討。 |

---

## 4. 設計案

### APIエンドポイント構成

#### 認証 (Auth)
- `POST /api/auth/login`: ログイン
- `POST /api/auth/logout`: ログアウト
- `GET /api/auth/me`: 状態確認

#### 教材生成 (Materials)
- `POST /api/materials`: 教材生成（同期処理）

#### 学習セッション (Sessions)
- `POST /api/sessions`: セッション開始
- `POST /api/sessions/{id}/answers`: 回答送信
- `GET /api/sessions/{id}/result`: 結果取得

### データモデル（インメモリ）

```typescript
interface LearningMaterial {
  id: string;
  url: string;
  summary: string;
  questions: QuizQuestion[];
}

interface LearningSession {
  id: string;
  materialId: string;
  answers: UserAnswer[];
}
```

---

## メモ

- 長時間実行プロセス（教材生成）については、まずはシンプルな同期REST APIとして実装し、UX上の問題があればStreamingやPollingへの移行を検討する。
