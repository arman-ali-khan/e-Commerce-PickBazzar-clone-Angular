
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannersComponent {
  banners = [
    {
      title: 'Free Shipping on Orders Over $50',
      description: 'Stock up on your favorites and get them delivered for free.',
      imageUrl: 'https://picsum.photos/id/21/600/300',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Get 20% Off Fresh Vegetables',
      description: 'Limited time offer on all leafy greens and seasonal veggies.',
      imageUrl: 'https://picsum.photos/id/31/600/300',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'New in Bakery: Sourdough Specials',
      description: 'Discover our new range of artisan sourdough breads.',
      imageUrl: 'https://picsum.photos/id/41/600/300',
      bgColor: 'bg-yellow-100'
    }
  ];
}
