# Exercise 2: User Management with Mutations, Invalidation, and Optimistic Updates

A React application demonstrating advanced data synchronization patterns with **TanStack Query v5**, including query invalidation, mutations, and optimistic updates with automatic rollback on server errors.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
exercise-2/
├── src/
│   ├── api.js         # In-memory mock database & async API methods
│   ├── hooks.jsx      # TanStack Query custom hooks (useUsers, useCreateUser, useDeleteUser)
│   ├── Form.jsx       # UI component with user creation form and directory list
│   ├── main.jsx       # React root, QueryClientProvider, and ReactQueryDevtools
│   └── styles.css     # Styling for layout, forms, list, and status messages
├── index.html
├── package.json
└── README.md
```

---

## Implementation Details

### 1. Mock API Layer (`src/api.js`)
- Simulates an asynchronous backend with network latency (`delay()` utility).
- Provides `fetchUsers()`, `createUser()`, and `deleteUser()`.
- **Error Simulation**: Randomly fails ~20% of the time (`Math.random() < 0.2`) to test mutation error states and verify optimistic rollbacks.

### 2. Custom Hooks (`src/hooks.jsx`)

#### `useUsers()`
- Uses `useQuery` with query key `['users']`.
- Fetches the current list of users via `fetchUsers`.

#### `useCreateUser()`
- Uses `useMutation` calling `createUser`.
- **Invalidation Strategy**: Upon `onSuccess`, calls `queryClient.invalidateQueries({ queryKey: ['users'] })` to mark the cached user list stale and trigger an automatic background refetch without manual `useEffect` or state synchronization.

#### `useDeleteUser()` (Optimistic Update)
Implements the full optimistic update lifecycle:
1. **`onMutate`**:
   - Cancels outgoing queries using `await queryClient.cancelQueries({ queryKey: ['users'] })` to avoid overwriting optimistic updates.
   - Snapshots the previous cache using `queryClient.getQueryData(['users'])`.
   - Optimistically updates the cache immediately via `queryClient.setQueryData(['users'], ...)` by filtering out the target user ID.
   - Returns `{ previousUsers }` context for potential rollback.
2. **`onError`**:
   - If the server rejects the request (e.g., triggered by the mock failure rate), restores the cache using `queryClient.setQueryData(['users'], context.previousUsers)`.
3. **`onSettled`**:
   - Always invalidates `['users']` to ensure client state is in sync with the server.

### 3. User Interface (`src/Form.jsx` & `src/main.jsx`)
- **App Wrapper**: Sets up `QueryClientProvider` and includes `ReactQueryDevtools` for inspecting query cache, query keys, and fetch statuses.
- **Creation Form**: Inputs for `name`, `email`, and `role` (Admin / User / Guest) with loading state (`isPending`), disabled button, and inline error feedback.
- **Directory List**: Displays users with role and email, loading state indicator, query fetch errors, and individual delete buttons.
- **Error Feedback**: Displays global error banners if creation or optimistic deletion rolls back.

---

## Requirements Coverage

| Requirement | Implementation |
| :--- | :--- |
| **`useUsers()` hook** | Implemented in `src/hooks.jsx` with query key `['users']`. |
| **`useCreateUser()` hook** | Implemented in `src/hooks.jsx` using `useMutation`. |
| **Form with Name, Email, Role** | Controlled form in `src/Form.jsx`. |
| **Mutation states** | Submit button shows `Creating...` while `isPending`; displays error message on failure. |
| **Query invalidation** | `queryClient.invalidateQueries({ queryKey: ['users'] })` called in `onSuccess` of create mutation. |
| **`useDeleteUser()` hook** | Implemented in `src/hooks.jsx` using `useMutation`. |
| **Optimistic deletion** | `onMutate` cancels queries, saves snapshot, and updates cache via `setQueryData`. |
| **Rollback on error** | `onError` restores previous cache from context snapshot. |
| **Sync on settled** | `onSettled` invalidates `['users']` query cache. |
| **No manual `useEffect`** | Data synchronization handled entirely by TanStack Query. |

---

## Verification & Testing Steps

1. **Initial Load**:
   - Start the app and confirm the initial mock users (`ABC`, `DEF`) appear once `isLoadingUsers` finishes.
2. **Create User**:
   - Fill in the form and click **Create User**.
   - Observe the button state change to `Creating...`.
   - Once complete, form fields reset and the new user appears in the list via automatic query invalidation.
   - (If the 20% random error hits, verify that "Failed to create user. Please try again." is displayed).
3. **Inspect Cache with DevTools**:
   - Open the React Query DevTools toggle at the bottom-left corner of the screen.
   - Observe the `['users']` query key transitioning between `fresh`, `fetching`, and `stale`.
4. **Optimistic Deletion**:
   - Click **Delete** on any user.
   - Observe that the user row disappears immediately from the UI without waiting for network response.
5. **Rollback Verification**:
   - Because `deleteUser` has a 20% failure simulation, delete a few users until a failure occurs.
   - When a deletion fails, verify that:
     - The user is restored back into the directory list automatically.
     - The rollback message *"Failed to delete user. The list has been restored."* is displayed.
