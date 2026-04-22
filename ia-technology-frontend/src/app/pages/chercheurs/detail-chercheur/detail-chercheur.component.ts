import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChercheurService } from '../../../services/chercheur.service';
import { PublicationService } from '../../../services/publication.service';
import { Chercheur } from '../../../models/chercheur.model';
import { Publication } from '../../../models/publication.model';

@Component({
  selector: 'app-detail-chercheur',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-chercheur.component.html',
  styleUrls: ['./detail-chercheur.component.scss']
})
export class DetailChercheurComponent implements OnInit {
  chercheur: Chercheur | null = null;
  publications: Publication[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private chercheurService: ChercheurService,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chercheurService.getById(+id).subscribe({
        next: (data) => {
          this.chercheur = data;
          this.loadPublications(+id);
        },
        error: () => this.isLoading = false
      });
    }
  }

  loadPublications(chercheurId: number): void {
    // Si l'API permet de filtrer par chercheur, on pourrait faire getByChercheurId
    // Sinon on charge tout et on filtre côté client.
    this.publicationService.getAll().subscribe({
      next: (pubs) => {
        this.publications = pubs.filter(p => p.chercheurs?.some(c => c.id === chercheurId));
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
}
