import React from 'react';

export default function Products({ products }) {
    return (
        <div className="products">
            <h1>Products</h1>
            {products.length === 0 && <p>No such product found</p>}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <h2>{product.title}</h2>
                        <img src={product.thumbnail} />
                        <p><strong>Description: </strong>{product.description}</p>
                        <p><strong>Price: </strong>{product.price}</p>
                        <p><strong>Category: </strong> {product.category}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}