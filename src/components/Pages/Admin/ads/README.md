# Ads Management Module

This module provides a complete admin interface for managing advertising placements across the platform.

## Features

- ✅ List all ads with pagination and sorting
- ✅ Create new ads
- ✅ Edit existing ads
- ✅ Delete ads with confirmation
- ✅ Advanced targeting options
- ✅ Schedule ads with start/end dates
- ✅ Track impressions and performance
- ✅ Support for seller, customer, and platform ads

## API Endpoints

### List Ads
```
GET /v1/ads
```
Query Parameters:
- `search`: Search by title
- `status`: Filter by status (draft, active, paused, archived)
- `placementKey`: Filter by placement
- `sellerId`: Filter by seller
- `customerId`: Filter by customer
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `sortBy`: Sort field
- `sortOrder`: Sort order (asc, desc)

### Get Single Ad
```
GET /v1/ads/:id
```

### Create Ad
```
POST /v1/ads
```
Body: See CreateAdData type

### Update Ad
```
PUT /v1/ads/:id
```
Body: See UpdateAdData type

### Delete Ad
```
DELETE /v1/ads/:id
```

## Ad Fields

### Required Fields
- `title`: Ad title
- `mediaUrl`: Image or video URL
- `linkUrl`: Target URL when clicked
- `placementKey`: Where the ad appears

### Optional Fields
- `description`: Ad description
- `sellerId`: Seller who owns this ad
- `customerId`: Customer who owns this ad
- `status`: draft | active | paused | archived (default: draft)
- `startAt`: When ad becomes active
- `endAt`: When ad expires
- `weight`: Selection weight (higher = more likely to show)
- `maxImpressionsPerDay`: Daily impression limit
- `targeting`: Advanced targeting criteria

### Targeting Options
- `categorySlug`: Target specific category
- `productType`: Target specific product type
- `country`: Target specific country
- `device`: Target device type (desktop, mobile, tablet)
- `pagePathPattern`: Regex pattern for page path matching

## Placement Keys

Available placement locations:
- `homepage_banner`: Main homepage banner
- `homepage_sidebar`: Homepage sidebar
- `category_banner`: Category page banner
- `category_sidebar`: Category page sidebar
- `category_inline`: Inline within category listings
- `product_detail_sidebar`: Product detail page sidebar
- `product_detail_inline`: Inline on product page
- `cart_sidebar`: Shopping cart sidebar
- `checkout_banner`: Checkout page banner

## Status Values

- `draft`: Ad is being prepared, not shown
- `active`: Ad is live and can be displayed
- `paused`: Ad is temporarily disabled
- `archived`: Ad is permanently disabled

## File Structure

```
src/components/Pages/Admin/ads/
├── AdminAdsPage/
│   ├── index.tsx           # Main list page component
│   ├── SectionAds.tsx      # Table section with actions
│   └── useColumn.tsx       # Column definitions and actions
└── AdminAdFormPage/
    └── index.tsx           # Create/Edit form component
```

## Routes

- `/admin/ads` - List all ads
- `/admin/ads/add` - Create new ad
- `/admin/ads/[id]/edit` - Edit existing ad

## Navigation

The Ads menu item has been added to the admin sidebar navigation in:
- `src/components/Layouts/sidebar/data/index.ts`
- `src/components/Layouts/sidebar/icons.tsx` (AdsIcon)

## Types

All TypeScript types are defined in:
- `src/types/ad.ts`

## Services

API service functions are defined in:
- `src/services/ads.services.ts`

## Usage Example

### Creating an Ad
1. Navigate to `/admin/ads`
2. Click "Add Ad" button
3. Fill in the form:
   - Enter title and description
   - Provide media URL (image/video)
   - Set link URL
   - Choose placement
   - Select status
   - Optionally set schedule and targeting
4. Click "Create Ad"

### Editing an Ad
1. Navigate to `/admin/ads`
2. Click edit icon on the ad you want to modify
3. Update fields as needed
4. Click "Update Ad"

### Deleting an Ad
1. Navigate to `/admin/ads`
2. Click delete icon on the ad you want to remove
3. Confirm deletion in the modal

## Notes

- Platform ads have no seller or customer assigned
- Only one of sellerId or customerId should be set
- Weight determines ad selection probability (higher weight = shown more often)
- maxImpressionsPerDay limits how many times ad is shown per day
- Targeting criteria are all optional and can be combined
- Empty targeting means ad is shown to all users
