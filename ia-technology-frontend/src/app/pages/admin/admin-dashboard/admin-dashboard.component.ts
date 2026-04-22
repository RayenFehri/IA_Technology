import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChercheurService } from '../../../services/chercheur.service';
import { PublicationService } from '../../../services/publication.service';
import { DomaineService } from '../../../services/domaine.service';
import { Publication } from '../../../models/publication.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  stats = { chercheurs: 0, publications: 0, domaines: 0, users: 0 };
  recentPublications: Publication[] = [];
  isLoading = true;
  private chartDataReady = false;

  pubTypeCounts: Record<string, number> = {};

  constructor(
    private chercheurService: ChercheurService,
    private publicationService: PublicationService,
    private domaineService: DomaineService
  ) {}

  ngOnInit(): void {
    forkJoin({
      chercheurs: this.chercheurService.getAll(),
      publications: this.publicationService.getAll(),
      domaines: this.domaineService.getAll()
    }).subscribe({
      next: (data: any) => {
        this.stats.chercheurs   = data.chercheurs.length;
        this.stats.publications = data.publications.length;
        this.stats.domaines     = data.domaines.length;

        // Compter par type pour Chart.js
        this.pubTypeCounts = { ARTICLE: 0, THESE: 0, RAPPORT: 0, CONFERENCE: 0 };
        data.publications.forEach((p: Publication) => {
          if (this.pubTypeCounts[p.type] !== undefined) this.pubTypeCounts[p.type]++;
        });

        // 5 dernières publications
        this.recentPublications = data.publications
          .sort((a: Publication, b: Publication) =>
            new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime())
          .slice(0, 5);

        this.isLoading = false;
        this.chartDataReady = true;
        setTimeout(() => this.buildChart(), 100);
      },
      error: (err) => {
        console.error('Erreur chargement Dashboard', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Chart sera construit après que les données arrivent
  }

  private buildChart(): void {
    const canvas = document.getElementById('pubTypeChart') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Articles', 'Thèses', 'Rapports', 'Conférences'],
        datasets: [{
          data: [
            this.pubTypeCounts['ARTICLE'],
            this.pubTypeCounts['THESE'],
            this.pubTypeCounts['RAPPORT'],
            this.pubTypeCounts['CONFERENCE']
          ],
          backgroundColor: ['#2D5BE3', '#10B981', '#F59E0B', '#7C3AED'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 16,
              font: { family: 'Inter', size: 13 },
              usePointStyle: true
            }
          }
        }
      }
    });
  }

  getPubBadgeClass(type: string): string {
    switch (type) {
      case 'ARTICLE':    return 'badge-article';
      case 'THESE':      return 'badge-these';
      case 'RAPPORT':    return 'badge-rapport';
      case 'CONFERENCE': return 'badge-conf';
      default: return '';
    }
  }
}
