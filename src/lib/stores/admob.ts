import { dev } from '$app/environment';
import {
	AdMob,
	type BannerAdOptions,
	BannerAdSize,
	BannerAdPosition,
	BannerAdPluginEvents,
	AdmobConsentStatus
	// type AdMobBannerSize,
  } from '@capacitor-community/admob';

	export async function initializeAds(): Promise<void> {
		await AdMob.initialize();

		const [trackingInfo, consentInfo] = await Promise.all([
			AdMob.trackingAuthorizationStatus(),
			AdMob.requestConsentInfo(),
		]);

		if (trackingInfo.status === 'notDetermined') {
			/**
			 * If you want to explain TrackingAuthorization before showing the iOS dialog,
			 * you can show the modal here.
			 * ex)
			 * const modal = await this.modalCtrl.create({
			 *   component: RequestTrackingPage,
			 * });
			 * await modal.present();
			 * await modal.onDidDismiss();  // Wait for close modal
			 **/

			await AdMob.requestTrackingAuthorization();
		}

		const authorizationStatus = await AdMob.trackingAuthorizationStatus();
		if (
			authorizationStatus.status === 'authorized' &&
			consentInfo.isConsentFormAvailable &&
			consentInfo.status === AdmobConsentStatus.REQUIRED
		) {
			await AdMob.showConsentForm();
		}
	}

	export async function banner(): Promise<void> {
		AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
			// Subscribe Banner Event Listener
		});

		// AdMob.addListener(
		//   BannerAdPluginEvents.SizeChanged,
		//   (size: AdMobBannerSize) => {
		// 	// Subscribe Change Banner Size
		//   },
		// );

		const options: BannerAdOptions = {
			adId: dev ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-6359902971784664/1810424049',
			adSize: BannerAdSize.BANNER,
			position: BannerAdPosition.BOTTOM_CENTER,
			margin: 0,
			// isTesting: true
			// npa: true
		};
		AdMob.showBanner(options);
	}