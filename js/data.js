const MEMBERS = [
  { key:"sueda",  name:"Sueda Uluca",       role:"Ana Vokal",         color:"var(--sueda)",  hex:"#2FBF71", emoji:"🌿", colorTr:"Yeşil",
    fact:"Grubun en genç üyesi. İletişim tasarımı okuyor ve sahnede güçlü sesiyle öne çıkıyor." },
  { key:"hilal",  name:"Hilal Yelekçi",     role:"Baş Dansçı",        color:"var(--hilal)", hex:"#9D5CFF", emoji:"💜", colorTr:"Mor",
    fact:"Bilgisayar mühendisliği okudu, küçük yaşlardan beri dans ediyor ve koreografilere hakim." },
  { key:"lidya",  name:"Lidya Pınar",       role:"Baş Vokalist",      color:"var(--lidya)", hex:"#FF5FA8", emoji:"🌸", colorTr:"Pembe",
    fact:"Uzun yıllar buz pateni yapmış, hem sesiyle hem zarif duruşuyla tanınıyor." },
  { key:"zoktay", name:"Zeynep Sude Oktay", role:"Dansçı · Zoktay",   color:"var(--zoktay)", hex:"#3E8EFF", emoji:"💙", colorTr:"Mavi",
    fact:"Sahne adı 'Zoktay'. Kendi tarzını yansıtan özgün duruşuyla dikkat çekiyor." },
  { key:"mina",   name:"Mina Solak",        role:"Koreografi Ustası", color:"var(--mina)",  hex:"#FF4757", emoji:"❤️", colorTr:"Kırmızı",
    fact:"Grubun en deneyimli üyelerinden. Salsa dansında da oldukça başarılı." },
  { key:"esin",   name:"Esin Bahat",        role:"Ana Dansçı",        color:"var(--esin)",  hex:"#FFC93C", emoji:"⭐", colorTr:"Sarı",
    fact:"Profesyonel dans eğitmeni. Disiplini ve pozitif enerjisiyle biliniyor." },
];

/** AURA GIRLS — 2026'da kurulan 4 kişilik yeni nesil kız grubu.
 *  Üye isimlerinin baş harfleri çapraz okunduğunda A-U-R-A oluşur;
 *  her üye doğadan bir element temsil eder. */
const AURA_MEMBERS = [
  { key:"asli", name:"Aslı Göztaşı", role:"Water of AURA", color:"#2E9EFF", hex:"#2E9EFF", emoji:"💧", colorTr:"Mavi",
    fact:"22 yaşında. Su elementini temsil ediyor. Aura'dan önce BIG 5 Türkiye yarışmasıyla adını duyurmuştu." },
  { key:"suzy", name:"Suzy Roumenov", role:"Storm of AURA", color:"#7C89B8", hex:"#7C89B8", emoji:"🌪️", colorTr:"Gri-Mavi",
    fact:"21 yaşında. Fırtına ve hava elementini temsil ediyor." },
  { key:"meri", name:"Meri Aslan", role:"Nature of AURA", color:"#3CB371", hex:"#3CB371", emoji:"🌿", colorTr:"Yeşil",
    fact:"23 yaşında. Toprak ve doğa elementini temsil ediyor." },
  { key:"esra", name:"Esra Mutlu", role:"Fire of AURA", color:"#FF6B35", hex:"#FF6B35", emoji:"🔥", colorTr:"Turuncu",
    fact:"22 yaşında. Ateş elementini temsil ediyor." },
];

/** AURA GIRLS'ün şarkıları/projeleri. */
const AURA_SONGS = [
  { title:"YUH!", note:"Çıkış single'ı · Mayıs 2026", emoji:"💥" },
  { title:"Tempo (Hepsi cover)", note:"Lansman gecesi performansı", emoji:"🎤" },
  { title:"Tuzak", note:"", emoji:"🕸️" },
  { title:"PES!", note:"", emoji:"🙅‍♀️" },
];

