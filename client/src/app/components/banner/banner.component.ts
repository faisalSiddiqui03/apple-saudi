import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { pwaLifeCycle, WidgetNames, ConfigService, CapRouterService } from "@capillarytech/pwa-framework";
import { BaseComponent } from '@capillarytech/pwa-components/base-component';
import { TranslateService } from '@capillarytech/pwa-framework';
import { Utils } from '@capillarytech/pwa-components';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})

@pwaLifeCycle()
export class BannerComponent extends BaseComponent implements OnInit {
  loaded = false;
  bundleWidgetAction = new EventEmitter();
  bundleWidgetExecutor = new EventEmitter();

  @Input()
  type: string;

  @Input()
  value: string;

  @Input()
  isPager = true;

  @Input()
  bannerClass = '';

  bannerRefCode: string;
  bannerUrl: string;
  sizeConfig: Array<any> = [];
  //  = [{ height: 200, width: 400, type: 'mobile' }, { height: 400, width: 1200, type: 'desktop' }];
  constructor(
    private translate: TranslateService,
    private capRouter: CapRouterService
  ) {
    super();
    this.bannerRefCode = this.configService.getConfig()['footerBannerRefCode'];
    this.translate.use(this.getCurrentLanguageCode());
  }

  ngOnInit() {
  }

  widgetLoadingSuccess(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.BANNER:
        this.loaded = true;
        console.log('banner widget model', model);
        break;
    }
  }

  widgetLoadingFailed(widgetName, model) {
    switch (widgetName) {
      case WidgetNames.BANNER:
        this.loaded = true;
        break;
    }
  }

  onBannerClicked(banner) {
    console.log(banner);
    switch (banner.targetType) {
      case 'Category':
        this.capRouter.routeByUrl('/products?category=banner&id=' + banner.targetId);
        break;
      case 'URL':
        this.capRouter.routeByUrl(banner.targetId + '&from=banner&name=' + Utils.getHiphenatedString(banner.name));
        break;
    }
  }

  navigateToDeals() {
    this.capRouter.routeByUrl('/products?category=deals&id=CU00215646');
  }

  getBannerUrl(banner) {
    switch (banner.targetType) {
      case 'Category':
        return ('/products?category=banner&id=' + banner.targetId);
        break;
      case 'URL':
        return (banner.targetId + '&from=banner&name=' + Utils.getHiphenatedString(banner.name));
        break;
    }
  }
 

  getFullBannerUrl(src) {
    return src ? src + '?height=340&width=680&builder=freeimage' : null;
  }

  getBannerRefCodeWithLangCode(refCode: string) {
    return refCode + this.getCurrentLanguageCode();
  }
}
