import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppStoreService } from '../../../store/app-store.service';
import * as StoreActions from '../../../store/actions';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-admin-products',
  imports: [CurrencyPipe, NgOptimizedImage, ReactiveFormsModule],
  templateUrl: './admin-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsComponent implements OnInit {
  store = inject(AppStoreService);
  fb = inject(FormBuilder);

  products = this.store.products;
  categories = this.store.categories;
  
  isModalOpen = signal(false);
  editingProduct = signal<Product | null>(null);
  productForm!: FormGroup;

  // Pagination
  currentPage = signal(1);
  itemsPerPage = 10;
  paginatedProducts = computed(() => {
    const allProducts = this.products();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return allProducts.slice(startIndex, startIndex + this.itemsPerPage);
  });
  totalPages = computed(() => Math.ceil(this.products().length / this.itemsPerPage));


  ngOnInit() {
    this.productForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      originalPrice: [null, [Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      imageUrl: ['', Validators.required],
      images: [''], // Simple comma-separated string for now
      shortDescription: ['', Validators.required],
      longDescription: [''],
      brand: [''],
    });
  }

  openModal(product: Product | null = null) {
    this.editingProduct.set(product);
    if (product) {
      this.productForm.patchValue({
        ...product,
        images: product.images.join(', ')
      });
    } else {
      this.productForm.reset({ stock: 0, price: 0 });
    }
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;
    const productData = {
      ...formValue,
      id: this.editingProduct()?.id ?? 0,
      originalPrice: formValue.originalPrice || undefined,
      images: formValue.images ? formValue.images.split(',').map((s: string) => s.trim()) : [],
      reviews: this.editingProduct()?.reviews ?? [],
      variants: this.editingProduct()?.variants ?? [],
    };

    if (this.editingProduct()) {
      this.store.dispatch(StoreActions.updateProduct(productData as Product));
    } else {
      // Omit id for new product
      const { id, ...newProductData } = productData;
      this.store.dispatch(StoreActions.addProduct(newProductData as Omit<Product, 'id'>));
    }
    this.closeModal();
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.store.dispatch(StoreActions.deleteProduct(productId));
    }
  }

  goToPage(page: number) {
    if (page > 0 && page <= this.totalPages()) {
        this.currentPage.set(page);
    }
  }
}