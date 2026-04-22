import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomaineService } from '../../../services/domaine.service';
import { AuthService } from '../../../services/auth.service';
import { Domaine } from '../../../models/domaine.model';

@Component({
  selector: 'app-list-domaine',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-domaine.component.html',
  styleUrls: ['./list-domaine.component.scss']
})
export class ListDomaineComponent implements OnInit {
  domaines: Domaine[] = [];
  isLoading = true;

  constructor(
    private domaineService: DomaineService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDomaines();
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  loadDomaines(): void {
    this.isLoading = true;
    this.domaineService.getAll().subscribe({
      next: (data) => {
        this.domaines = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement domaines', err);
        this.isLoading = false;
      }
    });
  }

  deleteDomaine(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce domaine ?')) {
      this.domaineService.delete(id).subscribe({
        next: () => {
          this.domaines = this.domaines.filter(d => d.id !== id);
        },
        error: (err) => {
          console.error('Erreur suppression', err);
          alert('Impossible de supprimer ce domaine.');
        }
      });
    }
  }
}
