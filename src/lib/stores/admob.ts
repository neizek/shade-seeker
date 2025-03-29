	import { dev } from '$app/environment';
	import {
		AdMob,
		type BannerAdOptions,
		BannerAdSize,
		BannerAdPosition,
		AdmobConsentStatus
		// type AdMobBannerSize,
	} from '@capacitor-community/admob';
	import { AppTrackingTransparency } from 'capacitor-plugin-app-tracking-transparency';

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

		// showBanner();
	}

	export async function showBanner(): Promise<void> {
		const options: BannerAdOptions = {
			adId: dev ? 'ca-app-pub-3940256099942544/6300978111' : 'ca-app-pub-6359902971784664/1810424049',
			adSize: BannerAdSize.ADAPTIVE_BANNER,
			position: BannerAdPosition.BOTTOM_CENTER,
			margin: 16,
		};
		
		AdMob.showBanner(options);
	}

	export async function showInterstitialAds() {
		await AdMob.prepareInterstitial({
			adId: dev ? 'ca-app-pub-3940256099942544/4411468910' : 'ca-app-pub-6359902971784664/7658690672'
		});

		AdMob.showInterstitial();
	}

	// export async function hideBanner() {
	// 	AdMob.hideBanner();
	// }

	// export async function resumeBanner() {
	// 	AdMob.resumeBanner();
	// }

	export async function removeBanner() {
		AdMob.removeBanner();
	}

	export async function requestTrackingPermission() {
		try {
			const statusResponse = await AppTrackingTransparency.getStatus();

			if (statusResponse.status === 'notDetermined') {
				const permissionResponse = await AppTrackingTransparency.requestPermission();
				return permissionResponse.status;
			}

			return statusResponse.status;
		} catch (error) {
			console.error('Error requesting tracking permission:', error);
			return 'error';
		}
	}
