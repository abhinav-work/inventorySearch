import React from 'react'
import styles from './css/product.module.css';
const product = {
    icon: 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp',
    status: 'Avail',
    name: 'Shoe',
    sku: 'ds',
    price: '22',
    quantity: 4
}

const ItemCard = () => {
    return (
        // <div className="card bg-base-100 w-96 shadow-sm">
        //     <figure>
        //         <img
        //         src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
        //         alt="Shoes" />
        //     </figure>
        //     <div className="card-body">
        //         <h2 className="card-title">Card Title</h2>
        //         <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
        //         <div className="card-actions justify-end">
        //         <button className="btn btn-primary">Buy Now</button>
        //         </div>
        //     </div>
        // </div>
        <div className={styles.productCard}>

            <div className={styles.productImage}>
                <img src={product.icon} alt={product.name} />
                <div className={styles.stockBadge}> In Stock</div>
            </div>
            <div className={styles.productInfo}>
                <h3 className="product-name">${product.name}</h3>
                <p className="product-sku">SKU: ${product.sku}</p>
                <div className="product-details">
                    <span className="product-price">₹${product.price.toLocaleString()}</span>
                    <span className="product-quantity">Qty: ${product.quantity}</span>
                </div>
                {/* <div className="product-actions">
                    <button className="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
                    <button className="btn btn-secondary" onclick="viewProduct(${product.id})">View</button>
                </div> */}
            </div>
        </div>

        //    
        //     <div className="product-details">
        //         <span className="product-price">₹${product.price.toLocaleString()}</span>
        //         <span className="product-quantity">Qty: ${product.quantity}</span>
        //     </div>
        //     <div className="product-actions">
        //         <button className="btn btn-primary" onclick="editProduct(${product.id})">Edit</button>
        //         <button className="btn btn-secondary" onclick="viewProduct(${product.id})">View</button>
        //     </div>
        //</div>
    )
}

export default ItemCard
