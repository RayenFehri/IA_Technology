import { CategorieActualite } from './categorie-actualite.model';

export interface Actualite {
  id?: number;
  titre: string;
  contenu: string;
  datePublication?: string;
  auteur?: string;
  imageUrl?: string;
  estEpingle?: boolean;
  categorie: CategorieActualite;
  visible?: boolean;
}
