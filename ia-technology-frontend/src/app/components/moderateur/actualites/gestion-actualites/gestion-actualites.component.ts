import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ActualiteService } from '../../../../services/actualite.service';
import { Actualite } from '../../../../models/actualite.model';
import { CategorieActualite } from '../../../../models/categorie-actualite.model';

@Component({
  selector: 'app-gestion-actualites',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gestion-actualites.component.html',
  styleUrls: ['./gestion-actualites.component.scss']
})
export class GestionActualitesComponent implements OnInit {

  actualites: Actualite[] = [];
  filtreCategorie: string = '';

  constructor(private actualiteService: ActualiteService) {}

  ngOnInit(): void {
    this.loadActualites();
  }

  loadActualites(): void {
    this.actualiteService.getAllForMod().subscribe({
      next: (data) => {
        this.actualites = data;
      }
    });
  }

  deleteActualite(id: number | undefined): void {
    if (id && confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      this.actualiteService.delete(id).subscribe({
        next: () => this.loadActualites()
      });
    }
  }

  toggleVisible(id: number | undefined): void {
    if(id) {
      this.actualiteService.toggleVisibilite(id).subscribe({
        next: () => this.loadActualites()
      });
    }
  }

  toggleEpingle(id: number | undefined): void {
    if(id) {
      this.actualiteService.toggleEpingle(id).subscribe({
        next: () => this.loadActualites()
      });
    }
  }

  get filteredActualites(): Actualite[] {
    if (!this.filtreCategorie) return this.actualites;
    return this.actualites.filter(a => a.categorie === this.filtreCategorie);
  }
}
