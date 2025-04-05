import React from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  attributes?: Record<string, string>;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    name,
    description,
    price,
    currency,
    imageUrl,
    category,
    rating,
    reviewCount,
    inStock,
    attributes
  } = product;

  // Helper function to format price
  const formatPrice = (price: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Helper function to render star rating
  const renderRating = (rating: number): React.ReactNode => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`${id}-full-${id}`} className="full-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <div className="half-star-container">
            <svg className="empty-star" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            <svg className="full-star half-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`${id}-empty-${id}`} className="empty-star" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="image-container">
        <img className="product-image" src={imageUrl} alt={name} />
        <span className="category-badge">{category}</span>
        
        {!inStock && (
          <div className="out-of-stock-overlay">
            <div className="out-of-stock-label">Out of Stock</div>
          </div>
        )}
      </div>
      
      <div className="info-container">
        <h3 className="product-name">{name}</h3>
        
        <div className="rating-container">
          {renderRating(rating)}
          <span className="review-count">({reviewCount} reviews)</span>
        </div>
        
        <p className="product-description">{description}</p>
        
        <div className="price-stock-container">
          <div className="product-price">{formatPrice(price, currency)}</div>
          <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        {attributes && Object.keys(attributes).length > 0 && (
          <div className="attributes-container">
            <h4 className="attributes-title">Features</h4>
            <div className="attributes-grid">
              {Object.entries(attributes).map(([key, value]) => (
                <div key={`${id}-attr-${key}`} className="attribute-item">
                  <span className="attribute-label">{key}: </span>
                  <span className="attribute-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

