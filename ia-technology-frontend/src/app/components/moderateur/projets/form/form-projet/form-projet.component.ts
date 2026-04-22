import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProjetMisEnAvantService } from '../../../../../services/projet-mis-en-avant.service';

@Component({
  selector: 'app-form-projet',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-projet.component.html',
  styleUrls: ['./form-projet.component.scss']
})
export class FormProjetComponent implements OnInit {

  projetForm: FormGroup;
  id: number | null = null;
  isEditMode = false;
  isUploading = false;
  
  constructor(
    private fb: FormBuilder,
    private projetService: ProjetMisEnAvantService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.projetForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      description: [''],
      imageUrl: [''],
      lienPublication: [null],
      ordre: [0, [Validators.required, Validators.min(0)]],
      actif: [true]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.isEditMode = true;
      // Il n'y a pas de getById dans le service projet, on récupère le projet depuis getAll
      this.projetService.getAll().subscribe({
        next: (data) => {
          const p = data.find(p => p.id === this.id);
          if(p) {
            this.projetForm.patchValue({
              titre: p.titre,
              description: p.description,
              imageUrl: p.imageUrl,
              lienPublication: p.lienPublication,
              ordre: p.ordre,
              actif: p.actif
            });
          }
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.post<{fileDownloadUri: string}>('http://localhost:8080/api/files/upload', formData, { headers }).subscribe({
        next: (response) => {
          this.projetForm.patchValue({ imageUrl: response.fileDownloadUri });
          this.isUploading = false;
        },
        error: () => {
          this.isUploading = false;
          alert("Erreur lors du téléchargement de l'image.");
        }
      });
    }
  }

  onSubmit(): void {
    if (this.projetForm.invalid || this.isUploading) return;

    if (this.isEditMode && this.id) {
      this.projetService.update(this.id, this.projetForm.value).subscribe({
        next: () => this.router.navigate(['/moderateur/projets'])
      });
    } else {
      this.projetService.create(this.projetForm.value).subscribe({
        next: () => this.router.navigate(['/moderateur/projets'])
      });
    }
  }
}
