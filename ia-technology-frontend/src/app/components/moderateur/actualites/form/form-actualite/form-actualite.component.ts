import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActualiteService } from '../../../../../services/actualite.service';
import { CategorieActualite } from '../../../../../models/categorie-actualite.model';

@Component({
  selector: 'app-form-actualite',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form-actualite.component.html',
  styleUrls: ['./form-actualite.component.scss']
})
export class FormActualiteComponent implements OnInit {

  actualiteForm: FormGroup;
  id: number | null = null;
  isEditMode = false;
  isUploading = false;
  categories = Object.values(CategorieActualite);
  
  constructor(
    private fb: FormBuilder,
    private actualiteService: ActualiteService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.actualiteForm = this.fb.group({
      titre: ['', [Validators.required, Validators.maxLength(200)]],
      contenu: ['', [Validators.required]],
      imageUrl: [''],
      categorie: [CategorieActualite.ACTUALITE, [Validators.required]],
      estEpingle: [false],
      visible: [true]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id = +idParam;
      this.isEditMode = true;
      this.actualiteService.getById(this.id).subscribe({
        next: (data) => {
          this.actualiteForm.patchValue({
            titre: data.titre,
            contenu: data.contenu,
            imageUrl: data.imageUrl,
            categorie: data.categorie,
            estEpingle: data.estEpingle,
            visible: data.visible
          });
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
          this.actualiteForm.patchValue({ imageUrl: response.fileDownloadUri });
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
    if (this.actualiteForm.invalid || this.isUploading) return;

    if (this.isEditMode && this.id) {
      this.actualiteService.update(this.id, this.actualiteForm.value).subscribe({
        next: () => this.router.navigate(['/moderateur/actualites'])
      });
    } else {
      this.actualiteService.create(this.actualiteForm.value).subscribe({
        next: () => this.router.navigate(['/moderateur/actualites'])
      });
    }
  }
}
