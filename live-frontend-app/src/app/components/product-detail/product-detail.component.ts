// product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/products.service';
import { Product } from '../../core/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product?: Product | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!isNaN(id)) {
      this.fetchProduct(id);
    } else {
      this.loading = false;
    }
  }

  fetchProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load product', err);
        this.product = null;
        this.loading = false;
      }
    });
  }

  // Called from template to handle broken images
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-image.png';
  }

  // Build full URL for product images (backend or local fallback)
  getFullImageUrl(imageUrl?: string): string {
    if (!imageUrl) return 'assets/images/no-image.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    // ensure leading slash
    const path = imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl;
    return `http://localhost:8082${path}`;
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}
