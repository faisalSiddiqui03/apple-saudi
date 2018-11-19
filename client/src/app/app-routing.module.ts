import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

var defaultLang = 'en';

const routes: Routes = [
  { path: '', redirectTo: defaultLang + '/home', pathMatch: 'full' },
  { path: ':lang/home', loadChildren: './pages/home/home.module#HomePageModule', pathMatch:'prefix' },
  { path: '**', redirectTo: 'en/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
