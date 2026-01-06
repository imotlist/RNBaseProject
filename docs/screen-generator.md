# Screen Generator Documentation

A command-line tool to generate new screens from pre-built templates. This generator accelerates development by providing consistent, production-ready screen scaffolds with best practices built-in.

## Overview

The generator creates screens from two layout templates:

- **`layoutList`** - For list-based screens with search, filters, and infinite scrolling
- **`layoutContainer`** - For container-based screens with detail views and action menus

## Quick Start

```bash
# Generate a list-based screen
yarn generate:screen productList list

# Generate a container-based screen
yarn generate:screen userSettings container
```

## Usage

```bash
yarn generate:screen <featureName> [layoutType]
```

### Arguments

| Argument | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `featureName` | string | Yes | - | The name of your feature (will be transformed to various cases) |
| `layoutType` | string | No | `list` | Either `list` or `container` |

### Examples

```bash
# List layout (default)
yarn generate:screen products list
yarn generate:screen products        # same as above

# Container layout
yarn generate:screen productDetail container
yarn generate:screen userProfile container
```

## Generated Files

Each screen generates 5 files in `app/screens/<featureName>/`:

### List Layout Files

| Template | Generated File | Purpose |
|----------|---------------|---------|
| `index.ts` | `index.ts` | Main export file |
| `layoutList.tsx` | `<Feature>List.tsx` | Screen controller with business logic |
| `layoutList.view.tsx` | `<Feature>ListView.tsx` | Presentational UI component |
| `layoutList.filter.tsx` | `<Feature>ListFilter.tsx` | Bottom sheet filter component |
| `layoutList.styles.ts` | `<Feature>List.styles.ts` | StyleSheet constants |

### Container Layout Files

| Template | Generated File | Purpose |
|----------|---------------|---------|
| `index.ts` | `index.ts` | Main export file |
| `layoutContainer.tsx` | `<Feature>Container.tsx` | Screen controller with business logic |
| `layoutContainer.view.tsx` | `<Feature>ContainerView.tsx` | Presentational UI component |
| `layoutContainer.menu.tsx` | `<Feature>ContainerActionSheet.tsx` | Bottom sheet menu component |
| `layoutContainer.styles.ts` | `<Feature>Container.styles.ts` | StyleSheet constants |

## Name Transformations

The `featureName` is automatically transformed to different casing conventions:

| Input | PascalCase | camelCase | Usage in Generated Files |
|-------|-----------|-----------|-------------------------|
| `productList` | `ProductList` | `productList` | Component names, imports |
| `user-profile` | `UserProfile` | `userProfile` | Component names, imports |
| `order_details` | `OrderDetails` | `orderDetails` | Component names, imports |

## Template Features

### List Layout (`layoutList`)

- **Search** - Integrated SearchBar component
- **Filters** - FilterChips in bottom sheet
- **Infinite Scroll** - Uses `useInfiniteList` hook
- **Pull to Refresh** - RefreshControl support
- **Empty States** - Loading and empty list handling
- **Active Filters** - Visual indicator for active filters

### Container Layout (`layoutContainer`)

- **Detail View** - Selected item details display
- **Action Menu** - Bottom sheet with action items
- **Pull to Refresh** - RefreshControl support
- **Selection State** - Track selected items
- **Action Handlers** - Pre-built action handling (view, edit, delete, share, etc.)

## After Generation

### 1. Update API Calls

Edit the main screen file (e.g., `ProductList.tsx`):

```tsx
// Replace the TODO section with actual API calls
const fetchData = useCallback(async (page: number) => {
  const response = await api.products.list({ page, limit: 20 })
  return response.data
}, [])
```

### 2. Define Your Types

Update the exported types to match your data:

```tsx
export interface ProductListData {
  id: string
  title: string
  value: string | number
  // Add your custom fields
}
```

### 3. Add to Navigator

Register your screen in the navigation configuration:

```tsx
import { ProductList } from "@/screens/productList"

// In your navigator:
<Stack.Screen name="ProductList" component={ProductList} />
```

### 4. Customize UI

Modify the view component (e.g., `ProductListView.tsx`) to match your design:
- Update item rendering
- Add custom components
- Modify styling

### 5. Customize Actions/Actions

Edit the filter or action sheet (e.g., `ProductListFilter.tsx`):
- Add/remove filter options
- Update action items
- Custom handlers

## Regenerating a Screen

If you need to regenerate a screen, first delete the existing directory:

```bash
# Windows
rmdir /s app\screens\productList

# Unix/Mac
rm -rf app/screens/productList

# Then regenerate
yarn generate:screen productList list
```

**Warning**: This will delete any customizations you made to the screen.

## Project Structure

```
app/
├── templateScreen/
│   ├── layoutList/
│   │   ├── index.ts
│   │   ├── layoutList.tsx
│   │   ├── layoutList.view.tsx
│   │   ├── layoutList.filter.tsx
│   │   └── layoutList.styles.ts
│   └── layoutContainer/
│       ├── index.ts
│       ├── layoutContainer.tsx
│       ├── layoutContainer.view.tsx
│       ├── layoutContainer.menu.tsx
│       └── layoutContainer.styles.ts
└── screens/
    └── <your generated screens>/
scripts/
└── generateScreen.js
```

## Customization

### Modifying Templates

Templates are located in `app/templateScreen/`. Edit these files to change default behavior for all future generated screens:

1. Edit the template file
2. All future generated screens will use your changes

### Adding New Layouts

To add a new layout type:

1. Create a new directory in `app/templateScreen/` (e.g., `layoutForm`)
2. Add template files with the naming convention `layoutForm.*`
3. Update `scripts/generateScreen.js`:

```javascript
const LAYOUT_TEMPLATES = {
  list: 'layoutList',
  container: 'layoutContainer',
  form: 'layoutForm',  // Add your new layout
}
```

## Troubleshooting

### Error: Screen directory already exists

The generator prevents overwriting existing screens. Delete the directory first if you want to regenerate.

### TypeScript Errors After Generation

Some TypeScript errors may occur until you:
- Update the types to match your data
- Implement the TODO sections
- Add missing imports for your custom components

### Missing Components

The templates use shared components from `@/components/`. Ensure these exist:
- `Screen`
- `Text`
- `Icon`
- `SearchBar`
- `FilterChips`
- `InfiniteList`
- `BottomSheetContent`

## Best Practices

1. **Keep templates updated** - When you find improvements, update the templates
2. **Use consistent naming** - Use kebab-case, camelCase, or snake_case for feature names
3. **Customize in the screen files** - Avoid modifying templates for one-off changes
4. **Document custom patterns** - If you add common patterns to templates, document them here
