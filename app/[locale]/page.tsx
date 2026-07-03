"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import BetterEcosystemSection from "@/components/BetterEcosystemSection";
import { useLocale, useTranslations } from 'next-intl';
import FinalChallenge from '@/components/FinalChallenge'
import GlobalAccessMechanism from "@/components/GlobalAccessMechanism";
import GrowthCapabilities from "@/components/GrowthCapabilities";
import LeadershipLeagues from "@/components/LeadershipLeagues"

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Locale = 'en' | 'es' | 'de' | 'pt';

// ─── TEAM DATA ───────────────────────────────────────────────────────────────
const team = [
  {
    name: "Diego Vargas",
    role: "Chief Business Engineering Operator",
    desc: "The mind behind the 72h framework. Diego built Better Technologies from a conviction: that real innovation doesn't need a million-dollar budget — it needs relentless execution. He leads the vision, the team, and every sprint from day one.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Organic Growth Chief Developer",
    desc: "Charlotte turns bold ideas into market movements. With a sharp eye for positioning and a data-driven approach to growth, she ensures every product we build doesn't just work — it gets noticed, adopted, and remembered.",
    initials: "CG",
    photo: "/charlotte.jpeg",
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Backend & Infrastructure Chief Engineer",
    desc: "Ezequiel is the engine room of every product we ship. He architects scalable, production-ready systems at startup speed — writing clean, fast, reliable code that makes the impossible 72h timelines actually possible.",
    initials: "EA",
    photo: "/ezequiel.jpeg",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "UX & Frontend Chief Developer",
    desc: "Victor is the one who makes it beautiful and fast. He crafts interfaces that feel inevitable — intuitive, polished, and ready for real users from the very first sprint. He doesn't just build UIs, he builds experiences.",
    initials: "VM",
    photo: "/victor.jpeg",
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Data Science Chief Operator",
    desc: "Yanina speaks the language of data fluently — and translates it into decisions that matter. She extracts signal from noise, builds intelligence layers into every product, and ensures that what we ship isn't just functional — it's smart.",
    initials: "YS",
    photo: "/Yanina.jpeg",
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

const teamEs = [
  {
    name: "Diego Vargas",
    role: "Chief Business Engineering Operator",
    desc: "La mente detras del framework de 72h. Diego construyo Better Technologies desde una conviccion: la innovacion real no necesita presupuestos millonarios, necesita ejecucion implacable. Lidera la vision, el equipo y cada sprint desde el dia uno.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Gotz",
    role: "Organic Growth Chief Developer",
    desc: "Charlotte convierte ideas audaces en movimientos de mercado. Con una mirada precisa para el posicionamiento y un enfoque guiado por datos, garantiza que cada producto no solo funcione: se note, se adopte y se recuerde.",
    initials: "CG",
    photo: "/charlotte.jpeg",
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Backend & Infrastructure Chief Engineer",
    desc: "Ezequiel es la sala de maquinas de cada producto que lanzamos. Arquitecta sistemas escalables listos para produccion a velocidad startup, escribiendo codigo limpio, rapido y confiable para hacer posible lo que parece imposible en 72h.",
    initials: "EA",
    photo: "/ezequiel.jpeg",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "UX & Frontend Chief Developer",
    desc: "Victor es quien lo vuelve hermoso y rapido. Disena interfaces intuitivas, pulidas y listas para usuarios reales desde el primer sprint. No solo construye UIs, construye experiencias.",
    initials: "VM",
    photo: "/victor.jpeg",
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Data Science Chief Operator",
    desc: "Yanina habla el lenguaje de los datos con fluidez y lo traduce en decisiones que importan. Extrae senal del ruido, incorpora inteligencia a cada producto y asegura que lo que lanzamos no solo funcione: sea inteligente.",
    initials: "YS",
    photo: "/Yanina.jpeg",
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

const teamDe = [
  {
    name: "Diego Vargas",
    role: "Chief Business Engineering Operator",
    desc: "Der Kopf hinter dem 72h-Framework. Diego hat Better Technologies aus einer Überzeugung heraus aufgebaut: Echte Innovation braucht kein Millionenbudget — sie braucht unermüdliche Umsetzung. Er leitet die Vision, das Team und jeden Sprint von Anfang an.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Organic Growth Chief Developer",
    desc: "Charlotte verwandelt mutige Ideen in Marktbewegungen. Mit einem scharfen Blick für Positionierung und einem datengesteuerten Wachstumsansatz stellt sie sicher, dass jedes Produkt nicht nur funktioniert — es wird wahrgenommen, angenommen und erinnert.",
    initials: "CG",
    photo: "/charlotte.jpeg",
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Backend & Infrastructure Chief Engineer",
    desc: "Ezequiel ist der Maschinenraum jedes Produkts, das wir liefern. Er entwirft skalierbare, produktionsreife Systeme in Startup-Geschwindigkeit — mit sauberem, schnellem, zuverlässigem Code, der die unmöglichen 72h-Zeitpläne tatsächlich möglich macht.",
    initials: "EA",
    photo: "/ezequiel.jpeg",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "UX & Frontend Chief Developer",
    desc: "Victor macht es schön und schnell. Er gestaltet Interfaces, die sich unausweichlich anfühlen — intuitiv, poliert und bereit für echte Nutzer vom ersten Sprint an. Er baut nicht nur UIs, er baut Erlebnisse.",
    initials: "VM",
    photo: "/victor.jpeg",
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Data Science Chief Operator",
    desc: "Yanina spricht die Sprache der Daten fließend — und übersetzt sie in Entscheidungen, die zählen. Sie extrahiert Signal aus Rauschen, baut Intelligenzschichten in jedes Produkt und stellt sicher, dass was wir liefern nicht nur funktioniert — es ist smart.",
    initials: "YS",
    photo: "/Yanina.jpeg",
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

const teamPt = [
  {
    name: "Diego Vargas",
    role: "Chief Business Engineering Operator",
    desc: "A mente por trás do framework de 72h. Diego construiu a Better Technologies a partir de uma convicção: a inovação real não precisa de orçamentos milionários — precisa de execução implacável. Ele lidera a visão, a equipe e cada sprint desde o primeiro dia.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Organic Growth Chief Developer",
    desc: "Charlotte transforma ideias ousadas em movimentos de mercado. Com um olhar aguçado para posicionamento e uma abordagem orientada por dados, ela garante que cada produto não apenas funcione — seja notado, adotado e lembrado.",
    initials: "CG",
    photo: "/charlotte.jpeg",
    linkedin: "https://www.linkedin.com/in/charlotte-goetz-public/",
  },
  {
    name: "Ezequiel Alonso",
    role: "Backend & Infrastructure Chief Engineer",
    desc: "Ezequiel é a sala de máquinas de cada produto que lançamos. Ele arquiteta sistemas escaláveis e prontos para produção em velocidade de startup — escrevendo código limpo, rápido e confiável que torna os impossíveis prazos de 72h realmente possíveis.",
    initials: "EA",
    photo: "/ezequiel.jpeg",
    linkedin: "https://linkedin.com/",
  },
  {
    name: "Victor Menendez",
    role: "UX & Frontend Chief Developer",
    desc: "Victor é quem torna tudo bonito e rápido. Ele cria interfaces que parecem inevitáveis — intuitivas, polidas e prontas para usuários reais desde o primeiro sprint. Ele não apenas constrói UIs, ele constrói experiências.",
    initials: "VM",
    photo: "/victor.jpeg",
    linkedin: "https://www.linkedin.com/in/demenezesvictor/",
  },
  {
    name: "Yanina Soto",
    role: "Data Science Chief Operator",
    desc: "Yanina fala a linguagem dos dados com fluência — e os traduz em decisões que importam. Ela extrai sinal do ruído, adiciona camadas de inteligência a cada produto e garante que o que lançamos não seja apenas funcional — seja inteligente.",
    initials: "YS",
    photo: "/Yanina.jpeg",
    linkedin: "https://www.linkedin.com/in/yanina-soto/",
  },
];

// ─── BELAND SCREENSHOTS ───────────────────────────────────────────────────────
const belandScreenshots = [
  { src: "/home1.jpeg", alt: "Main Home", title: "Home", text: "Main dashboard where you can track your wallet, accounts, and overall impact." },
  { src: "/registrate.jpeg", alt: "Registration", title: "Join the App", text: "Sign up, explore, participate, and turn your consumption into meaningful action." },
  { src: "/home.jpeg", alt: "Login", title: "Start Exploring", text: "Top up your balance, shop for products, get them delivered, and transform habits into impact." },
  { src: "/mismonedas.jpeg", alt: "Wallet", title: "Recharge & Shop", text: "Seamless transactions designed to generate social and environmental value." },
  { src: "/grupos.jpeg", alt: "Groups", title: "Build or Join Communities", text: "Join existing groups or create your own to organize circular economy events." },
  { src: "/carrito2.jpeg", alt: "Cart", title: "Delivery with Purpose", text: "Every delivery fuels a network built on circular impact and sustainability." },
  { src: "/impacto.jpeg", alt: "Impact", title: "Your Impact", text: "Track recycled kilograms, liters of water saved, and Becoins earned." },
  { src: "/ordenes.jpeg", alt: "Orders", title: "My Orders", text: "View and manage your active or completed purchases." },
];

const belandScreenshotsEs = [
  { src: "/home1.jpeg", alt: "Inicio", title: "Inicio", text: "Panel principal para seguir tu billetera, cuentas e impacto general." },
  { src: "/registrate.jpeg", alt: "Registro", title: "Unete a la App", text: "Registrate, explora, participa y transforma tu consumo en accion con sentido." },
  { src: "/home.jpeg", alt: "Acceso", title: "Comienza a explorar", text: "Recarga saldo, compra productos, recibelos y convierte habitos en impacto." },
  { src: "/mismonedas.jpeg", alt: "Billetera", title: "Recarga y compra", text: "Transacciones fluidas pensadas para generar valor social y ambiental." },
  { src: "/grupos.jpeg", alt: "Grupos", title: "Crea o unete a comunidades", text: "Unete a grupos existentes o crea el tuyo para organizar eventos de economia circular." },
  { src: "/carrito2.jpeg", alt: "Carrito", title: "Entregas con proposito", text: "Cada entrega impulsa una red basada en impacto circular y sostenibilidad." },
  { src: "/impacto.jpeg", alt: "Impacto", title: "Tu impacto", text: "Sigue kilos reciclados, litros de agua ahorrados y Becoins ganados." },
  { src: "/ordenes.jpeg", alt: "Ordenes", title: "Mis ordenes", text: "Visualiza y gestiona compras activas o completadas." },
];

const belandScreenshotsDe = [
  { src: "/home1.jpeg", alt: "Startseite", title: "Startseite", text: "Haupt-Dashboard zum Verfolgen deiner Wallet, Konten und Gesamtauswirkung." },
  { src: "/registrate.jpeg", alt: "Registrierung", title: "App beitreten", text: "Registriere dich, erkunde, mach mit und verwandle deinen Konsum in sinnvolle Aktionen." },
  { src: "/home.jpeg", alt: "Anmeldung", title: "Erkunden beginnen", text: "Guthaben aufladen, Produkte kaufen, liefern lassen und Gewohnheiten in Wirkung umwandeln." },
  { src: "/mismonedas.jpeg", alt: "Wallet", title: "Aufladen & Einkaufen", text: "Nahtlose Transaktionen, die sozialen und ökologischen Mehrwert erzeugen." },
  { src: "/grupos.jpeg", alt: "Gruppen", title: "Communities erstellen oder beitreten", text: "Bestehenden Gruppen beitreten oder eigene für Kreislaufwirtschafts-Events erstellen." },
  { src: "/carrito2.jpeg", alt: "Warenkorb", title: "Lieferung mit Zweck", text: "Jede Lieferung stärkt ein Netzwerk, das auf kreisförmiger Wirkung aufgebaut ist." },
  { src: "/impacto.jpeg", alt: "Wirkung", title: "Deine Wirkung", text: "Recycelte Kilogramm, gesparte Liter Wasser und verdiente Becoins verfolgen." },
  { src: "/ordenes.jpeg", alt: "Bestellungen", title: "Meine Bestellungen", text: "Aktive oder abgeschlossene Käufe anzeigen und verwalten." },
];

const belandScreenshotsPt = [
  { src: "/home1.jpeg", alt: "Início", title: "Início", text: "Painel principal para acompanhar sua carteira, contas e impacto geral." },
  { src: "/registrate.jpeg", alt: "Registro", title: "Entrar no App", text: "Cadastre-se, explore, participe e transforme seu consumo em ação significativa." },
  { src: "/home.jpeg", alt: "Login", title: "Começar a explorar", text: "Recarregue saldo, compre produtos, receba em casa e transforme hábitos em impacto." },
  { src: "/mismonedas.jpeg", alt: "Carteira", title: "Recarregar & Comprar", text: "Transações fluidas projetadas para gerar valor social e ambiental." },
  { src: "/grupos.jpeg", alt: "Grupos", title: "Criar ou entrar em comunidades", text: "Entre em grupos existentes ou crie o seu para organizar eventos de economia circular." },
  { src: "/carrito2.jpeg", alt: "Carrinho", title: "Entrega com propósito", text: "Cada entrega alimenta uma rede construída sobre impacto circular e sustentabilidade." },
  { src: "/impacto.jpeg", alt: "Impacto", title: "Seu impacto", text: "Acompanhe quilos reciclados, litros de água economizados e Becoins ganhos." },
  { src: "/ordenes.jpeg", alt: "Pedidos", title: "Meus pedidos", text: "Visualize e gerencie suas compras ativas ou concluídas." },
];

const belandTags = ["React Native", "Payments", "Delivery", "Circular Economy"];

// ─── DICCIONARIO MULTI-IDIOMA ─────────────────────────────────────────────────
const ui = {
  // Hero
  openLatam: {
    en: "The market doesn't reward followers. It belongs to leaders.",
    es: "El mercado no premia a los que siguen. Le pertenece a los que lideran.",
    de: "Der Markt belohnt keine Mitläufer. Er gehört den Führenden.",
    pt: "O mercado não recompensa quem segue. Ele pertence a quem lidera."
  },
  globalCompanies: { en: "", es: "", de: "", pt: "" },
  subtagline: {
    en: " We don't just write code. We are business architects, experience designers, and ecosystem builders. We engineer integrated Growth Systems for ambitious organizations determined to dominate their industries. We are not a fit for followers or companies looking for quick marketing patches. We build ecosystems for leaders.",
    es: "No solo escribimos código. Somos arquitectos de negocios, diseñadores de experiencias y constructores de ecosistemas. Diseñamos Sistemas de Crecimiento integrados para organizaciones ambiciosas decididas a dominar su industria. No somos para seguidores ni para empresas que buscan parches rápidos de marketing. Construimos ecosistemas para líderes.",
    de: "Wir schreiben nicht nur Code. Wir sind Geschäftsarchitekten, Experience Designer und Ökosystem-Builder. Wir entwickeln integrierte Wachstumssysteme für ambitionierte Unternehmen, die entschlossen sind, ihre Branche zu dominieren. Wir sind nicht die richtige Wahl für Mitläufer oder Unternehmen, die schnelle Marketing-Flicken suchen. Wir bauen Ökosysteme für Führende.",
    pt: "Não escrevemos apenas código. Somos arquitetos de negócios, designers de experiência e construtores de ecossistemas. Projetamos Sistemas de Crescimento integrados para organizações ambiciosas determinadas a dominar seus setores. Não somos indicados para seguidores ou empresas em busca de soluções rápidas de marketing. Construímos ecossistemas para líderes.",
  },
  getInTouch: { en: "Get in touch", es: "Contactar ahora", de: "Kontakt aufnehmen", pt: "Entre em contato" },

  // News section
  loadingFeed: { en: "Loading Intelligence Feed...", es: "Cargando feed de inteligencia...", de: "Intelligence Feed wird geladen...", pt: "Carregando feed de inteligência..." },
  globalFeed: { en: "Global Intelligence Feed", es: "Feed global de inteligencia", de: "Globaler Intelligence Feed", pt: "Feed global de inteligência" },
  inTimesOf: {
    en: "Let's Start Today",
    es: "Empecemos hoy mismo",
    de: "Lass uns heute anfangen",
    pt: "Vamos começar hoje"
  },
  changeTurbulence: {
    en: "Just the way you dream. Only Better.",
    es: "Exactamente como lo sueñas. Solo Mejor.",
    de: "Genauso wie du es dir erträumst. Nur Besser.",
    pt: "Exatamente como você sonha. Apenas Melhor."
  },
  liveUpdates: { en: "Live updates // April 2026", es: "Actualizaciones en vivo // Abril 2026", de: "Live-Updates // April 2026", pt: "Atualizações ao vivo // Abril 2026" },
  systemActive: { en: "System Active", es: "Sistema activo", de: "System aktiv", pt: "Sistema ativo" },
  newsUnavailable: { en: "News currently unavailable.", es: "Noticias no disponibles por ahora.", de: "Nachrichten derzeit nicht verfügbar.", pt: "Notícias indisponíveis no momento." },
  newsError: { en: "We could not fetch the latest intelligence right now. Please try again soon.", es: "No pudimos cargar la inteligencia mas reciente. Intenta nuevamente pronto.", de: "Wir konnten die neuesten Informationen gerade nicht abrufen. Bitte versuche es bald erneut.", pt: "Não conseguimos carregar as informações mais recentes. Tente novamente em breve." },
  noPreview: { en: "No Preview Available", es: "Sin vista previa", de: "Keine Vorschau verfügbar", pt: "Sem pré-visualização" },
  clickRead: { en: "Click to read the full coverage of this digital transformation update.", es: "Haz clic para leer la cobertura completa de esta actualizacion de transformacion digital.", de: "Klicke, um die vollständige Berichterstattung zu lesen.", pt: "Clique para ler a cobertura completa desta atualização de transformação digital." },
  read: { en: "Read →", es: "Leer →", de: "Lesen →", pt: "Ler →" },
  prevArticle: { en: "Previous article", es: "Articulo anterior", de: "Vorheriger Artikel", pt: "Artigo anterior" },
  nextArticle: { en: "Next article", es: "Siguiente articulo", de: "Nächster Artikel", pt: "Próximo artigo" },

  // Chat section
  kitchenTitle: {
    en: " THE AWAKENING & ",
    es: " EL DESPERTAR & ",
    de: " DAS ERWACHEN & ",
    pt: " O DESPERTAR & "
  },
  kitchenTitle2: {
    en: "THE PACK ",
    es: "LA MANADA ",
    de: "DAS RUDEL ",
    pt: "A ALCATEIA "
  },

  kitchenOpen: { en: "", es: "", de: "", pt: "" },
  century20: {
    en: "The Problem & The Unfair Advantage.",
    es: "El Problema y La Ventaja Injusta.",
    de: "Das Problem & Der unfaire Vorteil.",
    pt: "O Problema & A Vantagem Injusta."
  },
  howCanHelp: { en: "If someone searches for your business today,", es: "¿Si alguien busca tu negocio hoy,", de: "Wenn heute jemand nach Ihrem Unternehmen sucht,", pt: "Se alguém buscar pelo seu negócio hoje," },
  theTeam: { en: " can they actually", es: " ¿realmente puede", de: " kann er Sie dann tatsächlich", pt: " conseguirá realmente" },
  helpToday: { en: " find you?", es: " encontrarte?", de: " finden?", pt: " te encontrar?" },
  connectTeam: { en: "Connect with the team", es: "Conectar con el equipo", de: "Mit dem Team verbinden", pt: "Conectar com a equipe" },
  goBack: { en: "← Go back", es: "← Volver", de: "← Zurück", pt: "← Voltar" },
  whatWeSell: { en: "What we sell:", es: "Que vendemos:", de: "Was wir verkaufen:", pt: "O que vendemos:" },
  indAccel: { en: "Industrial Acceleration", es: "Aceleracion industrial", de: "Industrielle Beschleunigung", pt: "Aceleração industrial" },
  relocate: { en: "Relocating global production to LATAM with speed and cost efficiency.", es: "Relocalizamos produccion global en LATAM con velocidad y eficiencia de costos.", de: "Verlagerung globaler Produktion nach LATAM mit Geschwindigkeit und Kosteneffizienz.", pt: "Relocalização da produção global para a LATAM com velocidade e eficiência de custos." },
  opSetup: { en: " Operational setup in PY / MX / CO", es: " Setup operativo en PY / MX / CO", de: " Operativer Aufbau in PY / MX / CO", pt: " Configuração operacional em PY / MX / CO" },
  supplierNet: { en: " Industrial supplier networks", es: " Redes industriales de proveedores", de: " Industrielle Lieferantennetzwerke", pt: " Redes industriais de fornecedores" },
  costOpt: { en: " Cost optimization (30–60%)", es: " Optimizacion de costos (30–60%)", de: " Kostenoptimierung (30–60%)", pt: " Otimização de custos (30–60%)" },
  localMgmt: { en: " Local operational management", es: " Gestion operativa local", de: " Lokales Betriebsmanagement", pt: " Gestão operacional local" },
  chatOptions: {
    en: ["Industrial Acceleration", "Smart Supply Chain", "Talent Infrastructure", "Market Entry LATAM", "72h Validation"],
    es: ["Aceleracion industrial", "Supply chain inteligente", "Infraestructura de talento", "Entrada a mercado LATAM", "Validacion 72h"],
    de: ["Industrielle Beschleunigung", "Intelligente Lieferkette", "Talentinfrastruktur", "Markteintritt LATAM", "72h-Validierung"],
    pt: ["Aceleração industrial", "Supply chain inteligente", "Infraestrutura de talentos", "Entrada no mercado LATAM", "Validação 72h"],
  },
  whatsappMsg: {
    en: (opt: string) => `Hi! I'm interested in ${opt}. I'd like to talk to the team about a new project.`,
    es: (opt: string) => `Hola! Estoy interesado en ${opt}. Me gustaria hablar con el equipo sobre un nuevo proyecto.`,
    de: (opt: string) => `Hallo! Ich interessiere mich für ${opt}. Ich würde gerne mit dem Team über ein neues Projekt sprechen.`,
    pt: (opt: string) => `Olá! Estou interessado em ${opt}. Gostaria de falar com a equipe sobre um novo projeto.`,
  },
  leadership: {
  en: "Leadership",
  es: "Liderazgo",
  de: "Führung",
  pt: "Liderança",
},

noSizeLimit: {
  en: "has no size limit.",
  es: "no tiene límites de escala.",
  de: "kennt keine Größenbeschränkung.",
  pt: "não tem limites de escala.",
},

leadershipSubtitle: {
  en: "We engineer systems for those who lead, regardless of their current headcount.",
  es: "Diseñamos sistemas para quienes lideran, sin importar su tamaño actual.",
  de: "Wir entwickeln Systeme für Führungskräfte, unabhängig von ihrer aktuellen Größe.",
  pt: "Projetamos sistemas para quem lidera, independentemente do seu tamanho atual.",
},

chooseLeague: {
  en: "Choose your league",
  es: "Elige tu liga",
  de: "Wähle deine Liga",
  pt: "Escolha sua liga",
},
leadershipMain: {
  en: "Leadership",
  es: "El liderazgo",
  de: "Führung",
  pt: "Liderança",
},

leadershipHighlight: {
  en: "scales",
  es: "escala",
  de: "skaliert",
  pt: "escala",
},
leadershipRest: {
  en: "has no size limit.",
  es: "no tiene límites de escala.",
  de: "kennt keine Größenbeschränkung.",
  pt: "não tem limites de escala.",
},

  // Casos de éxito
  successStories: { en: "Our Success Stories", es: "Nuestros casos de exito", de: "Unsere Erfolgsgeschichten", pt: "Nossos casos de sucesso" },
  builtByUs: { en: "Built by us,", es: "Construido por nosotros,", de: "Von uns gebaut,", pt: "Construído por nós," },
  usedByPeople: { en: "Used by people.", es: "Usado por personas.", de: "Von Menschen genutzt.", pt: "Usado por pessoas." },
  circularEco: { en: "A", es: "Un", de: "Ein", pt: "Um" },
  circularEco2: { en: "circular ecosystem", es: "ecosistema circular", de: "kreisförmiges Ökosystem", pt: "ecossistema circular" },
  circularEco3: { en: "that integrates payments, delivery, and rewards within a single system, driving a network where every", es: "que integra pagos, entregas y recompensas en un solo sistema, impulsando una red donde cada", de: "das Zahlungen, Lieferung und Belohnungen in einem System integriert und ein Netzwerk antreibt, in dem jede", pt: "que integra pagamentos, entregas e recompensas em um único sistema, impulsionando uma rede onde cada" },
  positiveAction: { en: "positive action", es: "accion positiva", de: "positive Aktion", pt: "ação positiva" },
  strengthens: { en: "strengthens the entire community.", es: "fortalece a toda la comunidad.", de: "die gesamte Gemeinschaft stärkt.", pt: "fortalece toda a comunidade." },
  viewApp: { en: "View the app", es: "Ver la app", de: "App ansehen", pt: "Ver o app" },


  viewMachines: {
    en: "View Machines",
    es: "Ver Máquinas",
    de: "Maschinen ansehen",
    pt: "Ver Máquinas",
  },
  // Beland Modal
  belandTitle: {
    en: "CIRCULAR TECHNOLOGY",
    es: "TECNOLOGÍA CIRCULAR",
    de: "KREISLAUFTECHNOLOGIE",
    pt: "TECNOLOGIA CIRCULAR",
  },
  belandHeading1: { en: "AUTONOMOUS", es: "ESTACIÓN", de: "AUTONOME", pt: "AUTÔNOMA" },
  belandHeading2: { en: "RECYCLING", es: "AUTÓNOMA", de: "RECYCLING", pt: "RECICLAGEM" },
  belandHeading3: { en: "STATION", es: "DE RECICLAJE", de: "STATION", pt: "ESTAÇÃO" },
  belandDesc: {
    en: "Our smart machine receives your waste, scans it, and rewards you instantly. Turn recycling into a visible, social, and viral experience.",
    es: "Nuestra máquina inteligente recibe tus residuos, los escanea y te recompensa al instante. Convierte el reciclaje en una experiencia visible, social y viral.",
    de: "Unsere intelligente Maschine nimmt deinen Müll an, scannt ihn und belohnt dich sofort. Verwandle Recycling in ein sichtbares, soziales und virales Erlebnis.",
    pt: "Nossa máquina inteligente recebe seu resíduo, escaneia e o recompensa instantaneamente. Transforme a reciclagem em uma experiência visível, social e viral.",
  },
  belandFeature1: {
    en: "Accepts glass, aluminum, plastic and tetrapack",
    es: "Acepta vidrio, aluminio, plástico y tetrapack",
    de: "Akzeptiert Glas, Aluminium, Kunststoff und Tetrapak",
    pt: "Aceita vidro, alumínio, plástico e tetrapak",
  },
  belandFeature2: {
    en: "Capture your reaction and generate a unique QR",
    es: "Captura tu reacción y genera un QR único",
    de: "Erfasse deine Reaktion und generiere einen eindeutigen QR-Code",
    pt: "Capture sua reação e gere um QR único",
  },
  belandFeature3: {
    en: "Earn digital coins with every recycle",
    es: "Gana monedas digitales por cada reciclaje",
    de: "Verdiene digitale Münzen mit jedem Recycling",
    pt: "Ganhe moedas digitais a cada reciclagem",
  },
  belandFeature4: {
    en: "Remote monitoring and admin panel",
    es: "Monitoreo remoto y panel administrativo",
    de: "Remote-Überwachung und Admin-Panel",
    pt: "Monitoramento remoto e painel administrativo",
  },
  belandQuote: {
    en: "QUOTE YOURS",
    es: "COTIZA LA TUYA",
    de: "BERECHNE DEINE",
    pt: "COTAR A SUA",
  },
  // Mittelstand

  problemTitle: { en: "HOW CAN WE HELP?", es: "¿CÓMO PODEMOS AYUDAR?", de: "WIE KÖNNEN WIR HELFEN?", pt: "COMO PODEMOS AJUDAR?" },
  problemSubtitle: {
    en: "THE AI AWAKENING ",
    es: "EL DESPERTAR DE LA IA ",
    de: "DAS KI-ERWACHEN ",
    pt: "O DESPERTAR DA IA "
  },
  problemDesc: {
    en: "Engineering and deployment of your first Website as an Operating System (Optimized for AI & Human Trust).",
    es: "Ingeniería y despliegue de tu primer Sitio Web como Sistema Operativo (Optimizado para Confianza de IA y Humanos).",
    de: "Entwicklung und Bereitstellung Ihrer ersten Website als Betriebssystem (Optimiert für KI- und menschliches Vertrauen).",
    pt: "Engenharia e implantação do seu primeiro Site como Sistema Operacional (Otimizado para Confiança de IA e Humanos)."
  },
  typicalTickets: { en: "Typical tickets:", es: "Tickets típicos:", de: "Typische Tickets:", pt: "Tickets típicos:" },
  ourCustomers: { en: "WHATS NEXT?", es: "¿QUÉ SIGUE?", de: "WAS KOMMT ALS NÄCHSTES?", pt: "O QUE VEM A SEGUIR?" },
  midSized1: {
    en: " Your customers aren't searching for you anymore; they are asking AI",
    es: "Tus clientes ya no te buscan; le preguntan a la IA",
    de: "Ihre Kunden suchen nicht mehr nach Ihnen; sie fragen die KI",
    pt: "Seus clientes já não te procuram; eles perguntam à IA"
  }, midSized2: {
    en: "Market leaders have thrived chasing likes, so far. But the rules of the hunt have changed.",
    es: "Los líderes del mercado prosperaron persiguiendo likes, hasta ahora. Pero las reglas de la caza cambiaron.",
    de: "Marktführer sind bisher erfolgreich gewesen, indem sie Likes gejagt haben. Doch die Regeln der Jagd haben sich geändert.",
    pt: "Os líderes de mercado prosperaram perseguindo likes, até agora. Mas as regras da caçada mudaram."
  },
  employees: { en: "50–500 employees", es: "50–500 empleados", de: "50–500 Mitarbeiter", pt: "50–500 funcionários" },
  multiOps: { en: "Operations across multiple countries / regions", es: "Operaciones en multiples paises / regiones", de: "Betrieb in mehreren Ländern / Regionen", pt: "Operações em vários países / regiões" },
  longChains: { en: "Dependent on long supply chains", es: "Dependientes de cadenas de suministro largas", de: "Abhängig von langen Lieferketten", pt: "Dependentes de longas cadeias de suprimento" },
  tradModels: { en: "Traditional business models", es: "Modelos de negocio tradicionales", de: "Traditionelle Geschäftsmodelle", pt: "Modelos de negócios tradicionais" },
  packButtonLabel: {
    en: " Why Us?",
    es: " ¿Por qué nosotros?",
    de: " Warum wir?",
    pt: " Por que nós?"
  },
  packModalTitle: {
    en: "The Pack",
    es: "La Manada",
    de: "Das Rudel",
    pt: "A Alcateia"
  },
  packModalQuote: {
    en: "The strength of the wolf is the pack, and the strength of the pack is the wolf.",
    es: "La fuerza del lobo es la manada, y la fuerza de la manada es el lobo.",
    de: "Die Stärke des Wolfs ist das Rudel, und die Stärke des Rudels ist der Wolf.",
    pt: "A força do lobo é a alcateia, e a força da alcateia é o lobo."
  },
  packModalBody: {
    en: "Dominating this new landscape means acquiring world-class capabilities overnight. True leaders know that attempting to build an elite tech team from scratch takes years and bleeds capital; so they don't hunt alone. They plug into a superior ecosystem. We are your pack. By partnering with us, you integrate strategy, engineering, and growth systems instantly, at a fraction of the cost of an internal team. There is no other firm in the market deploying this level of integrated firepower. We hunt together. We thrive together.",
    es: "Dominar este nuevo panorama significa adquirir capacidades de clase mundial de la noche a la mañana. Los verdaderos líderes saben que intentar construir un equipo tecnológico de élite desde cero toma años y consume capital; por eso no cazan solos. Se conectan a un ecosistema superior. Nosotros somos tu manada. Al asociarte con nosotros, integrás estrategia, ingeniería y sistemas de crecimiento al instante, a una fracción del costo de un equipo interno. No hay otra firma en el mercado que despliegue este nivel de poder de fuego integrado. Cazamos juntos. Prosperamos juntos.",
    de: "Diese neue Landschaft zu dominieren bedeutet, über Nacht Weltklasse-Fähigkeiten zu erwerben. Wahre Führungskräfte wissen, dass der Aufbau eines Elite-Tech-Teams von Grund auf Jahre dauert und Kapital verschlingt; deshalb jagen sie nicht allein. Sie schließen sich einem überlegenen Ökosystem an. Wir sind Ihr Rudel. Durch die Partnerschaft mit uns integrieren Sie Strategie, Engineering und Wachstumssysteme sofort, zu einem Bruchteil der Kosten eines internen Teams. Keine andere Firma am Markt setzt dieses Maß an integrierter Schlagkraft ein. Wir jagen gemeinsam. Wir wachsen gemeinsam.",
    pt: "Dominar esse novo cenário significa adquirir capacidades de classe mundial da noite para o dia. Verdadeiros líderes sabem que tentar construir uma equipe tecnológica de elite do zero leva anos e consome capital; por isso não caçam sozinhos. Eles se conectam a um ecossistema superior. Nós somos a sua alcateia. Ao se associar conosco, você integra estratégia, engenharia e sistemas de crescimento instantaneamente, por uma fração do custo de uma equipe interna. Não há outra empresa no mercado implantando esse nível de poder de fogo integrado. Caçamos juntos. Prosperamos juntos."
  },
  closeButton: {
    en: "Close",
    es: "Cerrar",
    de: "Schließen",
    pt: "Fechar"
  },
  termsButtonLabel: {
    en: "The Terms",
    es: "Los Términos",
    de: "Die Bedingungen",
    pt: "Os Termos"
  },
  termsModalTitle: {
    en: "Terms",
    es: "Términos",
    de: "Bedingungen",
    pt: "Termos"
  },
  termsModalBody: {
    en: "Most agencies charge thousands for a dead digital brochure. We build your AI-ready infrastructure for free. Why? Because we play long-term games. Talk is cheap; leaders leave evidence. We will design, code, and deploy your new high-converting digital hub entirely on us. If you have the hunger, we got the system.",
    es: "La mayoría de las agencias cobran miles por un folleto digital sin vida. Nosotros construimos tu infraestructura lista para IA de forma gratuita. ¿Por qué? Porque jugamos a largo plazo. Hablar es barato; los líderes dejan evidencia. Diseñaremos, programaremos y desplegaremos tu nuevo centro digital de alta conversión completamente por nuestra cuenta. Si tenés el hambre, nosotros tenemos el sistema.",
    de: "Die meisten Agenturen verlangen Tausende für eine tote digitale Broschüre. Wir bauen Ihre KI-fähige Infrastruktur kostenlos. Warum? Weil wir langfristig denken. Reden ist billig; Führende hinterlassen Beweise. Wir werden Ihren neuen konversionsstarken digitalen Hub komplett auf unsere Kosten gestalten, programmieren und bereitstellen. Wenn Sie den Hunger haben, haben wir das System.",
    pt: "A maioria das agências cobra milhares por um folheto digital sem vida. Nós construímos a sua infraestrutura pronta para IA gratuitamente. Por quê? Porque jogamos a longo prazo. Falar é barato; líderes deixam evidências. Vamos projetar, programar e implantar o seu novo hub digital de alta conversão totalmente por nossa conta. Se você tem a fome, nós temos o sistema."
  },
  termsModalCta: {
    en: "Claim AI Awakening (15-Min Assessment)",
    es: "Reclamar Despertar de IA (Evaluación de 15 min)",
    de: "KI-Erwachen sichern (15-Min-Bewertung)",
    pt: "Reivindicar Despertar de IA (Avaliação de 15 min)"
  },
  engineeringPrice: {
    en: "Engineering Price: $0 you only cover the domain provisioning, no fine prints.",
    es: "Precio de Ingeniería: $0, solo cubrís el aprovisionamiento del dominio, sin letra chica.",
    de: "Engineering-Preis: $0, Sie übernehmen nur die Domain-Bereitstellung, kein Kleingedrucktes.",
    pt: "Preço de Engenharia: $0, você só cobre o provisionamento do domínio, sem letras miúdas."
  },
  // Pricing
  whatWeDeliver: { en: "Our", es: "Nuestros", de: "Unsere", pt: "Nossos" },
  weDeliver: { en: "Services", es: "Servicios", de: "Dienstleistungen", pt: "Serviços" },
  servicesSubtitle: {
    en: "Crafted with purpose. Built for impact.",
    es: "Diseñado con propósito. Construido para el impacto.",
    de: "Mit Zweck entworfen. Für Wirkung gebaut.",
    pt: "Projetado com propósito. Construído para impacto.",
  },
  tailorMade: { en: "Tailor made", es: "A medida", de: "Maßgeschneidert", pt: "Sob medida" },
  oppValidation: { en: " Opportunity Validation: Problem + viable solution hypothesis", es: " Validacion de oportunidad: problema + hipotesis de solucion viable", de: " Chancenvalidierung: Problem + tragfähige Lösungshypothese", pt: " Validação de oportunidade: problema + hipótese de solução viável" },
  feasibility: { en: " Feasibility Study: Financial overview + Operational forecast", es: " Estudio de factibilidad: overview financiero + pronostico operativo", de: " Machbarkeitsstudie: Finanzübersicht + Betriebsprognose", pt: " Estudo de viabilidade: visão financeira + previsão operacional" },
  solutionEng: { en: " Solution engineering", es: " Ingenieria de solucion", de: " Lösungsengineering", pt: " Engenharia de solução" },
  functionalMvp: { en: " Functional MVP", es: " MVP funcional", de: " Funktionaler MVP", pt: " MVP funcional" },
  betaTesting: { en: " Beta testing (with real users)", es: " Beta testing (con usuarios reales)", de: " Beta-Test (mit echten Nutzern)", pt: " Beta testing (com usuários reais)" },
  localDigital: { en: " Local + Digital operations", es: " Operaciones locales + digitales", de: " Lokale + digitale Operationen", pt: " Operações locais + digitais" },
  successOri: { en: " Success oriented business execution", es: " Ejecucion orientada a resultados", de: " Erfolgsorientierte Geschäftsausführung", pt: " Execução orientada ao sucesso" },
  reducedCosts: { en: " Reduced operational costs", es: " Reduccion de costos operativos", de: " Reduzierte Betriebskosten", pt: " Custos operacionais reduzidos" },
  fasterScaling: { en: " Faster and better scaling", es: " Escalamiento mas rapido y mejor", de: " Schnelleres und besseres Skalieren", pt: " Escalonamento mais rápido e melhor" },

  // Team
  aboutTeam: { en: "About our Team", es: "Sobre nuestro equipo", de: "Über unser Team", pt: "Sobre a nossa equipe" },
  highPerf: {
    en: "An Elite",
    es: "Un equipo de producto",
    de: "Ein erstklassiges",
    pt: "Uma equipe de produto"
  },

  highPerfEm: {
    en: "Trilingual Product Team.",
    es: "trilingüe de élite.",
    de: "dreisprachiges Produktteam.",
    pt: "trilíngue de elite."
  },

  forged: {
    en: "High Performance",
    es: "Alto rendimiento",
    de: "Hochleistung",
    pt: "Alto desempenho"
  },

  pressure: {
    en: "Execution.",
    es: "Ejecución.",
    de: "Ausführung.",
    pt: "Execução."
  },
  aboutTeamCopy: {
    en: "Forged in high-pressure environments. We are trilingual (EN, SPA, GER) business strategists, product managers, and world-class engineers ensuring business agility for those who are ready to scale.",
    es: "...",
    de: "...",
    pt: "..."
  },

  // Cierre
closingLine: {
  en: "Understand the past —",
  es: "Comprende el pasado —",
  de: "Verstehe die Vergangenheit —",
  pt: "Entenda o passado —"
},

closingLineEm: {
  en: "Build What's Next.",
  es: "Construye lo que viene.",
  de: "Baue die Zukunft.",
  pt: "Construa o futuro."
},
closingCopy: {
  en: "In an era defined by Global Operations Under Uncertainty, we engineer the infrastructure for the future. From Execution in LATAM to securing Real-Time operations & certainty, we build Trust Systems and Authentication systems that serve as Proof of Humanity in an AI-driven world. Whether deploying Circular Economic Systems, ensuring seamless Circular Systems Deployment, or running complex Validation protocols for the Future of Global Operations, we design for resilience and dominance.",

  es: "En una era definida por las operaciones globales bajo incertidumbre, diseñamos la infraestructura del futuro. Desde la ejecución en LATAM hasta la protección de operaciones en tiempo real y la generación de certeza, desarrollamos sistemas de confianza y autenticación que actúan como prueba de humanidad en un mundo impulsado por la IA. Ya sea implementando sistemas de economía circular, garantizando un despliegue fluido de sistemas circulares o ejecutando complejos protocolos de validación para el futuro de las operaciones globales, diseñamos soluciones orientadas a la resiliencia y al liderazgo.",

  de: "In einer Ära, die von globalen Operationen unter Unsicherheit geprägt ist, entwickeln wir die Infrastruktur der Zukunft. Von der Umsetzung in LATAM bis zur Absicherung von Echtzeitprozessen und Planungssicherheit entwickeln wir Vertrauens- und Authentifizierungssysteme, die als Nachweis der menschlichen Identität in einer KI-gesteuerten Welt dienen. Ob bei der Einführung zirkulärer Wirtschaftssysteme, der nahtlosen Bereitstellung zirkulärer Systeme oder der Durchführung komplexer Validierungsprotokolle für die Zukunft globaler Abläufe – wir entwickeln Lösungen für Resilienz und nachhaltige Stärke.",

  pt: "Em uma era definida por operações globais sob incerteza, desenvolvemos a infraestrutura do futuro. Da execução na LATAM à garantia de operações em tempo real e maior previsibilidade, construímos sistemas de confiança e autenticação que servem como prova de humanidade em um mundo impulsionado por IA. Seja implantando sistemas de economia circular, garantindo uma implementação fluida de sistemas circulares ou executando protocolos complexos de validação para o futuro das operações globais, projetamos soluções voltadas para resiliência e liderança."
},
  letsStart: { en: "LET'S START", es: "COMENCEMOS", de: "LASST UNS", pt: "VAMOS COMEÇAR" },
  today: { en: "TODAY", es: "HOY", de: "HEUTE BEGINNEN", pt: "HOJE" },

  // Latest Insights
  stayUpdated: { en: "Stay updated with us", es: "Mantente actualizado con nosotros", de: "Bleib auf dem Laufenden", pt: "Fique atualizado conosco" },
  latestInsights: { en: "Latest Insights", es: "Ultimos insights", de: "Neueste Einblicke", pt: "Últimos insights" },
  blogDesc: { en: "Explore our blog for industry trends, tech updates, and innovation stories.", es: "Explora nuestro blog para ver tendencias, actualizaciones tecnologicas e historias de innovacion.", de: "Erkunden Sie unseren Blog für Branchentrends, Tech-Updates und Innovationsgeschichten.", pt: "Explore nosso blog para tendências do setor, atualizações de tecnologia e histórias de inovação." },
  noPostsYet: { en: "No posts available yet.", es: "Aun no hay posts disponibles.", de: "Noch keine Beiträge verfügbar.", pt: "Ainda não há posts disponíveis." },
  readMore: { en: "Read More →", es: "Leer mas →", de: "Weiterlesen →", pt: "Ler mais →" },
  noImage: { en: "NO IMAGE", es: "SIN IMAGEN", de: "KEIN BILD", pt: "SEM IMAGEM" },
  noDesc: { en: "No description available", es: "No hay descripcion disponible", de: "Keine Beschreibung verfügbar", pt: "Sem descrição disponível" },



  dontMiss: {
    en: "Don't miss a move",
    es: "No te pierdas ningun movimiento",
    de: "Verpasse keine Bewegung",
    pt: "Não perca nenhum movimento"
  },
  followJourney: {
  en: "Follow",
  es: "Sigue",
  de: "Folgen Sie",
  pt: "Siga"
},

journey: {
  en: "Our Journey",
  es: "Nuestro Recorrido",
  de: "Unserem Weg",
  pt: "Nossa Jornada"
},
finalChallenge: {
  en: "The Final Challenge",
  es: "El Desafío Final",
  de: "Die Letzte Herausforderung",
  pt: "O Desafio Final"
},
scholarshipHeadline: {
  en: "The Better Underdog & Endangered Territories Scholarship.",
  es: "La beca Better Underdog & Territorios en Riesgo.",
  de: "Das Better Underdog & Gefährdete Regionen Stipendium.",
  pt: "A Bolsa Better Underdog & Territórios em Risco."
},

scholarshipIntro: {
  en: "Greatness isn't always funded, and geography shouldn't dictate your market share. This scholarship applies across all our Growth Systems, offering up to 50% co-investment in our operating fees through two qualification paths:",
  es: "La grandeza no siempre está financiada, y la geografía no debería definir tu participación en el mercado. Esta beca aplica a todos nuestros sistemas de crecimiento, ofreciendo hasta un 50% de co-inversión en nuestros honorarios operativos mediante dos vías de calificación:",
  de: "Größe wird nicht immer finanziert, und Geografie sollte nicht über Marktanteile entscheiden. Dieses Stipendium gilt für alle unsere Wachstumssysteme und bietet bis zu 50 % Co-Investition in unsere Betriebskosten über zwei Qualifikationswege:",
  pt: "A grandeza nem sempre é financiada, e a geografia não deve determinar sua participação de mercado. Esta bolsa se aplica a todos os nossos sistemas de crescimento, oferecendo até 50% de coinvestimento em nossas taxas operacionais através de dois caminhos de qualificação:"
},

scholarshipPath1: {
  en: "You are bootstrapping. Whether in a garage in Austin or a dorm in London, if you lack capital but have a disruptive vision, relentless ambition, and a story worth telling, we invest in your potential.",
  es: "Estás en etapa bootstrap. Ya sea en un garage en Austin o en una residencia en Londres, si te falta capital pero tienes una visión disruptiva, ambición incansable y una historia que contar, invertimos en tu potencial.",
  de: "Du bist im Bootstrapping. Ob in einer Garage in Austin oder einem Studentenwohnheim in London – wenn dir Kapital fehlt, aber du eine disruptive Vision und unermüdlichen Ehrgeiz hast, investieren wir in dein Potenzial.",
  pt: "Você está em bootstrap. Seja em uma garagem em Austin ou em um dormitório em Londres, se você não tem capital mas tem uma visão disruptiva e ambição incansável, investimos no seu potencial."
},

scholarshipPath2: {
  en: "You operate in a region where raw talent outpaces macroeconomic stability. If your venture faces systemic friction, hyperinflation, or currency devaluation (e.g., LATAM and emerging markets), you automatically qualify.",
  es: "Operas en una región donde el talento supera la estabilidad macroeconómica. Si tu proyecto enfrenta fricción sistémica, hiperinflación o devaluación monetaria (ej. LATAM y mercados emergentes), calificas automáticamente.",
  de: "Du operierst in einer Region, in der Talent die makroökonomische Stabilität übertrifft. Wenn dein Projekt systemische Reibung, Hyperinflation oder Währungsabwertung erlebt, qualifizierst du dich automatisch.",
  pt: "Você opera em uma região onde o talento supera a estabilidade macroeconômica. Se seu projeto enfrenta atrito sistêmico, hiperinflação ou desvalorização monetária, você se qualifica automaticamente."
},

scholarshipPromise: {
  en: "We sponsor the growth systems of tomorrow's Alphas, no matter where they are born or how much capital they have today.",
  es: "Financiamos los sistemas de crecimiento de los Alphas del mañana, sin importar dónde nacieron o cuánto capital tengan hoy.",
  de: "Wir fördern die Wachstumssysteme der Alphas von morgen, unabhängig davon, wo sie geboren wurden oder wie viel Kapital sie heute haben.",
  pt: "Patrocinamos os sistemas de crescimento dos Alphas de amanhã, não importa onde nasceram ou quanto capital têm hoje."
},

scholarshipCTA: {
  en: "Apply for Co-Investment →",
  es: "Aplicar a Co-Inversión →",
  de: "Für Co-Investition bewerben →",
  pt: "Aplicar para Coinvestimento →"
},

challengeHeadline: {
  en: "The world is changing faster than organizations.",
  es: "El mundo está cambiando más rápido que las organizaciones.",
  de: "Die Welt verändert sich schneller als Unternehmen.",
  pt: "O mundo está mudando mais rápido do que as organizações."
},

challengeCopy: {
  en: "Stop buying isolated services. Build a system. What's your next move?",
  es: "Deja de comprar servicios aislados. Construye un sistema. ¿Cuál es tu próximo movimiento?",
  de: "Hören Sie auf, isolierte Dienstleistungen zu kaufen. Bauen Sie ein System. Was ist Ihr nächster Schritt?",
  pt: "Pare de comprar serviços isolados. Construa um sistema. Qual é o seu próximo passo?"
},

challengeCTA: {
  en: "Choose Your Path",
  es: "Elige tu camino",
  de: "Wählen Sie Ihren Weg",
  pt: "Escolha seu caminho"
},
  // Botones Yes / No
  yesBtn: { en: "Yes", es: "Sí", de: "Ja", pt: "Sim" },
  noBtn: { en: "No", es: "No", de: "Nein", pt: "Não" },


  perfect: { en: "Perfect", es: "Perfecto", de: "Perfekt", pt: "Perfeito" },
  change: { en: "Change", es: "Cambiar", de: "Ändern", pt: "Mudar" },


  yesModalTitlePart1: {
    en: ", now make your business impossible to ",
    es: ", ahora volvé tu negocio imposible de ",
    de: ", mach dein Unternehmen unmöglich zu ",
    pt: ", agora torne o seu negócio impossível de ",
  },
  yesModalTitlePart2: {
    en: " ignore.",
    es: " ignorar.",
    de: " ignorieren.",
    pt: " ignorar.",
  },

  noModalTitlePart1: {
    en: "Let's ",
    es: "Empecemos a ",
    de: "Lass uns  ",
    pt: "Vamos ",
  },
  noModalTitlePart2: {
    en: " that.",
    es: " eso.",
    de: " das.",
    pt: " isso.",
  },
  yesModalDesc: {
    en: "Let's build a digital identity that makes you visible, relevant, and recommendable.",
    es: "Construyamos una identidad digital que te haga visible, relevante y recomendable.",
    de: "Lass uns eine digitale Identität aufbauen, die dich sichtbar, relevant und empfehlenswert macht.",
    pt: "Vamos construir uma identidade digital que te torne visível, relevante e recomendável.",
  },


  noModalDesc: {
    en: "Start with your first digital touchpoint and build the foundation of your digital identity.",
    es: "Empieza con tu primer punto de contacto digital y construye la base de tu identidad digital.",
    de: "Beginne mit deinem ersten digitalen Touchpoint und lege das Fundament deiner digitalen Identität.",
    pt: "Comece com o seu primeiro ponto de contato digital e construa a base da sua identidade digital.",
  },
growthCapabilities: {
  en: "Our Growth Capabilities",
  es: "Nuestras Capacidades de Crecimiento",
  de: "Unsere Wachstumskapazitäten",
  pt: "Nossas Capacidades de Crescimento",
},

customArsenal: {
  en: "The Custom Arsenal",
  es: "El Arsenal Personalizado",
  de: "Das Individuelle Arsenal",
  pt: "O Arsenal Personalizado",
},

growthIntro: {
  en: "We don't sell rigid packages. We deploy custom capabilities: Strategy, product engineering, human experiences, and business development—deployed exactly as your business needs it to scale.",
  es: "No vendemos paquetes rígidos. Implementamos capacidades a medida: estrategia, ingeniería de producto, experiencias humanas y desarrollo de negocio, desplegados exactamente según lo que tu empresa necesita para escalar.",
  de: "Wir verkaufen keine starren Pakete. Wir setzen maßgeschneiderte Fähigkeiten ein: Strategie, Produktentwicklung, menschliche Erfahrungen und Geschäftsentwicklung – exakt so, wie Ihr Unternehmen skalieren muss.",
  pt: "Não vendemos pacotes rígidos. Implantamos capacidades personalizadas: estratégia, engenharia de produto, experiências humanas e desenvolvimento de negócios — exatamente como sua empresa precisa para escalar.",
},

foundationTitle: {
  en: "Better Foundation",
  es: "Base Mejorada",
  de: "Bessere Grundlage",
  pt: "Fundação Melhorada",
},

foundationSubtitle: {
  en: "Digital Identity & AI Discoverability",
  es: "Identidad Digital y Descubrimiento por IA",
  de: "Digitale Identität & KI-Auffindbarkeit",
  pt: "Identidade Digital e Descoberta por IA",
},

foundationPain: {
  en: "We have a great product/service, but our digital footprint is weak. We are practically invisible to AI and new markets.",
  es: "Tenemos un gran producto/servicio, pero nuestra presencia digital es débil. Somos prácticamente invisibles para la IA y nuevos mercados.",
  de: "Wir haben ein großartiges Produkt/eine Dienstleistung, aber unser digitaler Fußabdruck ist schwach. Für KI und neue Märkte sind wir praktisch unsichtbar.",
  pt: "Temos um ótimo produto/serviço, mas nossa presença digital é fraca. Somos praticamente invisíveis para IA e novos mercados.",
},

foundationIncluded: {
  en: "Better Business Blueprint™, Website optimized for AI and GEO, basic CRM setup, and lead capture ecosystem.",
  es: "Better Business Blueprint™, sitio web optimizado para IA y GEO, configuración básica de CRM y ecosistema de captación de leads.",
  de: "Better Business Blueprint™, für KI und GEO optimierte Website, grundlegende CRM-Einrichtung und Lead-Erfassungssystem.",
  pt: "Better Business Blueprint™, site otimizado para IA e GEO, configuração básica de CRM e ecossistema de captura de leads.",
},

foundationInvestment: {
  en: "Starting at $1,500 / month",
  es: "Desde $1,500 / mes",
  de: "Ab $1.500 / Monat",
  pt: "A partir de $1.500 / mês",
},

foundationScholarship: {
  en: "Up to 50% co-investment (bringing it down to ~$750–$1,250/month).",
  es: "Hasta 50% de co-inversión (reduciéndolo a ~$750–$1,250/mes).",
  de: "Bis zu 50% Co-Investition (reduziert auf ca. ~$750–$1.250/Monat).",
  pt: "Até 50% de co-investimento (reduzindo para ~$750–$1.250/mês).",
},

relevanceTitle: {
  en: "Digital Relevance",
  es: "Relevancia Digital",
  de: "Digitale Relevanz",
  pt: "Relevância Digital",
},

relevanceSubtitle: {
  en: "The Growth & Human Engine",
  es: "El Motor de Crecimiento y lo Humano",
  de: "Die Wachstums- und Human-Engine",
  pt: "O Motor de Crescimento e Humano",
},

relevancePain: {
  en: "We have traction and revenue, but we are stuck competing for clicks. We need to dominate the narrative and generate absolute authority.",
  es: "Tenemos tracción e ingresos, pero estamos atrapados compitiendo por clics. Necesitamos dominar la narrativa y generar autoridad absoluta.",
  de: "Wir haben Traktion und Umsatz, aber wir konkurrieren nur um Klicks. Wir müssen die Narrative dominieren und absolute Autorität aufbauen.",
  pt: "Temos tração e receita, mas estamos presos competindo por cliques. Precisamos dominar a narrativa e gerar autoridade absoluta.",
},

relevanceIncluded: {
  en: "Ecosystem maintenance, marketing automations, real-world experience design for UGC (Proof of Humanity), and continuous Business Development (B2B positioning and Project Management).",
  es: "Mantenimiento del ecosistema, automatizaciones de marketing, diseño de experiencias reales para UGC (Proof of Humanity) y desarrollo de negocio continuo (posicionamiento B2B y gestión de proyectos).",
  de: "Ökosystem-Wartung, Marketing-Automatisierung, reale Erfahrungsgestaltung für UGC (Proof of Humanity) und kontinuierliche Geschäftsentwicklung (B2B-Positionierung und Projektmanagement).",
  pt: "Manutenção do ecossistema, automações de marketing, design de experiências reais para UGC (Proof of Humanity) e desenvolvimento contínuo de negócios (posicionamento B2B e gestão de projetos).",
},

relevanceInvestment: {
  en: "Starting at $3,500 / month",
  es: "Desde $3,500 / mes",
  de: "Ab $3.500 / Monat",
  pt: "A partir de $3.500 / mês",
},

relevanceScholarship: {
  en: "Up to 50% co-investment (bringing it down to ~$1,750–$2,750/month).",
  es: "Hasta 50% de co-inversión (reduciéndolo a ~$1,750–$2,750/mes).",
  de: "Bis zu 50% Co-Investition (reduziert auf ca. ~$1.750–$2.750/Monat).",
  pt: "Até 50% de co-investimento (reduzindo para ~$1.750–$2.750/mês).",
},

dominanceTitle: {
  en: "Digital Dominance",
  es: "Dominio Digital",
  de: "Digitale Dominanz",
  pt: "Domínio Digital",
},

dominanceSubtitle: {
  en: "Scale & Custom AI Architecture",
  es: "Escala y Arquitectura de IA Personalizada",
  de: "Skalierung & maßgeschneiderte KI-Architektur",
  pt: "Escala e Arquitetura de IA Personalizada",
},

dominancePain: {
  en: "We have the size and the market, but our internal operations are breaking. We need custom tech and AI infrastructure to scale without friction.",
  es: "Tenemos tamaño y mercado, pero nuestras operaciones internas están fallando. Necesitamos infraestructura de IA y tecnología personalizada para escalar sin fricción.",
  de: "Wir haben Größe und Markt, aber unsere internen Abläufe brechen zusammen. Wir brauchen maßgeschneiderte KI- und Technologie-Infrastruktur für reibungsloses Skalieren.",
  pt: "Temos escala e mercado, mas nossas operações internas estão quebrando. Precisamos de infraestrutura de IA e tecnologia personalizada para escalar sem atrito.",
},

dominanceIncluded: {
  en: "Custom Software, MVP Systems, internal Autonomous AI Agents, infrastructure for real-time global operations, and corporate Business Development (Matchmaking, Investor Readiness).",
  es: "Software personalizado, sistemas MVP, agentes autónomos de IA internos, infraestructura para operaciones globales en tiempo real y desarrollo de negocio corporativo (conexión con inversores y preparación para inversión).",
  de: "Individuelle Software, MVP-Systeme, interne autonome KI-Agenten, Infrastruktur für globale Echtzeit-Operationen und Unternehmensentwicklung (Investor-Readiness und Matchmaking).",
  pt: "Software personalizado, sistemas MVP, agentes autônomos de IA internos, infraestrutura para operações globais em tempo real e desenvolvimento de negócios corporativo (matchmaking e prontidão para investidores).",
},

dominanceInvestment: {
  en: "Starting at $10,000+ / month",
  es: "Desde $10,000+ / mes",
  de: "Ab $10.000+ / Monat",
  pt: "A partir de $10.000+ / mês",
},

dominanceScholarship: {
  en: "Tailor-made (Custom-structured, strictly for Enterprise-level operations or Whales).",
  es: "A medida (estructurado a medida, exclusivamente para operaciones enterprise o grandes clientes).",
  de: "Maßgeschneidert (nur für Enterprise-Level-Operationen oder Großkunden).",
  pt: "Sob medida (estruturado exclusivamente para operações enterprise ou grandes clientes).",
},

painPoint: {
  en: "Pain Point",
  es: "Problema",
  de: "Problem",
  pt: "Problema",
},

included: {
  en: "What's Included",
  es: "Qué incluye",
  de: "Enthalten",
  pt: "O que está incluído",
},

investment: {
  en: "Global Investment",
  es: "Inversión Global",
  de: "Globale Investition",
  pt: "Investimento Global",
},

scholarship: {
  en: "Underdog Scholarship",
  es: "Beca Underdog",
  de: "Underdog-Stipendium",
  pt: "Bolsa Underdog",
},
  // Compartido entre ambos modales
  assessTitle: {
    en: "Assess My Digital Identity",
    es: "Evaluar Mi Identidad Digital",
    de: "Meine digitale Identität bewerten",
    pt: "Avaliar Minha Identidade Digital",
  },
  assessment15min: { en: "15 min - Free Call", es: "15 min - Llamada gratuita", de: "15 Min - Kostenloser Anruf", pt: "15 min - Chamada gratuita" },
  assessment1h: { en: "1 Hour - $50", es: "1 Hora - $50", de: "1 Stunde - $50", pt: "1 Hora - $50" },
  bookAssessment: { en: "Book Assessment", es: "Reservar evaluación", de: "Bewertung buchen", pt: "Agendar avaliação" },
  goBackModal: { en: "Go Back", es: "Volver", de: "Zurück", pt: "Voltar" },
  // En tu objeto de traducciones
  lets: { en: "Let's ", es: "Empecemos ", de: "Lass uns ", pt: "Vamos " },
  startToday: { en: "Start Today", es: "hoy mismo", de: "heute beginnen", pt: "começar hoje" },

  dream: { en: "Just the way you dream. Only ", es: "Tal como lo soñaste. Solo que ", de: "Genau wie du es dir erträumst. Nur ", pt: "Exatamente como você sonhou. Só que " },
  better: { en: "Better.", es: "mejor.", de: "besser.", pt: "melhor." },

} as const;

// ─── ICONS ───────────────────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path d="M7 9H5v10h2V9zm-1-1.5A1.25 1.25 0 1 0 6 5a1.25 1.25 0 0 0 0 2.5zM19 13.2c0-2.3-1.1-4.2-3.3-4.2a3.2 3.2 0 0 0-2.7 1.4V9H11v10h2v-5.4c0-1.4.7-2.3 1.9-2.3 1.1 0 1.6.8 1.6 2.2V19h2v-5.8z" fill="#fff" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="5%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-gradient)" />
    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
  </svg>
);

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ member }: { member: { name: string; role: string; linkedin: string; photo: string; initials: string; desc?: string } }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-blue-50 flex items-center justify-center">
      {!imgError ? (
        <Image src={member.photo} alt={member.name} fill sizes="64px" className="object-cover" onError={() => setImgError(true)} />
      ) : (
        <span className="text-blue-600 font-black text-lg">{member.initials}</span>
      )}
    </div>
  );
};

// ─── NEWS SECTION ────────────────────────────────────────────────────────────
const NewsSection = () => {
  const locale = useLocale() as Locale;
  const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => console.log("Video waiting for interaction"));
    }
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      const fetchExternal = async () => {
        try {
          const response = await fetch('/api/news');
          if (!response.ok) {
            console.warn('Servicio de noticias externas no disponible.');
            return null;
          }
          return await response.json();
        } catch (err) {
          console.error('Error fetchExternal:', err);
          return null;
        }
      };
      const fetchLocal = async () => {
        try {
          const response = await fetch('/api/local-news');
          if (!response.ok) {
            console.warn('Servicio de noticias locales no disponible.');
            return null;
          }
          return await response.json();
        } catch (err) {
          console.error('Error fetchLocal:', err);
          return null;
        }
      };
      try {
        const [externalData, localData] = await Promise.all([fetchExternal(), fetchLocal()]);
        const externalArticles = externalData?.articles ?? null;
        const localArticles = localData?.news ?? null;

        if (externalArticles?.length) {
          setArticles(externalArticles);
          setCurrentIndex(0);
        } else if (localArticles?.length) {
          setArticles(localArticles);
          setCurrentIndex(0);
        } else {
          const externalError = externalData?.error || null;
          const localError = localData?.error || null;
          setNewsError(externalError || localError || tx('newsError'));
          setArticles([]);
        }
      } catch (err) {
        console.error('Error general en fetchNews:', err);
        setNewsError(tx('newsError'));
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [locale]);

  const goToPrevious = () => setCurrentIndex((p) => (p === 0 ? articles.length - 1 : p - 1));
  const goToNext = () => setCurrentIndex((p) => (p === articles.length - 1 ? 0 : p + 1));

  if (loading) return (
    <div className="py-20 text-center text-slate-400 uppercase tracking-widest text-[10px] font-bold">
      {tx('loadingFeed')}
    </div>
  );

  if (articles.length === 0) {
    return (
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-500 uppercase tracking-[0.25em] text-[10px] font-black mb-2">{tx('globalFeed')}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{tx('newsUnavailable')}</h3>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">{newsError || tx('newsError')}</p>
        </div>
      </section>
    );
  }

  const currentArticle = articles[currentIndex];
  const dateLang = locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : locale === 'pt' ? 'pt-BR' : 'en-US';

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
          <div className="hidden md:block w-48"></div>
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mt-8 inline-flex flex-col items-center"></div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mt-6 mb-4 block italic">{tx('globalFeed')}</span>

          </div>
          <div className="text-center md:text-right md:w-48">
            <p className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">{tx('liveUpdates')}</p>
            <div className="flex gap-2 justify-center md:justify-end mt-2 items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-900 uppercase">{tx('systemActive')}</span>
            </div>
          </div>
        </div>
        <div className="w-full relative z-20">
          <motion.a key={currentIndex} href={currentArticle.url} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="group border border-slate-100 rounded-3xl overflow-hidden hover:border-blue-600/30 hover:shadow-2xl transition-all duration-500 bg-white flex flex-col md:flex-row">
            <div className="relative h-64 md:h-80 md:w-1/2 overflow-hidden bg-slate-100">
              {currentArticle.urlToImage ? (
                <img src={currentArticle.urlToImage} alt={currentArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{tx('noPreview')}</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{currentArticle.source.name}</span>
              </div>
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{currentArticle.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">{currentArticle.description || tx('clickRead')}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <span className="text-[10px] font-bold uppercase text-slate-400">{new Date(currentArticle.publishedAt).toLocaleDateString(dateLang, { month: 'short', day: 'numeric' })}</span>
                <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">{tx('read')}</span>
              </div>
            </div>
          </motion.a>
          <div className="flex justify-center items-center gap-4 mt-8">
            <button onClick={goToPrevious} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label={tx('prevArticle') as string}>
              <span className="text-slate-500 font-black">←</span>
            </button>
            <button onClick={goToNext} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label={tx('nextArticle') as string}>
              <span className="text-slate-500 font-black">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// CHAT SECTION 
const ChatSection = () => {
  const locale = useLocale() as Locale;
  const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

  const [showYesModal, setShowYesModal] = useState(false);
  const [showNoModal, setShowNoModal] = useState(false);

  const [assessmentType, setAssessmentType] = useState("15 min - Free Call");
  const [step, setStep] = useState<number>(1);
  const [selection, setSelection] = useState<string>("");
  const options = (ui.chatOptions as any)[locale] ?? ui.chatOptions.en;

  const handleWhatsApp = (option: string) => {
    const phoneNumber = "593991358652";
    const msgFn = (ui.whatsappMsg as any)[locale] ?? ui.whatsappMsg.en;
    const message = encodeURIComponent(msgFn(option));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };
  const getCalendlyUrl = () => {
    return assessmentType === "15 min - Free Call"
      ? "https://calendar.app.google/Ntnv2PvHmPNgCnKZ6"
      : "https://calendar.app.google/74Sc4peRwuJ3eJ8W7";
  };
  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">

        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 uppercase tracking-tighter">
          {tx('kitchenTitle')} <span className="text-blue-600">{tx('kitchenTitle2')}</span>
        </h2>
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">{tx('century20')}</p>

        <div className="relative bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 transition-all hover:border-blue-600/30 text-center">

          {step === 1 ? (
            <>
              <p className="text-xl text-slate-600 mb-6 font-light">
                {tx('howCanHelp')}{" "}
                <span className="text-slate-900 font-semibold underline decoration-blue-600 underline-offset-4">
                  {tx('theTeam')}
                </span>
                {tx('helpToday')}
              </p>

              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={() => setShowYesModal(true)}
                  className="px-8 py-3 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-black uppercase tracking-widest text-[10px]"
                >
                  {tx('yesBtn')}
                </button>

                <button
                  onClick={() => setShowNoModal(true)}
                  className="px-8 py-3 rounded-full border-2 border-slate-200 bg-white text-slate-700 font-black uppercase tracking-widest text-[10px]"
                >
                  {tx('noBtn')}
                </button>
              </div>


            </>
          ) : (

            <div className="py-4 text-left">
              <div className="mb-6">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{tx('indAccel')}</h3>
                <p className="text-blue-600 text-xs font-bold tracking-widest uppercase mb-3">(Nearshoring + Smart Maquila)</p>
                <p className="text-slate-500 text-sm leading-relaxed border-l-2 border-blue-600 pl-4">{tx('relocate')}</p>
              </div>
              <div className="mb-8 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tx('whatWeSell')}</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li className="flex items-start gap-2"><span>●</span>{tx('opSetup')}</li>
                  <li className="flex items-start gap-2"><span>●</span>{tx('supplierNet')}</li>
                  <li className="flex items-start gap-2 text-blue-600 font-bold"><span>●</span>{tx('costOpt')}</li>
                  <li className="flex items-start gap-2"><span>●</span>{tx('localMgmt')}</li>
                </ul>
              </div>
              <button onClick={() => handleWhatsApp(selection)} className="w-full bg-blue-600 text-white py-4 rounded-full font-black text-sm hover:bg-blue-700 transition-all uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">{tx('connectTeam')}</button>
              <button onClick={() => setStep(1)} className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors">{tx('goBack')}</button>

            </div>
          )}
        </div>
      </div>



      <AnimatePresence>
        {showYesModal && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowYesModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-xl w-full"
            >
              <h3 className="text-3xl font-black text-slate-900 mb-4">
                <span className="text-orange-500 font-black">{tx('perfect')}</span>
                {tx('yesModalTitlePart1')}
                {tx('yesModalTitlePart2')}
              </h3>

              <p className="text-slate-600 mb-8">
                {tx('yesModalDesc')}
              </p>

              <h4 className="font-black uppercase tracking-widest text-sm mb-4">
                {tx('assessTitle')}
              </h4>

              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={() => setAssessmentType("15 min - Free Call")}
                  className={`rounded-full border-2 px-6 py-3 font-black uppercase text-xs ${assessmentType === "15 min - Free Call"
                    ? "border-blue-600 text-blue-600"
                    : "border-slate-200"
                    }`}
                >
                  {tx('assessment15min')}
                </button>

                <button
                  onClick={() => setAssessmentType("1 Hour - $50")}
                  className={`rounded-full border-2 px-6 py-3 font-black uppercase text-xs ${assessmentType === "1 Hour - $50"
                    ? "border-blue-600 text-blue-600"
                    : "border-slate-200"
                    }`}
                >
                  {tx('assessment1h')}
                </button>
              </div>

              <a
                href={getCalendlyUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center bg-blue-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs"
              >
                {tx('bookAssessment')}
              </a>
              <button
                onClick={() => setShowYesModal(false)}
                className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors"
              >
                {tx('goBackModal')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNoModal && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNoModal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-xl w-full"
            >
              <h3 className="text-3xl font-black text-slate-900 mb-4">
                {tx('noModalTitlePart1')}
                <span className="text-orange-500 font-black">{tx('change')}</span>
                {tx('noModalTitlePart2')}
              </h3>

              <p className="text-slate-600 mb-8">
                {tx('noModalDesc')}
              </p>

              <h4 className="font-black uppercase tracking-widest text-sm mb-4">
                {tx('assessTitle')}
              </h4>

              <div className="flex flex-col gap-3 mb-8">
                <button
                  onClick={() => setAssessmentType("15 min - Free Call")}
                  className={`rounded-full border-2 px-6 py-3 font-black uppercase text-xs ${assessmentType === "15 min - Free Call"
                    ? "border-blue-600 text-blue-600"
                    : "border-slate-200"
                    }`}
                >
                  {tx('assessment15min')}
                </button>

                <button
                  onClick={() => setAssessmentType("1 Hour - $50")}
                  className={`rounded-full border-2 px-6 py-3 font-black uppercase text-xs ${assessmentType === "1 Hour - $50"
                    ? "border-blue-600 text-blue-600"
                    : "border-slate-200"
                    }`}
                >
                  {tx('assessment1h')}
                </button>
              </div>

              <a
                href={getCalendlyUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center bg-blue-600 text-white py-4 rounded-full font-black uppercase tracking-widest text-xs"
              >
                {tx('bookAssessment')}
              </a>

              <button
                onClick={() => setShowNoModal(false)}
                className="block mx-auto mt-6 text-slate-400 hover:text-blue-600 text-[10px] uppercase font-black tracking-widest transition-colors"
              >
                {tx('goBackModal')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>

  );

};


//  CASOS DE ÉXITO 
const CasosDeExito = ({ showMachinesModal, setShowMachinesModal }: { showMachinesModal: boolean; setShowMachinesModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const locale = useLocale() as Locale;
  const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

  const screenshotsMap = { en: belandScreenshots, es: belandScreenshotsEs, de: belandScreenshotsDe, pt: belandScreenshotsPt };
  const screenshots = screenshotsMap[locale] ?? belandScreenshots;

  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => { setCurrentSlide((prev) => (prev + 1) % screenshots.length); }, 4000);
    return () => clearInterval(timer);
  }, [screenshots.length]);

  const goToPrevious = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length); };
  const goToNext = (e?: React.MouseEvent) => { e?.stopPropagation(); setCurrentSlide((prev) => (prev + 1) % screenshots.length); };
  const handleTouchStart = (e: React.TouchEvent) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => (touchCurrentX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX.current == null || touchCurrentX.current == null) return;
    const delta = touchStartX.current - touchCurrentX.current;
    if (delta > 50) goToNext(); else if (delta < -50) goToPrevious();
    touchStartX.current = null; touchCurrentX.current = null;
  };

  return (
    <section className="py-16 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">{tx('successStories')}</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase">
            {tx('builtByUs')} <em className="italic underline decoration-blue-100">{tx('usedByPeople')}</em>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] cursor-grab active:cursor-grabbing" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              <div className="relative aspect-[9/19] w-full overflow-hidden rounded-[2.5rem] border-[6px] border-white bg-white shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-white rounded-b-xl z-20" />
                {screenshots.map((screenshot, index) => (
                  <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <Image src={screenshot.src} alt={screenshot.alt} fill className="object-contain" priority={index === 0} sizes="300px" />
                  </div>
                ))}
              </div>
              <button onClick={goToPrevious} className="absolute -left-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:border-blue-600 transition-colors z-30"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
              <button onClick={goToNext} className="absolute -right-5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:border-blue-600 transition-colors z-30"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
              <div className="flex justify-center gap-1.5 mt-5">
                {screenshots.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} className={`rounded-full transition-all duration-300 ${i === currentSlide ? "w-5 h-1.5 bg-blue-600" : "w-1.5 h-1.5 bg-slate-300"}`} />))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="inline-flex flex-col items-start">
              <div style={{ width: '200px', height: '50px' }} className="relative -ml-4">
                <Image src="/beland.titulo.png" alt="Beland Logo" fill className="object-contain object-left" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
            </div>
            <div key={currentSlide} className="border-l-4 border-blue-600 pl-4 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">{screenshots[currentSlide].title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{screenshots[currentSlide].text}</p>
            </div>
            <p className="text-slate-700 text-base leading-relaxed font-medium">
              {tx('circularEco')} <span className="text-slate-900 font-black">{tx('circularEco2')}</span> {tx('circularEco3')} <span className="text-blue-600 font-bold">{tx('positiveAction')}</span> {tx('strengthens')}
            </p>
            <div className="flex flex-wrap gap-2">
              {belandTags.map((tag) => (<span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-slate-200 text-slate-500 bg-slate-50">{tag}</span>))}
            </div>
            <div className="flex flex-col gap-3 self-start w-full sm:w-auto mt-4">
              <a
                href="https://beland.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-[0.15em] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
              >
                {tx('viewApp')}
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://beland.land"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                Landing
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setShowMachinesModal(true)}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto border border-slate-300 text-slate-700 px-6 py-3 rounded-full font-black text-[10px] sm:text-[11px] uppercase tracking-[0.15em] hover:border-blue-600 hover:text-blue-600 transition-colors"
              >
                {tx('viewMachines')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
//  MAIN HOME
export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;
  const tx = (key: string) => (ui[key as keyof typeof ui] as any)?.[locale] ?? (ui[key as keyof typeof ui] as any)?.['en'] ?? '';

  const [posts, setPosts] = useState<any[]>([]);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<number | null>(1);
  const [showMachinesModal, setShowMachinesModal] = useState(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const teamMap = { en: team, es: teamEs, de: teamDe, pt: teamPt };
  const teamData = teamMap[locale] ?? team;
  const localeBase = locale === 'en' ? '' : `/${locale}`;

  // Fetch posts con traducción multi-idioma
  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(3);

      if (data) {
        if (locale !== 'en' && data.length > 0) {
          try {
            const response = await fetch('/api/translate-posts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ posts: data, targetLocale: locale, full: false }),
            });
            if (response.ok) {
              const translated = await response.json();
              setPosts(translated);
              return;
            }
          } catch {

          }
        }
        setPosts(data);
      }
    };
    fetchPosts();
  }, [locale]);

  // ── Hero video ────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.loop = true;

    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay bloqueado en iOS
      });
    };

    tryPlay();
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("canplaythrough", tryPlay);

    const handleInteraction = () => {
      tryPlay();
    };

    document.addEventListener("touchstart", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });
    document.addEventListener("click", handleInteraction, { once: true });

    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("canplaythrough", tryPlay);
      document.removeEventListener("touchstart", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
      document.removeEventListener("click", handleInteraction);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dateLang = locale === 'es' ? 'es-ES' : locale === 'de' ? 'de-DE' : locale === 'pt' ? 'pt-BR' : 'en-US';

  return (

    <main className="relative w-full bg-white">

      {/* SHARED HEADER */}
      <Header />

      {/* 1. HERO */}
      <section className="relative w-full h-[100dvh] overflow-hidden" id="top">
        <video
          ref={heroVideoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/10 z-[1]" />
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center px-6 text-center">
          <p className="text-blue-600 uppercase tracking-[0.4em] mb-3 text-[10px] font-black">
            {t('whatWeDo')}
          </p>
          <h1 className="text-3xl md:text-8xl font-black leading-[1] tracking-tighter max-w-4xl text-white uppercase">
            {tx('openLatam')} <br /> {tx('globalCompanies')}
          </h1>
          <p className="mt-3 text-white text-[9px] md:text-[10px] uppercase tracking-widest font-bold">{tx('subtagline')}</p>
          <a href="https://wa.me/593991358652?text=Hi!%20I%27d%20like%20to%20get%20in%20touch%20with%20the%20team." className="mt-3 inline-block px-8 py-3 bg-[#FF6B00] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-[10px] transition-transform active:scale-95">
            {tx('getInTouch')}
          </a>
        </div>
      </section>



      {/* 3. CHAT */}
      <ChatSection />



      {/* 4. MITTELSTAND */}
      <section id="mittelstand" className="py-12 md:py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          {/* COLUMNA IZQUIERDA (antes derecha) */}
          <div>
            {/*  "WHATS NEXT?" */}
            <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 block mb-3">
              {ui.ourCustomers[locale]}
            </span>

            {/* "Grow by Design" */}
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight tracking-tighter uppercase">
              {ui.midSized1[locale]}
            </h2>

            {/* 3. descripción  */}
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10 text-balance">
              {ui.midSized2[locale]}
            </p>

            {/* BOTÓN THE PACK */}
            <button
              onClick={() => setIsPackModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              {ui.packButtonLabel[locale]}
            </button>
          </div>

          {/* COLUMNA DERECHA (antes izquierda) */}
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <p className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-3">
              {tx('problemTitle')}
            </p>
            <h3 className="text-3xl font-bold text-blue-600 mb-6 leading-tight">
              {tx('problemSubtitle')}
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">
              {tx('problemDesc')}
            </p>
            {/* PRECIO */}
            <p className="text-sm font-bold text-blue-600 mb-4">
              {tx('engineeringPrice')}
            </p>
            {/* BOTÓN THE TERMS */}
            <button
              onClick={() => setIsTermsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors"
            >
              {ui.termsButtonLabel[locale]}
            </button>
          </div>

        </div>

        {/* MODAL THE PACK */}
        {isPackModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setIsPackModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-10 md:p-12 relative max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPackModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors text-2xl leading-none"
                aria-label={ui.closeButton[locale]}
              >
                ×
              </button>

              <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">
                {ui.packModalTitle[locale]}
              </h3>

              <p className="text-blue-600 font-bold text-lg italic mb-6">
                "{ui.packModalQuote[locale]}"
              </p>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {ui.packModalBody[locale]}
              </p>

              <button
                onClick={() => setIsPackModalOpen(false)}
                className="bg-slate-900 text-white font-bold px-8 py-3 rounded-full hover:bg-slate-800 transition-colors"
              >
                {ui.closeButton[locale]}
              </button>
            </div>
          </div>
        )}

        {/* MODAL THE TERMS */}
        {isTermsModalOpen && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setIsTermsModalOpen(false)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full p-10 md:p-12 relative max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsTermsModalOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors text-2xl leading-none"
                aria-label={ui.closeButton[locale]}
              >
                ×
              </button>

              <h3 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">
                {ui.termsModalTitle[locale]}
              </h3>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {ui.termsModalBody[locale]}
              </p>


              <a href="https://calendar.app.google/Ntnv2PvHmPNgCnKZ6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center bg-slate-900 text-white font-bold px-8 py-4 rounded-full hover:bg-slate-800 transition-colors text-center"
              >
                {ui.termsModalCta[locale]}
              </a>
            </div>
          </div>
        )}
      </section>

      <BetterEcosystemSection locale={locale} />

      <div className="py-10 border-t border-slate-100 text-center">
        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-10">
  {tx('followJourney')}{" "}
  <span className="text-blue-600">
    {tx('journey')}
  </span>
</h3>
        <div className="flex justify-center gap-6">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better_technologies?igsh=MWUwYmkyYXVhdWRucA==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
      </div>

      <LeadershipLeagues tx={tx} />

      <div className="py-16 px-6 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-2">
            {tx('lets')}
            <span className="text-blue-600">{tx('startToday')}</span>
          </h2>
          <p className="text-slate-500 font-medium italic text-lg md:text-xl tracking-tight">
            {tx('dream')}
            <span className="text-orange-500 font-black">{tx('better')}</span>
          </p>
        </div>
      </div>
      {/* 6. EQUIPO */}
      <section id="about" className="py-16 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">


          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">{tx('aboutTeam')}</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6">
            {tx('highPerf')}{" "}
            <em className="italic underline decoration-blue-100">
              {tx('highPerfEm')}
            </em>{" "}
            <span className="text-blue-600">{tx('forged')}</span>{" "}
            {tx('pressure')}
          </h2>
          <div className="border-l-[3px] border-blue-600 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-8">
            <p className="text-slate-900 font-black italic text-sm leading-relaxed tracking-tight">
              {tx('aboutTeamCopy')}
            </p>
          </div>
          <AnimatePresence mode="wait">
            {selected !== null && (
              <motion.div key={selected} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center gap-5 border border-slate-100 rounded-3xl p-5 mb-6 hover:border-blue-600/30 transition-colors">
                <Avatar member={teamData[selected]} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-slate-900 font-black uppercase tracking-tight text-sm">{teamData[selected].name}</p>
                      <p className="text-blue-600 font-black uppercase tracking-[0.15em] text-[10px] mt-0.5 mb-2">{teamData[selected].role}</p>
                    </div>
                    <a href={teamData[selected].linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-600 hover:bg-blue-50 transition-all flex-shrink-0">
                      <LinkedInIcon /><span className="text-[9px] font-black uppercase tracking-widest text-slate-500">LinkedIn</span>
                    </a>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{teamData[selected].desc}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex flex-wrap gap-2">
            {teamData.map((member, i) => (
              <button key={i} type="button" onClick={() => setSelected(selected === i ? null : i)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selected === i ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-white border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"}`}>
                {member.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CASOS DE ÉXITO — BELAND */}
      <CasosDeExito showMachinesModal={showMachinesModal} setShowMachinesModal={setShowMachinesModal} />

      {/* CIERRE */}
<section className="py-20 px-6 bg-white">
  <div className="max-w-6xl mx-auto text-center">

    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6">
      <span className="block">
        {tx('closingLine')}{" "}
        <span className="text-blue-600">
          {tx('closingLineEm')}
        </span>
      </span>
    </h2>

    <div className="w-24 h-1 rounded-full bg-gradient-to-r from-blue-600 to-orange-400 mx-auto mb-10"></div>

    <div className="max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-orange-50 p-8 md:p-14 shadow-xl">

        {/* Ambient light */}
        <div className="absolute -top-28 -right-28 w-72 h-72 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 w-72 h-72 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative">


          <p className="text-slate-600 text-base md:text-lg leading-8 max-w-4xl mx-auto">
            {tx('closingCopy')}
          </p>

        </div>

      </div>
    </div>

  </div>
</section>
      {/*  NEWS FEED */}
      <NewsSection />
      <GlobalAccessMechanism tx={tx} />
      <GrowthCapabilities tx={tx} />
      
      {/* LATEST INSIGHTS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-4">{tx('stayUpdated')}</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase">{tx('latestInsights')}</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-10">{tx('blogDesc')}</p>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
              {posts.map((post) => (
                <div key={post.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className="relative h-40 mb-4 rounded-xl overflow-hidden bg-slate-100">
                    {post.cover_url
                      ? (<img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />)
                      : (<div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">{tx('noImage')}</div>)
                    }
                  </div>
                  <h3 className="font-black text-lg mb-3 uppercase text-slate-900 line-clamp-2">{post.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                    {(() => {
                      const raw = post.description?.replace(/<[^>]*>?/gm, '') || tx('noDesc') as string;
                      if (typeof window === 'undefined') return raw;
                      const txt = document.createElement('textarea');
                      txt.innerHTML = raw;
                      return txt.value;
                    })()}
                  </p>
                  <a href={`${localeBase}/blog/${post.slug}`} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">{tx('readMore')}</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center"><p className="text-slate-400 text-sm">{tx('noPostsYet')}</p></div>
          )}
          <a href={`${localeBase}/blog`} className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">
            {t('viewAllPosts')}
          </a>
        </div>
      </section>

<FinalChallenge tx={tx} />

      {/* FOOTER */}
      <footer className="py-16 text-center bg-white border-t border-slate-100">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">{tx('dontMiss')}</p>
        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-10">
  {tx('followJourney')}{" "}
  <span className="text-blue-600">
    {tx('journey')}
  </span>
</h3>
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better_technologies?igsh=MWUwYmkyYXVhdWRucA==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2026 Better Technologies.</p>
      </footer>


      {showMachinesModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-start pt-20 md:pt-32 p-4 overflow-y-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-lg h-auto overflow-visible">

            {/* cerrar */}
            <button
              onClick={() => setShowMachinesModal(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-30 w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 text-lg md:text-xl font-bold hover:bg-slate-50 transition-colors"
            >
              ✕
            </button>

            {/* contenido */}
            <div className="px-6 pt-12 pb-8 sm:pt-8 md:px-10 md:pt-10">
              <p className="text-[#7A9B3C] uppercase tracking-[0.25em] text-[10px] md:text-xs font-black mb-3">
                {tx('belandTitle')}
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-none uppercase mb-6 md:mb-8">
                <span className="text-black">{tx('belandHeading1')}</span>
                <br />
                <span className="text-orange-500 italic">{tx('belandHeading2')}</span>
                <br />
                <span className="text-lime-600 italic">{tx('belandHeading3')}</span>
              </h2>

              <p className="text-slate-600 text-sm md:text-base leading-7 md:leading-8 mb-8 md:mb-10">
                {tx('belandDesc')}
              </p>

              <div className="relative w-full h-[180px] sm:h-[220px] md:h-[280px] mb-8 md:mb-10">
                <Image
                  src="/maquina-beland.png"
                  alt="Beland machine"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="space-y-4 md:space-y-5 text-xs sm:text-sm md:text-base font-semibold text-slate-800 mb-8 md:mb-10">
                <p>♻️ {tx('belandFeature1')}</p>
                <p>📸 {tx('belandFeature2')}</p>
                <p>💰 {tx('belandFeature3')}</p>
                <p>📊 {tx('belandFeature4')}</p>
              </div>

              <a
                href="https://wa.me/593991358652?text=Hi!%20I%20would%20like%20to%20quote%20a%20recycling%20machine%20for%20my%20business."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center items-center bg-[#7A9B3C] text-white py-3 sm:py-4 md:py-5 rounded-2xl font-black text-xs sm:text-sm md:text-base uppercase tracking-widest hover:bg-[#6b8a2f] transition-colors"
              >
                {tx('belandQuote')}
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};





