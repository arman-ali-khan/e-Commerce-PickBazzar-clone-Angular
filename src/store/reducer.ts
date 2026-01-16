import { AppState } from './state';
import { AppAction } from './actions';
import { CartItem } from '../models/cart-item.model';

// Helper function (kept from original service)
function getCartItemId(productId: number, selectedVariants?: { [key: string]: string }): string {
    if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
      return `${productId}`;
    }
    const variantKey = Object.keys(selectedVariants).sort().map(key => `${key}:${selectedVariants[key]}`).join('|');
    return `${productId}-${variantKey}`;
}

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case '[Cart] Add To Cart': {
      const { product, selectedVariants } = action.payload;
      const cartItemId = getCartItemId(product.id, selectedVariants);
      
      let finalPrice = product.price;
      if (product.variants && selectedVariants) {
          product.variants.forEach(variant => {
              const selectedOptionName = selectedVariants[variant.type];
              if (selectedOptionName) {
                  const selectedOption = variant.options.find(opt => opt.name === selectedOptionName);
                  if (selectedOption?.priceModifier) {
                      finalPrice += selectedOption.priceModifier;
                  }
              }
          });
      }

      const itemInCart = state.cartItems.find(item => item.cartItemId === cartItemId);
      
      let newCartItems: CartItem[];
      if (itemInCart) {
        newCartItems = state.cartItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        const newItem: CartItem = { 
          ...product, 
          price: finalPrice,
          cartItemId, 
          quantity: 1, 
          selectedVariants: selectedVariants || {}
        };
        newCartItems = [...state.cartItems, newItem];
      }
      return { ...state, cartItems: newCartItems };
    }

    case '[Cart] Remove From Cart': {
        const { cartItemId } = action.payload;
        return {
            ...state,
            cartItems: state.cartItems.filter(item => item.cartItemId !== cartItemId)
        };
    }
      
    case '[Cart] Update Quantity': {
        const { cartItemId, change } = action.payload;
        const newCartItems = state.cartItems
            .map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
            )
            .filter(item => item.quantity > 0);
        return { ...state, cartItems: newCartItems };
    }

    case '[UI] Open Cart':
      return { ...state, isCartOpen: true };
    
    case '[UI] Close Cart':
      return { ...state, isCartOpen: false };

    case '[UI] Open Quick View':
      return { ...state, quickViewProduct: action.payload.product };

    case '[UI] Close Quick View':
      return { ...state, quickViewProduct: null };

    case '[Checkout] Set Shipping Details':
        return { ...state, shippingDetails: action.payload.details };

    case '[Checkout] Process Successful Order':
        return {
            ...state,
            lastSuccessfulOrder: action.payload.order,
            cartItems: [],
            shippingDetails: null,
        };

    case '[Product] Add Review': {
        const { productId, review } = action.payload;
        const newProducts = state.products.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.reviews ? [...p.reviews, review] : [review];
                return { ...p, reviews: updatedReviews };
            }
            return p;
        });
        return { ...state, products: newProducts };
    }

    case '[Wishlist] Toggle Item': {
        const { productId } = action.payload;
        const isInWishlist = state.wishlist.includes(productId);
        let newWishlist: ReadonlyArray<number>;
        if (isInWishlist) {
            newWishlist = state.wishlist.filter(id => id !== productId);
        } else {
            newWishlist = [...state.wishlist, productId];
        }
        return { ...state, wishlist: newWishlist };
    }

    case '[Admin] Add Product': {
        const newProduct = action.payload.product;
        const newId = (state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) : 0) + 1;
        return { ...state, products: [...state.products, { ...newProduct, id: newId }] };
    }

    case '[Admin] Update Product': {
        const updatedProduct = action.payload.product;
        return {
            ...state,
            products: state.products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
        };
    }

    case '[Admin] Delete Product': {
        return {
            ...state,
            products: state.products.filter(p => p.id !== action.payload.productId)
        };
    }
    
    case '[Admin] Add Category': {
        const newCategory = action.payload.category;
        const exists = state.categories.some(c => c.name.toLowerCase() === newCategory.name.toLowerCase());
        if (exists) return state; // Don't add if it exists
        return { ...state, categories: [...state.categories, newCategory] };
    }
    
    case '[Admin] Delete Category': {
        return {
            ...state,
            categories: state.categories.filter(c => c.name !== action.payload.categoryName)
        };
    }

    default:
      return state;
  }
}