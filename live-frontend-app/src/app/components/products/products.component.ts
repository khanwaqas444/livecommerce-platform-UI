import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from '../../core/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  showAddModal = false;

  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    category: '',
    live: true,
    stock: 0
  };
  selectedFile: File | null = null;

  constructor(private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error loading products:', err)
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  openProductDetail(id: number): void {
  this.router.navigate(['/products', id]);
}

  addProduct(): void {
    if (!this.selectedFile) {
      alert('Please select an image');
      return;
    }

    this.productService.addProduct(this.newProduct, this.selectedFile).subscribe({
      next: (res) => {
        this.products.push(res);
        this.closeAddModal();
        this.newProduct = { name: '', description: '', price: 0, category: '', live: true, stock: 0 };
        this.selectedFile = null;
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }
}
