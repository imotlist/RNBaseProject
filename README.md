# TallyGreen

> A scalable React Native application built with Ignite boilerplate, featuring custom tools, reusable components, and a screen generator for rapid development.

TallyGreen is a production-ready React Native app template designed to accelerate mobile development. It provides a comprehensive set of pre-built components, custom hooks, utilities, and a powerful screen generator to help you build consistent, maintainable applications.

## Features

- **Screen Generator** - CLI tool to generate new screens from pre-built templates
- **Custom Hooks** - Reusable stateful logic for common patterns
- **UI Components** - Comprehensive library of styled, themeable components
- **Bottom Sheet System** - Built-in bottom sheet with context provider
- **Flash Messages** - Toast notifications with multiple types
- **Infinite List** - Complete solution for paginated lists with search and filters
- **Theme Support** - Centralized theming with light/dark mode support
- **Responsive Design** - Utilities for scaling across different screen sizes

## Quick Start

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start the development server
npm run start

# For iOS simulator
npm run build:ios:sim

# For iOS device
npm run build:ios:device

# For Android
npm run build:android:sim
```

## Project Structure

```
TallyGreen/
├── app/                          # Main application code
│   ├── components/               # Reusable UI components
│   │   ├── filters/             # Filter-related components
│   │   │   ├── FilterBar.tsx    # Active filters display bar
│   │   │   └── FilterChips.tsx  # Selectable filter chips
│   │   ├── list/                # List-related components
│   │   │   ├── InfiniteList.tsx # Complete infinite scroll list
│   │   │   ├── ListEmpty.tsx    # Empty state component
│   │   │   ├── ListError.tsx    # Error state component
│   │   │   ├── ListEndIndicator.tsx  # End of list indicator
│   │   │   ├── ListFooterLoading.tsx # Loading footer
│   │   │   └── ListLoading.tsx  # Initial loading state
│   │   ├── Toggle/              # Toggle components
│   │   │   ├── Checkbox.tsx     # Checkbox input
│   │   │   ├── Radio.tsx        # Radio button
│   │   │   └── Switch.tsx       # Toggle switch
│   │   ├── ui/                  # Additional UI components
│   │   │   ├── Avatar/          # User avatar component
│   │   │   ├── BottomSheetContent/  # Bottom sheet wrapper
│   │   │   ├── Dropdown/        # Select dropdown
│   │   │   ├── Frame/           # Decorative frame component
│   │   │   ├── HeaderApp/       # App header component
│   │   │   ├── IconPack/        # Icon pack component
│   │   │   ├── ImageViewer/     # Image viewing component
│   │   │   ├── Input/           # Input field component
│   │   │   ├── ScreenTitle/     # Screen title component
│   │   │   ├── SearchBar/       # Search input component
│   │   │   ├── Textarea/        # Textarea component
│   │   │   └── TitleBar/        # Title bar component
│   │   ├── AutoImage.tsx        # Auto-sizing image
│   │   ├── Button.tsx           # Button component
│   │   ├── Card.tsx             # Card component
│   │   ├── EmptyState.tsx       # Empty state display
│   │   ├── Header.tsx           # Header component
│   │   ├── Icon.tsx             # Icon wrapper
│   │   ├── ListItem.tsx         # List item component
│   │   ├── Screen.tsx           # Screen wrapper with safe areas
│   │   ├── Text.tsx             # Text component with presets
│   │   └── TextField.tsx        # Text input field
│   ├── config/                  # App configuration files
│   │   ├── config.base.ts       # Base configuration
│   │   ├── config.dev.ts        # Development config
│   │   └── config.prod.ts       # Production config
│   ├── context/                 # React contexts
│   │   ├── AuthContext.tsx      # Authentication state
│   │   ├── ConnectionContext.tsx # Network connection state
│   │   ├── EpisodeContext.tsx   # Episode data state
│   │   └── PermissionContext.tsx # App permissions state
│   ├── hooks/                   # Custom React hooks
│   │   ├── useBottomSheet.ts    # Bottom sheet control
│   │   ├── useFlashMessage.ts   # Toast/flash messages
│   │   ├── useFormikSubmit.ts   # Formik form submission
│   │   ├── useInfiniteList.ts   # Infinite list with pagination
│   │   ├── useInfiniteScroll.tsx # Infinite scroll utilities
│   │   ├── useInternetConnection.ts # Network status
│   │   ├── usePermissions.ts    # Runtime permissions
│   │   └── usePopupMessage.ts   # Popup messages
│   ├── i18n/                    # Internationalization
│   │   ├── en.ts, ar.ts, etc.   # Translation files
│   │   └── translate.ts         # Translation utilities
│   ├── navigators/              # Navigation configuration
│   │   ├── AppNavigator.tsx     # Main app navigator
│   │   ├── AuthNavigator.tsx    # Authentication flow
│   │   ├── DemoNavigator.tsx    # Demo screens
│   │   ├── MainTabNavigator.tsx # Bottom tab navigation
│   │   └── navigationTypes.ts   # Navigation type definitions
│   ├── providers/               # React providers
│   │   ├── AppProvider.tsx      # Main app provider
│   │   ├── BottomSheetProvider.tsx # Bottom sheet context
│   │   ├── FlashMessageProvider.tsx # Flash message wrapper
│   │   └── PopupMessageProvider.tsx # Popup message wrapper
│   ├── screens/                 # Screen components
│   ├── services/                # API and business logic
│   │   └── api/                 # API endpoints and calls
│   ├── templateScreen/          # Screen templates for generator
│   │   ├── layoutList/          # List layout template
│   │   └── layoutContainer/     # Container layout template
│   ├── theme/                   # Theme configuration
│   │   └── context.tsx          # Theme context
│   └── utils/                   # Utility functions
│       ├── helpers/             # Helper functions
│       ├── storage/             # Local storage utilities
│       └── responsive.ts        # Responsive scaling utilities
├── assets/                      # Static assets
│   ├── icons/                   # Icon files
│   └── images/                  # Image files
├── docs/                        # Documentation
│   └── screen-generator.md      # Screen generator guide
├── scripts/                     # Build and utility scripts
│   └── generateScreen.js        # Screen generator CLI
└── package.json                 # Dependencies and scripts
```

## Custom Tools

### Screen Generator

A powerful CLI tool that generates new screens from pre-built templates. Supports two layout types: `list` (for paginated lists) and `container` (for detail/action screens).

**Documentation:** See [docs/screen-generator.md](docs/screen-generator.md)

#### Usage

```bash
# Generate a list-based screen (default)
yarn generate:screen productList list

