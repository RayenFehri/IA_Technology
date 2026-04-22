import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PublicationService } from '../../../services/publication.service';
import { DomaineService } from '../../../services/domaine.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Publication } from '../../../models/publication.model';
import { Domaine } from '../../../models/domaine.model';

@Component({
  selector: 'app-list-publication',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './list-publication.component.html',
  styleUrls: ['./list-publication.component.scss']
})
export class ListPublicationComponent implements OnInit, OnDestroy {
  publications: Publication[] = [];
  filteredPublications: Publication[] = [];
  domaines: Domaine[] = [];
  
  titreControl = new FormControl('');
  typeControl = new FormControl('');
  domaineControl = new FormControl('');
  
  isLoading = true;
  deleteModalOpen = false;
  publicationToDelete: Publication | null = null;
  isDeleting = false;
  private sub = new Subscription();

  constructor(
    private publicationService: PublicationService,
    private domaineService: DomaineService,
    private authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.sub.add(this.titreControl.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged()
    ).subscribe(() => this.applyFilters()));
    this.sub.add(this.typeControl.valueChanges.subscribe(() => this.applyFilters()));
    this.sub.add(this.domaineControl.valueChanges.subscribe(() => this.applyFilters()));
  }

  ngOnDestroy(): void { this.sub.unsubscribe(); }

  get isAdmin(): boolean { return this.authService.isAdmin(); }
  get isModerator(): boolean { return this.authService.isModerator(); }
  get canEdit(): boolean { return this.isAdmin || this.isModerator; } // Ajuster si besoin

  loadData(): void {
    this.isLoading = true;
    this.publicationService.getAll().subscribe(data => {
      this.publications = data;
      this.applyFilters();
      this.isLoading = false;
    });

    this.domaineService.getAll().subscribe(data => {
      this.domaines = data;
    });
  }

  applyFilters(): void {
    let titre = this.titreControl.value?.toLowerCase() || '';
    let type = this.typeControl.value || '';
    let domaineId = this.domaineControl.value || '';

    this.filteredPublications = this.publications.filter(p => {
      const matchTitre = p.titre.toLowerCase().includes(titre);
      const matchType = type ? p.type === type : true;
      const matchDomaine = domaineId ? p.domaine?.id?.toString() === domaineId : true;
      
      return matchTitre && matchType && matchDomaine;
    });
  }

  openDeleteModal(pub: Publication): void {
    this.publicationToDelete = pub;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.publicationToDelete = null;
  }

  confirmDelete(): void {
    if (!this.publicationToDelete?.id) return;
    this.isDeleting = true;
    this.publicationService.delete(this.publicationToDelete.id).subscribe({
      next: () => {
        this.publications = this.publications.filter(p => p.id !== this.publicationToDelete!.id);
        this.applyFilters();
        this.toast.showSuccess('Publication supprimée avec succès');
        this.closeDeleteModal();
        this.isDeleting = false;
      },
      error: (err) => {
        this.toast.showError(err.error?.message || 'Erreur lors de la suppression');
        this.closeDeleteModal();
        this.isDeleting = false;
      }
    });
  }

  resetFilters(): void {
    this.titreControl.reset('');
    this.typeControl.reset('');
    this.domaineControl.reset('');
  }

  getBadgeColor(type: string): string {
    switch (type) {
      case 'ARTICLE': return 'bg-primary';
      case 'THESE': return 'bg-success';
      case 'RAPPORT': return 'bg-warning text-dark';
      case 'CONFERENCE': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }
}
