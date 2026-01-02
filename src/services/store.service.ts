import { Injectable, signal, computed } from '@angular/core';
import { Product, ProductReview } from '../models/product.model';
import { CartItem } from '../models/cart-item.model';

export interface Order {
  items: CartItem[];
  shipping: any;
  subtotal: number;
  shippingCost: number;
  total: number;
}

const products: Product[] = [
    { id: 1, name: 'Organic Bananas', category: 'Fruits', price: 1.20, imageUrl: 'https://picsum.photos/id/1080/400/400', images: ['https://picsum.photos/id/1080/800/800', 'https://picsum.photos/id/1081/800/800', 'https://picsum.photos/id/1082/800/800'], unit: '1 lb', shortDescription: 'Naturally ripened, sweet, and packed with potassium.', longDescription: 'Our organic bananas are sourced from the best farms, ensuring they are grown without synthetic pesticides or fertilizers. They are perfect for smoothies, baking, or as a healthy, on-the-go snack. Each bunch is carefully selected for optimal ripeness and quality.', reviews: [{user: 'Mark P.', rating: 5, comment: 'So fresh and sweet!'}]},
    { id: 2, name: 'Fresh Strawberries', category: 'Fruits', price: 4.50, originalPrice: 5.00, imageUrl: 'https://picsum.photos/id/102/400/400', images: ['https://picsum.photos/id/102/800/800', 'https://picsum.photos/id/103/800/800'], unit: '1 pint', shortDescription: 'Juicy, red strawberries bursting with flavor.', longDescription: 'A great source of Vitamin C and antioxidants, these strawberries are hand-picked at peak ripeness. They are perfect for desserts, salads, or simply enjoying on their own. We guarantee freshness and taste in every pint.' },
    { id: 3, name: 'Whole Milk', category: 'Dairy', price: 3.00, imageUrl: 'https://picsum.photos/id/292/400/400', images: ['https://picsum.photos/id/292/800/800'], unit: '1 gallon', shortDescription: 'Fresh, Grade A whole milk.', longDescription: 'Rich, creamy, and perfect for your cereal, coffee, or favorite recipes. Our milk is sourced from local dairies that prioritize animal welfare and quality.' },
    { id: 4, name: 'Cage-Free Eggs', category: 'Dairy', price: 4.25, imageUrl: 'https://picsum.photos/id/431/400/400', images: ['https://picsum.photos/id/431/800/800'], unit: '1 dozen', shortDescription: 'A dozen large brown cage-free eggs.', longDescription: 'Sourced from hens that have room to roam, forage, and spread their wings. These eggs have rich, golden yolks and are a wholesome choice for any meal.' },
    { id: 5, name: 'Artisan Sourdough Bread', category: 'Bakery', price: 5.50, imageUrl: 'https://picsum.photos/id/210/400/400', images: ['https://picsum.photos/id/210/800/800', 'https://picsum.photos/id/211/800/800', 'https://picsum.photos/id/212/800/800'], unit: '1 loaf', shortDescription: 'Classic sourdough with a tangy flavor and a delightfully chewy crust. Baked fresh daily.', longDescription: 'Baked fresh daily using a traditional starter, this sourdough has a delightfully chewy crust and a soft, open crumb. It contains no commercial yeast or preservatives. Perfect for toast, sandwiches, or with a bowl of soup. This detailed description goes on to explain the baking process, the quality of the ingredients, and serving suggestions to give the customer a full picture of the product they are buying. We believe in transparency and quality above all else. Our flour is milled locally, and our water is filtered multiple times for purity.',
      variants: [
        { type: 'Size', options: [{ name: 'Standard Loaf' }, { name: 'Large Loaf', priceModifier: 1.50 }] }
      ],
      reviews: [
        { user: 'Jane D.', rating: 5, comment: 'The best sourdough I have ever had! The crust is perfect.' },
        { user: 'John S.', rating: 4, comment: 'Great flavor, a bit dense but very tasty. The large loaf is huge!' }
      ]
    },
    { id: 6, 'name': 'Baby Spinach', category: 'Vegetables', price: 3.75, imageUrl: 'https://picsum.photos/id/1015/400/400', images: ['https://picsum.photos/id/1015/800/800'], unit: '5 oz', shortDescription: 'Tender baby spinach leaves, pre-washed.', longDescription: 'Our baby spinach is triple-washed and ready to eat, making it a convenient and healthy addition to any meal. It\'s tender enough for fresh salads and wilts perfectly for cooked dishes.' },
    { id: 7, name: 'Cherry Tomatoes', category: 'Vegetables', price: 2.99, originalPrice: 3.50, imageUrl: 'https://picsum.photos/id/1078/400/400', images: ['https://picsum.photos/id/1078/800/800'], unit: '1 pint', shortDescription: 'Sweet and juicy cherry tomatoes.', longDescription: 'These vibrant cherry tomatoes are perfect for salads, snacks, or roasting. They are grown for high flavor and sweetness, making them a family favorite.' },
    { id: 8, name: 'Cheddar Cheese Block', category: 'Dairy', price: 6.00, imageUrl: 'https://picsum.photos/id/312/400/400', images: ['https://picsum.photos/id/312/800/800'], unit: '8 oz', shortDescription: 'A sharp and flavorful cheddar cheese block.', longDescription: 'Aged for over 9 months, this sharp cheddar has a rich, nutty flavor and a firm, crumbly texture. It\'s great for slicing for sandwiches, shredding for recipes, or cubing for a cheese board.' },
    { id: 9, name: 'All-Purpose Flour', category: 'Grocery', price: 2.50, imageUrl: 'https://picsum.photos/id/495/400/400', images: ['https://picsum.photos/id/495/800/800'], unit: '5 lb', shortDescription: 'Versatile all-purpose flour for baking.', longDescription: 'An essential for any pantry, our all-purpose flour is milled from high-quality wheat and is suitable for all your baking needs, from fluffy cakes to crispy cookies and artisan breads.' },
    { id: 10, name: 'Olive Oil', category: 'Grocery', price: 12.00, imageUrl: 'https://picsum.photos/id/458/400/400', images: ['https://picsum.photos/id/458/800/800'], unit: '500ml', shortDescription: 'Extra virgin olive oil with a robust flavor.', longDescription: 'This cold-pressed extra virgin olive oil has a robust, peppery flavor that is perfect for dressings, marinades, and drizzling over finished dishes. It is rich in healthy monounsaturated fats and antioxidants.' },
    { id: 11, name: 'Fresh Baguette', category: 'Bakery', price: 2.75, imageUrl: 'https://picsum.photos/id/184/400/400', images: ['https://picsum.photos/id/184/800/800'], unit: '1 loaf', shortDescription: 'A crispy, golden-brown French baguette.', longDescription: 'Baked fresh throughout the day, our baguette has a thin, crispy crust and a light, airy interior. It\'s the perfect companion for cheese, butter, or for making classic sandwiches.' },
    { id: 12, name: 'Organic Avocado', category: 'Fruits', price: 2.50, imageUrl: 'https://picsum.photos/id/992/400/400', images: ['https://picsum.photos/id/992/800/800'], unit: 'each', shortDescription: 'Creamy and nutritious organic Hass avocado.', longDescription: 'Our organic Hass avocados are known for their creamy texture and rich, nutty flavor. They are an excellent source of healthy fats, fiber, and potassium. Perfect for toast, guacamole, or salads.' },
];

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  isCartOpen = signal(false);
  cartItems = signal<CartItem[]>([]);
  quickViewProduct = signal<Product | null>(null);
  shippingDetails = signal<any | null>(null);
  lastSuccessfulOrder = signal<Order | null>(null);

  cartCount = computed(() => this.cartItems().reduce((acc, item) => acc + item.quantity, 0));
  cartTotal = computed(() => this.cartItems().reduce((acc, item) => acc + (item.price * item.quantity), 0));
  
  private products: Product[] = products;

  constructor() { }
  
  getAllProducts(): Product[] {
    return this.products;
  }

  getFeaturedProducts(): Product[] {
    return this.products.slice(0, 8);
  }
  
  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  searchProducts(query: string): Product[] {
    if (!query) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return this.products.filter(p => p.name.toLowerCase().includes(lowerCaseQuery) || p.category.toLowerCase().includes(lowerCaseQuery));
  }

  getCategoriesWithCounts(): { name: string, count: number }[] {
    const categoryCounts: { [key: string]: number } = this.products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    return Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name]
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  getBrands(): string[] {
    // In a real app, products would have a 'brand' property.
    // Here we'll just mock it.
    return ['Brand A', 'Brand B', 'Grocery Co', 'Farm Fresh'];
  }

  getCategories() {
      return [
          { name: 'Fruits', icon: '🍎' },
          { name: 'Vegetables', icon: '🥦' },
          { name: 'Dairy', icon: '🥛' },
          { name: 'Bakery', icon: '🍞' },
          { name: 'Grocery', icon: '🛒' },
          { name: 'Meat', icon: '🥩' },
          { name: 'Fish', icon: '🐟' },
      ];
  }

  getReviews() {
    return [
      { name: 'Alice Johnson', rating: 5, comment: 'Incredible quality and fast delivery. The fruits were so fresh!', avatar: 'https://i.pravatar.cc/150?img=1' },
      { name: 'Ben Carter', rating: 5, comment: 'My go-to for weekly groceries. The selection is fantastic and prices are fair.', avatar: 'https://i.pravatar.cc/150?img=2' },
      { name: 'Clara Dunne', rating: 4, comment: 'Love the organic selection. Wish they had more gluten-free bakery items, but overall great!', avatar: 'https://i.pravatar.cc/150?img=3' },
      { name: 'David Smith', rating: 5, comment: 'The customer service is top-notch. They resolved an issue with my order immediately.', avatar: 'https://i.pravatar.cc/150?img=4' }
    ];
  }

  addProductReview(productId: number, review: ProductReview) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      if (!product.reviews) {
        product.reviews = [];
      }
      product.reviews.push(review);
    }
  }
  
  getCartItemId(productId: number, selectedVariants?: { [key: string]: string }): string {
    if (!selectedVariants || Object.keys(selectedVariants).length === 0) {
      return `${productId}`;
    }
    const variantKey = Object.keys(selectedVariants).sort().map(key => `${key}:${selectedVariants[key]}`).join('|');
    return `${productId}-${variantKey}`;
  }

  addToCart(product: Product, selectedVariants?: { [key: string]: string }) {
    const cartItemId = this.getCartItemId(product.id, selectedVariants);
    
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

    this.cartItems.update(items => {
      const itemInCart = items.find(item => item.cartItemId === cartItemId);
      if (itemInCart) {
        return items.map(item =>
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
        return [...items, newItem];
      }
    });
  }

  removeFromCart(cartItemId: string) {
    this.cartItems.update(items => items.filter(item => item.cartItemId !== cartItemId));
  }

  updateQuantity(cartItemId: string, change: number) {
    this.cartItems.update(items =>
      items.map(item =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      ).filter(item => item.quantity > 0)
    );
  }

  openCart() {
    this.isCartOpen.set(true);
  }

  closeCart() {
    this.isCartOpen.set(false);
  }

  openQuickView(product: Product) {
    this.quickViewProduct.set(product);
  }

  closeQuickView() {
    this.quickViewProduct.set(null);
  }

  setShippingDetails(details: any) {
    this.shippingDetails.set(details);
  }

  processSuccessfulOrder(shippingCost: number) {
    const order: Order = {
      items: this.cartItems(),
      shipping: this.shippingDetails(),
      subtotal: this.cartTotal(),
      shippingCost: shippingCost,
      total: this.cartTotal() + shippingCost
    };
    this.lastSuccessfulOrder.set(order);

    // Clear the cart and shipping details for the next purchase
    this.cartItems.set([]);
    this.shippingDetails.set(null);
  }
}