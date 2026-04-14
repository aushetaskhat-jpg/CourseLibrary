// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CatalogComponent }   from './pages/catalog/catalog.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent }   from './pages/profile/profile.component';

export const routes: Routes = [
  { path: '',         redirectTo: 'catalog', pathMatch: 'full' },
  { path: 'catalog',   component: CatalogComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile',   component: ProfileComponent },
  { path: '**',        redirectTo: 'catalog' },
];