# Generate a container-based screen
yarn generate:screen userSettings container
```

#### Generated Files

Each screen generates 5 files:
- `index.ts` - Main export file
- `<Feature>List.tsx` / `<Feature>Container.tsx` - Screen controller
- `<Feature>ListView.tsx` / `<Feature>ContainerView.tsx` - UI component
- `<Feature>ListFilter.tsx` / `<Feature>ContainerActionSheet.tsx` - Bottom sheet
- `<Feature>List.styles.ts` / `<Feature>Container.styles.ts` - Styles

## Custom Hooks

### useInfiniteList

A comprehensive hook for infinite scrolling lists with search, filters, pull-to-refresh, and pagination.

```tsx
import { useInfiniteList } from "@/hooks/useInfiniteList"

const { data, isLoading, loadMore, refresh, searchQuery, setSearchQuery, filters, setFilters } = useInfiniteList({
  fetchData: async ({ page, pageSize, searchQuery, filters }) => {
    const response = await api.getItems({ page, pageSize, q: searchQuery, ...filters })
    return { data: response.items, hasMore: response.hasMore }
  },
  pageSize: 20,
})
```

**Returns:** `data`, `isLoading`, `isLoadingMore`, `isRefreshing`, `error`, `hasMore`, `currentPage`, `searchQuery`, `filters`, `loadMore`, `refresh`, `retry`, `reset`, `setSearchQuery`, `setFilters`, `clearFilters`, `refreshControl`, `listRef`, `scrollToTop`

### useBottomSheet

Control bottom sheets from anywhere in your app.

```tsx
import { useBottomSheet } from "@/hooks/useBottomSheet"

