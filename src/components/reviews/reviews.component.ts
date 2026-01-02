
import { Component, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, OnDestroy, inject } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { NgOptimizedImage } from '@angular/common';

declare var Swiper: any;

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reviewsSwiper') reviewsSwiper!: ElementRef;
  swiperInstance: any;

  storeService = inject(StoreService);
  reviews = this.storeService.getReviews();
  
  // Helper method for templates
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }

  ngAfterViewInit() {
    this.swiperInstance = new Swiper(this.reviewsSwiper.nativeElement, {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 6000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  ngOnDestroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }
}
