import Image from "next/image";

interface Product {
  name: string;
  description: string;
  price: string;
  images: {
    desktop: string;
    mobile: string;
    tablet: string;
    thumbnail: string;
  };
}

interface CartItem {
    quantity: number;
    thumbnail: string;
    description: string;
    price: string;
  }

interface ProductImages {
    mobile: string;
    tablet: string;
    desktop: string;
  }

interface ProductProps {
  decreaseQuantity: (item: CartItem) => void;
  increaseQuantity: (item: CartItem) => void;
  addToCart: (product: Product) => void;
  useResponsiveImage: (images: ProductImages) => string;
  product: Product;
  cartItem: CartItem | undefined;
}

function ProductCart({
  product,
  decreaseQuantity,
  increaseQuantity,
  addToCart,
  useResponsiveImage,
  cartItem,
}: ProductProps) {
  const responsiveImageSrc = useResponsiveImage(product.images);
  
  return (
    <div className="product-card" key={product.name}>
      <div>
        <Image
          src={responsiveImageSrc}
          width={300}
          height={150}
          alt={product.name}
          priority
        />
        {cartItem ? (
          <div className="quantity-control">
            <button
              onClick={() => decreaseQuantity(cartItem)}
              className="quantity-button"
            >
              <Image
                src="/images/icon-decrement-quantity.svg"
                width={5}
                height={5}
                alt="Decrease quantity"
              />
            </button>
            <span>{cartItem.quantity}</span>
            <button
              onClick={() => increaseQuantity(cartItem)}
              className="quantity-button"
            >
              <Image
                src="/images/icon-increment-quantity.svg"
                width={5}
                height={5}
                alt="Increase quantity"
              />
            </button>
          </div>
        ) : (
          <button
            className="add-to-cart-button"
            onClick={() => addToCart(product)}
          >
            <Image
              src="/images/icon-add-to-cart.svg"
              width={10}
              height={10}
              alt="Add to cart"
            />
            Add To Cart
          </button>
        )}
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">{product.price}</p>
    </div>
  );
}

export default ProductCart;
