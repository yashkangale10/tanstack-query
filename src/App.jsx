import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Products from "./Products";
import React from 'react';

const fetchProducts = async (searchTerm) => {
    const response = await fetch(`https://dummyjson.com/products/search?q=${searchTerm}`);

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products.slice(0, 10);
}

export default function App() {
    const [searchTerm, setSearchTerm] = useState('');

    const { data, isLoading, isError, error, isFetching, isPending, isSuccess, refetch } = useQuery({
        queryKey: ['products', { search: searchTerm }],
        queryFn: () => fetchProducts(searchTerm),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000
    })

    return (
        <div className="main">
            <div className="action-items">
                <input
                    className="search"
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => refetch()}
                >
                    Refresh Products
                </button>
            </div>
            <div className="products">
                {isLoading && <div>Loading...</div>}
                {isFetching && !isLoading && <div>Fetching...</div>}
                {isError && <div>Error: {error.message}</div>}
                {isSuccess && data && <Products products={data} />}
            </div>
        </div>
    )
}