/** "Hangi AURA Kızısın?" testi — her seçenek sırasıyla
 *  Su (Aslı) · Fırtına (Suzy) · Doğa (Meri) · Ateş (Esra) elementine karşılık gelir. */
const AURA_QUESTIONS = [
  { q:"Zor bir günde kendini nasıl toparlarsın?",
    opts:["Sakince oturup düşüncelerimi süzerim","Enerjimi dışa vurup hemen harekete geçerim","Doğaya çıkıp kafamı dağıtırım","Kendimi bir hedefe verip ilerlerim"]},
  { q:"Arkadaşların seni bir kelimeyle tanımlasa hangisini seçerler?",
    opts:["Derin","Spontane","Sıcakkanlı","Ateşli"]},
  { q:"Bir sahne performansı hazırlarken en çok neye önem verirsin?",
    opts:["Duyguyu doğru yansıtmaya","Beklenmedik bir sürpriz katmaya","Samimi ve doğal durmaya","Güçlü, iddialı bir giriş yapmaya"]},
  { q:"Hangi hava/atmosfer sana en çok huzur verir?",
    opts:["Yağmurlu, sakin bir gün","Fırtınalı, elektrikli bir hava","Güneşli, yeşillik dolu bir alan","Sıcak, canlı bir yaz akşamı"]},
  { q:"Bir tartışmada tavrın nasıl olur?",
    opts:["Önce dinlerim, sonra sakince konuşurum","Anında ve içtenlikle tepki veririm","Ortamı yumuşatmaya çalışırım","Net ve kararlı bir duruş sergilerim"]},
  { q:"Sahnede en çok neyle dikkat çekersin?",
    opts:["Akıcı ve zarif hareketlerle","Beklenmedik enerji patlamalarıyla","Doğal, içten bir tavırla","Güçlü sahne hakimiyetiyle"]},
  { q:"Bir gününü nasıl geçirmeyi tercih edersin?",
    opts:["Kitap okuyup dinlenerek","Yeni bir şeyler deneyip macera yaşayarak","Doğada vakit geçirip arkadaşlarımla sohbet ederek","Hedeflerime odaklanıp aktif çalışarak"]},
  { q:"AURA'nın senin favori tarafı hangisi?",
    opts:["Duygusal, akıcı sesi","Enerjik ve öngörülemez tarzı","Sıcak ve samimi enerjisi","Güçlü, ateşli sahne performansı"]},
];

const SONGS = [
  { title:"Zamansızdık", emoji:"⏳" },
  { title:"Arıyo", emoji:"📞" },
  { title:"Snap", emoji:"📸" },
  { title:"KTS", emoji:"🔥" },
  { title:"Amatör", emoji:"🎤" },
  { title:"Toz Pembe", emoji:"🌷" },
  { title:"Başrol Sensin", emoji:"🎬" },
  { title:"Hileli", emoji:"🎲" },
];

/** Ritim oyunu şarkıları — MP3 varsa audio/ klasöründen çalar. */
const TRACKS = [
  { id:"zamansizdik", title:"Zamansızdık", emoji:"⏳", mp3:"audio/zamansizdik.mp3", bpm:122, startAt:10 },
  { id:"ariyo",       title:"Arıyo",      emoji:"📞", mp3:"audio/ariyo.mp3", bpm:128, startAt:10 },
  { id:"snap",        title:"Snap",       emoji:"📸", mp3:"audio/snap.mp3", bpm:130, startAt:10 },
  { id:"kts",         title:"KTS",        emoji:"🔥", mp3:"audio/kts.mp3", bpm:126, startAt:10 },
  { id:"amator",      title:"Amatör",     emoji:"🎤", mp3:"audio/amator.mp3", bpm:124, startAt:10 },
  { id:"toz-pembe",   title:"Toz Pembe",  emoji:"🌷", mp3:"audio/toz-pembe.mp3", bpm:120, startAt:10 },
  { id:"basrol-sensin",title:"Başrol Sensin", emoji:"🎬", mp3:"audio/basrol-sensin.mp3", bpm:127, startAt:10 },
  { id:"hileli",       title:"Hileli", emoji:"🎲", mp3:"audio/hileli.mp3", bpm:129, startAt:10 },

];

