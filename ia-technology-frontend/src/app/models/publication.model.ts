import { Chercheur } from './chercheur.model';
import { Domaine } from './domaine.model';

export type TypePublication = 'ARTICLE' | 'CONFERENCE' | 'THESE' | 'RAPPORT' | 'LIVRE';

export interface Publication {
  id?: number;
  titre: string;
  resume?: string;
  datePublication: string;
  type: TypePublication;
  doi?: string;
  fichierUrl?: string;
  motsCles?: string;
  chercheurs?: Chercheur[];
  domaine?: Domaine;
  domaineId?: number;
  chercheurIds?: number[];
}
