import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActualiteService } from '../../../../services/actualite.service';
import { ProjetMisEnAvantService } from '../../../../services/projet-mis-en-avant.service';
import { Actualite } from '../../../../models/actualite.model';

@Component({
  selector: 'app-moderateur-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moderateur-dashboard.component.html',
  styleUrls: ['./moderateur-dashboard.component.scss']
})
export class ModerateurDashboardComponent implements OnInit {

  nbActualites = 0;
  nbAnnonces = 0;
  nbProjetsRecents = 0;
  nbProjetsMisEnAvant = 0;

  dernieresActualites: Actualite[] = [];

  constructor(
    private actualiteService: ActualiteService,
    private projetService: ProjetMisEnAvantService
  ) {}

  ngOnInit(): void {
    this.actualiteService.getAllForMod().subscribe({
      next: (data) => {
        this.nbActualites = data.filter(a => a.categorie === 'ACTUALITE').length;
        this.nbAnnonces = data.filter(a => a.categorie === 'ANNONCE').length;
        this.nbProjetsRecents = data.filter(a => a.categorie === 'PROJET_RECENT').length;
        
        this.dernieresActualites = data.sort((a, b) => {
          return new Date(b.datePublication || '').getTime() - new Date(a.datePublication || '').getTime();
        }).slice(0, 5);
      }
    });

    this.projetService.getAll().subscribe({
      next: (data) => {
        this.nbProjetsMisEnAvant = data.length;
      }
    });
  }

  getActuBadgeClass(cat: string): string {
    switch (cat) {
      case 'ACTUALITE':     return 'badge-info';
      case 'ANNONCE':       return 'badge-warning';
      case 'PROJET_RECENT': return 'badge-nlp';
      default: return '';
    }
  }

  formatCategorie(cat: string): string {
    switch (cat) {
      case 'ACTUALITE':     return 'Actualité';
      case 'ANNONCE':       return 'Annonce';
      case 'PROJET_RECENT': return 'Projet Récent';
      default: return cat;
    }
  }
}
