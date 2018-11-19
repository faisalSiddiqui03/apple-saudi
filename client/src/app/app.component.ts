import { Component, OnInit, EventEmitter } from '@angular/core';
import { Platform, NavController, ModalController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { TranslateService } from '@capillarytech/pwa-framework';
import { RoutingState } from './routing-state';
// import { Market } from '@ionic-native/market';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  // logoutActionEmitter = new EventEmitter();
  sharedService: any;

  constructor(
    private platform: Platform,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private navCtrl: NavController,
    private routingState: RoutingState,
  ) {
    routingState.loadRouting();
    // const langCode = 'ar';
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then( async() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

}
