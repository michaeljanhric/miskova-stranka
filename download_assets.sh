#!/bin/bash

# Vytvorenie adresárov
mkdir -p assets/images/game/preload
mkdir -p assets/images/game/frame
mkdir -p assets/page/html5_fallback
mkdir -p assets/css
mkdir -p assets/js

# Stiahnutie obrázkov
curl -o assets/images/game/preload/PreloaderCompany.png https://foesk.innogamescdn.com/images/game/preload/PreloaderCompany.png
curl -o assets/images/game/preload/Preloader.png https://foesk.innogamescdn.com/images/game/preload/Preloader.png
curl -o assets/images/game/frame/performance_logo_foe.png https://foesk.innogamescdn.com/images/game/frame/performance_logo_foe.png
curl -o assets/images/page_btn_support.png https://foesk.innogamescdn.com/assets/page/html5_fallback/page_btn_support-ee2afb9cc.png
curl -o assets/images/icon_error.png https://foesk.innogamescdn.com/assets/page/html5_fallback/icon_error-4554e00ed.png
curl -o assets/images/paper_scroll.png https://foesk.innogamescdn.com/assets/page/html5_fallback/paper_scroll.png
curl -o assets/images/favicon.ico https://foesk.innogamescdn.com/favicon.ico
curl -o assets/images/apple-touch-icon.png https://foesk.innogamescdn.com/apple-touch-icon.png

# Stiahnutie CSS
curl -o assets/css/game.css https://foesk.innogamescdn.com/cache/merged-game-6de4a4e8.css

# Stiahnutie JavaScript
curl -o assets/js/3rd-party.js https://foesk.innogamescdn.com/cache/merged-3rd-party-109b844c.js
curl -o assets/js/game.js https://foesk.innogamescdn.com/cache/merged-game-c3b9b79d.js 