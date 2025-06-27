// api.js
import { useSettings } from '../../context/SettingsContext';

export async function getProducts() {
  const { settings } = useSettings();
  const url = `${settings.api_url}/api/v1/products/display-all.php`;

  try {
    const cached = await caches.match(url);
    if (cached) {
      const data = await cached.json();
      return data;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Fetch failed");
    
    const data = await res.clone().json();

    // Cache the new response
    const cache = await caches.open("product-cache");
    cache.put(url, res);

    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}
