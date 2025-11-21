# ユビキタス言語一覧

<!--
何を書くか: プロジェクト全体で共有される共通言語の定義集

目的:
  - 開発者とドメインエキスパート間の共通理解を構築
  - 用語の曖昧さを排除し、コミュニケーションの齟齬を防ぐ
  - コード、ドキュメント、会話で一貫した用語を使用
  - 新しいチームメンバーのオンボーディングを支援

ユビキタス言語とは:
  - Domain-Driven Designの中核概念
  - ビジネス用語と技術用語の橋渡し
  - すべてのコミュニケーション（コード、会話、ドキュメント）で使用
  - Bounded Contextごとに定義される（同じ用語でも異なるContextでは異なる意味を持つ場合がある）

記載のポイント:
  - ドメインエキスパートが使う言葉を優先
  - 技術用語ではなく、ビジネス用語で記述
  - クラス名、メソッド名、変数名にも反映
  - 曖昧な用語は禁止用語として明記

Living Document（生きたドキュメント）:
  - ドメイン理解が深まるにつれて継続的に更新
  - 新しい用語の追加、既存用語の洗練
  - Git管理で変更履歴を追跡
  - Wikiやconfluenceなど、チーム全員がアクセス可能な場所に配置

更新頻度:
  - ドメインモデリング時に初版作成
  - Event Stormingやレビュー時に追加・修正
  - 用語の混乱や不一致が見つかった時に即座に更新
-->

---

## Bounded Context共通: 用語定義

| 用語 | 定義 | 使用例 |
|------|------|--------|
| 社会人（自習者） | 自己学習を行う成人。本システムの主要なユーザー。 | `class Learner`, ユーザーストーリー「社会人として、○×問題を解きたい」 |
| Wikipedia記事 | Wikipediaに掲載されている百科事典形式の記事。学習教材の元となるコンテンツ。 | `wikipediaArticle.getText()`, 「Wikipedia記事を取得する」 |
| サマリ | Wikipedia記事を3行程度に要約した短い文章。記事の概要を把握するために生成される。 | `class Summary`, `generateSummary()`, 「サマリを生成する」 |
| ○×問題 | 正解が○または×のいずれかである二択問題。全10問が生成される。 | `class QuizQuestion`, 「○×問題を生成する」 |
| 学習セッション | ユーザーが1つのWikipedia記事について学習する一連の活動。URL入力から結果表示までの流れ。 | `class LearningSession`, 「学習セッションを開始する」 |

---

## 認証 (Authentication): 用語定義

| 用語 | 定義 | 使用例 |
|------|------|--------|
| ベーシック認証 | ユーザー名とパスワードによる基本的な認証方式。本システムでは共通パスワード1つで運用。 | `basicAuth()`, 「ベーシック認証を実装する」 |
| 認証セッション | 認証成功後のアクセス状態を管理する単位。ブラウザセッションと連動。 | `class AuthSession`, `authSession.isAuthenticated()` |
| システム管理者 | アプリケーションの設定やパスワードを管理する役割。開発者が担う。 | 「システム管理者として、パスワードを設定する」 |
| 認証成功 | パスワードが正しく、アプリケーションへのアクセスが許可された状態。 | `event: AuthenticationSucceeded`, `onAuthenticationSuccess()` |
| 認証失敗 | パスワードが誤っており、アクセスが拒否された状態。 | `event: AuthenticationFailed`, `onAuthenticationFailure()` |

---

## 教材生成 (Learning Material Generation): 用語定義

