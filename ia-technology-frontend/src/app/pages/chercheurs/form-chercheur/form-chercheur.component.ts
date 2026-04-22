import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChercheurService } from '../../../services/chercheur.service';
import { DomaineService } from '../../../services/domaine.service';
import { ToastService } from '../../../services/toast.service';
import { Domaine } from '../../../models/domaine.model';

@Component({
  selector: 'app-form-chercheur',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-chercheur.component.html',
  styleUrls: ['./form-chercheur.component.scss']
})
export class FormChercheurComponent implements OnInit {
  chercheurForm: FormGroup;
  isEditMode = false;
  chercheurId?: number;
  
  domainesDisponibles: Domaine[] = [];
  selectedFile: File | null = null;
  
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private chercheurService: ChercheurService,
    private domaineService: DomaineService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.chercheurForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      specialite: ['', Validators.required],
      biographie: [''],
      photo: [''],
      domainesIds: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    // Charger tous les domaines pour les checkboxes
    this.domaineService.getAll().subscribe(doms => {
      this.domainesDisponibles = doms;
      
      if (idParam) {
        this.isEditMode = true;
        this.chercheurId = +idParam;
        this.loadChercheur();
      }
    });
  }

  get domainesFormArray() {
    return this.chercheurForm.get('domainesIds') as FormArray;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.chercheurForm.patchValue({
        photo: file.name
      });
    }
  }

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.chercheurForm.get('domainesIds') as FormArray;
    if (e.target.checked) {
      checkArray.push(new FormControl(+e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: any) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  isDomaineSelected(id: number): boolean {
    return this.domainesFormArray.value.includes(id);
  }

  loadChercheur(): void {
    this.isLoading = true;
    this.chercheurService.getById(this.chercheurId!).subscribe({
      next: (ch) => {
        this.chercheurForm.patchValue({
          nom: ch.nom,
          prenom: ch.prenom,
          email: ch.email,
          telephone: ch.telephone,
          specialite: ch.specialite,
          biographie: ch.biographie,
          photo: ch.photo
        });
        
        // Cocher les checkboxes correctes
        if (ch.domaines) {
          ch.domaines.forEach(d => {
            if (d.id) this.domainesFormArray.push(new FormControl(d.id));
          });
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger le chercheur.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.chercheurForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    
    const formValue = this.chercheurForm.value;
    const payload = {
      ...formValue,
      domaineIds: formValue.domainesIds
    };
    delete payload.domainesIds; // on nettoie le payload form control

    if (this.selectedFile) {
      // 1. Uploader la photo de profil physical sur le backend Spring
      this.chercheurService.uploadPhoto(this.selectedFile).subscribe({
        next: (res) => {
          payload.photo = res.fileDownloadUri;
          this.executeSave(payload);
        },
        error: err => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Erreur lors de l\'envoi de la photo.';
        }
      });
    } else {
      // Pas de nouveau fichier, on continue directement
      this.executeSave(payload);
    }
  }

  private executeSave(payload: any): void {
    const request$ = this.isEditMode
      ? this.chercheurService.update(this.chercheurId!, payload)
      : this.chercheurService.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.showSuccess(
          this.isEditMode ? 'Chercheur modifié avec succès' : 'Chercheur ajouté avec succès'
        );
        this.router.navigate(['/chercheurs']);
      },
      error: err => {
        this.isSaving = false;
        const msg = err.error?.message || 'Erreur lors de l\'enregistrement.';
        this.errorMessage = msg;
        this.toast.showError(msg);
      }
    });
  }
}
