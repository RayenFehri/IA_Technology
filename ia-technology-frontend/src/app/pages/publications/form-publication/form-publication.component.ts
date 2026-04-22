import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PublicationService } from '../../../services/publication.service';
import { DomaineService } from '../../../services/domaine.service';
import { ChercheurService } from '../../../services/chercheur.service';
import { ToastService } from '../../../services/toast.service';
import { Domaine } from '../../../models/domaine.model';
import { Chercheur } from '../../../models/chercheur.model';

@Component({
  selector: 'app-form-publication',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-publication.component.html',
  styleUrls: ['./form-publication.component.scss']
})
export class FormPublicationComponent implements OnInit {
  pubForm: FormGroup;
  isEditMode = false;
  pubId?: number;
  
  domainesDisponibles: Domaine[] = [];
  chercheursDisponibles: Chercheur[] = [];
  selectedFile: File | null = null;
  
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private publicationService: PublicationService,
    private domaineService: DomaineService,
    private chercheurService: ChercheurService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.pubForm = this.fb.group({
      titre: ['', Validators.required],
      resume: ['', Validators.required],
      datePublication: ['', Validators.required],
      type: ['ARTICLE', Validators.required],
      doi: [''],
      fichierUrl: [''],
      motsCles: [''],
      domaine: this.fb.group({
        id: [null, Validators.required]
      }),
      chercheursIds: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    // Charger dépendances : domaines et chercheurs
    this.domaineService.getAll().subscribe(doms => this.domainesDisponibles = doms);
    this.chercheurService.getAll().subscribe(chers => {
      this.chercheursDisponibles = chers;
      
      if (idParam) {
        this.isEditMode = true;
        this.pubId = +idParam;
        this.loadPublication();
      }
    });
  }

  get chercheursFormArray() {
    return this.pubForm.get('chercheursIds') as FormArray;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pubForm.patchValue({
        fichierUrl: file.name
      });
    }
  }

  onChercheurCheck(e: any) {
    const checkArray: FormArray = this.chercheursFormArray;
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

  isChercheurSelected(id: number): boolean {
    return this.chercheursFormArray.value.includes(id);
  }

  loadPublication(): void {
    this.isLoading = true;
    this.publicationService.getById(this.pubId!).subscribe({
      next: (pub) => {
        // Formatage de la date pour l'input type="date"
        const dateStr = new Date(pub.datePublication).toISOString().substring(0, 10);
        
        this.pubForm.patchValue({
          titre: pub.titre,
          resume: pub.resume,
          datePublication: dateStr,
          type: pub.type,
          doi: pub.doi,
          fichierUrl: pub.fichierUrl,
          motsCles: pub.motsCles,
          domaine: { id: pub.domaine?.id }
        });
        
        if (pub.chercheurs) {
          pub.chercheurs.forEach(c => {
            if (c.id) this.chercheursFormArray.push(new FormControl(c.id));
          });
        }
        
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger la publication.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.pubForm.invalid) return;

    this.isSaving = true;
    this.errorMessage = '';
    
    const formValue = this.pubForm.value;
    const payload = {
      ...formValue,
      domaineId: formValue.domaine?.id,
      chercheurIds: formValue.chercheursIds 
    };
    delete payload.domaine;
    delete payload.chercheursIds;

    if (this.selectedFile) {
      // Si un fichier est sélectionné, on l'upload d'abord.
      this.publicationService.uploadFile(this.selectedFile).subscribe({
        next: (res) => {
          payload.fichierUrl = res.fileDownloadUri;
          this.executeSave(payload);
        },
        error: err => {
          this.isSaving = false;
          this.errorMessage = err.error?.message || 'Erreur lors de upload du fichier PDF.';
        }
      });
    } else {
      // Aucun nouveau fichier, on enregistre directement le payload JSON
      this.executeSave(payload);
    }
  }

  private executeSave(payload: any): void {
    const request$ = this.isEditMode
      ? this.publicationService.update(this.pubId!, payload)
      : this.publicationService.create(payload);

    request$.subscribe({
      next: () => {
        this.toast.showSuccess(
          this.isEditMode ? 'Publication modifiée avec succès' : 'Publication créée avec succès'
        );
        this.router.navigate(['/publications']);
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
