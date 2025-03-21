import {
	AdMob,
	type BannerAdOptions,
	BannerAdSize,
	BannerAdPosition,
	BannerAdPluginEvents,
	// type AdMobBannerSize,
  } from '@capacitor-community/admob';
  
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
	  adId: 'ca-app-pub-6359902971784664/1810424049',
	  adSize: BannerAdSize.BANNER,
	  position: BannerAdPosition.BOTTOM_CENTER,
	  margin: 0,
	  // isTesting: true
	  // npa: true
	};
	AdMob.showBanner(options);
  }