import { Domaine } from './domaine.model';

export interface Chercheur {
  id?: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  specialite: string;
  photo?: string;
  biographie?: string;
  domaines?: Domaine[];
}
