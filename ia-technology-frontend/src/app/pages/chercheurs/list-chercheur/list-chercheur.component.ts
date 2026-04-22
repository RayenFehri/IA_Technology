import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChercheurService } from '../../../services/chercheur.service';
import { DomaineService } from '../../../services/domaine.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Chercheur } from '../../../models/chercheur.model';
import { Domaine } from '../../../models/domaine.model';

@Component({
  selector: 'app-list-chercheur',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './list-chercheur.component.html',
  styleUrls: ['./list-chercheur.component.scss']
})
export class ListChercheurComponent implements OnInit, OnDestroy {
  chercheurs: Chercheur[] = [];
  filteredChercheurs: Chercheur[] = [];
  domaines: Domaine[] = [];
  
  searchControl = new FormControl('');
  domaineFilterControl = new FormControl('');
  
  isLoading = true;
  deleteModalOpen = false;
  chercheurToDelete: Chercheur | null = null;
  isDeleting = false;
  private sub = new Subscription();

  constructor(
    private chercheurService: ChercheurService,
    private domaineService: DomaineService,
    public authService: AuthService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();

    // Barre de recherche avec Debounce (RxJS)
    this.sub.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(() => this.applyFilters())
    );

    this.sub.add(
      this.domaineFilterControl.valueChanges.subscribe(() => this.applyFilters())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get isAdmin(): boolean { return this.authService.isAdmin(); }
  get isAuthenticated(): boolean { return this.authService.isLoggedIn(); }

  loadData(): void {
    this.isLoading = true;
    this.chercheurService.getAll().subscribe(data => {
      this.chercheurs = data;
      this.applyFilters();
      this.isLoading = false;
    });

    this.domaineService.getAll().subscribe(data => {
      this.domaines = data;
    });
  }

  applyFilters(): void {
    let term = this.searchControl.value?.toLowerCase() || '';
    let selectedDomaineId = this.domaineFilterControl.value;

    this.filteredChercheurs = this.chercheurs.filter(ch => {
      const matchName = ch.nom.toLowerCase().includes(term) || ch.prenom.toLowerCase().includes(term);
      
      let matchDomaine = true;
      if (selectedDomaineId) {
        matchDomaine = ch.domaines?.some(d => d.id?.toString() === selectedDomaineId) || false;
      }
      
      return matchName && matchDomaine;
    });
  }

  openDeleteModal(chercheur: Chercheur): void {
    this.chercheurToDelete = chercheur;
    this.deleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.chercheurToDelete = null;
  }

  confirmDelete(): void {
    if (!this.chercheurToDelete?.id) return;
    this.isDeleting = true;
    this.chercheurService.delete(this.chercheurToDelete.id).subscribe({
      next: () => {
        this.chercheurs = this.chercheurs.filter(c => c.id !== this.chercheurToDelete!.id);
        this.applyFilters();
        this.toast.showSuccess('Chercheur supprimé avec succès');
        this.closeDeleteModal();
        this.isDeleting = false;
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de la suppression. Il est peut-être lié à des publications.';
        this.toast.showError(msg);
        this.closeDeleteModal();
        this.isDeleting = false;
      }
    });
  }
}
