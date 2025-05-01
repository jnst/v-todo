# v-todo

GSAPアニメーションを使った美しいTODOアプリです。タスクの追加、完了、削除などの基本機能にアニメーション効果を付けたシンプルで楽しいアプリケーションです。

![GSAPアニメーションTODO](https://github.com/your-username/v-todo/raw/main/app/screenshot.png)

## 特徴

- GSAPアニメーションライブラリを活用
- 美しい追加・削除アニメーション
- タスクの完了時にはお祝いエフェクト
- スクロールに応じた動的なUI
- モバイルフレンドリー

## 技術スタック

- Node v22.15
- PNPM 10.10
- Vite 6.3
- TypeScript 5.7
- GSAP 3.13（アニメーションライブラリ）

## セットアップ

```sh
# リポジトリのクローン
git clone https://github.com/your-username/v-todo.git
cd v-todo/app

# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm run dev
```

## 使用方法

1. 入力フィールドに新しいタスクを入力
2. 「追加」ボタンをクリックするか、Enterキーを押す
3. タスク完了時は✓ボタンをクリック
4. タスク削除時は×ボタンをクリック

## ビルド方法

```sh
# プロダクションビルド
cd app
pnpm run build
```

## 開発メモ

```sh
# プロジェクト初期化
pnpm init
pnpm add gsap

# Viteプロジェクト作成
pnpm create vite app --template vanilla-ts
cd app
pnpm install
pnpm add gsap
```

## ライセンス

ISC
