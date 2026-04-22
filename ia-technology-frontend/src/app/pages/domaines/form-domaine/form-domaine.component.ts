import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomaineService } from '../../../services/domaine.service';

@Component({
  selector: 'app-form-domaine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-domaine.component.html',
  styleUrls: ['./form-domaine.component.scss']
})
export class FormDomaineComponent implements OnInit {
  domaineForm: FormGroup;
  isEditMode = false;
  domaineId?: number;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private domaineService: DomaineService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.domaineForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.domaineId = +idParam;
      this.loadDomaine();
    }
  }

  loadDomaine(): void {
    this.isLoading = true;
    this.domaineService.getById(this.domaineId!).subscribe({
      next: (dom) => {
        this.domaineForm.patchValue({
          nom: dom.nom,
          description: dom.description
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le domaine.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.domaineForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    const payload = this.domaineForm.value;

    const request$ = this.isEditMode
      ? this.domaineService.update(this.domaineId!, payload)
      : this.domaineService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/domaines']);
      },
      error: err => {
        this.isSaving = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue lors de l\'enregistrement.';
      }
    });
  }
}
