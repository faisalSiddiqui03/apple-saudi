import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrivacyPolicyPage } from './privacy-policy.page';
import { TranslateModule } from '@capillarytech/pwa-framework';
import { HttpLoaderFactory } from '../../../translation.loader';
import { HttpClient } from '@angular/common/http';
import { HeaderModule } from '../../../components/header/header.module';
import { SubHeaderModule } from '../../../components/sub-header/sub-header.module';

const routes: Routes = [
  {
    path: '',
    component: PrivacyPolicyPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HeaderModule,
    SubHeaderModule,
    TranslateModule
  ],
  declarations: [PrivacyPolicyPage],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrivacyPolicyPageModule {}
