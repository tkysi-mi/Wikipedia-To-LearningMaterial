# Phase 7 - Manual Testing Guide

## Prerequisites

1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open browser to http://localhost:3000

## Test Scenarios

### 1. Happy Path - Complete User Journey

**Steps:**

1. Navigate to http://localhost:3000
2. Enter password: `test-password-123` (or your configured AUTH_PASSWORD)
3. Click "Login"
4. Enter Wikipedia URL: `https://ja.wikipedia.org/wiki/東京`
5. Click "教材を生成"
6. Wait for summary to load
7. Click "○×問題を開始"
8. Answer all 10 questions
9. View results page

**Expected Results:**

- ✅ Login succeeds and redirects to home page
- ✅ Summary displays in 3 sentences
- ✅ 10 quiz questions are shown
- ✅ Immediate feedback on each answer (correct/incorrect)
- ✅ Results page shows score and percentage
- ✅ Can retry or go home

### 2. Error Scenarios

#### Invalid Password

**Steps:**

1. Navigate to http://localhost:3000
2. Enter password: `wrong-password`
3. Click "Login"

**Expected:**

- ❌ Error message: "パスワードが間違っています"
- ❌ Stays on login page

#### Invalid Wikipedia URL

**Steps:**

1. Login successfully
2. Enter URL: `https://google.com`
3. Click "教材を生成"

**Expected:**

- ❌ Error message: "WikipediaのURLを入力してください"

#### Non-existent Wikipedia Article

**Steps:**

1. Login successfully
2. Enter URL: `https://ja.wikipedia.org/wiki/ThisArticleDoesNotExist12345`
3. Click "教材を生成"

**Expected:**

- ❌ Error message about article not found

## Verification Checklist

- [ ] Login works with correct password
- [ ] Login fails with incorrect password
- [ ] Wikipedia URL validation works
- [ ] Summary generation completes
- [ ] Quiz questions display correctly
- [ ] Answer feedback is immediate
- [ ] Results calculation is correct
- [ ] Navigation between pages works
- [ ] Error messages are user-friendly
- [ ] Loading states are visible

## Notes

- OpenAI API key must be configured in `.env.local`
- Network connection required for Wikipedia API
- Each test may take 10-30 seconds for AI generation
