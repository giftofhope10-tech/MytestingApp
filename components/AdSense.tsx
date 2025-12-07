import { useEffect, useState } from 'react';
import type { SiteSettings } from '../lib/types';

interface AdSenseProps {
  slot: 'header' | 'sidebar' | 'inArticle' | 'footer';
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export default function AdSense({ slot, format = 'auto', className = '' }: AdSenseProps) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/ads');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch ad settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings?.adsEnabled && settings?.adsenseClientId && !loaded) {
      const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${settings.adsenseClientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
      setLoaded(true);
    }
  }, [settings, loaded]);

  useEffect(() => {
    if (settings?.adsEnabled && settings?.adSlots[slot] && loaded) {
      try {
        ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense push error:', error);
      }
    }
  }, [settings, slot, loaded]);

  if (!settings?.adsEnabled || !settings?.adsenseClientId || !settings?.adSlots[slot]) {
    return null;
  }

  const slotId = settings.adSlots[slot];

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={settings.adsenseClientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSenseHeader() {
  return <AdSense slot="header" format="horizontal" className="my-2" />;
}

export function AdSenseSidebar() {
  return <AdSense slot="sidebar" format="vertical" className="my-4" />;
}

export function AdSenseInArticle() {
  return <AdSense slot="inArticle" format="auto" className="my-6" />;
}

export function AdSenseFooter() {
  return <AdSense slot="footer" format="horizontal" className="my-2" />;
}
