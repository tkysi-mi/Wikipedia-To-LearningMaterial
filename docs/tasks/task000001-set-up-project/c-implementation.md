# 実装タスクリスト

<!--
実装手順をステップごとに列挙します。
例: 1. パッケージインストール, 2. ESLint設定, 3. Prettier設定, 4. Vitest設定, 5. .env作成
-->

## 実装ステップ
1. `npm init -y`（既にpackage.jsonがある場合はスキップ）
2. 必要パッケージインストール
   ```bash
   npm install next react react-dom typescript @types/react @types/node
   npm install -D tailwindcss postcss autoprefixer eslint prettier vitest @testing-library/react @testing-library/jest-dom
   ```
3. Tailwind CSS 初期化
   ```bash
   npx tailwindcss init -p
   ```
4. ESLint と Prettier 設定ファイル作成（`.eslintrc.json`, `.prettierrc`）
5. Vitest 設定（`vitest.config.ts`）
6. `.env.example` 作成（APIキー、パスワードのプレースホルダー）
7. `npm run lint` と `npm run test` が成功することを確認

## 受け入れ基準
- すべてのコマンドがエラーなしで完了
- `npm run dev` でローカルサーバーが起動し、ページが表示される
- `npm run lint` と `npm run test` が成功
