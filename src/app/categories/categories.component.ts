import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoryForm: FormGroup;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const { name, description } = this.categoryForm.value;

    this.categoriesService.createCategory(name, description).subscribe(
      response => {
        console.log('Categoria criada com sucesso:', response);
      },
      error => {
        this.error = `Erro ao criar categoria: ${error}`;
        console.error(this.error);
      }
    );
  }
}
