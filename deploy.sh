#!/usr/bin/env bash

# Manifest Projesi Dağıtım Betiği
set -e

# 1. GitHub'dan en güncel kodları çek
echo "[+] Güncel kodlar çekiliyor..."
git pull origin main

# 2. Dosyaları Nginx yayın klasörüne kopyala
echo "[+] Dosyalar Nginx yayın klasörüne kopyalanıyor..."
sudo cp -r * /var/www/manifest/

# 3. İzinleri ayarla
echo "[+] Dosya izinleri ayarlanıyor..."
sudo chown -R www-data:www-data /var/www/manifest

echo "[+] Dağıtım tamamlandı! Siten güncel."
