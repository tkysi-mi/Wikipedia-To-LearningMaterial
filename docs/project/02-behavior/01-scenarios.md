# Gherkinシナリオ一覧

<!--
何を書くか: Gherkin形式で記述した振る舞いシナリオ（BDD）

目的:
  - ユーザー視点での具体的な動作例を記述
  - 開発者、QA、ステークホルダーの共通理解を構築
  - 自動テストの基礎として活用（Cucumber、SpecFlow等）
  - ドメインイベントやコマンドの発見（Event Stormingの入力）

BDD（Behavior-Driven Development）とは:
  - Example First: 具体例から始める開発手法
  - Given-When-Then形式で振る舞いを記述
  - 実行可能なドキュメント（テストとして自動化可能）
  - 非技術者も理解できる平易な言葉で記述

Gherkinとは:
  - BDDのためのドメイン特化言語（DSL）
  - Feature, Scenario, Given, When, Thenなどのキーワードで構成
  - 人間が読みやすく、機械も解析可能
  - Cucumber、SpecFlow、Behatなどのツールで実行可能

ドキュメント構成:
  1. シナリオ一覧テーブル: 全シナリオの概要（検索性、トラッキング）
  2. シナリオ詳細: Feature単位でGherkin形式で記述

記載のポイント:
  - ユーザーストーリーから具体的なシナリオを抽出
  - 1シナリオ = 1つの具体的な例
  - ハッピーパス（正常系）から開始し、徐々にエッジケースを追加
  - 宣言的スタイル（What）で記述、実装詳細（How）は避ける

更新頻度:
  - ユーザーストーリー作成後に作成
  - スプリント計画時に詳細化
  - 実装完了後も Living Documentation として維持
-->

---

## シナリオ一覧

| シナリオID | 機能 | シナリオ名 | 優先度 |
|-----------|------|-----------|--------|
| SC-001 | ベーシック認証 | 正しいパスワードで認証成功 | High |
| SC-002 | ベーシック認証 | 誤ったパスワードで認証失敗 | High |
| SC-003 | Wikipedia URL入力 | 有効なWikipedia URLを入力 | High |
| SC-004 | Wikipedia URL入力 | 無効なURLを入力してエラー表示 | High |
| SC-005 | Wikipedia URL入力 | 空のURLを送信してエラー表示 | Medium |
| SC-006 | サマリ生成 | Wikipedia記事からサマリを生成 | High |
| SC-007 | サマリ生成 | サマリ生成失敗時のエラー表示 | Medium |
| SC-008 | ○×問題生成 | 記事から10問の○×問題を生成 | High |
| SC-009 | 問題回答 | 正解の○×問題に回答 | High |
| SC-010 | 問題回答 | 不正解の○×問題に回答 | High |
| SC-011 | 問題回答 | 全10問を順番に回答 | High |
| SC-012 | 結果表示 | 全問回答後に正答数と正答率を表示 | High |
| SC-013 | 結果表示 | 全問正解の場合の結果表示 | Medium |
| SC-014 | 結果表示 | 全問不正解の場合の結果表示 | Low |
| SC-015 | 再学習 | 結果画面から別の記事で再学習 | High |

---

## Feature: ベーシック認証

```gherkin
@authentication @security
Feature: ベーシック認証
  As a システム管理者
  I want 不特定多数のアクセスを防ぐ
  So that OpenAI APIの不正利用によるコスト増加を避けられる

  @SC-001 @smoke @happy-path
  Scenario: 正しいパスワードで認証成功
    Given アプリケーションにアクセスする
    When 正しいパスワードを入力する
    Then 認証に成功する
    And URL入力画面が表示される

  @SC-002 @error-handling
  Scenario: 誤ったパスワードで認証失敗
    Given アプリケーションにアクセスする
    When 誤ったパスワードを入力する
    Then 認証に失敗する
    And 認証エラーメッセージが表示される
```

---

## Feature: Wikipedia URL入力

