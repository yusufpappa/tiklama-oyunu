# 🪙 moneyyyy — Tıklama Oyunu

Tek dosyalık (HTML + CSS + JavaScript), Türkçe, karanlık temalı bir **tıklama/idle oyunu**. Telefon ve bilgisayarda sorunsuz çalışır. Kurulum gerektirmez — `index.html` dosyasını tarayıcıda açman yeterli.

## 🎮 Nasıl Oynanır?

- Ekrana tıklayarak puan topla. Her tıklamada puan kazanılır.
- Biriktirdiğin puanlarla **yükseltmeler** alarak kazancını artır.
- İstersen **zamanlı test** modunda (5 sn / 10 sn / 30 sn / 1 dk) kendini sına ve rekor kır.

## ⬆️ Yükseltmeler

| Yükseltme | Etkisi | Başlangıç Fiyatı | Fiyat Çarpanı |
|-----------|--------|------------------|---------------|
| **Tıklama Gücü** | Tık başına +1 puan | 50 | ×1.5 |
| **Otomatik Tıklayıcı** | Saniyede +1 puan (otomatik) | 100 | ×1.6 |
| **Süper Çarpan** | Tüm kazancı 2× yapar | 250 | ×3.0 |

Her alımda fiyat çarpanı kadar pahalaşır.

## ⏱️ Zamanlı Test & Dereceler

Toplam tıklama sayısına göre 5 kademeli derece verilir:

🐢 Çok Yavaş → 🐌 Yavaş → 🙂 Orta → ⚡ Hızlı → 🔥 Çok Hızlı

Her süre için en iyi sonuç **rekor (BEST)** olarak saklanır.

## ✨ Özellikler

- 📱 **Responsive** — mobil ve masaüstünde aynı deneyim
- 🌑 **Karanlık tema**
- 🖱️ **Sol tık / Sağ tık** modu seçimi
- 💾 **Otomatik kayıt** — tarayıcıya (`localStorage`) kaydedilir, sayfayı kapatsan bile devam eder
- 🗂️ **Tek dosya** — bağımlılık veya derleme adımı yok

## 🚀 Çalıştırma

`index.html` dosyasını çift tıklayarak ya da herhangi bir tarayıcıda aç.

İstersen basit bir yerel sunucuyla da çalıştırabilirsin:

```bash
# Python ile
python -m http.server 8000
```

Ardından tarayıcıda `http://localhost:8000` adresine git.

## 🛠️ Teknoloji

- Saf HTML, CSS ve JavaScript — framework veya kütüphane kullanılmaz
- Her şey tek `index.html` dosyasının içinde