const { showBottomSheet, closeBottomSheet } = useBottomSheet()

// Show a bottom sheet
showBottomSheet({
  title: "My Sheet",
  snapPoints: ["50%"],
  renderContent: () => <MyContent onClose={closeBottomSheet} />,
})
```

### useFlashMessage

Display toast/flash messages with multiple types.

```tsx
import { useFlashMessage } from "@/hooks/useFlashMessage"

const { showSuccess, showError, showWarning, showInfo } = useFlashMessage()

// Show messages
showSuccess("Operation completed!")
showError("Something went wrong")
showWarning("Please check your input")
showInfo("New message received")
```

### Other Hooks

| Hook | Purpose |
|------|---------|
| `useInternetConnection` | Monitor network connectivity |
| `usePermissions` | Request and check app permissions |
| `useFormikSubmit` | Handle form submissions with Formik |
| `usePopupMessage` | Show popup messages/modals |

## Reusable Components

### List Components

#### InfiniteList

A complete infinite scroll list component with built-in states.

```tsx
import { InfiniteList } from "@/components/list"

<InfiniteList
  hookOptions={{
    fetchData: async ({ page, pageSize }) => {
      const response = await api.getItems(page, pageSize)
      return { data: response.items, hasMore: response.hasMore }
    },
  }}
  renderItem={(item) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  emptyText="No items found"
/>
```

#### List State Components

Individual components for different list states:

```tsx
import { ListLoading, ListEmpty, ListError, ListEndIndicator } from "@/components/list"

<ListLoading type="initial" />      // Initial loading spinner
<ListEmpty title="No data" message="Get started by..." />
<ListError message="Failed to load" onRetry={retry} retryLabel="Try Again" />
<ListEndIndicator visible={true} />  // "End of list" message
```

### Filter Components

#### SearchBar

A search input with debouncing, clear button, and optional filter button.

```tsx
import { SearchBar } from "@/components/ui/SearchBar"

<SearchBar
  placeholder="Search items..."
  value={searchQuery}
  onSearch={setSearchQuery}
  showClear
  showFilter
  onFilterPress={() => setShowFilters(true)}
/>
```

#### FilterChips

Single or multi-select filter chips.

```tsx
import { FilterChips } from "@/components/filters"

// Single select
<FilterChips
  options={[
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ]}
  selectedValue={status}
  onSelect={setStatus}
/>

// Multi-select
<FilterChips
  multiple
  options={categories}
  selectedValue={selectedCategories}
  onSelect={toggleCategory}
/>
```

#### FilterBar

Display active filters with remove buttons.

```tsx
import { FilterBar } from "@/components/filters"

<FilterBar
  activeFilters={[
    { key: "status", value: "active", label: "Active" },
    { key: "category", value: "books", label: "Books" },
  ]}
  onRemove={(key) => removeFilter(key)}
  onClearAll={clearAllFilters}
/>
```

### Form Components

#### TextField

Styled text input with validation support.

```tsx
import { TextField } from "@/components/TextField"

<TextField
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

#### Dropdown

Select dropdown with options.

```tsx
import { Dropdown } from "@/components/ui/Dropdown"

<Dropdown
  label="Country"
  placeholder="Select a country"
  options={[
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
  ]}
  value={country}
  onSelect={setCountry}
/>
```

#### Toggle Components

Checkbox, radio, and switch components.

```tsx
import { Checkbox, Radio, Switch } from "@/components/Toggle"

<Checkbox
  label="Accept terms"
  value={accepted}
  onToggle={setAccepted}
/>

<Radio
  label="Option 1"
  value={option}
  selectedValue={selectedOption}
  onSelect={setSelectedOption}
/>

<Switch
  label="Enable notifications"
  value={enabled}
  onToggle={setEnabled}
/>
```

### Layout Components

#### Screen

Wrapper component with safe area handling.

```tsx
import { Screen } from "@/components/Screen"

<Screen preset="fixed" safeAreaEdges={["top", "bottom"]}>
  {/* Your content */}
</Screen>
```

#### Card

Card container with consistent styling.

```tsx
import { Card } from "@/components/Card"

<Card
  heading="Card Title"
  content="Card content goes here"
  footer={<Button>Action</Button>}
/>
```

#### Header

Screen header with title and actions.

```tsx
import { Header } from "@/components/Header"

<Header
  title="My Screen"
  leftIcon="back"
  onLeftPress={goBack}
  rightIcon="settings"
  onRightPress={openSettings}
/>
```

### Bottom Sheet

#### BottomSheetContent

Pre-built bottom sheet content with header, body, and footer.

```tsx
import { BottomSheetContent, BottomSheetSection } from "@/components/ui/BottomSheetContent"
import { useBottomSheet } from "@/hooks/useBottomSheet"

const { showBottomSheet, closeBottomSheet } = useBottomSheet()

showBottomSheet({
  snapPoints: ["60%"],
  renderContent: () => (
    <BottomSheetContent
      title="Filter Options"
      primaryButtonLabel="Apply"
      onPrimaryPress={applyFilters}
      secondaryButtonLabel="Reset"
      onSecondaryPress={resetFilters}
      onClose={closeBottomSheet}
    >
      <BottomSheetSection title="Categories">
        <FilterChips options={categories} selectedValue={category} onSelect={setCategory} />
      </BottomSheetSection>
    </BottomSheetContent>
  ),
})
```

### Other Components

| Component | Description |
|-----------|-------------|
| `Avatar` | User avatar with fallback |
| `Button` | Styled button with variants |
| `EmptyState` | Empty state with illustration |
| `Icon` | Icon wrapper using react-native-vector-icons |
| `IconPack` | Custom icon set |
| `ImageViewer` | Image viewing with zoom |
| `ListItem` | List item with press handlers |
| `Text` | Text component with style presets |
| `Textarea` | Multi-line text input |
| `TitleBar` | Title bar with subtitle |

## Theming

The app uses a centralized theming system with `useAppTheme` hook.

```tsx
import { useAppTheme } from "@/theme/context"

const { theme, isDark } = useAppTheme()

// Access theme colors
const backgroundColor = theme.colors.background
const tint = theme.colors.tint
```

## Responsive Utilities

Utilities for scaling across different screen sizes.

```tsx
import { scale, scaleFontSize, moderateScale } from "@/utils/responsive"

const styles = StyleSheet.create({
  box: {
    width: scale(100),           // Scale width
    height: scale(100),          // Scale height
    borderRadius: moderateScale(12),  // Moderate scale for radius
    padding: scale(16),
  },
  text: {
    fontSize: scaleFontSize(16), // Scale font size
  },
})
```

## Documentation

- [Screen Generator Guide](docs/screen-generator.md) - Full documentation for the screen generator tool
- [Ignite Documentation](https://github.com/infinitered/ignite/blob/master/docs/README.md) - Official Ignite docs
- [Ignite Cookbook](https://ignitecookbook.com/) - Community recipes and snippets

## Community

- [Ignite GitHub](https://github.com/infinitered/ignite) - Star us on GitHub!
- [Ignite Slack](https://join.slack.com/t/infiniteredcommunity/shared_invite/zt-1f137np4h-zPTq_CbaRFUOR_glUFs2UA) - Join the community
- [React Native Newsletter](https://reactnativenewsletter.com/) - Stay updated

## License

This project is built on the [Ignite boilerplate](https://github.com/infinitered/ignite) and follows its licensing terms.
