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

const SONGS = [
  { title:"Zamansızdık", emoji:"⏳" },
  { title:"Arıyo", emoji:"📞" },
  { title:"Snap", emoji:"📸" },
  { title:"KTS", emoji:"🔥" },
  { title:"Amatör", emoji:"🎤" },
  { title:"Toz Pembe", emoji:"🌷" },
  { title:"Başrol Sensin", emoji:"🎬" },
];

/** Ritim oyunu şarkıları — MP3 varsa audio/ klasöründen çalar. */
const TRACKS = [
  { id:"zamansizdik", title:"Zamansızdık", emoji:"⏳", mp3:"audio/zamansizdik.mp3", bpm:122, startAt:0 },
  { id:"ariyo",       title:"Arıyo",      emoji:"📞", mp3:"audio/ariyo.mp3", bpm:128, startAt:0 },
  { id:"snap",        title:"Snap",       emoji:"📸", mp3:"audio/snap.mp3", bpm:130, startAt:0 },
  { id:"kts",         title:"KTS",        emoji:"🔥", mp3:"audio/kts.mp3", bpm:126, startAt:0 },
  { id:"amator",      title:"Amatör",     emoji:"🎤", mp3:"audio/amator.mp3", bpm:124, startAt:0 },
  { id:"toz-pembe",   title:"Toz Pembe",  emoji:"🌷", mp3:"audio/toz-pembe.mp3", bpm:120, startAt:0 },
  { id:"basrol-sensin",title:"Başrol Sensin", emoji:"🎬", mp3:"audio/basrol-sensin.mp3", bpm:127, startAt:0 },
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
];

const NAV_ITEMS = [
  { href:"index.html",   label:"Ana Sayfa",       id:"home" },
  { href:"kizlar.html",  label:"Manifest Kızları", id:"kizlar" },
  { href:"test.html",    label:"Test",            id:"test" },
  { href:"oyunlar.html", label:"Oyunlar",         id:"oyunlar" },
  { href:"atolye.html",  label:"Atölye",          id:"atolye" },
  { href:"kanalim.html", label:"Şarkılar",        id:"kanalim" },
];
