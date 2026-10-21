import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Form from './Form.jsx'

const queryClient = new QueryClient();

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <Form />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  );
}

createRoot(document.getElementById('root')).render(<App />);
