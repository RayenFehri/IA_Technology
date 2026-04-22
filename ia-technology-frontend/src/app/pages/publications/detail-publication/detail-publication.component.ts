import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublicationService } from '../../../services/publication.service';
import { Publication } from '../../../models/publication.model';

@Component({
  selector: 'app-detail-publication',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-publication.component.html',
  styleUrls: ['./detail-publication.component.scss']
})
export class DetailPublicationComponent implements OnInit {
  publication: Publication | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private publicationService: PublicationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.publicationService.getById(+id).subscribe({
        next: (data) => {
          this.publication = data;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
    }
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

  downloadPdf(publication: Publication): void {
    if (publication.fichierUrl) {
      window.open(publication.fichierUrl, '_blank');
    }
  }
}
