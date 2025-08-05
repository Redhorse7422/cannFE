# Seller Module - Admin Template

A complete Seller management module for the admin template, following the existing theme patterns and API structure.

## 🚀 Features

### 1. **Seller List Page** (`/admin/sellers`)
- **Smart Paginated Table** with sorting and filtering
- **Advanced Filters**: Status, Verification Status, City, State, Country, Date Range
- **Search**: Business name and description search
- **Actions**: View, Edit, Delete sellers
- **Statistics Display**: Products, Sales, Revenue, Rating

### 2. **Seller Details Page** (`/admin/sellers/[id]`)
- **Tabbed Interface**: Profile, Business Info, Documents, Statistics
- **Status Cards**: Status, Verification, Products, Revenue
- **Complete Information Display**: All seller data with proper formatting
- **User Information**: Linked user details when available

### 3. **Seller Create/Edit Form** (`/admin/sellers/create` & `/admin/sellers/[id]/edit`)
- **Comprehensive Form**: All seller fields with proper validation
- **Organized Sections**: Basic Info, Contact, Address, Legal, Status, Financial, Images
- **Form Validation**: Required fields, email, URL validation
- **Image Upload Support**: Profile and banner image URLs

## 📁 File Structure

```
src/
├── types/
│   └── seller.ts                    # Seller type definitions
├── services/
│   └── seller.services.ts           # API service functions
├── components/Pages/Admin/
│   ├── AdminSellersPage/            # Main sellers list page
│   │   ├── index.tsx               # Main component
│   │   ├── SectionFilter.tsx       # Filter section
│   │   ├── SectionSellers.tsx      # Table section
│   │   ├── FormFilter.tsx          # Filter form
│   │   ├── useColumn.tsx           # Table columns hook
│   │   └── SellerFilterContext.tsx # Filter context
│   └── sellers/
│       ├── AdminSellerDetailPage/  # Seller details page
│       │   └── index.tsx
│       └── AdminSellerFormPage/    # Create/Edit form
│           └── index.tsx
└── app/(manager)/admin/(session)/sellers/
    ├── page.tsx                    # Main sellers page route
    ├── create/
    │   └── page.tsx               # Create seller route
    └── [id]/
        ├── page.tsx               # Seller details route
        └── edit/
            └── page.tsx           # Edit seller route
```

## 🔧 API Integration

### Endpoints Used
- `GET /api/v1/sellers` - List all sellers with pagination & filters
- `GET /api/v1/sellers/:id` - Get seller by ID
- `GET /api/v1/sellers/user/:userId` - Get seller by user ID
- `POST /api/v1/sellers` - Create new seller
- `PUT /api/v1/sellers/:id` - Update seller
- `DELETE /api/v1/sellers/:id` - Delete seller

### Query Parameters Supported
- `page`, `limit` - Pagination
- `search` - Search in business name/description
- `status` - Filter by status
- `verificationStatus` - Filter by verification status
- `businessCity`, `businessState`, `businessCountry` - Location filters
- `includeUser` - Include user information
- `includeProducts` - Include product statistics

## 🎨 UI Components Used

### Form Elements
- `TextField` - Text inputs
- `TextAreaField` - Multi-line text inputs
- `SelectField` - Dropdown selects
- `Button` - Action buttons

### Layout Components
- `Card` - Content containers
- `Grid` & `GridItem` - Responsive layouts
- `SmartPaginatedTable` - Data table with pagination
- `Icon` - Icon components

### Status Badges
- **Status**: Pending, Approved, Rejected, Suspended, Inactive
- **Verification**: Unverified, Pending, Verified, Rejected

## 📊 Data Fields

### Basic Information
- User ID (required)
- Business Name
- Business Description

### Contact Information
- Business Email
- Business Phone
- Business Website

### Address Information
- Business Address
- City, State, Postal Code, Country

### Legal Information
- Tax ID
- License Number
- License Expiry Date

### Status & Verification
- Status (pending/approved/rejected/suspended/inactive)
- Verification Status (unverified/pending/verified/rejected)
- Verification Documents

### Financial Information
- Commission Rate (%)
- Payout Method
- Payout Details

### Images
- Profile Image URL
- Banner Image URL

### Statistics (read-only)
- Total Products
- Total Sales
- Total Orders
- Total Revenue
- Rating & Review Count

## 🚀 Getting Started

1. **Navigation**: The "Sellers" menu item has been added to the admin sidebar
2. **Access**: Navigate to `/admin/sellers` to view the seller list
3. **Create**: Click "Add Seller" to create a new seller
4. **View**: Click the eye icon to view seller details
5. **Edit**: Click the edit icon to modify seller information
6. **Delete**: Click the delete icon to remove a seller

## 🔒 Security & Validation

- **Form Validation**: Required fields, email format, URL format
- **Status Management**: Admin can change seller status and verification
- **Data Protection**: Sensitive information properly handled
- **Error Handling**: Comprehensive error messages and loading states

## 🎯 Key Features

### Filtering & Search
- Real-time search across business name and description
- Multi-criteria filtering (status, verification, location)
- Date range filtering
- Reset functionality

### Responsive Design
- Mobile-friendly layouts
- Responsive grid systems
- Adaptive table columns

### User Experience
- Loading states for all operations
- Success/error toast notifications
- Confirmation dialogs for destructive actions
- Breadcrumb navigation

## 🔄 State Management

- **Filter Context**: Manages filter state across components
- **Form State**: React Hook Form for form management
- **API State**: React Query for data fetching and caching
- **Toast Notifications**: Global notification system

## 🎨 Theme Integration

The module follows the existing theme patterns:
- Consistent color scheme and spacing
- Matching component styles
- Unified icon system
- Responsive design patterns
- Card-based layouts

## 📝 Notes

- All components are fully typed with TypeScript
- Follows existing code patterns and conventions
- Integrates seamlessly with the current admin template
- Ready for production use
- Extensible for future enhancements

## 🚀 Future Enhancements

Potential improvements that could be added:
- Bulk operations (approve/reject multiple sellers)
- Export functionality (CSV/Excel)
- Advanced analytics dashboard
- Document upload functionality
- Email notifications
- Audit trail
- Performance metrics 