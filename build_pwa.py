import os
import re
from PIL import Image

def generate_icons():
    source_img_path = r"C:\Users\soroe\Documents\A-App\data\image\editorializer.jpg"
    public_dir = r"C:\Users\soroe\Documents\A-App\data\SOLID-DESIGN-EDITORIALIZER-\public"
    
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
        
    try:
        img = Image.open(source_img_path)
        # Convert to RGBA for transparency if needed
        img = img.convert("RGBA")
        
        # Resize to 192x192
        img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
        img_192.save(os.path.join(public_dir, "icon-192.png"), "PNG")
        
        # Resize to 512x512
        img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
        img_512.save(os.path.join(public_dir, "icon-512.png"), "PNG")
        
        # Also create favicon.ico
        img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
        img_32.save(os.path.join(public_dir, "favicon.ico"), format="ICO")
    except Exception as e:
        print(f"Error generating icons: {e}")

def create_manifest():
    manifest_path = r"C:\Users\soroe\Documents\A-App\data\SOLID-DESIGN-EDITORIALIZER-\public\manifest.json"
    manifest_content = """{
  "name": "SOLID DESIGN EDITORIALIZER",
  "short_name": "EDITORIALIZER",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#0E1014",
  "theme_color": "#0E1014",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}"""
    with open(manifest_path, "w", encoding="utf-8") as f:
        f.write(manifest_content)

def create_sw():
    sw_path = r"C:\Users\soroe\Documents\A-App\data\SOLID-DESIGN-EDITORIALIZER-\public\sw.js"
    sw_content = """const CACHE_NAME = 'solid-editorializer-v1.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
"""
    with open(sw_path, "w", encoding="utf-8") as f:
        f.write(sw_content)

def update_index_html():
    index_path = r"C:\Users\soroe\Documents\A-App\data\SOLID-DESIGN-EDITORIALIZER-\index.html"
    with open(index_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Modify title if needed
    content = re.sub(r'<title>.*?</title>', '<title>SOLID DESIGN EDITORIALIZER</title>', content)
    
    # Add manifest and theme-color
    head_addition = """
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0E1014" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/icon-192.png" />
"""
    if '<link rel="manifest"' not in content:
        content = content.replace('</head>', f'{head_addition}</head>')

    # Add service worker registration
    body_addition = """
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
          }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    </script>
"""
    if 'serviceWorker' not in content:
        content = content.replace('</body>', f'{body_addition}</body>')

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(content)

def create_batch_files():
    base_dir = r"C:\Users\soroe\Documents\A-App\data\SOLID-DESIGN-EDITORIALIZER-"
    
    dev_content = """@echo off
cd /d "%~dp0"
call npm run dev
pause"""
    build_content = """@echo off
cd /d "%~dp0"
call npm run build
pause"""
    preview_content = """@echo off
cd /d "%~dp0"
call npm run preview
pause"""

    with open(os.path.join(base_dir, "開発スタート.bat"), "w", encoding="shift_jis") as f:
        f.write(dev_content)
    with open(os.path.join(base_dir, "ビルド.bat"), "w", encoding="shift_jis") as f:
        f.write(build_content)
    with open(os.path.join(base_dir, "プレビュー.bat"), "w", encoding="shift_jis") as f:
        f.write(preview_content)

if __name__ == "__main__":
    generate_icons()
    create_manifest()
    create_sw()
    update_index_html()
    create_batch_files()
    print("Done")
