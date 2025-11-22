# API仕様書

<!--
このドキュメントについて:
  - 目的: フロントエンドとバックエンド間の通信規約を定義する
  - 前提: Next.js App Router (API Routes) を使用
  - データ形式: JSON
-->

## 1. 共通仕様

### ベースURL
`/api`

### リクエストヘッダー
- `Content-Type: application/json`

### 認証方式
- **Cookieベース**: 認証成功時に `auth_token` クッキー（HttpOnly）を発行。
- すべての保護されたエンドポイントでこのクッキーを検証する。

### エラーレスポンス形式
HTTPステータスコードが4xxまたは5xxの場合、以下の形式でエラー詳細を返す。

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "ユーザー向けのエラーメッセージ"
  }
}
```

| ステータスコード | 説明 |
|----------------|------|
| 400 | Bad Request (入力値不正など) |
| 401 | Unauthorized (未認証) |
| 404 | Not Found (リソース不在) |
| 500 | Internal Server Error (サーバーエラー) |

---

## 2. 認証 (Authentication)

### 2.1 ログイン
パスワードを検証し、セッションを開始する。

- **Endpoint**: `POST /api/auth/login`
- **Auth**: 不要

**Request Body**:
```json
{
  "password": "user_input_password"
}
```

**Response (200 OK)**:
```json
{
  "success": true
}
```
*Set-Cookie: auth_token=...*

**Response (401 Unauthorized)**:
```json
{
  "error": {
    "code": "INVALID_PASSWORD",
    "message": "パスワードが間違っています。"
  }
}
```

### 2.2 ログアウト
セッションを破棄する。

- **Endpoint**: `POST /api/auth/logout`
- **Auth**: 必要

**Response (200 OK)**:
```json
{
  "success": true
}
```
*Set-Cookie: auth_token=; Max-Age=0*

### 2.3 認証状態確認
現在のユーザーがログイン済みか確認する（画面ロード時など）。

- **Endpoint**: `GET /api/auth/me`
- **Auth**: 不要（Cookieがあれば検証）

**Response (200 OK)**:
```json
{
  "isAuthenticated": true
}
```
※ 未認証の場合は `isAuthenticated: false` を返す（401にはしない）。

---

## 3. 教材生成 (Learning Materials)

### 3.1 教材生成
Wikipedia URLを受け取り、サマリと問題リストを生成する。
※ 生成には時間がかかるため、タイムアウト設定に注意（または将来的にStreaming検討）。

- **Endpoint**: `POST /api/materials`
- **Auth**: 必要

**Request Body**:
```json
{
  "url": "https://ja.wikipedia.org/wiki/..."
}
```

**Response (200 OK)**:
```json
{
  "materialId": "uuid-string",
  "summary": "記事の要約テキスト（3行程度）...",
  "questions": [
    {
      "id": "q1",
      "text": "問題文...",
      "options": ["○", "×"] 
    }
    // ... 10問
  ]
}
```
※ セキュリティのため、この時点では正解データ（Answer）はクライアントに返さない。

**Response (400 Bad Request)**:
```json
{
  "error": {
    "code": "INVALID_URL",
    "message": "有効なWikipedia URLを入力してください。"
  }
}
```

---

## 4. 学習セッション (Learning Sessions)

### 4.1 セッション開始
生成された教材IDを指定して、学習セッション（回答履歴管理）を開始する。
※ `POST /api/materials` のレスポンスを使って即座に開始してもよいが、
「サマリを見てから開始」というフローを考慮し、明示的な開始アクションとする。

- **Endpoint**: `POST /api/sessions`
- **Auth**: 必要

**Request Body**:
```json
{
  "materialId": "uuid-string"
}
```

**Response (201 Created)**:
```json
{
  "sessionId": "session-uuid-string",
  "totalQuestions": 10,
  "currentQuestionIndex": 0
}
```

### 4.2 回答送信
現在の問題に対する回答を送信し、正誤判定を受け取る。

- **Endpoint**: `POST /api/sessions/{sessionId}/answers`
- **Auth**: 必要

**Request Body**:
```json
{
  "questionId": "q1",
  "userAnswer": true  // true=○, false=×
}
```

**Response (200 OK)**:
```json
{
  "isCorrect": true,
  "explanation": "解説テキスト...",
  "correctAnswer": true,
  "nextQuestionId": "q2", // 次の問題がない場合は null
  "isFinished": false
}
```

### 4.3 結果取得
セッションの最終結果（正答数など）を取得する。

- **Endpoint**: `GET /api/sessions/{sessionId}/result`
- **Auth**: 必要

**Response (200 OK)**:
```json
{
  "sessionId": "session-uuid-string",
  "totalQuestions": 10,
  "correctCount": 8,
  "finishedAt": "2025-11-22T10:00:00Z"
}
```

---

## 5. データモデル（インメモリ）

サーバー側で保持するデータ構造のイメージ（TypeScript Interface）。

```typescript
interface AuthSession {
  token: string;
  expiresAt: Date;
}

interface LearningMaterial {
  id: string;
  url: string;
  summary: string;
  questions: QuizQuestion[];
  createdAt: Date;
}

interface QuizQuestion {
  id: string;
  text: string;
  correctAnswer: boolean; // true=○, false=×
  explanation: string;
}

interface LearningSession {
  id: string;
  materialId: string;
  answers: UserAnswer[];
  startedAt: Date;
}

interface UserAnswer {
  questionId: string;
  userChoice: boolean;
  isCorrect: boolean;
}
```
