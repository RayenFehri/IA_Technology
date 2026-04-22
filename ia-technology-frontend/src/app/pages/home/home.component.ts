import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChercheurService } from '../../services/chercheur.service';
import { PublicationService } from '../../services/publication.service';
import { DomaineService } from '../../services/domaine.service';
import { Publication } from '../../models/publication.model';
import { Domaine } from '../../models/domaine.model';
import { Actualite } from '../../models/actualite.model';
import { ProjetMisEnAvant } from '../../models/projet-mis-en-avant.model';
import { ActualiteService } from '../../services/actualite.service';
import { ProjetMisEnAvantService } from '../../services/projet-mis-en-avant.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  stats = { chercheurs: 0, publications: 0, domaines: 0 };
  displayStats = { chercheurs: 0, publications: 0, domaines: 0 };
  recentPublications: Publication[] = [];
  domaines: Domaine[] = [];
  actualites: Actualite[] = [];
  epingles: Actualite[] = [];
  projetsVus: ProjetMisEnAvant[] = [];
  isLoading = true;
  currentYear = new Date().getFullYear();

  constructor(
    private chercheurService: ChercheurService,
    private publicationService: PublicationService,
    private domaineService: DomaineService,
    private actualiteService: ActualiteService,
    private projetService: ProjetMisEnAvantService
  ) {}

  ngOnInit(): void {
    forkJoin({
      chercheurs: this.chercheurService.getAll(),
      publications: this.publicationService.getAll(),
      domaines: this.domaineService.getAll(),
      actualites: this.actualiteService.getAllVisible(),
      projets: this.projetService.getActifs()
    }).subscribe({
      next: (data) => {
        this.stats.chercheurs   = data.chercheurs.length;
        this.stats.publications = data.publications.length;
        this.stats.domaines     = data.domaines.length;

        this.recentPublications = data.publications
          .sort((a: Publication, b: Publication) =>
            new Date(b.datePublication).getTime() - new Date(a.datePublication).getTime())
          .slice(0, 3);

        this.domaines = data.domaines;

        const allActs = data.actualites;
        this.epingles  = allActs.filter(a => a.estEpingle);
        this.actualites = allActs.filter(a => !a.estEpingle).slice(0, 6);

        this.projetsVus = data.projets;
        this.isLoading  = false;

        // Count-up animation
        this.runCountUp();
      },
      error: (err) => {
        console.error('Erreur chargement Home', err);
        this.isLoading = false;
      }
    });
  }

  /** Anime les chiffres de 0 jusqu'à leur valeur réelle */
  private runCountUp(): void {
    const duration = 1500;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3); // easeOut cubic

      this.displayStats.chercheurs   = Math.round(this.stats.chercheurs * ease);
      this.displayStats.publications = Math.round(this.stats.publications * ease);
      this.displayStats.domaines     = Math.round(this.stats.domaines * ease);

      if (step >= steps) {
        clearInterval(timer);
        this.displayStats = { ...this.stats };
      }
    }, interval);
  }

  /** Retourne la classe CSS du badge selon le type de publication */
  getPubBadgeClass(type: string): string {
    switch (type) {
      case 'ARTICLE':    return 'badge-article';
      case 'THESE':      return 'badge-these';
      case 'RAPPORT':    return 'badge-rapport';
      case 'CONFERENCE': return 'badge-conf';
      default:           return 'badge-modern';
    }
  }

  /** Icône Font Awesome selon le nom du domaine */
  getDomainIcon(nom: string): string {
    const n = nom.toLowerCase();
    if (n.includes('nlp') || n.includes('langage')) return 'fa-comment-dots';
    if (n.includes('vision') || n.includes('image'))  return 'fa-eye';
    if (n.includes('cyber') || n.includes('sécurité')) return 'fa-shield-halved';
    if (n.includes('deep') || n.includes('apprent'))   return 'fa-brain';
    if (n.includes('robot'))                           return 'fa-robot';
    if (n.includes('data') || n.includes('donnée'))    return 'fa-database';
    return 'fa-microchip';
  }

  /** Classe couleur de l'icône selon domaine */
  getDomainIconClass(nom: string): string {
    const n = nom.toLowerCase();
    if (n.includes('nlp') || n.includes('langage')) return 'domain-nlp';
    if (n.includes('vision') || n.includes('image')) return 'domain-vision';
    if (n.includes('cyber') || n.includes('sécurité')) return 'domain-cyber';
    const classes = ['domain-nlp', 'domain-vision', 'domain-cyber'];
    return classes[Math.abs(nom.charCodeAt(0)) % 3];
  }

  getActuCategoryClass(cat: string): string {
    switch (cat) {
      case 'ACTUALITE':    return 'cat-actualite';
      case 'ANNONCE':      return 'cat-annonce';
      case 'PROJET_RECENT': return 'cat-projet';
      default: return 'cat-actualite';
    }
  }

  getActuBadgeClass(cat: string): string {
    switch (cat) {
      case 'ACTUALITE':    return 'badge-info';
      case 'ANNONCE':      return 'badge-warning';
      case 'PROJET_RECENT': return 'badge-nlp';
      default: return '';
    }
  }

  formatCategorie(cat: string): string {
    switch (cat) {
      case 'ACTUALITE':    return 'Actualité';
      case 'ANNONCE':      return 'Annonce';
      case 'PROJET_RECENT': return 'Projet Récent';
      default: return cat;
    }
  }

  /** Remplace une image cassée par le placeholder SVG */
  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/images/default-project.svg';
    img.onerror = null;
  }
}