const QUESTIONS = [
  { q:"Boş bir günün olsa en çok ne yaparsın?",
    opts:["Yeni bir melodi mırıldanırım","Aynanın karşısında dans hareketi çalışırım","Kıyafetlerimle yeni kombinler denerim","Arkadaşlarımla plan yaparım","Herkesi güldürecek bir şaka bulurum","Müzik açıp evde konser veririm"]},
  { q:"Arkadaşların seni nasıl tanımlar?",
    opts:["Tatlı ve duygusal","Enerjik ve spontane","Zarif ve özgün","Açık sözlü ve kendinden emin","Çalışkan ve kararlı","Disiplinli ve pozitif"]},
  { q:"Sahneye çıksan en çok neyinle öne çıkardın?",
    opts:["Güçlü sesimle","Enerjik dans hareketlerimle","Sahne kostümümle","Kendi tarzımı yansıtan duruşumla","Kusursuz koreografimle","Bitmeyen enerjimle"]},
  { q:"En sevdiğin renk hangisi?",
    opts:["Yeşil","Mor","Pembe","Mavi","Kırmızı","Sarı"]},
  { q:"Bir Manifest konserinde olsan en çok ne yapardın?",
    opts:["Şarkı sözlerini tek kelime kaçırmadan söylerdim","Ön sırada dans ederdim","En güzel kombini giyip fotoğraf çektirirdim","Arkadaşlarımı organize ederdim","Koreografiyi ezbere bilirdim","Konser bitene kadar zıplardım"]},
  { q:"Bir dans videosu çekeceğin zaman en çok neye dikkat edersin?",
    opts:["Şarkı sözlerine duygu katmaya","Hareketlerin senkron olmasına","Kıyafetimin uyumuna","Kendi yorumumu katmaya","Koreografiyi kusursuz yapmaya","Enerjimi en üst seviyede tutmaya"]},
  { q:"Yeni bir hobiye başlasan hangisini seçerdin?",
    opts:["Şarkı yazarlığı","Hip-hop dans kursu","Moda tasarımı","Fotoğrafçılık","Bale ya da modern dans","Zumba / aerobik"]},
  { q:"Bir yarışmada seni en çok ne heyecanlandırır?",
    opts:["Solo şarkı söylemek","Dans düellosu","En iyi giyinen olmak","Kendi ekibimi kurmak","Koreografiyi öğretmek","Sahnede zıplayıp enerji vermek"]},
  { q:"Manifest'in hangi tarzı sana daha yakın?",
    opts:["Duygusal balad","Enerjik pop-dans","Şık ve zarif sahne","Kendine özgü / alternatif","Kompleks koreografili","Enerjik ve eğlenceli"]},
  { q:"Bir gün Manifest ile tanışsan ilk ne sorardın?",
    opts:["En sevdiğin şarkı sözü hangisi?","En sevdiğin dans hareketi ne?","En sevdiğin sahne kostümün ne?","Kendi tarzını nasıl buldun?","Koreografi yaparken nereden ilham alıyorsun?","Sahnede enerjini nasıl koruyorsun?"]},
];

const NAV_ITEMS = [
  { href:"/",            label:"Ana Sayfa",       id:"home" },
  { href:"kizlar.html",  label:"Manifest Kızları", id:"kizlar" },
  { href:"aura.html",    label:"Aura Kızları",    id:"aura" },
  { href:"test.html",    label:"Test",            id:"test" },
  { href:"oyunlar.html", label:"Oyunlar",         id:"oyunlar" },
  { href:"atolye.html",  label:"Atölye",          id:"atolye" },
  { href:"sarkilar.html", label:"Şarkılar",        id:"sarkilar" },
];
