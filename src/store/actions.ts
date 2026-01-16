import { Product, ProductReview } from '../models/product.model';
import { Order } from '../models/order.model';

// Action Types
const ADD_TO_CART = '[Cart] Add To Cart';
const REMOVE_FROM_CART = '[Cart] Remove From Cart';
const UPDATE_QUANTITY = '[Cart] Update Quantity';
const OPEN_CART = '[UI] Open Cart';
const CLOSE_CART = '[UI] Close Cart';
const OPEN_QUICK_VIEW = '[UI] Open Quick View';
const CLOSE_QUICK_VIEW = '[UI] Close Quick View';
const SET_SHIPPING_DETAILS = '[Checkout] Set Shipping Details';
const PROCESS_SUCCESSFUL_ORDER = '[Checkout] Process Successful Order';
const ADD_PRODUCT_REVIEW = '[Product] Add Review';
const TOGGLE_WISHLIST = '[Wishlist] Toggle Item';
const ADD_PRODUCT = '[Admin] Add Product';
const UPDATE_PRODUCT = '[Admin] Update Product';
const DELETE_PRODUCT = '[Admin] Delete Product';
const ADD_CATEGORY = '[Admin] Add Category';
const DELETE_CATEGORY = '[Admin] Delete Category';


// Action Creators
export const addToCart = (product: Product, selectedVariants?: { [key: string]: string }) => ({
  type: ADD_TO_CART,
  payload: { product, selectedVariants },
} as const);

export const removeFromCart = (cartItemId: string) => ({
  type: REMOVE_FROM_CART,
  payload: { cartItemId },
} as const);

export const updateQuantity = (cartItemId: string, change: number) => ({
  type: UPDATE_QUANTITY,
  payload: { cartItemId, change },
} as const);

export const openCart = () => ({ type: OPEN_CART } as const);
export const closeCart = () => ({ type: CLOSE_CART } as const);

export const openQuickView = (product: Product) => ({
  type: OPEN_QUICK_VIEW,
  payload: { product },
} as const);

export const closeQuickView = () => ({ type: CLOSE_QUICK_VIEW } as const);

export const setShippingDetails = (details: any) => ({
  type: SET_SHIPPING_DETAILS,
  payload: { details },
} as const);

export const processSuccessfulOrder = (order: Order) => ({
  type: PROCESS_SUCCESSFUL_ORDER,
  payload: { order },
} as const);

export const addProductReview = (productId: number, review: ProductReview) => ({
    type: ADD_PRODUCT_REVIEW,
    payload: { productId, review }
} as const);

export const toggleWishlist = (productId: number) => ({
  type: TOGGLE_WISHLIST,
  payload: { productId }
} as const);

export const addProduct = (product: Omit<Product, 'id'>) => ({
    type: ADD_PRODUCT,
    payload: { product }
} as const);

export const updateProduct = (product: Product) => ({
    type: UPDATE_PRODUCT,
    payload: { product }
} as const);

export const deleteProduct = (productId: number) => ({
    type: DELETE_PRODUCT,
    payload: { productId }
} as const);

export const addCategory = (category: { name: string, icon: string }) => ({
    type: ADD_CATEGORY,
    payload: { category }
} as const);

export const deleteCategory = (categoryName: string) => ({
    type: DELETE_CATEGORY,
    payload: { categoryName }
} as const);


// Union type for all actions
export type AppAction =
  | ReturnType<typeof addToCart>
  | ReturnType<typeof removeFromCart>
  | ReturnType<typeof updateQuantity>
  | ReturnType<typeof openCart>
  | ReturnType<typeof closeCart>
  | ReturnType<typeof openQuickView>
  | ReturnType<typeof closeQuickView>
  | ReturnType<typeof setShippingDetails>
  | ReturnType<typeof processSuccessfulOrder>
  | ReturnType<typeof addProductReview>
  | ReturnType<typeof toggleWishlist>
  | ReturnType<typeof addProduct>
  | ReturnType<typeof updateProduct>
  | ReturnType<typeof deleteProduct>
  | ReturnType<typeof addCategory>
  | ReturnType<typeof deleteCategory>;