import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent {
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

  onSubmit() {
    if (this.categoryForm.valid) {
      const { name, description } = this.categoryForm.value;
      this.categoriesService.createCategory(name, description).subscribe(
        response => {
          console.log('Categoria criada com sucesso!', response);
          // Resetar o formulário após a criação bem-sucedida
          this.categoryForm.reset();
          this.error = null; // Limpar qualquer erro anterior
        },
        error => {
          console.error('Erro ao criar categoria:', error);
          this.error = 'Erro ao criar categoria. Por favor, tente novamente.'; // Exibir erro na interface
        }
      );
    } else {
      // Marcar os campos como tocados para exibir mensagens de erro, se houver
      Object.values(this.categoryForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

  // Método auxiliar para obter mensagens de erro do formulário
  getErrorMessage(controlName: string): string {
    const control = this.categoryForm.get(controlName);
    return control?.hasError('required') ? 'Campo obrigatório' : '';
  }
}
