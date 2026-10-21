# Exercise 1: Product Listing with Caching, Loading States, and Query Keys

A React application built with **TanStack Query v5** demonstrating product listing from a REST API (`dummyjson.com`), caching strategies (`staleTime`, `gcTime`), dynamic query keys with search/filtering, manual refetching, and comprehensive query state handling (`isPending`, `isFetching`, `isError`, `isSuccess`).

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
exercise-1/
├── src/
│   ├── App.jsx        # Main component: search input, refetch button, useQuery configuration, and UI states
│   ├── Products.jsx   # Product display component: renders product cards and handles empty states
│   ├── main.jsx       # Application entry: sets up QueryClientProvider and ReactQueryDevtools
│   └── styles.css     # Styles for page layout and 3-column responsive product card grid
├── index.html
├── package.json
└── README.md
```

---

## Implementation Details

### 1. TanStack Query Provider & DevTools Setup (`src/main.jsx`)
- Initializes a new `QueryClient` instance.
- Wraps the root component with `QueryClientProvider` to make query caching and client methods accessible throughout the component tree.
- Mounts `<ReactQueryDevtools initialIsOpen={false} />` to enable real-time inspection of query keys, cache status, and query lifecycle states.

### 2. API Data Fetching (`fetchProducts` in `src/App.jsx`)
- Fetches products from DummyJSON REST endpoint: `https://dummyjson.com/products/search?q=${searchTerm}`.
- Checks `response.ok` and throws an `Error('Failed to fetch products')` if the network request fails, allowing TanStack Query to transition to the error state.
- Limits the returned array to the first 10 items via `.slice(0, 10)`.

### 3. Query Configuration (`useQuery` in `src/App.jsx`)
- **Query Key**: Uses a hierarchical query key `['products', { search: searchTerm }]`. Whenever `searchTerm` changes, TanStack Query automatically triggers a query for the new key and maintains isolated cache entries for each search keyword.
- **`staleTime: 30 * 1000` (30 seconds)**: Data remains fresh for 30 seconds. Switching between repeated searches or re-renders within this window serves cached data instantly without re-fetching.
- **`gcTime: 5 * 60 * 1000` (5 minutes)**: Inactive search queries stay in the cache memory for 5 minutes before being garbage collected.
- **Manual Refetching**: The **Refresh Products** button invokes `refetch()` to manually invalidate and refetch the current search query on demand.

### 4. UI State Handling (`src/App.jsx`)
- **Initial Loading (`isLoading`)**: Renders `Loading...` when there is no cached data and the query is fetching for the first time.
- **Background Fetching (`isFetching && !isLoading`)**: Displays `Fetching...` during background refetches (e.g. manual refresh or window focus) while keeping existing product data visible on screen.
- **Error State (`isError`)**: Displays `Error: {error.message}` if the fetch fails.
- **Success State (`isSuccess`)**: Renders `<Products products={data} />` when data is successfully resolved.

### 5. Product Presentation (`src/Products.jsx`)
- Displays product card elements including title, thumbnail image, description, price, and category.
- Handles empty search results gracefully with a `"No such product found"` fallback when `products.length === 0`.
- Styled with CSS flexbox layout (`src/styles.css`) in a clean 3-column card grid.

### 6. Separation of Server vs. Client State
- Server state is managed entirely by TanStack Query cache without manual `useEffect()` or `useState()` hooks for storing fetched data.
- React `useState()` is used exclusively for the search input value (`searchTerm`).

---

## Requirements Coverage Matrix

| Requirement | Implementation Detail | Location |
| :--- | :--- | :--- |
| **Install & configure `@tanstack/react-query`** | Added in dependencies; configured with `QueryClient` | `package.json`, `src/main.jsx` |
| **Wrap app with `QueryClientProvider`** | Application wrapped in `QueryClientProvider client={queryClient}` | `src/main.jsx` |
| **Product listing with `useQuery()`** | Query hook implemented with `queryKey` and `queryFn` | `src/App.jsx` |
| **Base query key `['products']`** | Query key defined as `['products', { search: searchTerm }]` | `src/App.jsx` |
| **Implement UI states** | Handled `isLoading`, `isFetching`, `isError`, and `isSuccess` | `src/App.jsx` |
| **Configure cache times** | Set `staleTime: 30 * 1000` and `gcTime: 5 * 60 * 1000` | `src/App.jsx` |
| **Manual refresh button** | Button triggers `refetch()` on click | `src/App.jsx` |
| **Search / filter with query key** | Controlled input updates `searchTerm`, triggering queries for `['products', { search }]` | `src/App.jsx` |
| **No manual `useEffect` for data** | Data fetched and synced solely through `useQuery` | `src/App.jsx` |

---

## Verification & Testing Steps

1. **Initial Load**:
   - Run `npm run dev` and navigate to `http://localhost:5173`.
   - Observe the initial `Loading...` state followed by the product grid displaying 10 products.
2. **React Query DevTools**:
   - Open DevTools via the floating icon in the bottom-left corner.
   - Confirm the query `["products", { "search": "" }]` is present and active.
3. **Search & Query Key Invalidation**:
   - Type a term (e.g. `phone` or `laptop`) into the search input.
   - Observe a new query entry in DevTools: `["products", { "search": "phone" }]`.
   - Verify matching products load, or `"No such product found"` displays if no items match.
4. **Cache & `staleTime` Verification**:
   - Search for `phone`, then clear the input to return to the initial list within 30 seconds.
   - Verify the cached data loads instantly without showing `Loading...` because data is still fresh (`staleTime: 30s`).
5. **Background Refetch**:
   - Click the **Refresh Products** button.
   - Verify the existing product list remains visible while the `Fetching...` indicator appears temporarily.
6. **Error State Verification**:
   - In browser developer tools, set Network to **Offline** or block requests to `dummyjson.com`.
   - Click **Refresh Products** or enter a new search term.
   - Verify the error state displays `Error: Failed to fetch products` (or network error).