```gherkin
@url-input @validation
Feature: Wikipedia URL入力
  As a 社会人（自習者）
  I want WikipediaのURLを入力する
  So that 学習したいトピックの記事を選択し、教材を生成できる

  Background:
    Given ベーシック認証が完了している
    And URL入力画面が表示されている

  @SC-003 @smoke @happy-path
  Scenario: 有効なWikipedia URLを入力
    When Wikipedia記事のURL "https://ja.wikipedia.org/wiki/人工知能" を入力する
    And 送信ボタンをクリックする
    Then サマリ生成画面へ遷移する
    And サマリの生成が開始される

  @SC-004 @validation @error-handling
  Scenario: 無効なURLを入力してエラー表示
    When 無効なURL "https://example.com" を入力する
    And 送信ボタンをクリックする
    Then エラーメッセージ "有効なWikipedia URLを入力してください" が表示される
    And サマリ生成画面へは遷移しない

  @SC-005 @validation @error-handling
  Scenario: 空のURLを送信してエラー表示
    When URL入力フィールドを空のままにする
    And 送信ボタンをクリックする
    Then エラーメッセージ "URLを入力してください" が表示される
    And サマリ生成画面へは遷移しない
```

---

## Feature: サマリ生成

```gherkin
@summary-generation @ai
Feature: サマリ生成
  As a 社会人（自習者）
  I want Wikipedia記事の3行サマリを読む
  So that 記事の概要を素早く把握し、学習価値があるか判断できる

  Background:
    Given ベーシック認証が完了している
    And 有効なWikipedia URL "https://ja.wikipedia.org/wiki/人工知能" が送信されている

  @SC-006 @smoke @happy-path
  Scenario: Wikipedia記事からサマリを生成
    When Wikipedia API から記事を取得する
    And OpenAI API でサマリを生成する
    Then 3行程度のサマリが表示される
    And サマリは記事の主要な内容を簡潔に要約している
    And 「問題を開始」ボタンが表示される

  @SC-007 @error-handling
  Scenario: サマリ生成失敗時のエラー表示
    When Wikipedia API の呼び出しが失敗する
    Then エラーメッセージ "記事の取得に失敗しました。URLを確認してください" が表示される
    And 「問題を開始」ボタンは表示されない
```

---

## Feature: ○×問題生成

```gherkin
@quiz-generation @ai
Feature: ○×問題生成
  As a 社会人（自習者）
  I want ○×問題を生成する
  So that 記事を注意深く読むモチベーションを得られる

  Background:
    Given ベーシック認証が完了している
    And Wikipedia記事のサマリが表示されている
    And 「問題を開始」ボタンをクリックしている

  @SC-008 @smoke @happy-path
  Scenario: 記事から10問の○×問題を生成
    When OpenAI API で○×問題を生成する
    Then 10問の○×問題が生成される
    And 各問題には問題文と正解（○または×）が含まれる
    And 問題は記事の内容に関連している
    And 1問目が表示される
```

---

## Feature: 問題回答

```gherkin
@quiz-answering @learning
Feature: 問題回答
  As a 社会人（自習者）
  I want ○×問題を1問ずつ解く
  So that 能動的な学習体験ができる

  Background:
    Given ベーシック認証が完了している
    And 10問の○×問題が生成されている
    And 1問目が表示されている

  @SC-009 @smoke @happy-path
  Scenario: 正解の○×問題に回答
    Given 問題文は "人工知能は機械学習を含む" である
    And 正解は ○ である
    When ○ボタンをクリックする
    Then 「正解！」メッセージが表示される
    And 「次へ」ボタンが表示される

  @SC-010 @smoke @happy-path
  Scenario: 不正解の○×問題に回答
    Given 問題文は "人工知能は機械学習を含む" である
    And 正解は ○ である
    When ×ボタンをクリックする
    Then 「不正解」メッセージが表示される
    And 正しい答え "正解は ○ です" が表示される
    And 「次へ」ボタンが表示される

  @SC-011 @regression
  Scenario: 全10問を順番に回答
    Given 現在は 1問目 である
    When 1問目に回答して「次へ」をクリックする
    Then 2問目が表示される
    And 問題番号表示は "2/10" である
    When 2問目から9問目まで同様に回答する
    And 10問目に回答して「次へ」をクリックする
    Then 結果画面が表示される
```

