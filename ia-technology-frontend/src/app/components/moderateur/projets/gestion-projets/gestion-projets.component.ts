import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjetMisEnAvantService } from '../../../../services/projet-mis-en-avant.service';
import { ProjetMisEnAvant } from '../../../../models/projet-mis-en-avant.model';

@Component({
  selector: 'app-gestion-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-projets.component.html',
  styleUrls: ['./gestion-projets.component.scss']
})
export class GestionProjetsComponent implements OnInit {

  projets: ProjetMisEnAvant[] = [];

  constructor(private projetService: ProjetMisEnAvantService) {}

  ngOnInit(): void {
    this.loadProjets();
  }

  loadProjets(): void {
    this.projetService.getAll().subscribe({
      next: (data) => {
        // Classer par ordre localement d'abord car getAll n'est pas forcément ordonné
        this.projets = data.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));
      }
    });
  }

  deleteProjet(id: number | undefined): void {
    if (id && confirm('Supprimer ce projet mis en avant ?')) {
      this.projetService.delete(id).subscribe(() => this.loadProjets());
    }
  }

  toggleActif(p: ProjetMisEnAvant): void {
    if (p.id) {
      this.projetService.update(p.id, { ...p, actif: !p.actif }).subscribe(() => this.loadProjets());
    }
  }

  monterOrdre(e: Event, p: ProjetMisEnAvant, idx: number): void {
    e.stopPropagation();
    if(idx > 0 && p.id) {
      const precedent = this.projets[idx - 1];
      const pOrdre = p.ordre || 0;
      const prevOrdre = precedent.ordre || 0;
      
      // Swap order direct api
      this.projetService.changerOrdre(p.id, prevOrdre).subscribe(() => {
        if(precedent.id) this.projetService.changerOrdre(precedent.id, pOrdre).subscribe(() => this.loadProjets());
      });
    }
  }

  descendreOrdre(e: Event, p: ProjetMisEnAvant, idx: number): void {
    e.stopPropagation();
    if(idx < this.projets.length - 1 && p.id) {
      const suivant = this.projets[idx + 1];
      const pOrdre = p.ordre || 0;
      const suivOrdre = suivant.ordre || 0;
      
      this.projetService.changerOrdre(p.id, suivOrdre).subscribe(() => {
        if(suivant.id) this.projetService.changerOrdre(suivant.id, pOrdre).subscribe(() => this.loadProjets());
      });
    }
  }
  /** Remplace une image cassée par le placeholder SVG */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/default-project.svg';
    img.onerror = null; // éviter une boucle infinie
  }
}
