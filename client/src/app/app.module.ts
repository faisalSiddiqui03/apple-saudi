import { NgModule, APP_INITIALIZER, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
// import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

import { AuthGuard } from './auth.guard';
import { appConfig } from '../../config/config';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RoutingState } from './routing-state';


export function getAppConfig(): Object {
  return appConfig || {};
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule.withServerTransition({appId: 'cappwa'}),
    IonicModule.forRoot({mode: 'md'}),
    AppRoutingModule,
    HttpClientModule,
    // AppUpdateServiceModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient]
    //   },
    //   compiler: {
    //     provide: TranslateCompiler,
    //     useClass: TranslateMessageFormatCompiler
    //   }
    // }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    AuthGuard,
    HttpClientModule,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },
    RoutingState,
    // AppUpdateServiceImpl
  ],
  bootstrap: [AppComponent]
})


export class AppModule {
  constructor(injector: Injector
    // languageService: LanguageService
    ) {
    // setAppInjector(injector);
    const locationUrl = window.location.pathname;

    let defaultLang;
    const allowedLanguages = [];
    // languages.forEach(async (lang) => {
    //   allowedLanguages.push(lang.code);
    //   if (lang.isDefault) {
    //     defaultLang = lang.code;
    //     // await languageService.initialize(lang.code);
    //     // this.capRouterService.routeByUrlWithLanguage(locationUrl);
    //   }
    // });
    if (locationUrl.startsWith('/ar')) {
      // languageService.initialize('ar');
    } else if (locationUrl.startsWith('/en')) {
      // languageService.initialize('en');
    } else {
      // two possiblities: either lang code not provided
      // or wrong lang code is provided

      // here check the browser language
      // const browserLang = navigator.language;
      // let mappedLang = languageService.getCodeByBrowserLanguage(browserLang);
      // if (!mappedLang || mappedLang === '') {
      //   mappedLang = defaultLang;
      // }

      // if (mappedLang === '') {
      //   mappedLang = 'en';
      // }

      // languageService.initialize(mappedLang);
      // this.capRouterService.routeByUrl(locationUrl);
    }
  }
}