---

## Feature: 結果表示

```gherkin
@results @learning
Feature: 結果表示
  As a 社会人（自習者）
  I want 全問終了後に正答数と正答率を見る
  So that 学習の成果を確認し、達成感を得られる

  Background:
    Given ベーシック認証が完了している
    And 全10問に回答済みである

  @SC-012 @smoke @happy-path
  Scenario: 全問回答後に正答数と正答率を表示
    Given 10問中7問に正解している
    When 結果画面が表示される
    Then "7問正解" が表示される
    And "正答率: 70%" が表示される
    And 「別の記事で試す」ボタンが表示される

  @SC-013
  Scenario: 全問正解の場合の結果表示
    Given 10問中10問に正解している
    When 結果画面が表示される
    Then "10問正解" が表示される
    And "正答率: 100%" が表示される
    And おめでとうメッセージが表示される

  @SC-014
  Scenario: 全問不正解の場合の結果表示
    Given 10問中0問に正解している
    When 結果画面が表示される
    Then "0問正解" が表示される
    And "正答率: 0%" が表示される
    And 励ましメッセージが表示される
```

---

## Feature: 再学習

```gherkin
@restart @learning
Feature: 再学習
  As a 社会人（自習者）
  I want 別のWikipedia記事でも学習する
  So that 様々なトピックで知識を広げられる

  Background:
    Given ベーシック認証が完了している
    And 結果画面が表示されている

  @SC-015 @smoke @happy-path
  Scenario: 結果画面から別の記事で再学習
    When 「別の記事で試す」ボタンをクリックする
    Then URL入力画面にリダイレクトされる
    And 前回の学習データ（サマリ、問題、回答）がクリアされている
    And 新しいWikipedia URLを入力できる
```

---

## メモ

### テスト自動化

本プロジェクトはデモ用途のため、BDD自動化ツール（Cucumber、SpecFlow等）の導入は必須ではありません。
ただし、シナリオは手動テストの指針として活用し、将来的な自動化の基盤とします。

### タグ戦略

- **@smoke**: CI/CDで毎回実行する重要な基本機能
- **@regression**: リリース前に実行するリグレッションテスト
- **@happy-path**: 正常系シナリオ
- **@error-handling**: エラーハンドリングのシナリオ
- **@validation**: バリデーションのシナリオ
- **@ai**: AI（OpenAI API）を使用するシナリオ

### シナリオ作成の方針

- **宣言的スタイル**: UIの操作詳細（「ボタンをクリック」）ではなく、ユーザーの意図（「送信する」）に焦点
- **独立性**: 各シナリオは他のシナリオに依存せず、単独で実行可能
- **具体性**: 抽象的な表現を避け、具体的な値や状態を記述
- **ユーザー視点**: 技術用語を避け、ビジネス用語を使用

### カバレッジ目標

- 全8つのユーザーストーリーをカバー（US-001〜US-008）
- 正常系（ハッピーパス）: 8シナリオ
- 異常系（エラーケース）: 7シナリオ
- **合計**: 15シナリオ

### ドメインモデリングとの連携

シナリオの Given-When-Then から、以下のドメインイベントとコマンドを抽出できます：

**コマンド（When）**:
- Wikipedia URLを入力する
- パスワードを入力する
- ○/×ボタンをクリックする

**ドメインイベント（Then）**:
- 認証に成功する
- サマリが生成される
- 問題が生成される
- 正解/不正解が表示される
- 結果が表示される

これらは次のフェーズ（`/a-004-DefineDomainModel`）でドメインモデルの定義に活用されます。
