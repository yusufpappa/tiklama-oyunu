        /* =====================================================
           1) KLAVYE HARİTASI (Türkçe Q)
           -----------------------------------------------------
           Her harfin: kolon, satır (0 üst / 1 ev / 2 alt),
           eli (L/R) ve parmağı (0 serçe ... 3 işaret) tutulur.
           İki harf arasındaki güçlük bunlardan hesaplanır.
           ===================================================== */
        const TUSLAR = {
            q: [0, 0, 'L', 0], w: [1, 0, 'L', 1], e: [2, 0, 'L', 2], r: [3, 0, 'L', 3], t: [4, 0, 'L', 3],
            y: [5, 0, 'R', 3], u: [6, 0, 'R', 3], ı: [7, 0, 'R', 2], o: [8, 0, 'R', 1], p: [9, 0, 'R', 0], ğ: [10, 0, 'R', 0], ü: [11, 0, 'R', 0],
            a: [0, 1, 'L', 0], s: [1, 1, 'L', 1], d: [2, 1, 'L', 2], f: [3, 1, 'L', 3], g: [4, 1, 'L', 3],
            h: [5, 1, 'R', 3], j: [6, 1, 'R', 3], k: [7, 1, 'R', 2], l: [8, 1, 'R', 1], ş: [9, 1, 'R', 0], i: [10, 1, 'R', 0],
            z: [1, 2, 'L', 0], x: [2, 2, 'L', 1], c: [3, 2, 'L', 2], v: [4, 2, 'L', 3], b: [5, 2, 'L', 3],
            n: [6, 2, 'R', 3], m: [7, 2, 'R', 3], ö: [8, 2, 'R', 2], ç: [9, 2, 'R', 1]
        };

        /* İki harf arasındaki yazma güçlüğü puanı.
           - Aynı el + aynı parmak = en zor (parmak uzun atlar)
           - Aynı el komşu parmaklar = orta
           - Elle değiştirme = en kolay */
        function ciftPuan(h1, h2) {
            const a = TUSLAR[h1], b = TUSLAR[h2];
            const mesafe = Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2);
            if (a[2] !== b[2]) return 0.2 + mesafe * 0.4;             // eller farklı
            if (a[3] === b[3]) return 2 + mesafe * 1.2;               // aynı parmak
            return 0.5 + mesafe * 0.8;                                // aynı el, farklı parmak
        }

        /* Bir grubun ortalama güçlüğü */
        function grupPuan(grup) {
            let t = 0;
            for (let i = 1; i < grup.length; i++) t += ciftPuan(grup[i - 1], grup[i]);
            return t / (grup.length - 1);
        }

        /* =====================================================
           1b) SANAL KLAVYE (Türkçe Q) — parmak renkleri
           -----------------------------------------------------
           Her tuş: [harf, satır, kolon, el, parmak(0-3), renk]
           Parmak renkleri: sol el soluk tonlar, sağ el sıcak tonlar;
           serçe→işaret ayrımı renk yoğunluğuyla hissedilir.
           ===================================================== */
        const PARMAK_RENKLERI = {
            L0: '#8ecae6', L1: '#90be6d', L2: '#f9c74f', L3: '#f8961e',   // sol el: serçe→işaret
            R0: '#f4a6c0', R1: '#c77dff', R2: '#7bdff2', R3: '#b5e48c',   // sağ el: serçe→işaret
            TB: '#9aa0b5'                                                  // başparmak (boşluk)
        };

        const KB_SATIRLAR = [
            [   ['q', 'L0'], ['w', 'L1'], ['e', 'L2'], ['r', 'L3'], ['t', 'L3'],
                ['y', 'R3'], ['u', 'R3'], ['ı', 'R2'], ['o', 'R1'], ['p', 'R0'],
                ['ğ', 'R0'], ['ü', 'R0'] ],
            [   ['a', 'L0', true], ['s', 'L1', true], ['d', 'L2', true], ['f', 'L3', true], ['g', 'L3'],
                ['h', 'R3'], ['j', 'R3', true], ['k', 'R2', true], ['l', 'R1', true], ['ş', 'R0', true],
                ['i', 'R0'] ],
            [   ['z', 'L0'], ['x', 'L1'], ['c', 'L2'], ['v', 'L3'], ['b', 'L3'],
                ['n', 'R3'], ['m', 'R3'], ['ö', 'R2'], ['ç', 'R1'] ]
        ];

        const kbTuslar = {};         // harf -> tuş elemanı

        /* Klavye normalde RENKSİZDİR (gri tuşlar). Renklendir
           butonu 2 durum arasında geçer:
           1) Parmak renkleri (her parmak kendi renginde)
           2) Hata ısı haritası (kırmızı=kötü -> yeşil=iyi) */
        function sanalKlavyeCiz() {
            const kapsayici = document.getElementById('sanalKlavye');
            kapsayici.querySelectorAll('.kb-satir').forEach(r => r.remove());

            KB_SATIRLAR.forEach(function (satir) {
                const sEl = document.createElement('div');
                sEl.className = 'kb-satir';
                satir.forEach(function (t) {
                    const tus = document.createElement('div');
                    tus.className = 'kb-tus' + (t[2] ? ' ev-tusu' : '');
                    tus.textContent = t[0];
                    tus.dataset.parmak = t[1];       /* renk modu için sakla */
                    kbTuslar[t[0]] = tus;
                    sEl.appendChild(tus);
                });
                kapsayici.appendChild(sEl);
            });

            /* Boşluk tuşu */
            const bs = document.createElement('div');
            bs.className = 'kb-satir';
            const bosluk = document.createElement('div');
            bosluk.className = 'kb-tus kb-bosluk';
            bosluk.textContent = 'BOŞLUK';
            bosluk.dataset.parmak = 'TB';
            kbTuslar[' '] = bosluk;
            bs.appendChild(bosluk);
            kapsayici.appendChild(bs);

            klavyeModUygula();
        }

        /* Sıradaki harfe göre klavyede vurgu + ELLERİ güncelle */
        function klavyeVurgula(siradaki, sonuc) {
            /* Önceki vurguları temizle */
            Object.values(kbTuslar).forEach(function (t) {
                t.classList.remove('siradaki', 'basildi-dogru', 'basildi-yanlis');
            });
            if (siradaki === undefined || siradaki === null) { elleriGuncelle(null); return; }
            const t = kbTuslar[siradaki.toLowerCase ? siradaki.toLowerCase() : ' '];
            if (!t) { elleriGuncelle(null); return; }
            t.classList.add('siradaki');
            if (sonuc === 'd') t.classList.add('basildi-dogru');
            if (sonuc === 'y') t.classList.add('basildi-yanlis');

            /* Yan ellerde de o parmağı parlat */
            elleriGuncelle(siradaki);
        }

        /* =====================================================
           1c) ZAYIF HARF TAKİBİ
           -----------------------------------------------------
           Her harf için doğru/yanlış sayısı tutulur.
           Hata oranı %20'yi aşayan harfler "zayıf" kabul edilir
           ve yeni gruplarda 2.5 kat daha sık seçilir.
           ===================================================== */
        const ZAYIF_KEY = 'klavye_harf_istatistik';
        let harfIstatistik = {};     // { harf: {d: doğru, y: yanlış} }

        function harfIstatistikYukle() {
            try {
                const k = localStorage.getItem(ZAYIF_KEY);
                if (k) harfIstatistik = JSON.parse(k) || {};
            } catch (h) { harfIstatistik = {}; }
        }

        function harfIstatistikKaydet() {
            try { localStorage.setItem(ZAYIF_KEY, JSON.stringify(harfIstatistik)); } catch (h) {}
        }

        function harfKayit(harf, dogruMu) {
            if (!harfIstatistik[harf]) harfIstatistik[harf] = { d: 0, y: 0 };
            if (dogruMu) harfIstatistik[harf].d++;
            else harfIstatistik[harf].y++;
            harfIstatistikKaydet();
        }

        /* Zayıf harfleri getir: en az 4 deneme + %20'den fazla hata */
        function zayifHarfleriGetir() {
            const zayif = [];
            for (const h in harfIstatistik) {
                const s = harfIstatistik[h];
                const toplam = s.d + s.y;
                if (toplam >= 4 && s.y / toplam > 0.20) {
                    zayif.push({ h: h, oran: s.y / toplam });
                }
            }
            zayif.sort((a, b) => b.oran - a.oran);
            return zayif.slice(0, 5).map(z => z.h);
        }

        function zayifSatiriGuncelle() {
            const list = zayifHarfleriGetir();
            document.getElementById('zayifHarfler').textContent =
                list.length > 0 ? list.join('  ') : '—';
        }

        /* =====================================================
           1e) DERS MÜFREDATI — sıfırdan, en temelden
           -----------------------------------------------------
           "Hiç klavye kullanmamış birine" göre yazılmış
           anlatımlar. Her ders: yeni harf(ler) + alıştırma.
           parmaklar: [el, parmakNo(0=serçe..3=işaret), ad]
           ===================================================== */
        const PARMakLAR_TR = {
            L: ['Serçe', 'Yüzük', 'Orta', 'İşaret'],
            R: ['Serçe', 'Yüzük', 'Orta', 'İşaret']
        };

        const DERSLER = [
            {
                no: 1, baslik: 'Klavyeye Tanış', harfler: [],
                anlatim: 'Merhaba! 🖐️ <b>10 parmak yazma</b>, her parmağın kendine ait tuşlara basması demek. ' +
                    'Ekranda gördüğün renkli klavyeye bak: <b>her renk bir parmağa</b> ait. ' +
                    'Önce ellerimizi doğru yere koyalım: aşağıdaki ellerdeki <b>renkli parmaklar</b> sana yol gösterecek. ' +
                    'Bu derste sadece hazırlık var — yazmaya başlamak için <b>boşluk</b> tuşuna bas!',
                parmakVurgu: { L3: true, R3: true },
                alistirma: () => [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']   /* 8 tekli boşluk */
            },
            {
                no: 2, baslik: 'Ev Sırası: F ve J', harfler: ['f', 'j'],
                anlatim: 'Klavyede <b>F</b> ve <b>J</b> tuşlarını elinle tara — üstlerinde küçük bir <b>çıkıntı</b> var! 👆 ' +
                    'Bu çıkıntılar gözünü kapatsan bile parmaklarını doğru yere koymaı sağlar. ' +
                    '<b>Sol işaret parmağı F</b>\'ye, <b>sağ işaret parmağı J</b>\'ye. ' +
                    'Diğer parmaklarını da sırayla koy: sol el A-S-D-F, sağ el J-K-L-Ş. ' +
                    'Şimdi F ve J yaz — parmakların bastıktan sonra <b>aynı yere geri dönsün!</b>',
                parmakVurgu: { L3: true, R3: true },
                alistirma: () => dersUret('fj', 12)
            },
            {
                no: 3, baslik: 'Ev Sırası: D ve K', harfler: ['d', 'k', 'f', 'j'],
                anlatim: 'Harika! Şimdi komşular: <b>D</b> sol <b>orta</b> parmağın, <b>K</b> sağ <b>orta</b> parmağın. 🖐️ ' +
                    'Eller ev sırasında duruyor: <b>A S D F</b> — <b>J K L Ş</b>. ' +
                    'Unutma: parmak bastığı tuştan sonra <b>daima ev sırasına döner</b>. ' +
                    'Yavaş olsan da olur — şu an hız değil, <b>doğru parmak</b> önemli!',
                parmakVurgu: { L2: true, R2: true },
                alistirma: () => dersUret('dfjk', 12)
            },
            {
                no: 4, baslik: 'Ev Sırası: S ve L', harfler: ['s', 'l', 'd', 'k', 'f', 'j'],
                anlatim: 'Sıradaki: <b>S</b> sol <b>yüzük</b>, <b>L</b> sağ <b>yüzük</b> parmağında. 💍 ' +
                    'Ev sırası tamam oluyor: <b>A S D F</b> — <b>J K L Ş</b>. ' +
                    'Bu 8 tuş klavyedeki <b>evin</b>. Yazarken bile eller hep buraya döner. ' +
                    'Alıştırmada eski harfler de tekrar edilecek — <b>bakmadan</b> yazmaya çalış!',
                parmakVurgu: { L1: true, R1: true },
                alistirma: () => dersUret('sdklfj', 12)
            },
            {
                no: 5, baslik: 'Ev Sırası: A ve Ş', harfler: ['a', 'ş', 's', 'l', 'd', 'k', 'f', 'j'],
                anlatim: 'Son çift: <b>A</b> sol <b>serçe</b>, <b>Ş</b> sağ <b>serçe</b> parmağında. 🤏 ' +
                    'Serçe parmak en zayıf parmaktır — bol bol alıştırma gerekir, zorlanmak normal! ' +
                    'Artık <b>tüm ev sırasını</b> biliyorsun: <b>A S D F — J K L Ş</b>. 🏠 ' +
                    'Bu dersi geçince artık bakmadan ev sırasını yazabiliyor olacaksın!',
                parmakVurgu: { L0: true, R0: true },
                alistirma: () => dersUret('asdfjklş', 14)
            },
            {
                no: 6, baslik: 'Ev Sırası: G ve H', harfler: ['g', 'h'],
                anlatim: 'Ev sırasından <b>yukarı uzanan</b> ilk harfler: <b>G</b> sol işaret parmağının <b>F\'den bir sağa</b>, ' +
                    '<b>H</b> sağ işaret parmağının <b>J\'den bir sola</b> kayması. 🤸 ' +
                    'İşaret parmakların sadece bu ikisi için yerinden kayar — bastıktan sonra <b>hemen geri dön!</b> ' +
                    'Küçük bir hareket, büyük bir alışkanlık.',
                parmakVurgu: { L3: true, R3: true },
                alistirma: () => dersUret('ghfjdk', 12)
            },
            {
                no: 7, baslik: 'Üst Sıra: Q P ve Komşuları', harfler: ['q', 'p', 'w', 'o'],
                anlatim: 'Şimdi klavyenin <b>üst sırasına</b> çıkıyoruz! ⬆️ ' +
                    '<b>Q</b>: sol serçe parmağın yukarı kayar. <b>P</b>: sağ serçe parmağın yukarı kayar. ' +
                    '<b>W</b>: sol yüzük, <b>O</b>: sağ yüzük parmağının üst tuşu. ' +
                    'Parmaklar yukarı <b>çapraz</b> uzanır, bilekler <b>hareket etmez</b>. ' +
                    'Eller sabit, sadece parmaklar uzanıyor — düşünen bir örümcek gibi 🕷️',
                parmakVurgu: { L0: true, R0: true },
                alistirma: () => dersUret('qpowjklş', 12)
            },
            {
                no: 8, baslik: 'Üst Sıra: E I R U T Y', harfler: ['e', 'ı', 'r', 'u', 't', 'y'],
                anlatim: 'Üst sıranın merkez harfleri: <b>E</b> ve <b>I</b> orta parmakların, <b>R</b>-<b>U</b> işaretlerin, ' +
                    '<b>T</b>-<b>Y</b> da işaret parmakların biraz daha içeri uzanışı. ☝️ ' +
                    'Türkçe\'de E ve I çok sık geçer — bunları öğrenmek hızını birden artırır! ' +
                    'Yavaş başla, doğru parmakla yazmaya odaklan.',
                parmakVurgu: { L2: true, R2: true },
                alistirma: () => dersUret('eırutyasdf', 12)
            },
            {
                no: 9, baslik: 'Üst Sıra: Ğ Ü', harfler: ['ğ', 'ü'],
                anlatim: 'Türkçe\'ye özel harfler geliyor! 🇹🇷 <b>Ğ</b> ve <b>Ü</b> sağ <b>serçe</b> parmağının üst sıra tuşları. ' +
                    'Serçe parmak bunlar için uzanır — başta garip gelir, alışınca otomatikleşir. ' +
                    'Yabancıların öğrenemediği bu harfleri sen klavyede ustalaşacaksın!',
                parmakVurgu: { R0: true },
                alistirma: () => dersUret('ğüpşşoq', 12)
            },
            {
                no: 10, baslik: 'Alt Sıra: Z M ve Komşuları', harfler: ['z', 'm', 'x', 'c', 'v', 'b', 'n'],
                anlatim: 'Klavyenin <b>alt sırasına</b> iniyoruz! ⬇️ ' +
                    '<b>Z</b> sol serçe aşağı, <b>M</b> sağ işaret aşağı uzanır. ' +
                    '<b>X-C</b> sol yüzük-orta, <b>V-B</b> sol işaret; <b>N</b> sağ işaretin altı. ' +
                    'Parmaklar <b>aşağı kıvrılarak</b> basar — yine bilek sabit. ' +
                    'Alt sıra en zor sıradır, acele etme!',
                parmakVurgu: { L0: true, R3: true },
                alistirma: () => dersUret('zmxcbnv', 12)
            },
            {
                no: 11, baslik: 'Alt Sıra: Ö Ç', harfler: ['ö', 'ç'],
                anlatim: 'Türkçe\'nin alt sıra özel harfleri: <b>Ö</b> sağ <b>orta</b> parmağın alt tuşu, ' +
                    '<b>Ç</b> sağ <b>yüzük</b> parmağın alt tuşu. 🔤 ' +
                    'Artık klavyedeki <b>tüm harfleri</b> biliyorsun! ' +
                    'Bu dersten sonra sana sadece kelime ve hız kalıyor.',
                parmakVurgu: { R2: true, R1: true },
                alistirma: () => dersUret('öçmnl', 12)
            },
            {
                no: 12, baslik: 'Büyük Harf: Shift', harfler: [],
                anlatim: 'Büyük harf için <b>Shift</b> kullanacağız! ⬆️ ' +
                    'Kural çok basit: <b>sağ elin harfine sol Shift</b>, <b>sol elin harfine sağ Shift</b>. ' +
                    'Yani <b>A</b> yazarken sol serçe A\'ya giderken <b>sağ serçe sağ Shift</b>\'e basar. ' +
                    'İki el birlikte çalışır — bir el asla iki iş yapmaz! ' +
                    'Şimdi büyük harflerle yaz: <b>A S D F J K L Ş</b>',
                parmakVurgu: { L0: true, R0: true },
                shiftDersi: true,
                alistirma: () => 'AsDfJkLş FdSs JjŞş' .replace(/ /g, ' ')
            },
            {
                no: 13, baslik: 'Türkçe Büyük Harfler', harfler: [],
                anlatim: 'Türkçe\'nin inceliği: <b>i → İ</b> ve <b>ı → I</b> dönüşümleri! 🇹🇷 ' +
                    'Klavyede <b>I</b> tuşuna Shift ile basarsan <b>I</b> (büyük ı), ' +
                    '<b>i</b> tuşu ile Shift\'ten <b>İ</b> (noktalı İ) gelir. ' +
                    '"İstanbul" ve "Isparta" yazarken dikkat! Şimdi alıştırma:',
                parmakVurgu: { L0: true, R0: true },
                shiftDersi: true,
                alistirma: () => 'İstanbul Isparta İzmir Iğdır'
            },
            {
                no: 14, baslik: 'Kısa Kelimeler', harfler: [],
                anlatim: 'Tebrikler, <b>tüm klavyeyi</b> öğrendin! 🎉 Artık kelime yazma zamanı. ' +
                    'Kısa ve sık kullanılan Türkçe kelimelerle başlıyoruz. ' +
                    'Artık <b>ekrana bak</b>, klavyeye <b>asla</b>! 👀 ' +
                    'Parmakların ev sırasından çıkıp geri döndüğünü hissetmeye başlayacaksın.',
                kelimeDersi: true,
                alistirma: () => kelimeDizisi(['bir', 've', 'bu', 'ile', 'için', 'gibi', 'ama', 'veya', 'daha', 'çok'])
            },
            {
                no: 15, baslik: 'Cümleler', harfler: [],
                anlatim: 'Son ders! 🏁 Artık <b>tam cümleler</b> yazacaksın. ' +
                    'Boşluk tuşuna <b>başparmaklarınla</b> bas — sol kelime sağ başparmak, sağ kelime sol başparmak diye sırayla. ' +
                    'Nokta ve virgül sağ serçe parmağın işi. ' +
                    'Bu dersi bitirince 10 parmak yazmayı <b>öğrenmiş</b> oluyorsun — geriye sadece <b>pratik</b> kalır! 💪',
                kelimeDersi: true,
                alistirma: () => kelimeDizisi(['Bugün', 'hava', 'çok', 'güzel', 've', 'biz', 'parka', 'gideceğiz', 'çünkü', 'güneş', 'açtı'])
            }
        ];

        /* Ders için yardımcı üreticiler */
        function dersUret(havuzStr, adet) {
            const havuz = havuzStr.split('');
            const gruplar = [];
            for (let i = 0; i < adet; i++) {
                const len = 3;
                let g = '';
                for (let j = 0; j < len; j++) g += havuz[Math.floor(Math.random() * havuz.length)];
                gruplar.push(g);
            }
            return gruplar;
        }

        function kelimeDizisi(kelimeler) {
            return kelimeler.slice();
        }

        /* =====================================================
           2) 10 SEVİYE: 9 HARF + 1 KELİME
           -----------------------------------------------------
           1-9: harf grupları (min/max güçlük aralığı yükselir)
           10:  normal Türkçe kelimeler
           hizEsik: harf/saniye hızı bu seviyeye "yeterli" sayılır
                    (sonuç ekranındaki öneri bunu kullanır)
           ===================================================== */
        const SEVIYELER = [
            { no: 1,  ad: 'Isınma',     min: 0.0, max: 1.5, tuslar: 'asdfjklşgh',              hizEsik: 1.2 },
            { no: 2,  ad: 'Temel',      min: 0.0, max: 2.0, tuslar: 'asdfjklşghrtuvbnmy',      hizEsik: 1.6 },
            { no: 3,  ad: 'Alışma',     min: 0.0, max: 2.4, tuslar: 'asdfjklşghrtuvbnmyeımcö',  hizEsik: 2.0 },
            { no: 4,  ad: 'Orta',       min: 0.0, max: 2.8, tuslar: 'asdfjklşghrtuvbnmyeımcöwoxçl', hizEsik: 2.4 },
            { no: 5,  ad: 'Genişleme',  min: 0.0, max: 3.2, tuslar: 'asdfjklşghrtuvbnmyeımcöwoxçpziş', hizEsik: 2.8 },
            { no: 6,  ad: 'Zorlanma',   min: 0.0, max: 3.6, tuslar: 'qwertyuıopğüasdfghjklşizxcvbnmöç', hizEsik: 3.2 },
            { no: 7,  ad: 'Hız',        min: 0.8, max: 4.0, tuslar: 'qwertyuıopğüasdfghjklşizxcvbnmöç', hizEsik: 3.6 },
            { no: 8,  ad: 'Zor',        min: 1.4, max: 4.2, tuslar: 'qwertyuıopğüasdfghjklşizxcvbnmöç', hizEsik: 4.0 },
            { no: 9,  ad: 'Çok Zor',    min: 2.0, max: 4.4, tuslar: 'qwertyuıopğüasdfghjklşizxcvbnmöç', hizEsik: 4.5 },
            { no: 10, ad: 'Kelimeler',  kelime: true,                                        hizEsik: 5.0 }
        ];

        /* 10. seviye kelimeleri: normal Türkçe kelimeler */
        const KELIMELER = [
            'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz', 'on',
            'su', 'ev', 'kitap', 'kalem', 'masa', 'sandalye', 'pencere', 'kapı', 'duvar', 'oda',
            'gün', 'ay', 'yıl', 'hafta', 'saat', 'dakika', 'saniye', 'sabah', 'akşam', 'gece',
            'anne', 'baba', 'kardeş', 'arkadaş', 'komşu', 'öğretmen', 'öğrenci', 'doktor', 'mühendis', 'işçi',
            'kırmızı', 'mavi', 'yeşil', 'sarı', 'siyah', 'beyaz', 'turuncu', 'mor', 'pembe', 'kahverengi',
            'yürümek', 'koşmak', 'yüzmek', 'okumak', 'yazmak', 'dinlemek', 'konuşmak', 'görmek', 'duymak', 'anlamak',
            'Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Konya', 'Adana', 'Kocaeli', 'Mersin',
            'bilgisayar', 'klavye', 'ekran', 'fare', 'internet', 'telefon', 'mesaj', 'program', 'dosya', 'sistem',
            'çünkü', 'fakat', 'ancak', 'yine', 'gene', 'hemen', 'şimdi', 'sonra', 'önce', 'herzaman',
            'güzel', 'kötü', 'büyük', 'küçük', 'uzun', 'kısa', 'geniş', 'dar', 'yüksek', 'alçak'
        ];

        /* Hıza göre önerilecek seviyeyi bul:
           harf/sn, o seviyenin hız eşiğini tutturuyorsa o seviyedesin */
        function oneriBul(hiz, dogruluk) {
            /* Doğruluk çok düşükse hız ne olursa olsun bir seviye geri */
            if (dogruluk < 0.70) {
                let s = 1;
                for (const sv of SEVIYELER) if (hiz >= sv.hizEsik) s = sv.no;
                return Math.max(1, s - 1) || 1;
            }
            let s = 1;
            for (const sv of SEVIYELER) {
                if (hiz >= sv.hizEsik) s = sv.no;
            }
            return s;
        }

        const SURE = 60;                        // Test süresi: 60 saniye

        /* Seviyeye uygun grup üretir.
           1-9: 3-4 harflik gruplar (güçlük aralığına göre)
           10: normal Türkçe kelime
           ZAYIF harfler havuzda 2.5 kat fazla temsil edilir. */
        function grupUret() {
            const sv = SEVIYELER[durum.seviye - 1];

            /* 10. SEVİYE: normal kelime */
            if (sv.kelime) {
                return KELIMELER[Math.floor(Math.random() * KELIMELER.length)];
            }

            /* Zayıf harfler bu seviyenin havuzundaysa ekstra ekle */
            const zayif = zayifHarfleriGetir();
            let havuzDizi = sv.tuslar.split('');
            for (const zh of zayif) {
                if (sv.tuslar.includes(zh)) havuzDizi.push(zh, zh);  // 2 kopya = ~3x sık
            }
            const havuz = havuzDizi;
            const uzunluk = Math.random() < 0.5 ? 3 : 4;

            let enIyi = null, enIyiFark = 999;

            for (let deneme = 0; deneme < 60; deneme++) {
                const g = [];
                for (let i = 0; i < uzunluk; i++) {
                    g.push(havuz[Math.floor(Math.random() * havuz.length)]);
                }
                const p = grupPuan(g);

                /* Aralıktaysa hemen kabul */
                if (p >= sv.min && p <= sv.max) return g.join('');

                /* Değilse en yakın adayı sakla (kilitlenme olmasın) */
                const hedef = p < sv.min ? sv.min : sv.max;
                const fark = Math.abs(p - hedef);
                if (fark < enIyiFark) { enIyiFark = fark; enIyi = g; }
            }
            return enIyi.join('');
        }

        /* =====================================================
           3) DURUM
           ===================================================== */
        let durum = {
            seviye: 1,
            akis: [], kelimeEls: [],
            index: 0, yazilan: '',
            calisiyor: false, bitti: false,
            baslangic: null, zamanId: null,
            harf: 0, hatali: 0,             // toplam doğru harf / hatalı tuş
            tus: 0                          // toplam tuş vuruşu (doğruluk için)
        };

        const kelimeAkisiEl = document.getElementById('kelimeAkisi');
        const girisiEl = document.getElementById('girisi');
        const baslaIpucuEl = document.getElementById('baslaIpucu');

        /* =====================================================
           4) SES (yanlış harfte kısa "dırt")
           ===================================================== */
        let sesBaglami = null;
        let sesAcik = localStorage.getItem('klavye_ses') !== '0';

        function yanlisSesiCal() {
            if (!sesAcik) return;
            try {
                if (!sesBaglami) sesBaglami = new (window.AudioContext || window.webkitAudioContext)();
                if (sesBaglami.state === 'suspended') sesBaglami.resume();

                const t = sesBaglami.currentTime;
                const osc = sesBaglami.createOscillator();
                const gain = sesBaglami.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, t);
                osc.frequency.exponentialRampToValueAtTime(70, t + 0.12);
                gain.gain.setValueAtTime(0.35, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
                osc.connect(gain).connect(sesBaglami.destination);
                osc.start(t); osc.stop(t + 0.15);

                const osc2 = sesBaglami.createOscillator();
                const gain2 = sesBaglami.createGain();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(140, t);
                osc2.frequency.exponentialRampToValueAtTime(50, t + 0.1);
                gain2.gain.setValueAtTime(0.2, t);
                gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
                osc2.connect(gain2).connect(sesBaglami.destination);
                osc2.start(t); osc2.stop(t + 0.12);
            } catch (h) { /* sessiz devam */ }
        }

        /* =====================================================
           5) AKIŞ YÖNETİMİ
           ===================================================== */
        function kelimeCiz(grup) {
            const kutu = document.createElement('div');
            kutu.className = 'kelime';

            /* Boşluk dersi grubu: görünür "␣" göster */
            if (grup === ' ') {
                const b = document.createElement('span');
                b.className = 'harf';
                b.textContent = '␣';
                b.style.opacity = '0.7';
                kutu.appendChild(b);
                const son0 = document.createElement('span');
                son0.className = 'son-imlec';
                kutu.appendChild(son0);
                durum.kelimeEls.push(kutu);
                return kutu;
            }
            for (const harf of grup) {
                const h = document.createElement('span');
                h.className = 'harf';
                h.textContent = harf;
                kutu.appendChild(h);
            }
            const son = document.createElement('span');
            son.className = 'son-imlec';
            kutu.appendChild(son);
            durum.kelimeEls.push(kutu);
            return kutu;
        }

        function akisDoldur(adet, temizle) {
            if (temizle) {
                durum.akis = []; durum.kelimeEls = [];
                kelimeAkisiEl.innerHTML = '';
                kelimeAkisiEl.style.transform = 'translateY(0)';
            }
            for (let i = 0; i < adet; i++) {
                durum.akis.push(grupUret());
                kelimeAkisiEl.appendChild(kelimeCiz(durum.akis[durum.akis.length - 1]));
            }
        }

        function harfleriBoya() {
            const kutu = durum.kelimeEls[durum.index];
            if (!kutu) return;
            const grup = durum.akis[durum.index];

            /* Boşluk-dersi grubu: sadece imleci göster */
            if (grup === ' ') {
                kutu.classList.add('tamamlandi');
                return;
            }

            const harfler = kutu.querySelectorAll('.harf');
            const yaz = durum.yazilan;

            harfler.forEach((h, i) => {
                h.classList.remove('d', 'y', 'bekleyen');
                if (i < yaz.length) {
                    h.classList.add(yaz[i] === durum.akis[durum.index][i] ? 'd' : 'y');
                } else if (i === yaz.length) {
                    h.classList.add('bekleyen');
                }
            });
            kutu.classList.toggle('tamamlandi', yaz.length >= durum.akis[durum.index].length);
        }

        function kaydir() {
            const el = durum.kelimeEls[durum.index];
            if (!el) return;
            const satir = el.offsetHeight + 14;
            if (el.offsetTop > satir) {
                kelimeAkisiEl.style.transform = 'translateY(' + (satir - el.offsetTop) + 'px)';
            }
        }

        /* =====================================================
           6) GRUP TAMAMLAMA
           ===================================================== */
        function grupGonder() {
            const kelime = durum.akis[durum.index];
            const kutu = durum.kelimeEls[durum.index];
            /* Boşluk-dersi grubunda tek boşluk vuruşu = doğru */
            const dogruMu = kelime === ' ' ? true : durum.yazilan === kelime;

            kutu.classList.remove('aktif', 'tamamlandi');
            kutu.classList.add(dogruMu ? 'td' : 'ty');

            durum.index++;
            durum.yazilan = '';

            const yeni = durum.kelimeEls[durum.index];
            if (yeni) { yeni.classList.add('aktif'); harfleriBoya(); }
            else if (kelime === ' ') klavyeVurgula(null);

            kaydir();
            sayacGuncelle();

            /* Akış tükeniyorsa uzat (test modunda); ders modunda bitiş kontrolü */
            if (dersModu && aktifDers) {
                dersKontrol();
            } else if (durum.index >= durum.akis.length - 8) {
                akisDoldur(12, false);
            }
        }

        /* =====================================================
           7) SAYAÇ + WPM + 60 SANİYE ZAMANLAYICI
           -----------------------------------------------------
           WPM = (doğru karakter / 5) / dakika  (standart formül:
           1 "kelime" = 5 karakter, boşluklar dahil)
           ===================================================== */
        function wpmHesapla(dogruHarf, gecenSaniye) {
            if (gecenSaniye <= 0) return 0;
            return (dogruHarf / 5) / (gecenSaniye / 60);
        }

        function sayacGuncelle() {
            document.getElementById('harfSayisi').textContent = durum.harf;
            const gecen = durum.baslangic ? (Date.now() - durum.baslangic) / 1000 : 0;
            document.getElementById('gecenSure').textContent = gecen.toFixed(1);

            /* ÜST CANLI SAYAÇ: WPM + hız + kalan süre yazarken görünür */
            document.getElementById('canliWpm').textContent =
                Math.round(wpmHesapla(durum.harf, gecen));
            document.getElementById('canliHiz').textContent =
                gecen > 0 ? (durum.harf / gecen).toFixed(1) : '0.0';

            /* Kalan süre */
            if (durum.calisiyor) {
                const kalan = Math.max(0, SURE - gecen);
                const kalanTam = Math.ceil(kalan);
                document.getElementById('canliSure').textContent = kalanTam;
                document.getElementById('kalanSure').textContent = '⏱️ ' + kalanTam + ' sn';

                /* Son 10 saniyede kırmızı yanıp sön */
                document.getElementById('canliSureKutusu').classList.toggle('son-10', kalan <= 10 && kalan > 0);

                if (kalan <= 0) testiBitir();
            }
        }

        function zamanlayiciBaslat() {
            durum.calisiyor = true;
            durum.baslangic = Date.now();
            baslaIpucuEl.classList.add('gizli');
            durum.zamanId = setInterval(sayacGuncelle, 100);
        }

        /* =====================================================
           7b) TESTİ BİTİR + ÖNERİLEN SEVİYE
           -----------------------------------------------------
           60 saniye dolunca: harf/sn hızına ve doğruluğa
           bakılarak "senin seviyen" hesaplanır ve modalda
           gösterilir.
           ===================================================== */
        function testiBitir() {
            clearInterval(durum.zamanId);
            durum.calisiyor = false;
            durum.bitti = true;
            girisiEl.blur();

            const gecen = durum.baslangic ? (Date.now() - durum.baslangic) / 1000 : SURE;
            const hiz = gecen > 0 ? durum.harf / gecen : 0;
            const wpm = wpmHesapla(durum.harf, gecen);
            const dogruluk = durum.tus > 0 ? durum.harf / durum.tus : 1;
            const oneri = oneriBul(hiz, dogruluk);
            const oneriSv = SEVIYELER[oneri - 1];

            /* Bugünün kaydını güncelle (en iyi WPM) */
            gunlukKayitEkle(Math.round(wpm));

            /* Öneri rozetini doldur */
            document.getElementById('oneriSeviye').innerHTML =
                'Seviye <b>' + oneri + '</b> <span class="ok">— ' + oneriSv.ad + '</span>';
            document.getElementById('oneriNot').textContent =
                oneri === 10
                    ? '👑 Harika! Kelime seviyesine hazırsın.'
                    : 'Hedefin: ' + oneriSv.hizEsik + ' harf/sn (şu an: ' + hiz.toFixed(1) + ')';

            document.getElementById('sonucWpm').textContent = Math.round(wpm);
            document.getElementById('sonucHarf').textContent = durum.harf;
            document.getElementById('sonucHiz').textContent = hiz.toFixed(1);
            document.getElementById('sonucDogruluk').textContent =
                '%' + Math.round(dogruluk * 100);

            document.getElementById('sonucModal').classList.add('acik');
            ilerlemePaneliCiz();     // grafik + streak tazele
        }

        /* =====================================================
           7c) İLERLEME: GÜNLÜK KAYIT + GRAFİK + STREAK
           -----------------------------------------------------
           Her günün en iyi WPM'si kaydedilir; son 7 gün
           çubuk grafikte gösterilir. Streak = art arda çalışılan
           gün sayısı (bir gün atlanırsa sıfırlanır).
           ===================================================== */
        const GUNLUK_KEY = 'klavye_gunluk_wpm';
        let gunlukWpm = {};          // { 'YYYY-AA-GG': enIyiWpm }

        function gunlukYukle() {
            try {
                const k = localStorage.getItem(GUNLUK_KEY);
                if (k) gunlukWpm = JSON.parse(k) || {};
            } catch (h) { gunlukWpm = {}; }
        }

        function bugunAnahtari() {
            const d = new Date();
            return d.getFullYear() + '-' +
                   String(d.getMonth() + 1).padStart(2, '0') + '-' +
                   String(d.getDate()).padStart(2, '0');
        }

        function gunlukKayitEkle(wpm) {
            const a = bugunAnahtari();
            if (!gunlukWpm[a] || wpm > gunlukWpm[a]) gunlukWpm[a] = wpm;
            try { localStorage.setItem(GUNLUK_KEY, JSON.stringify(gunlukWpm)); } catch (h) {}
        }

        /* Streak: bugün dahil geriye doğru kesintisiz gün sayısı */
        function streakHesapla() {
            let s = 0;
            const d = new Date();
            for (;;) {
                const a = d.getFullYear() + '-' +
                          String(d.getMonth() + 1).padStart(2, '0') + '-' +
                          String(d.getDate()).padStart(2, '0');
                if (gunlukWpm[a]) { s++; d.setDate(d.getDate() - 1); }
                else break;
            }
            return s;
        }

        /* Son 7 gün çubuk grafiği */
        function ilerlemePaneliCiz() {
            const kapsayici = document.getElementById('grafikKapsayici');
            const gunlerEl = document.getElementById('grafikGunler');
            const bosEl = document.getElementById('ilerlemeBos');
            kapsayici.innerHTML = '';
            gunlerEl.innerHTML = '';

            /* Son 7 günü topla */
            const gunler = [];
            const d = new Date();
            d.setDate(d.getDate() - 6);
            for (let i = 0; i < 7; i++) {
                const a = d.getFullYear() + '-' +
                          String(d.getMonth() + 1).padStart(2, '0') + '-' +
                          String(d.getDate()).padStart(2, '0');
                gunler.push({ anahtar: a, wpm: gunlukWpm[a] || 0, etiket: ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][d.getDay() === 0 ? 6 : d.getDay() - 1] });
                d.setDate(d.getDate() + 1);
            }

            const maxWpm = Math.max(10, ...gunler.map(g => g.wpm));
            const bugunA = bugunAnahtari();
            const kayitVar = gunler.some(g => g.wpm > 0);

            if (!kayitVar) {
                bosEl.style.display = 'block';
                document.getElementById('streakRozeti').textContent = '🔥 0 gün';
                return;
            }
            bosEl.style.display = 'none';

            gunler.forEach(function (g) {
                const sutun = document.createElement('div');
                sutun.className = 'grafik-cubuk';

                const cubuk = document.createElement('div');
                cubuk.className = 'cubuk' + (g.anahtar === bugunA ? ' bugun' : '');
                cubuk.style.height = Math.max(3, (g.wpm / maxWpm) * 100) + '%';
                if (g.wpm > 0) {
                    const deger = document.createElement('span');
                    deger.className = 'deger';
                    deger.textContent = g.wpm;
                    cubuk.appendChild(deger);
                }
                sutun.appendChild(cubuk);
                kapsayici.appendChild(sutun);

                const et = document.createElement('span');
                et.textContent = g.anahtar === bugunA ? 'BUGÜN' : g.etiket;
                if (g.anahtar === bugunA) et.style.color = 'var(--vurgu)';
                gunlerEl.appendChild(et);
            });

            const st = streakHesapla();
            document.getElementById('streakRozeti').textContent =
                '🔥 ' + st + ' gün' + (st >= 3 ? ' serisin devam ediyor!' : '');
        }

        /* =====================================================
           7d) KLAVYE RENK MODLARI: renksiz -> parmak -> ısı
           -----------------------------------------------------
           Normal: gri tuşlar, sadece sıradaki tuş parlar.
           "Renklendir" butonu: önce PARMAK renkleri, sonra
           HATA ISI HARİTASI (kırmızı=en zayıf, turuncu=kötü,
           yeşil=iyi), sonra tekrar renksiz. Döngüsel.
           ===================================================== */
        let klavyeRenkModu = 0;      // 0=renksiz 1=parmak 2=ısı

        /* Bir tuşun hata oranını 0-1 aralığında döndürür */
        function hataOrani(harf) {
            const s = harfIstatistik[harf];
            if (!s) return 0;
            const toplam = s.d + s.y;
            return toplam > 0 ? s.y / toplam : 0;
        }

        /* Isı haritası rengi: kırmızı (en kötü) -> turuncu -> yeşil (iyi) */
        function isiRengi(oran) {
            if (oran <= 0.05) return '#22c55e';       // iyi/temiz
            if (oran <= 0.15) return '#84cc16';       // fena değil
            if (oran <= 0.30) return '#eab308';       // orta
            if (oran <= 0.50) return '#f97316';       // kötü
            return '#ef4444';                          // en zayıf
        }

        function klavyeModUygula() {
            document.body.classList.toggle('renkli-mod', klavyeRenkModu === 1);

            Object.keys(kbTuslar).forEach(function (h) {
                const tus = kbTuslar[h];

                if (klavyeRenkModu === 0) {
                    /* Renksiz: gri */
                    tus.style.background = '';
                    tus.style.color = '';
                    tus.title = '';

                } else if (klavyeRenkModu === 1) {
                    /* Parmak renkleri */
                    tus.style.background = PARMAK_RENKLERI[tus.dataset.parmak];
                    tus.style.color = '#0f1115';
                    const satir = KB_SATIRLAR.flat().find(t => t[0] === h);
                    if (satir) {
                        const elAd = satir[1][0] === 'L' ? 'Sol' : 'Sağ';
                        const pAd = satir[1][1] === 'T' ? 'Başparmak'
                            : PARMakLAR_TR[satir[1][0]][parseInt(satir[1][1])];
                        tus.title = h.toUpperCase() + ' = ' + elAd + ' el, ' + pAd + ' parmağı';
                    }

                } else {
                    /* Isı haritası: hata + hız karışımı */
                    if (h === ' ') { tus.style.background = ''; tus.title = ''; return; }
                    const s = harfIstatistik[h];
                    const toplam = s ? s.d + s.y : 0;
                    if (toplam >= 3) {
                        const oran = hataOrani(h);
                        tus.style.background = isiRengi(oran);
                        tus.style.color = '#fff';
                        tus.title = h.toUpperCase() + ' — hata %' + Math.round(oran * 100) +
                                    ' (' + toplam + ' deneme)';
                    } else {
                        tus.style.background = '#374151';
                        tus.style.color = '';
                        tus.title = h.toUpperCase() + ' — yeterli veri yok';
                    }
                }
            });

            /* Buton ve not yazısı */
            const btn = document.getElementById('renkBtn');
            const not = document.getElementById('klavyeNotu');
            if (klavyeRenkModu === 0) {
                btn.textContent = '🎨 Renklendir';
                not.innerHTML = '👇 Sıradaki tuş yukarı kalkar';
            } else if (klavyeRenkModu === 1) {
                btn.textContent = '🔥 Hata Haritası';
                not.innerHTML = '🖐️ Her renk bir parmağa ait';
            } else {
                btn.textContent = '⚪ Renksiz';
                not.innerHTML = '🔴 zayıf → 🟠 kötü → 🟡 orta → 🟢 iyi';
            }
        }

        /* =====================================================
        /* =====================================================
           7e) YAN ELLER — THREE.JS GERÇEKÇİ 3D ELLER
           -----------------------------------------------------
           Avuç içe bakar (kameraya dönük). 5 parmak gerçek el
           anatomisiyle: her parmak 3 boğum + 4 eklem, uca doğru
           incelir, uç boğumu hafif kıvrık. Başparmak avuç
           kenarından doğal açıyla ayrılır. Parmaklar avuç
           düzleminde hafif yay yapar (gerçek eller gibi).
           ===================================================== */
        let three3D = { yuklu: false };

        /* Parmak ölçüleri (gerçek el oranları, birim ~avuç genişliği)
           uz: toplam parmak uzunluğu, x: avuçtan çıkış noktası,
           k: taban kalınlığı, yay: parmakların kavis farkı */
        const PARM3D = {
            L0: { uz: 0.98, x: -0.84, k: 0.135, yay: 0.30 },   // serçe: kısa, ince, dışa yay
            L1: { uz: 1.24, x: -0.30, k: 0.158, yay: 0.10 },   // yüzük: uzun
            L2: { uz: 1.34, x:  0.18, k: 0.168, yay: 0.00 },   // orta: en uzun, tepe
            L3: { uz: 1.22, x:  0.64, k: 0.162, yay: -0.10 }   // işaret: biraz kısa
        };

        /* Bir parmağı 3 boğum + eklemlerle üretir; animasyon
           için kök/orta/uç menteşe grupları döndürür. */
        function parmakUret(parent, t, malzeme, tirnakM) {
            /* Boğum oranları (gerçek): %36 / %33 / %26 + eklemler */
            const oranlar = [0.36, 0.33, 0.26];
            const kalin = [t.k, t.k * 0.88, t.k * 0.76];

            const kok = new THREE.Group();          /* avuca bağlanan kök */
            parent.add(kok);

            /* Segmentler ve menteşeler zinciri:
               kok -> seg1 -> mentese2 -> seg2 -> mentese3 -> seg3 */
            let uc = kok;
            const segler = [], menteseler = [kok], eklemler = [];

            for (let s = 0; s < 3; s++) {
                const seg = new THREE.Mesh(
                    new THREE.CapsuleGeometry(kalin[s], t.uz * oranlar[s], 8, 16), malzeme);
                seg.position.y = t.uz * oranlar[s] / 2 + kalin[s] * 0.42;
                uc.add(seg);
                segler.push(seg);

                /* eklem küresi (boğum başı) */
                const eklem = new THREE.Mesh(
                    new THREE.SphereGeometry(kalin[s] * 1.0, 14, 12), malzeme);
                eklem.position.y = seg.position.y + t.uz * oranlar[s] / 2 + kalin[s] * 0.38;
                uc.add(eklem);
                eklemler.push(eklem);

                /* sonraki segment için menteşe */
                if (s < 2) {
                    const mentese = new THREE.Group();
                    mentese.position.y = eklem.position.y;
                    uc.add(mentese);
                    menteseler.push(mentese);
                    uc = mentese;
                } else {
                    /* uç: parmak ucu küresi + tırnak */
                    const parmakUcu = new THREE.Mesh(
                        new THREE.SphereGeometry(kalin[2] * 0.92, 14, 12), malzeme);
                    parmakUcu.position.y = eklem.position.y + kalin[2] * 0.55;
                    uc.add(parmakUcu);
                    eklemler.push(parmakUcu);

                    const tirnak = new THREE.Mesh(
                        new THREE.BoxGeometry(kalin[2] * 1.35, kalin[2] * 0.38, kalin[2] * 1.75), tirnakM);
                    tirnak.position.set(0, eklem.position.y + kalin[2] * 0.3, kalin[2] * 0.85);
                    tirnak.rotation.x = -0.4;
                    uc.add(tirnak);
                }
            }
            return { kok: kok, segler: segler, menteseler: menteseler, eklemler: eklemler };
        }

        /* El sahnesi kurar: avuç içi KAMERAYA bakar */
        function elSahnesiKur(elKodu, kapsayiciId) {
            const kapsayici = document.getElementById(kapsayiciId);

            const sahne = new THREE.Scene();
            const kamera = new THREE.PerspectiveCamera(26, 0.66, 0.1, 30);
            kamera.position.set(0, 1.5, 6.2);
            kamera.lookAt(0, 0.35, 0);

            const cizici = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            cizici.setPixelRatio(window.devicePixelRatio);
            const boyut = function () {
                const w = kapsayici.clientWidth || 175;
                const h = Math.round(w * 1.5);
                cizici.setSize(w, h);
                kamera.aspect = w / h;
                kamera.updateProjectionMatrix();
                return h;
            };
            boyut();
            kapsayici.insertBefore(cizici.domElement, kapsayici.firstChild);

            /* Işıklar: sıcak ana + serin dolgu + alttan hafif */
            sahne.add(new THREE.AmbientLight(0xffffff, 0.58));
            const isik1 = new THREE.DirectionalLight(0xfff0dd, 1.1);
            isik1.position.set(2.5, 3.5, 4.5);
            sahne.add(isik1);
            const isik2 = new THREE.DirectionalLight(0xa8c4ff, 0.42);
            isik2.position.set(-3, 1.5, 2.5);
            sahne.add(isik2);
            const isik3 = new THREE.DirectionalLight(0xffd9c0, 0.25);
            isik3.position.set(0, -2, 3);
            sahne.add(isik3);

            const ten = new THREE.MeshStandardMaterial({ color: 0xE8B48C, roughness: 0.55, metalness: 0.03 });
            const tirnakM = new THREE.MeshStandardMaterial({ color: 0xF6E3D0, roughness: 0.28 });

            const elGrup = new THREE.Group();
            if (elKodu === 'R') elGrup.scale.x = -1;
            /* EL 90 DERECE ÇEVRİLMİŞ: avuç yana bakar, parmaklar
               yukarı-yana uzanır; hafif yatışla doğal duruş.
               Boyut %22 küçültüldü — kutucuğa rahat sığar. */
            elGrup.scale.multiplyScalar(0.78);
            elGrup.rotation.set(1.5708, 0.18, 0.35);
            elGrup.position.set(0, -0.35, 0);
            sahne.add(elGrup);

            /* --- AVUÇ: gerçek avuç formu (Lathe ile organik) --- */
            /* Yassı, parmaklara doğru genişleyen, bileğe daralan */
            const avucSekli = new THREE.Shape();
            avucSekli.moveTo(-0.92, 0.55);                       /* parmak tarafı sol */
            avucSekli.bezierCurveTo(-1.04, 0.15, -1.06, -0.3, -0.88, -0.62);
            avucSekli.bezierCurveTo(-0.6, -0.8, 0.6, -0.8, 0.88, -0.62);   /* bilek */
            avucSekli.bezierCurveTo(1.06, -0.3, 1.04, 0.15, 0.92, 0.55);  /* sağ kenar */
            avucSekli.bezierCurveTo(0.6, 0.72, -0.6, 0.72, -0.92, 0.55);  /* üst (parmak dipleri) */
            const avucGeo = new THREE.ExtrudeGeometry(avucSekli, {
                depth: 0.34, bevelEnabled: true, bevelThickness: 0.12,
                bevelSize: 0.12, bevelSegments: 4, curveSegments: 24
            });
            avucGeo.rotateX(-Math.PI / 2);      /* yatay: XZ düzleminde dur */
            const avuc = new THREE.Mesh(avucGeo, ten);
            avuc.position.y = -0.15;
            elGrup.add(avuc);

            /* --- BİLEK --- */
            const bilek = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.56, 1.1, 22), ten);
            bilek.position.set(0, -0.78, 0.02);
            elGrup.add(bilek);

            const parmakObjeleri = {};

            /* --- 4 PARMAK: avuç üst kenarından, hafif yay ile --- */
            [0, 1, 2, 3].forEach(function (pNo) {
                const t = PARM3D['L' + pNo];
                const kod = elKodu + pNo;
                const y = 0.62;

                const tutucu = new THREE.Group();
                tutucu.position.set(t.x, y, 0.1);
                elGrup.add(tutucu);

                const pr = parmakUret(tutucu, t, ten, tirnakM);

                /* Parmak doğal yayı + HAFİF KIRIK dinlenme pozu:
                   parmaklar düz değil, gerçekte olduğu gibi hafif
                   kıvrık durur (klavyeye hazır poz) */
                pr.kok.rotation.z = -t.yay * 0.5;
                pr.kok.rotation.x = 0.22;                 /* kökten hafif öne */
                pr.menteseler[1].rotation.z = -t.yay * 0.35;
                pr.menteseler[2].rotation.z = -t.yay * 0.2;
                pr.menteseler[1].rotation.x = 0.30;        /* orta boğum belirgin kırık */
                pr.menteseler[2].rotation.x = 0.42;        /* uç boğum daha da kırık */

                parmakObjeleri[kod] = {
                    kok: pr.kok, segler: pr.segler, menteseler: pr.menteseler,
                    eklemler: pr.eklemler, egim: 0, hedef: 0, malzeme: ten,
                    tabanYay: t.yay
                };
            });

            /* --- BAŞPARMAK: gerçek konum — avucun alt kenarından,
                   kıvrık, C şeklinde, içe dönük --- */
            const bp = new THREE.Group();
            bp.position.set(-0.78, -0.18, 0.22);
            bp.rotation.set(0.25, 0.75, -0.85);   /* dışa + öne + yana açılı */
            elGrup.add(bp);

            /* 2 boğum: kalın taban + ince uç, hafif C kıvrımı */
            const bpTanim = { uz: 0.92, k: 0.185 };
            const bpr = parmakUret(bp, bpTanim, ten, tirnakM);
            bpr.kok.rotation.z = -0.28;
            bpr.menteseler[1].rotation.z = -0.42;   /* daha kıvrık */
            bpr.menteseler[2].rotation.z = -0.30;

            parmakObjeleri[elKodu + 'TB'] = {
                kok: bpr.kok, segler: bpr.segler, menteseler: bpr.menteseler,
                eklemler: bpr.eklemler, egim: 0, hedef: 0, malzeme: ten,
                basparmak: true
            };

            /* Animasyon */
            function animate() {
                requestAnimationFrame(animate);

                Object.keys(parmakObjeleri).forEach(function (kod) {
                    const pr = parmakObjeleri[kod];
                    pr.egim += (pr.hedef - pr.egim) * 0.15;

                    if (pr.basparmak) {
                        /* Başparmak: avuca doğru kapanır */
                        pr.kok.rotation.y = 0.75 - pr.egim * 0.45;
                        pr.menteseler[1].rotation.x = 0.12 + pr.egim * 0.35;
                    } else {
                        /* Parmak: kırık dinlenme pozundan basma hareketine
                           kademeli geçiş (kök az, uç boğum çok katlanır) */
                        pr.kok.rotation.x = 0.22 + pr.egim * 0.30;
                        pr.menteseler[1].rotation.x = 0.30 + pr.egim * 0.50;
                        pr.menteseler[2].rotation.x = 0.42 + pr.egim * 0.65;
                    }
                });

                cizici.render(sahne, kamera);
            }
            animate();

            return { parmakObjeleri: parmakObjeleri, boyutlandir: boyut };
        }

        /* El kurulumu (Three.js yüklenince çağrılır) */
        function elCiz(elKodu) {
            if (!three3D.yuklu) return;
            const id = elKodu === 'L' ? 'solElKapsayici' : 'sagElKapsayici';
            if (!three3D[elKodu]) three3D[elKodu] = elSahnesiKur(elKodu, id);
        }

        /* Sıradaki harfe göre 3B parmağı oynat */
        function elleriGuncelle(siradakiHarf) {
            if (!three3D.yuklu) return;

            /* Herkesi sıfırla */
            ['L', 'R'].forEach(function (elK) {
                if (!three3D[elK]) return;
                Object.keys(three3D[elK].parmakObjeleri).forEach(function (kod) {
                    const pr = three3D[elK].parmakObjeleri[kod];
                    pr.hedef = 0;
                    pr.segler.forEach(function (s) { s.material = pr.malzeme; });
                    pr.eklemler.forEach(function (e) { e.material = pr.malzeme; });
                });
            });
            if (!siradakiHarf) return;

            const harfKucuk = typeof siradakiHarf === 'string' ? siradakiHarf.toLowerCase() : siradakiHarf;
            let kod = null;
            if (harfKucuk === ' ') kod = 'RTB';
            else {
                const satir = KB_SATIRLAR.flat().find(t => t[0] === harfKucuk);
                if (satir) kod = satir[1];
            }
            if (!kod) return;

            const elK = kod[0];
            const pr = three3D[elK] && three3D[elK].parmakObjeleri[kod];
            if (!pr) return;
            pr.hedef = 1;

            /* Parmak rengi */
            const renk = new THREE.MeshStandardMaterial({
                color: PARMAK_RENKLERI[kod.slice(0, 2)],
                roughness: 0.35,
                emissive: PARMAK_RENKLERI[kod.slice(0, 2)],
                emissiveIntensity: 0.3
            });
            pr.segler.forEach(function (s) { s.material = renk; });
            pr.eklemler.forEach(function (e) { e.material = renk; });
        }

        /* Geriye dönük uyumluluk */
        function elEtiketleriniSabitle() {}

        /* Three.js yükle */
        (function threeYukle() {
            const sc = document.createElement('script');
            sc.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
            sc.onload = function () {
                three3D.yuklu = true;
                elCiz('L');
                elCiz('R');
                /* yükleme sonrası mevcut harfi uygula */
                try {
                    const g = durum.akis && durum.akis[durum.index];
                    if (g && g !== ' ') klavyeVurgula(g[durum.yazilan.length]);
                } catch (h) {}
                window.addEventListener('resize', function () {
                    if (three3D.L) three3D.L.boyutlandir();
                    if (three3D.R) three3D.R.boyutlandir();
                });
            };
            sc.onerror = function () { /* CDN yoksa eller çizilmez, site çalışır */ };
            document.head.appendChild(sc);
        })();

        /* HTML yorum etiketleri (eller JS ile çizilir) */
        /* =====================================================
           7e) DERS MODU MOTORU
           -----------------------------------------------------
           - Dersler sırayla açılır (önceki tamamlanmadan
             sonraki kilitli kalır)
           - Her ders: anlatım + parmak rehberi + alıştırma
           - Alıştırmanın tamamı doğru yazılınca ders biter
           ===================================================== */
        const DERS_KEY = 'klavye_ders_ilerleme';
        let dersIlerleme = 0;                    // tamamlanan ders sayısı
        let aktifDers = null;                    // şu an çalışılan ders objesi
        let dersAkis = [];                       // dersin alıştırma dizisi
        let dersIndex = 0;                       // hangi gruptayız
        let dersModu = false;                    // mod durumu

        function dersIlerlemeYukle() {
            try {
                dersIlerleme = parseInt(localStorage.getItem(DERS_KEY)) || 0;
            } catch (h) { dersIlerleme = 0; }
        }

        function dersIlerlemeKaydet() {
            try { localStorage.setItem(DERS_KEY, String(dersIlerleme)); } catch (h) {}
        }

        /* Ders listesini çizer (kilitli / açık / tamamlanmış) */
        function dersListesiCiz() {
            const liste = document.getElementById('dersListesi');
            liste.innerHTML = '';

            DERSLER.forEach(function (d) {
                const kart = document.createElement('div');
                const tamamlanan = d.no <= dersIlerleme;
                const kilitli = d.no > dersIlerleme + 1;
                kart.className = 'ders-kart' + (tamamlanan ? ' tamamlanan' : '') + (kilitli ? ' kilitli' : '');

                kart.innerHTML =
                    '<div class="dk-no">DERS ' + d.no + '</div>' +
                    '<div class="dk-baslik">' + d.baslik + '</div>' +
                    '<div class="dk-durum">' + (tamamlanan ? '✅' : (kilitli ? '🔒' : '▶️')) + '</div>';

                if (!kilitli) {
                    kart.addEventListener('click', function () { dersBaslat(d); });
                }

                liste.appendChild(kart);
            });
        }

        /* Parmak rehberini çizer (iki el, vurgulu parmaklar) */
        function parmakRehberiCiz(ders) {
            const kapsayici = document.getElementById('parmakRehberi');
            kapsayici.innerHTML = '';

            const vurgu = (ders && ders.parmakVurgu) || {};

            [['SOL EL', 'L'], ['SAĞ EL', 'R']].forEach(function (elTanim) {
                const elAdi = elTanim[0], elKodu = elTanim[1];
                const el = document.createElement('div');
                el.className = 'el';
                el.innerHTML = '<div class="el-baslik">' + elAdi + '</div>';

                const parmaklar = document.createElement('div');
                parmaklar.className = 'parmaklar';

                /* serçe→işaret sırayla; renkler klavyeyle aynı */
                for (let p = 0; p <= 3; p++) {
                    const kod = elKodu + p;
                    const pr = document.createElement('div');
                    pr.className = 'parmak' + (vurgu[kod] ? ' aktif-parmak' : '');
                    pr.style.background = PARMAK_RENKLERI[kod];
                    pr.textContent = PARMakLAR_TR[elKodu][p];
                    parmaklar.appendChild(pr);
                }

                /* başparmak */
                const bp = document.createElement('div');
                bp.className = 'parmak basparmak' + (vurgu.TB ? ' aktif-parmak' : '');
                bp.style.background = PARMAK_RENKLERI.TB;
                bp.textContent = 'Boşluk';
                parmaklar.appendChild(bp);

                el.appendChild(parmaklar);
                kapsayici.appendChild(el);
            });
        }

        /* Klavyede dersin harflerini vurgula */
        function klavyeDersVurgula(harfler) {
            document.querySelectorAll('.kb-tus').forEach(function (t) {
                t.classList.remove('ders-tusu');
            });
            if (!harfler) return;
            harfler.forEach(function (h) {
                if (kbTuslar[h]) kbTuslar[h].classList.add('ders-tusu');
            });
        }

        /* Dersi başlat */
        function dersBaslat(ders) {
            aktifDers = ders;

            document.getElementById('dersListeKapsayici').style.display = 'none';
            document.getElementById('dersCalisma').classList.add('gorunur');

            document.getElementById('dersBaslik').innerHTML =
                'Ders <b>' + ders.no + '</b> — ' + ders.baslik;
            document.getElementById('dersAnlatim').innerHTML = ders.anlatim;

            parmakRehberiCiz(ders);
            klavyeDersVurgula(ders.harfler);

            /* Alıştırmayı hazırla */
            dersAkis = typeof ders.alistirma === 'function' ? ders.alistirma() : [];
            if (typeof dersAkis === 'string') dersAkis = dersAkis.split(' ').filter(w => w.length > 0);
            dersIndex = 0;

            /* Ana akışı ders alıştırmasıyla doldur */
            durum.akis = dersAkis.slice();
            durum.kelimeEls = [];
            kelimeAkisiEl.innerHTML = '';
            kelimeAkisiEl.style.transform = 'translateY(0)';
            durum.akis.forEach(function (g) {
                kelimeAkisiEl.appendChild(kelimeCiz(g));
            });
            durum.index = 0;
            durum.yazilan = '';
            durum.kelimeEls[0].classList.add('aktif');
            harfleriBoya();

            /* Sayaçları sıfırla (ders zamansız) */
            clearInterval(durum.zamanId);
            durum.calisiyor = false;
            durum.bitti = false;
            durum.harf = 0; durum.hatali = 0; durum.tus = 0;
            baslaIpucuEl.classList.remove('gizli');
            sayacGuncelle();

            dersIlerlemeGuncelle();
            /* İlk sıradaki tuşu klavyede göster (boşluk dersi -> boşluk tuşu) */
            klavyeVurgula(dersAkis[0] === ' ' ? ' ' : dersAkis[0][0]);
        }

        /* Ders ilerleme çubuğu */
        function dersIlerlemeGuncelle() {
            const toplam = dersAkis.length || 1;
            const yuzde = Math.round((dersIndex / toplam) * 100);
            document.getElementById('dersAdimEtiket').textContent =
                dersIndex + ' / ' + toplam + ' grup tamam';
            document.getElementById('dersIlerlemeYuzde').textContent = '%' + yuzde;
            document.getElementById('dersCubuk').style.width = yuzde + '%';
        }

        /* Ders bittiğinde çağrılır (grupGonder içinden) */
        function dersKontrol() {
            if (!aktifDers) return;
            dersIndex++;
            dersIlerlemeGuncelle();

            if (dersIndex >= dersAkis.length) {
                /* DERS TAMAMLANDI */
                const sonraki = aktifDers.no + 1;
                const buDers = aktifDers.no;
                if (buDers > dersIlerleme) {
                    dersIlerleme = buDers;
                    dersIlerlemeKaydet();
                }

                document.getElementById('dersSonucEmoji').textContent =
                    sonraki <= DERSLER.length ? '🎉' : '🏆';
                document.getElementById('dersSonucBaslik').textContent =
                    sonraki <= DERSLER.length
                        ? 'Ders ' + buDers + ' Tamamlandı!'
                        : 'Tüm Dersler Bitti — Artık 10 Parmaksın!';
                document.getElementById('dersSonucNot').textContent =
                    sonraki <= DERSLER.length
                        ? 'Sıradaki: Ders ' + sonraki + ' — ' + DERSLER[sonraki - 1].baslik
                        : 'Hız Testi modunda pratiğe devam edebilirsin ⚡';
                document.getElementById('dersSonrakiBtn').style.display =
                    sonraki <= DERSLER.length ? '' : 'none';

                document.getElementById('dersSonucModal').classList.add('acik');
                dersListesiCiz();
            }
        }

        /* Mode geçişleri */
        function modaGec(dersMi) {
            dersModu = dersMi;
            document.body.classList.toggle('ders-modunda', dersMi);
            document.getElementById('testModBtn').classList.toggle('aktif-mod', !dersMi);
            document.getElementById('dersModBtn').classList.toggle('aktif-mod', dersMi);

            if (dersMi) {
                document.getElementById('dersListeKapsayici').style.display = '';
                document.getElementById('dersCalisma').classList.remove('gorunur');
                klavyeDersVurgula(null);
                aktifDers = null;
                dersListesiCiz();
                sifirla();
            } else {
                klavyeDersVurgula(null);
                sifirla();
            }
        }

        document.getElementById('testModBtn').addEventListener('click', function () { modaGec(false); });
        document.getElementById('dersModBtn').addEventListener('click', function () { modaGec(true); });
        document.getElementById('dersListeyeDon').addEventListener('click', function () { modaGec(true); });
        document.getElementById('dersListeyeDon2').addEventListener('click', function () {
            document.getElementById('dersSonucModal').classList.remove('acik');
            modaGec(true);
        });
        document.getElementById('dersSonrakiBtn').addEventListener('click', function () {
            document.getElementById('dersSonucModal').classList.remove('acik');
            const sonraki = DERSLER[aktifDers.no];   /* aktifDers.no + 1 - 1 */
            if (sonraki && sonraki.no <= dersIlerleme + 1) dersBaslat(sonraki);
            else modaGec(true);
        });

        /* =====================================================
           8) SEVİYE ŞERİDİ + SEVİYE KARTLARI + BİLDİRİM
           ===================================================== */
        function seviyeSeridiCiz() {
            document.getElementById('seviyeAdi').innerHTML =
                'Seviye <b>' + durum.seviye + '</b> — ' + SEVIYELER[durum.seviye - 1].ad +
                (SEVIYELER[durum.seviye - 1].kelime ? ' 📝' : '');

            const yol = document.getElementById('seviyeNoktalar');
            yol.innerHTML = '';
            for (let i = 1; i <= 10; i++) {
                const n = document.createElement('div');
                n.className = 'nokta' +
                    (i < durum.seviye ? ' gecti' : '') +
                    (i === durum.seviye ? ' simdiki' : '');
                n.title = 'Seviye ' + i + ' — ' + SEVIYELER[i - 1].ad;
                yol.appendChild(n);
            }
        }

        /* Seviye seçim kartları: kullanıcı SEVİYEYİ SEÇER */
        function seviyeKartlariCiz() {
            const kapsayici = document.getElementById('seviyelerKapsayici');
            kapsayici.innerHTML = '';

            SEVIYELER.forEach(function (sv) {
                const kart = document.createElement('div');
                kart.className = 'seviye-kart' +
                    (sv.no === durum.seviye ? ' secili' : '') +
                    (sv.kelime ? ' kelime-kart' : '');
                kart.innerHTML =
                    '<div class="no">' + sv.no + (sv.kelime ? ' 📝' : '') + '</div>' +
                    '<div class="ad">' + sv.ad + '</div>';

                kart.addEventListener('click', function () {
                    durum.seviye = sv.no;
                    localStorage.setItem('drill_seviye', String(sv.no));
                    seviyeKartlariCiz();
                    sifirla();
                });

                kapsayici.appendChild(kart);
            });
        }

        /* =====================================================
           9) TUŞ YAKALAMA (bilgisayar + telefon, çift yol)
           ===================================================== */
        function harfIsle(harf) {
            if (durum.bitti) return;
            const suAnkiGrup = durum.akis[durum.index];
            if (!suAnkiGrup) return;                        /* koruma */
            if (suAnkiGrup === ' ') return;                 /* boşluk dersi grubu */

            if (!durum.calisiyor) zamanlayiciBaslat();
            durum.tus++;
            const beklenen = suAnkiGrup[durum.yazilan.length];
            if (beklenen === undefined) return;
            let sonuc;
            if (harf === beklenen) {
                durum.harf++;
                sonuc = 'd';
            } else {
                durum.hatali++;
                yanlisSesiCal();
                sonuc = 'y';
            }
            if (beklenen !== ' ') harfKayit(beklenen, sonuc === 'd');
            durum.yazilan += harf;
            harfleriBoya();

            /* Sanal klavyede sıradaki tuşu göster */
            const siradaki = suAnkiGrup[durum.yazilan.length];
            klavyeVurgula(siradaki);
            if (kbTuslar[beklenen]) {
                kbTuslar[beklenen].classList.add(sonuc === 'd' ? 'basildi-dogru' : 'basildi-yanlis');
            }
        }

        document.addEventListener('keydown', function (e) {
            /* Modal açıkken: Enter = tekrar dene */
            if (document.getElementById('sonucModal').classList.contains('acik')) {
                if (e.key === 'Enter') sifirla();
                return;
            }
            if (e.key === 'Escape') { sifirla(); return; }
            if (durum.bitti) return;
            if (e.target === girisiEl) return;             // telefon yoluna bırak
            if (e.ctrlKey || e.metaKey || e.altKey) return;

            if (e.key === 'Backspace') {
                e.preventDefault();
                if (durum.yazilan.length > 0) {
                    durum.yazilan = durum.yazilan.slice(0, -1);
                    harfleriBoya();
                }
                return;
            }

            if (e.key === ' ' || e.code === 'Space') {
                e.preventDefault();
                /* Normal: yazılan varsa onayla. Ders boşluk-grubu ise boş onayla */
                if (durum.yazilan.length > 0) grupGonder();
                else if (dersModu && aktifDers && durum.akis[durum.index] === ' ') grupGonder();
                return;
            }

            if (e.key && e.key.length === 1 && !e.isComposing) {
                e.preventDefault();
                harfIsle(e.key);
            }
        });

        /* Telefon / odak-input yolu: değerin UZUNLUK FARKINA göre
           harf harf işlenir (çift işlem olmasın). */
        girisiEl.addEventListener('input', function () {
            if (durum.bitti) { girisiEl.value = ''; return; }
            const v = girisiEl.value;

            /* Boşluk = grubu gönder */
            if (v.endsWith(' ')) {
                const y = v.trim();
                if (y.length > 0) {
                    durum.yazilan = y;        /* senkron */
                    grupGonder();
                }
                girisiEl.value = '';
                return;
            }

            /* Eklenen harfler: sırayla işle (harfIsle ekler) */
            while (durum.yazilan.length < v.length) {
                harfIsle(v[durum.yazilan.length]);
            }

            /* Silinen harfler: geri al */
            while (durum.yazilan.length > v.length) {
                durum.yazilan = durum.yazilan.slice(0, -1);
            }

            harfleriBoya();
        });

        function odakla() {
            girisiEl.value = '';
            girisiEl.focus({ preventScroll: true });
        }

        document.addEventListener('pointerdown', function (e) {
            if (e.target.closest('button')) return;
            if (!durum.bitti) odakla();
        });

        window.addEventListener('load', function () { setTimeout(odakla, 50); });
        odakla();

        /* =====================================================
           10) SIFIRLAMA + BUTONLAR + BAŞLANGIÇ
           ===================================================== */
        function sifirla() {
            clearInterval(durum.zamanId);
            const sv = durum.seviye;             // seçilen seviye korunur
            durum = {
                seviye: sv,
                akis: [], kelimeEls: [],
                index: 0, yazilan: '',
                calisiyor: false, bitti: false,
                baslangic: null, zamanId: null,
                harf: 0, hatali: 0,
                tus: 0
            };
            akisDoldur(20, true);
            durum.kelimeEls[0].classList.add('aktif');
            harfleriBoya();
            baslaIpucuEl.classList.remove('gizli');
            document.getElementById('sonucModal').classList.remove('acik');
            document.getElementById('kalanSure').textContent = '⏱️ ' + SURE + ' sn';
            document.getElementById('canliSure').textContent = SURE;
            document.getElementById('canliWpm').textContent = '0';
            document.getElementById('canliHiz').textContent = '0.0';
            document.getElementById('canliSureKutusu').classList.remove('son-10');
            sayacGuncelle();
            seviyeSeridiCiz();
            zayifSatiriGuncelle();
            odakla();

            /* Yeni akışın ilk tuşunu klavyede göster */
            klavyeVurgula(durum.akis[0][0]);
        }

        document.getElementById('yenidenBtn').addEventListener('click', sifirla);
        document.getElementById('tekrarBtn').addEventListener('click', sifirla);

        /* Önerilen seviyeye geç butonu */
        document.getElementById('oneriBtn').addEventListener('click', function () {
            const oneriNo = parseInt(
                document.getElementById('oneriSeviye').querySelector('b').textContent
            );
            durum.seviye = oneriNo;
            localStorage.setItem('drill_seviye', String(oneriNo));
            seviyeKartlariCiz();
            sifirla();
        });

        const sesBtnEl = document.getElementById('sesBtn');
        function sesBtnGuncelle() {
            sesBtnEl.textContent = sesAcik ? '🔊 Ses Açık' : '🔇 Ses Kapalı';
        }
        sesBtnEl.addEventListener('click', function () {
            sesAcik = !sesAcik;
            localStorage.setItem('klavye_ses', sesAcik ? '1' : '0');
            sesBtnGuncelle();
            if (sesAcik) yanlisSesiCal();
        });

        (function basla() {
            const kayitli = parseInt(localStorage.getItem('drill_seviye'));
            if (kayitli >= 1 && kayitli <= 10) durum.seviye = kayitli;
            sesBtnGuncelle();
            sanalKlavyeCiz();
            elCiz('L');
            elCiz('R');
            elEtiketleriniSabitle();
            document.getElementById('renkBtn').addEventListener('click', function () {
                klavyeRenkModu = (klavyeRenkModu + 1) % 3;
                klavyeModUygula();
            });
            harfIstatistikYukle();
            gunlukYukle();
            dersIlerlemeYukle();
            zayifSatiriGuncelle();
            ilerlemePaneliCiz();
            seviyeKartlariCiz();
            sifirla();

            /* İlk sıradaki tuşu göster */
            klavyeVurgula(durum.akis[0][0]);
        })();
