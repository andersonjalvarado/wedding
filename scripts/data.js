/* ============================================================
   DATA.JS — TODO el contenido editable de la invitación.
   Modifica este archivo para personalizar la boda.
   ============================================================ */

export const WEDDING = {

  /* --- Nombres de los novios --- */
  couple: {
    name1:     "Anderson Alvarado",
    name2:     "Mariana Rojas",
    fullNames: "Anderson Alvarado & Mariana Rojas",
    shortNames:"A & M",
    parents1:  "Padres de Anderson Alvarado",
    parents2:  "Padres de Mariana Rojas",
  },

  /* --- Fecha y hora --- */
  date: {
    iso:     "2026-08-15T16:00:00",
    display: "15 de agosto, 2026",
    time:    "16:00 hrs",
    dayName: "Sábado",
    year:    "2026",
  },

  /* --- Ceremonia religiosa --- */
  ceremony: {
    name:     "Parroquia Nuestra Señora del Carmen Iglesia Santa Teresita",
    address:  "Cra 18a #43a-59, Bogotá, Colombia",
    mapsUrl:  "https://maps.app.goo.gl/A98QyzhPErTiZNdLA?g_st=aw",
    mapsEmbed:"https://maps.app.goo.gl/A98QyzhPErTiZNdLA?g_st=aw",
    dresscode:"Formal",
    dressNote:"Recomendamos Formal de noche. Caballeros con traje oscuro y corbata, damas con vestido largo o de cóctel.",
    note:     "Te pedimos llegar 30 minutos antes de la ceremonia.",
    /* --- note2:    "La recepción iniciará una hora después de la ceremonia.",--- */
  },

  /* --- Recepción 
  reception: {
    name:    "Casa Residencial Villa del Prado",
    address: "Cra 48a #170-39, Bogotá, Colombia",
    mapsUrl: "https://maps.app.goo.gl/Yirqr8RKcAoZXyBQ7?g_st=aw",
    time:    "19:00 hrs",
  },--- */

  reception: {
    name:    "Bosques de la Alameda II",
    address: "Carrera 17B #175-77, Bogotá, Cundinamarca",
    mapsUrl: "https://maps.app.goo.gl/NmstR7o3kjUj6WCJ9?g_st=aw",
    time:    "19:00 hrs",
  },

  /* --- Nuestra historia --- */
  story: [
    {
      year:  "El comienzo",
      title: "Nos conocimos",
      text:  "En un cafetería de la universidad, dos caminos se cruzaron y algo especial comenzó a florecer.",
      icon:  "heart",
    },
    {
      year:  "El gran viaje juntos",
      title: "Aventureros juntos",
      text:  "Descubrimos que compartíamos el amor por explorar el mundo y crear memorias únicas.",
      icon:  "map-pin",
    },
    {
      year:  "La propuesta",
      title: "Dijo que sí",
      text:  "En el momento perfecto, con el corazón lleno de gratitud, comenzamos el camino hacia el altar.",
      icon:  "sparkles",
    },
  ],

  /* --- Frase bíblica --- */
  bible: {
    verse: "El amor es paciente; es benigno, sin envidia envidia; el amor no es jactancioso, no se engríe; no hace nada que no sea conveniente, no busca lo suyo, no se irrita, no piensa mal; no se regocija en la injusticia, antes se regocija con la verdad; todo lo sobrelleva, todo lo cree, todo lo espera, todo lo soporta.",
    reference: "1 Corintios 13:4-7",
  },

  /* --- Mensaje de bienvenida --- */
  welcome: "Con el corazón lleno de alegría y gratitud a Dios, tenemos el honor de invitarlos a ser testigos de nuestra unión en el sacramento del matrimonio.",

  /* --- Mensaje de cierre --- */
  closing: "Gracias por ser parte de este momento que marcará nuestras vidas para siempre. Su presencia es el regalo más grande que podemos recibir.",

  /* --- RSVP --- */
  rsvp: {
    formspreeId: "xpqgbleb",
    deadline:    "5 de agosto, 2026",
    maxGuests:   2,
  },

  /* --- Contacto --- */
  contact: {
    people: [
      { nombre: "Anderson Alvarado", whatsapp: "+57 3196997799" },
      { nombre: "Mariana Rojas",     whatsapp: "+57 3105571286" },
    ],
  },

  /* --- Imágenes (cambiar rutas para reemplazar fotos) --- */
  images: {
    hero:    "assets/images/hero-bg.jpg",
    couple:  "assets/images/closing.png",
    gallery: [
      "assets/images/gallery/01.jpg",
      "assets/images/gallery/02.jpg",
      "assets/images/gallery/03.jpg",
      "assets/images/gallery/04.jpg",
      "assets/images/gallery/05.jpg",
      "assets/images/gallery/06.jpg",
      "assets/images/gallery/07.jpg",
      "assets/images/gallery/08.jpg",
      "assets/images/gallery/09.jpg",
      "assets/images/gallery/10.jpg",
      "assets/images/gallery/11.jpg",
      "assets/images/gallery/12.jpg",
      "assets/images/gallery/13.jpg",
    ],
  },

  /* --- Meta / SEO --- */
  meta: {
    title:       "Anderson & Mariana — 15.08.2026",
    description: "Nos casamos el 15 de agosto de 2026. Tienes lugar especial en este día.",
    ogImage:     "assets/images/og-image.jpg",
    lang:        "es",
  },
};
