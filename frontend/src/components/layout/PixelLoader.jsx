import { useEffect } from "react";
import { useSettings } from "../../context/SettingsContext";

export default function PixelLoader() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings) return;

    // Facebook Pixel
    if (settings.facebookPixelId) {
      const fbe = document.createElement("script");
      fbe.text = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(fbe);

      // noscript fallback
      const noscript = document.createElement("noscript");
      const img = document.createElement("img");
      img.height = 1;
      img.width = 1;
      img.style.display = "none";
      img.src = `https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1`;
      noscript.appendChild(img);
      document.head.appendChild(noscript);
    }

    // TikTok Pixel
    if (settings.tiktokPixelId) {
      const ttq = document.createElement("script");
      ttq.text = `
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e+""]=+new Date,ttq._o=ttq._o||{},ttq._o[e+""]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
          ttq.load('${settings.tiktokPixelId}');
          ttq.page();
        }(window, document, 'ttq');
      `;
      document.head.appendChild(ttq);
    }

    // Google Analytics (GA4)
    if (settings.googleAnalyticsId) {
      const ga = document.createElement("script");
      ga.async = true;
      ga.src = `https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`;
      document.head.appendChild(ga);

      const gaScript = document.createElement("script");
      gaScript.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.googleAnalyticsId}');
      `;
      document.head.appendChild(gaScript);
    }
  }, [settings]);

  return null;
}
