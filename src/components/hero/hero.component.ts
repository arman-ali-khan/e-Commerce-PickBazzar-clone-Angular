
import { Component, ChangeDetectionStrategy, AfterViewInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';

declare var Swiper: any;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiperInstance: any;

  slides = [
    {
      img: 'https://picsum.photos/id/1018/1920/600',
      title: 'Fresh Groceries Delivered Daily',
      subtitle: 'Get the best quality ingredients from local farms to your kitchen.',
      buttonText: 'Shop Now'
    },
    {
      img: 'https://picsum.photos/id/1040/1920/600',
      title: 'Save Big on Organic Products',
      subtitle: 'Weekly deals and special offers on our entire organic range.',
      buttonText: 'Explore Offers'
    },
    {
      img: 'https://picsum.photos/id/1050/1920/600',
      title: 'Artisan Bakery & Fresh Breads',
      subtitle: 'Handcrafted with passion, delivered with care.',
      buttonText: 'Discover Bakery'
    }
  ];

  ngAfterViewInit() {
    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  }

  ngOnDestroy() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
    }
  }
}