| 用語 | 定義 | 使用例 |
|------|------|--------|
| 教材 | サマリと○×問題を含む学習用コンテンツ。Wikipedia記事から自動生成される。 | `class LearningMaterial`, `material.getSummary()` |
| URL検証 | 入力されたURLが有効なWikipedia URLであるかをチェックするプロセス。 | `validateUrl()`, 「URLを検証する」 |
| 記事取得 | Wikipedia APIを使用して記事のテキストを取得するプロセス。 | `fetchArticle()`, 「記事を取得する」 |
| サマリ生成 | OpenAI APIを使用して記事を3行程度に要約するプロセス。 | `generateSummary()`, `event: SummaryGenerated` |
| 問題生成 | OpenAI APIを使用して記事から10問の○×問題を生成するプロセス。 | `generateQuestions()`, `event: QuestionsGenerated` |
| 問題文 | ○×問題の質問内容。記事の内容に基づいて生成される。 | `question.getText()`, 「問題文を表示する」 |
| 正解 | ○×問題の正しい答え（○または×）。 | `question.correctAnswer`, `if (answer === correctAnswer)` |
| Wikipedia API | Wikipedia記事のテキストを提供する外部API。 | `wikipediaClient.fetchArticle(url)` |
| OpenAI API | サマリと○×問題を生成するAIサービス。GPT-4.5 miniを使用。 | `openaiClient.generateSummary(text)` |

---

## 学習セッション (Learning Session): 用語定義

| 用語 | 定義 | 使用例 |
|------|------|--------|
| 回答 | ユーザーが○×問題に対して選択した答え（○または×）。 | `class Answer`, `answer.userChoice`, 「回答を送信する」 |
| 正解判定 | ユーザーの回答と正解を比較し、正解/不正解を決定するプロセス。 | `judgeAnswer()`, `event: AnswerJudged` |
| フィードバック | 回答後に表示される正解/不正解メッセージと正しい答えの説明。 | `showFeedback()`, 「フィードバックを表示する」 |
| 問題番号 | 現在表示されている問題の順番（1/10, 2/10...10/10）。 | `session.currentQuestionNumber`, 「問題番号を表示する」 |
| 正答数 | 全10問のうち、正解した問題の数。 | `session.correctAnswersCount`, 「正答数: 7問」 |
| 正答率 | 正答数を問題総数で割った割合（パーセンテージ）。 | `session.correctRate`, 「正答率: 70%」 |
| 回答履歴 | ユーザーが回答したすべての問題と答えの記録。インメモリで管理。 | `session.answerHistory`, `history.getAnswer(questionId)` |
| セッションリセット | 学習セッションのすべてのデータをクリアし、初期状態に戻すプロセス。 | `resetSession()`, 「学習をリセットする」 |

---

## 禁止用語

| 禁止用語 | 理由 | 推奨用語 |
|---------|------|---------|
| Data | 意味が広すぎて何のデータか不明 | LearningMaterial, QuizQuestion, Answer など具体的な名称 |
| Manager | 責務が不明確（何を管理するのか） | SessionManager → LearningSession, QuizGenerator など役割を明確に |
| Request | WebのHTTPリクエストと混同しやすい | Command（例: GenerateSummaryCommand） |
| Response | WebのHTTPレスポンスと混同しやすい | Event（例: SummaryGenerated） |
| User | 曖昧（システム管理者か学習者か） | Learner（社会人・自習者）, SystemAdmin（システム管理者） |
| Item | 何のアイテムか不明 | QuizQuestion, Article など具体的な名称 |

---

## メモ

### ユビキタス言語の運用ルール

1. **コードとの一致**: クラス名、メソッド名、変数名はユビキタス言語の用語を使用
2. **会話での使用**: チーム内の会話、ドキュメント、仕様書で一貫して使用
3. **更新プロセス**: 新しい用語が必要になったら、このドキュメントに追加してから実装
4. **レビュー**: コードレビュー時に用語の使用が適切か確認

### Bounded Context間の用語の違い

現時点ではContextを跨いで意味が異なる用語はありません。すべての用語はプロジェクト全体で一貫した意味を持ちます。

### 技術用語との対応

| ビジネス用語（ユビキタス言語） | 技術用語 |
|------------------------|---------|
| 教材 | DTO (Data Transfer Object) |
| ○×問題 | Boolean型の選択問題 |
| 学習セッション | インメモリ状態管理オブジェクト |
| 正解判定 | Boolean比較ロジック |
| セッションリセット | 状態の初期化 |

### 今後の拡張

プロジェクトが拡張された場合、以下の用語が追加される可能性があります：

- **学習履歴**: 永続化された過去の学習記録
- **難易度**: 問題の難易度レベル（易しい、普通、難しい）
- **ユーザーアカウント**: 個別ログイン機能追加時の用語
- **学習コース**: 複数記事を組み合わせたカリキュラム
