import { Component, OnInit, AfterViewInit, EventEmitter } from '@angular/core';
import { CODService } from '@capillarytech/pwa-cod-service/cod';
import { TranslateService } from '@capillarytech/pwa-framework';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MerchantDetails, OrderResponse, StatusCode } from '@capillarytech/pwa-payment-providers';
import { PaymentCore } from '@capillarytech/payment-core/core';
import { LoaderService, AlertService, HardwareService } from '@capillarytech/pwa-ui-helpers';
import {
  pwaLifeCycle,
  pageView,
  DeliverySlot,
  CapRouterService,
} from '@capillarytech/pwa-framework';
import { ContactDetail, Address } from '@cap-widget/user-address';
import { Utils } from '@capillarytech/pwa-components';
import { SinglePageCheckoutComponent, UserIdentifier } from '@capillarytech/pwa-components/checkout/single-page-checkout.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})

@pwaLifeCycle()
@pageView()
export class CheckoutPage extends SinglePageCheckoutComponent {

  showdropdown = true;
  showSlotsModal = false;
  slotSelected = false;

  checkoutForm: FormGroup;
  useSavedAddress = true;
  selectedSavedAddress;
  savedAddresses = [];
  isAddNewAddressClicked = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private translate: TranslateService,
    public hardwareService: HardwareService,
    private capRouter: CapRouterService,
    private codService: CODService,
    private paymentCore: PaymentCore
  ) {
    super({
      handleGaEvent: true,
      identifier: UserIdentifier.EMAIL,
      handleEmptyPaymentOption: true
    }, hardwareService);

    this.buildForm();
    this.instantiatePaymentServices();
  }

  // construct the form while class is getting instantiated
  private buildForm() {

    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required,
        Validators.pattern('^[2,5,6,9][0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(8)])],
      email:  ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[\\w\\.=-]+@[\\w\\.-]+\\.[\\w]{2,3}$')
      ])],
      building: ['', Validators.compose([Validators.required])],
      street: ['', Validators.compose([Validators.required])],
      comment: [''],
      paymentMethod: ['COD'],
      addressType: ['home'],
      saveAddress: [false],
    });
    this.instantiatePaymentServices();
  }

  ionViewWillEnter() {

    this.setUpAddress();
    this.setUpLoggedInUser();
    this.checkSlots();
    this.checkCart();
    this.isAddNewAddressClicked = false;
  }

  // callback handling
  handleDefaultStoreSlotError() {
    this.presentSlotModal();
  }

  handleDefaultStoreSlotSuccess() {
    this.setDeliverySlot(DeliverySlot.getAsap());
  }

  handleEmptyCart() {
    this.goToDeals();
  }

  async setUpAddress() {

    if ( await this.getDeliveryModeAsync() === this.deliveryModes.PICKUP) {

      this.checkoutForm.controls['building'].setValue('T');
      this.checkoutForm.controls['street'].setValue('T');
    }
  }

  async setUpLoggedInUser() {

    const userData = await this.getUserPromise();
    if (userData && userData.type !== 'GUEST') {

      this.checkoutForm.controls['name'].setValue(userData.firstName + ' ' + userData.lastName);
      this.checkoutForm.controls['mobile'].setValue(userData.mobileNo);
      this.checkoutForm.controls['email'].setValue(userData.alternateEmail);
    }
  }

  private instantiatePaymentServices() {
    const merchant = new MerchantDetails('Pizza hut', '', '#ed1c24');
    this.paymentCore.registerPaymentService(this.getComponentId(),
      (data: OrderResponse) => {
        this.handleOrderActionFailure(data);
      },
      (data: OrderResponse) => {
        this.handleOrderActionSuccess(data);
      });
    this.paymentCore.initMerchantDetails(merchant, this.checkoutWidgetAction);
  }

  async handleOrderActionFailure(data: OrderResponse): Promise<void> {

    await this.loaderService.stopLoading();
    await this.alertService.presentToast(this.translate.instant('checkout_page.order_failure'),
      2000, 'top', 'top');
  }

  async handleOrderActionSuccess(data: OrderResponse): Promise<void> {

    await this.loaderService.stopLoading();
    if (data.statusCode === StatusCode.PENDING) {

      // will not come in case of COD
      await this.alertService.presentToast(this.translate.instant('Please proceed with your payment to taste our delicious Pizza'),
        2000, 'top', 'top');
      return;
    }

    if (data.statusCode === StatusCode.FAILURE) {

      await this.handleOrderActionFailure(data);
      return;
    }

    await this.alertService.presentToast(this.translate.instant('checkout_page.order_successful'),
      2000, 'top', 'top');

    if (this.checkoutForm.value.saveAddress) {

      this.saveUserAddress();
    }

    this.navigateToSuccess(data);
  }

  private saveUserAddress() {

    const userAddress = new Address();
    userAddress.detail = this.checkoutForm.value.building;
    userAddress.landmark = this.checkoutForm.value.street;
    userAddress.addressType = this.checkoutForm.value.addressType;
    userAddress.contactDetail = new ContactDetail();
    this.saveAddress(userAddress);
  }

  private navigateToSuccess(data) {

    this.capRouter.routeByUrl('/success/' + data.orderId + '/' + btoa(this.identifier));
  }

  handleUserAddressLoadingSuccess(data) {
    this.getSavedAddresses(data);
  }

  handleUserAddressLoadingFailure() {
    this.getSavedAddresses([]);
  }

  private getServiceByPaymentMode() {

    return this.codService;
  }

  async placeOrder() {
    await this.loaderService.startLoadingByMode(null, this.getDeliveryMode());

    const objShipAddress = new Address();
    objShipAddress.address1 = this.checkoutForm.value.building;
    objShipAddress.address2 = this.checkoutForm.value.street;
    objShipAddress.addressType = this.checkoutForm.value.addressType || '';

    const contactDetail = new ContactDetail();
    contactDetail.firstName = this.checkoutForm.value.name;
    contactDetail.emailID = this.checkoutForm.value.email;
    contactDetail.mobileNumber = this.checkoutForm.value.mobile;
    objShipAddress.contactDetail = contactDetail;

    try {

      const checkoutDetails = await this.prepareCheckoutDetails(objShipAddress);
      this.getServiceByPaymentMode().placeOrder(checkoutDetails, this.getCart());
    }catch (e) {

      this.alertService.presentToast('No Delivery Slot Available', 1000, 'bottom');
    }
  }

  handleGetShippingAddressActionSuccess(data) {
    this.fillDataFromCache(data);
  }

  async handleSaveUserActionSuccess() {
    await this.alertService.presentToast(this.translate.instant('checkout_page.address_saved_successfully'), 500, 'bottom');
  }

  getSavedAddresses(addresses) {
    // this.savedAddresses = addresses; TODO : check with faisale
    this.savedAddresses = addresses.filter(elem =>
      elem.city.code === this.getCurrentStore().selectedCity.code
    );
    this.useSavedAddress = this.savedAddresses.length > 0;
    if (this.useSavedAddress) {
      const index = 0;
      this.selectAddress(index);
    }
  }

  selectAddress(index) {
    this.selectedSavedAddress = this.savedAddresses[index];

    this.checkoutForm.controls['building'].setValue(this.savedAddresses[index].address1);
    this.checkoutForm.controls['street'].setValue(this.savedAddresses[index].address2);
    this.checkoutForm.controls['addressType'].setValue(this.savedAddresses[index].addressType);
  }

  slectPaymentOption(option) {
    this.objPayment = option;
  }

  // todo: use this data to prefill the form.
  fillDataFromCache(data) {
    if (!data) return;
    this.checkoutForm.controls['name'].setValue(data.contactDetail.firstName);
    this.checkoutForm.controls['mobile'].setValue(data.contactDetail.mobileNumber);
    this.checkoutForm.controls['email'].setValue(data.contactDetail.emailID);
    this.checkoutForm.controls['building'].setValue(data.address1);
    this.checkoutForm.controls['street'].setValue(data.address2);
  }

  // Slot Modal Handling
  presentSlotModal() {
    this.showSlotsModal = true;
  }

  closePickTime() {
    this.showSlotsModal = false;
  }

  selectTime(timeslot, index) {

    this.asSoonPossible = !(timeslot.id !== -1);
    this.slotSelected = true;
    this.slotContent = Utils.getTimeHHMM(timeslot.time);
    this.activeTimeSlot = index;
    this.timeSlotObj = timeslot;
    this.showdropdown = false;
  }

  selectTimeSlot() {

    super.selectTimeSlot();
    this.showdropdown = false;
    this.closePickTime();
  }

  goToDeals() {
    const dealCategoryId = this.configService.getConfig()['dealCategoryId'];
    this.capRouter.routeByUrl('/products?category=deals&id=' + dealCategoryId);
  }

  handleGetBillingAddressActionFailure(data: any): any {}
  handleGetBillingAddressActionSuccess(data: any): any {}
  handleGetOrderAttributesActionFailure(data: any): any {}
  handleGetOrderAttributesActionSuccess(data: any): any {}
  handleGetPaymentOptionActionFailure(data: any): any {}
  handleGetShippingAddressActionFailure(data: any): any {}
  handleSaveUserAddressActionFailure(data: any): any {}
  handleSaveUserAddressActionSuccess(data: any): any {}
  handleSingleUserAddressLoadingFailure(data: any): any {}
}
