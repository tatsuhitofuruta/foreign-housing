# Foreign Housing - Real Estate Review Platform

## コンセプト

訪日外国人・在住外国人向けに、物件情報＋レビューを直感的に閲覧できるプラットフォーム

## ベンチマーク

- **海外**: Zillow, Rightmove
- **国内**: マンションノート

## 主要機能

### 1. 物件検索・閲覧
- エリア、価格帯、物件タイプでの検索
- 地図上での物件表示
- フィルタリング機能（価格、広さ、築年数など）
- 検索結果の並び替え

### 2. 物件詳細
- 基本情報（価格、広さ、間取り、築年数など）
- 写真ギャラリー
- 周辺環境情報
- 交通アクセス情報
- レビュー・評価

### 3. レビュー機能（C2C）
- 星評価（5段階）
- テキストレビュー
- カテゴリ別評価（立地、設備、管理など）
- 写真投稿
- レビューの「役に立った」投票
- レビュー投稿には認証必要

### 4. ユーザー機能
- 会員登録・ログイン
- プロフィール管理
- お気に入り物件保存
- レビュー履歴

### 5. 多言語対応
- 英語（メイン）
- 日本語
- 将来的に中国語、韓国語など追加可能

## 技術スタック

### フロントエンド
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context / Zustand
- **Form**: React Hook Form + Zod
- **i18n**: next-intl

### バックエンド
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (画像保存)
- **API**: Next.js API Routes / Server Actions

### 外部サービス
- **Maps**: Google Maps API / Mapbox
- **Image**: Next.js Image Optimization

## データモデル

### Properties (物件)
```typescript
{
  id: string
  title: string
  title_ja: string
  description: string
  description_ja: string
  price: number
  currency: string
  property_type: 'apartment' | 'house' | 'condo' | 'studio'
  bedrooms: number
  bathrooms: number
  area_sqm: number
  year_built: number
  address: string
  latitude: number
  longitude: number
  prefecture: string
  city: string
  ward: string
  station_nearest: string
  station_walk_minutes: number
  images: string[]
  amenities: string[]
  created_at: timestamp
  updated_at: timestamp
}
```

### Reviews (レビュー)
```typescript
{
  id: string
  property_id: string
  user_id: string
  rating_overall: number (1-5)
  rating_location: number (1-5)
  rating_facilities: number (1-5)
  rating_management: number (1-5)
  rating_value: number (1-5)
  title: string
  comment: string
  images: string[]
  helpful_count: number
  created_at: timestamp
  updated_at: timestamp
}
```

### Users (ユーザー)
```typescript
{
  id: string
  email: string
  display_name: string
  avatar_url: string
  locale: string
  created_at: timestamp
}
```

### Favorites (お気に入り)
```typescript
{
  id: string
  user_id: string
  property_id: string
  created_at: timestamp
}
```

## UIデザイン方針

### カラースキーム
- プライマリ: ブルー系（信頼感）
- セカンダリ: グリーン系（安心感）
- ニュートラル: グレー系

### レイアウト
- レスポンシブデザイン（モバイルファースト）
- カード型レイアウト（Zillow風）
- 大きな画像とクリアなCTA
- わかりやすいナビゲーション

### タイポグラフィ
- 英語: Inter / Roboto
- 日本語: Noto Sans JP
- 読みやすさ重視

## ディレクトリ構造

```
foreign-housing/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              # ホーム
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx          # 物件一覧
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # 物件詳細
│   │   │   ├── search/
│   │   │   │   └── page.tsx          # 検索結果
│   │   │   └── profile/
│   │   │       └── page.tsx          # プロフィール
│   │   └── api/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui
│   │   ├── property/                 # 物件関連
│   │   ├── review/                   # レビュー関連
│   │   ├── search/                   # 検索関連
│   │   └── layout/                   # レイアウト
│   ├── lib/
│   │   ├── supabase/                 # Supabase設定
│   │   ├── utils/                    # ユーティリティ
│   │   └── validations/              # Zodスキーマ
│   ├── types/                        # 型定義
│   ├── hooks/                        # カスタムフック
│   └── messages/                     # i18n翻訳ファイル
├── public/
│   └── images/
├── supabase/
│   └── migrations/
└── docs/
```

## 開発フェーズ

### Phase 1: 基盤構築
- Next.jsプロジェクトセットアップ
- Tailwind CSS + shadcn/ui導入
- 型定義・データモデル作成
- 多言語対応基盤

### Phase 2: 物件機能
- ホームページ
- 物件一覧・検索
- 物件詳細ページ
- 地図統合

### Phase 3: レビュー機能
- レビュー表示
- レビュー投稿フォーム
- 写真アップロード
- 評価集計

### Phase 4: ユーザー機能
- 認証システム
- プロフィール
- お気に入り機能
- レビュー管理

## セキュリティ考慮事項

- XSS対策: 入力のサニタイズ
- CSRF対策: トークン検証
- 認証: JWT + セッション管理
- 画像アップロード: サイズ・形式制限
- レート制限: API呼び出し制限

## パフォーマンス最適化

- Next.js Image Optimization
- 動的インポート・コード分割
- ISR (Incremental Static Regeneration)
- キャッシング戦略
- 遅延読み込み
