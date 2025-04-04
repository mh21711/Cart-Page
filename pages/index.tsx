import Image from "next/image";
import { products } from "../data";
import { useEffect, useRef, useState } from "react";

export interface CartItem {
  quantity: number;
  thumbnail: string;
  description: string;
  price: string;
}

export interface ProductImages {
  mobile: string;
  tablet: string;
  desktop: string;
}

export interface Product {
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

function ShoppingCartApp() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [orderTotal, setOrderTotal] = useState<string>("$0.00");
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Observe container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Add product to cart
  function addToCart(product: Product) {
    const newItem: CartItem = {
      quantity: 1,
      thumbnail: product.images.thumbnail,
      description: product.description,
      price: product.price,
    };

    setCartItems((prevItems) => [...prevItems, newItem]);
  }

  // Update cart totals whenever cart items change
  useEffect(() => {
    // Calculate total number of items
    const itemCount = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItems(itemCount);

    // Calculate order total
    const total = cartItems
      .reduce(
        (sum, item) => sum + parseFloat(item.price.slice(1)) * item.quantity,
        0
      )
      .toFixed(2);
    setOrderTotal(`$${total}`);
  }, [cartItems]);

  // Decrease item quantity
  function decreaseQuantity(item: CartItem) {
    const updatedCart = cartItems
      .map((cartItem) => {
        if (cartItem === item) {
          return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
      })
      .filter((item) => item.quantity > 0); // Remove items with zero quantity

    setCartItems(updatedCart);
  }

  // Increase item quantity
  function increaseQuantity(item: CartItem) {
    const updatedCart = cartItems.map((cartItem) => {
      if (cartItem === item) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });

    setCartItems(updatedCart);
  }

  // Remove item from cart
  function removeFromCart(item: CartItem) {
    const updatedCart = cartItems.filter((cartItem) => cartItem !== item);
    setCartItems(updatedCart);
  }

  // Confirm order
  function confirmOrder() {
    if (cartItems.length > 0) {
      setIsOrderConfirmed(true);
    }
  }

  // Start new order
  function startNewOrder() {
    setIsOrderConfirmed(false);
    setCartItems([]);
  }

  return (
    <div className="app-container" ref={containerRef}>
      {/* Products Section */}
      <div className="products-section">
        <h1>Desserts</h1>
        <div className="products-grid">
          {products.map((product) => {
            const cartItem = cartItems.find(
              (item) => product.description === item.description
            );

            return (
              <div className="product-card" key={product.name}>
                <div>
                  <Image
                    src={
                      containerWidth <= 768
                        ? product.images.mobile
                        : containerWidth <= 1024
                        ? product.images.tablet
                        : product.images.desktop
                    }
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
          })}
        </div>
      </div>

      {/* Shopping Cart Section */}
      <div className="shopping-cart">
        <h2>Your Cart ({totalItems})</h2>
        {totalItems === 0 ? (
          <div className="empty-cart">
            <Image
              src="/images/illustration-empty-cart.svg"
              width={40}
              height={40}
              alt="Empty cart"
            />
            <p>Your added Items will appear Here.</p>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.description}>
                <div className="item-details">
                  <p>{item.description}</p>
                  <p>
                    <span>{item.quantity}x</span> <span>@{item.price}</span>
                    <span>
                      $
                      {(
                        parseFloat(item.price.slice(1)) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </p>
                </div>
                <button
                  className="remove-item"
                  onClick={() => removeFromCart(item)}
                  aria-label="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="order-summary">
              <p>Order Total</p>
              <p>{orderTotal}</p>
            </div>
            <p className="carbon-neutral">
              <Image
                src="/images/icon-carbon-neutral.svg"
                width={5}
                height={5}
                alt="Carbon neutral"
              />
              This is a carbon-neutral delivery
            </p>
            <button
              className="confirm-order-button"
              onClick={confirmOrder}
              disabled={cartItems.length === 0}
            >
              Confirm Order
            </button>
          </div>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {isOrderConfirmed && (
        <div className="order-confirmation">
          <div className="confirmation-content">
            <Image
              src="/images/icon-order-confirmed.svg"
              width={10}
              height={10}
              alt="Order confirmed"
            />
            <h2>Order Confirmed</h2>
            <p>We hope you enjoy your food!</p>
            <div className="order-details">
              {cartItems.map((item) => (
                <div key={item.description} className="confirmed-item">
                  <div className="item-info">
                    <Image
                      src={item.thumbnail}
                      width={20}
                      height={20}
                      alt={item.description}
                    />
                    <div>
                      <p>{item.description}</p>
                      <p>
                        <span>{item.quantity}x</span>{" "}
                        <span>@ {item.price}</span>
                      </p>
                    </div>
                  </div>
                  <p className="item-total">
                    $
                    {(parseFloat(item.price.slice(1)) * item.quantity).toFixed(
                      2
                    )}
                  </p>
                </div>
              ))}
              <div className="confirmed-total">
                <p>Order Total</p>
                <p>{orderTotal}</p>
              </div>
              <button className="new-order-button" onClick={startNewOrder}>
                Start New Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCartApp;
