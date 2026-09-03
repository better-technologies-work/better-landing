"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client'
import { type VideoSource } from '@/lib/video-utils'
import VideoPlayer from '@/components/VideoPlayer'
import ArticleCard from '@/components/ArticleCard'
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import BetterEcosystemSection from "@/components/BetterEcosystemSection";
import { useLocale, useTranslations } from 'next-intl';
import FinalChallenge from '@/components/FinalChallenge'
import GlobalAccessMechanism from "@/components/GlobalAccessMechanism";
import GrowthCapabilities from "@/components/GrowthCapabilities";
import ScholarshipsPartnerships from "@/components/Scholarshipspartnerships";
import LeadershipLeagues from "@/components/LeadershipLeagues"


// ─── TYPES ───────────────────────────────────────────────────────────────────
export type Locale = 'en' | 'es' | 'de' | 'pt';

// ─── TEAM DATA ───────────────────────────────────────────────────────────────
const team = [
  {
    name: "Diego Vargas",
    role: "Founder & Chief Product Engineer ",
    desc: "Diego founded Better Technologies on a simple conviction: real innovation does not need a massive budget — it needs relentless execution. He leads business and product development, turning problems into solutions: Quantos, Hacks and systems you can own.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Co-Founder & Chief Digital Relevance Officer ",
    desc: "Charlotte co-founded Better Technologies to turn bold ideas into market movements. She leads positioning and organic growth — making businesses visible to your target group, trusted by AI and remembered by the market. People forget ads: They remember experiences.",
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
    role: "Founder & Chief Product Engineer ",
    desc: "Diego founded Better Technologies on a simple conviction: real innovation does not need a massive budget — it needs relentless execution. He leads business and product development, turning problems into solutions: Quantos, Hacks and systems you can own.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Gotz",
    role: "Co-Founder & Chief Digital Relevance Officer ",
    desc: "Charlotte co-fundó Better Technologies para convertir ideas audaces en movimientos de mercado. Lidera el posicionamiento y el crecimiento orgánico — haciendo que los negocios sean visibles para su público objetivo, confiables para la IA y recordados por el mercado. La gente olvida los anuncios: recuerda las experiencias.",
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
    role: "Founder & Chief Product Engineer ",
    desc: "Diego founded Better Technologies on a simple conviction: real innovation does not need a massive budget — it needs relentless execution. He leads business and product development, turning problems into solutions: Quantos, Hacks and systems you can own.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Co-Founder & Chief Digital Relevance Officer ",
    desc: "Charlotte ist Mitgründerin von Better Technologies und verwandelt mutige Ideen in Marktbewegungen. Sie leitet die Positionierung und das organische Wachstum — und macht Unternehmen sichtbar für ihre Zielgruppe, vertrauenswürdig für KI und unvergesslich für den Markt. Menschen vergessen Werbung: Sie erinnern sich an Erlebnisse.",
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
    role: "Founder & Chief Product Engineer ",
    desc: "Diego founded Better Technologies on a simple conviction: real innovation does not need a massive budget — it needs relentless execution. He leads business and product development, turning problems into solutions: Quantos, Hacks and systems you can own.",
    initials: "DV",
    photo: "/diego.jpeg",
    linkedin: "https://www.linkedin.com/in/diegoe-vargas/",
  },
  {
    name: "Charlotte Götz",
    role: "Co-Founder & Chief Digital Relevance Officer ",
    desc: "Charlotte é cofundadora da Better Technologies e transforma ideias ousadas em movimentos de mercado. Ela lidera o posicionamento e o crescimento orgânico — tornando os negócios visíveis para o público-alvo, confiáveis para a IA e memoráveis para o mercado. As pessoas esquecem os anúncios: elas se lembram das experiências",
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
export const ui = {
  // Heroke 
  openLatam: {
    en: "Make your business visible. Stop renting the tools that run it. Own the capabilities to grow it.",
    es: "Haz visible tu negocio. Deja de alquilar las herramientas que lo hacen funcionar. Adquiere las capacidades para hacerlo crecer.",
    de: "Mach dein Unternehmen sichtbar. Hör auf, die Tools zu mieten, die es am Laufen halten. Baue die Fähigkeiten auf, die du für weiteres Wachstum brauchst.",
    pt: "Dê visibilidade ao seu negócio. Pare de alugar as ferramentas que o fazem funcionar. Desenvolva as capacidades necessárias para fazê-lo crescer.",
  },
  globalCompanies: {
    en: "Better Technologies engineers modular software capabilities you can own, combine and scale.",
    es: "Better Technologies desarrolla capacidades de software modulares que puedes adquirir, combinar y escalar.",
    de: "Better Technologies entwickelt modulare Softwarelösungen, die Sie besitzen, kombinieren und skalieren können.",
    pt: "A Better Technologies desenvolve capacidades de software modulares que você pode adquirir, combinar e escalar.",
  },
  subtagline: {
    en: "The market does not belong to those with the most tools. It belongs to those who own the system.",
    es: "El mercado no pertenece a quienes tienen más herramientas. Pertenece a quienes son dueños del sistema.",
    de: "Der Markt gehört nicht denen mit den meisten Tools. Er gehört denen, die das System besitzen.",
    pt: "O mercado não pertence a quem tem mais ferramentas. Ele pertence a quem possui o sistema.",
  },
  getInTouch: { en: "Get in touch", es: "Contactar ahora", de: "Kontakt aufnehmen", pt: "Entre em contato" },
  heroCtaPrimary: {
    en: "Build Your First Capability",
    es: "Construí tu primera capacidad",
    de: "Bauen Sie Ihre erste Fähigkeit auf",
    pt: "Construa sua primeira capacidade",
  },
  heroCtaSecondary: {
    en: "See How it Works",
    es: "Descubrí cómo funciona",
    de: "Sehen Sie, wie es funktioniert",
    pt: "Veja como funciona",
  },
  // News section
  titulonews: {
    en: "The Better Knowledge, Check the Changes",
    es: "El mejor conocimiento, comprueba los cambios",
    de: "Das bessere Wissen, überprüfe die Veränderungen",
    pt: "O melhor conhecimento, confira as mudanças",
  },
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
  published: { en: "Published", es: "Publicado", de: "Veröffentlicht", pt: "Publicado" },
  updated: { en: "Updated", es: "Actualizado", de: "Aktualisiert", pt: "Atualizado" },
  clickRead: { en: "Click to read the full coverage of this digital transformation update.", es: "Haz clic para leer la cobertura completa de esta actualizacion de transformacion digital.", de: "Klicke, um die vollständige Berichterstattung zu lesen.", pt: "Clique para ler a cobertura completa desta atualização de transformação digital." },
  read: { en: "Read →", es: "Leer →", de: "Lesen →", pt: "Ler →" },
  prevArticle: { en: "Previous article", es: "Articulo anterior", de: "Vorheriger Artikel", pt: "Artigo anterior" },
  nextArticle: { en: "Next article", es: "Siguiente articulo", de: "Nächster Artikel", pt: "Próximo artigo" },

  // Chat section
  kitchenTitle: {
    en: "Choose your needs, build a system,",
    es: "Elige tus necesidades, construye un sistema,",
    de: "Wähle deine Bedürfnisse, baue ein System,",
    pt: "Escolha suas necessidades, construa um sistema,"
  },
  kitchenTitle2: {
    en: "and keep the value you create.",
    es: "y conserva el valor que creas.",
    de: "und behalte den Wert, den du schaffst.",
    pt: "e mantenha o valor que você cria."
  },
  kitchenOpen: { en: "", es: "", de: "", pt: "" },
  century20: {
    en: "Build Your First Capability, See How It Works",
    es: "Construye tu primera capacidad, descubre cómo funciona",
    de: "Baue deine erste Fähigkeit auf und erfahre, wie sie funktioniert",
    pt: "Construa sua primeira capacidade e veja como ela funciona"
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

  problemTitle: { en: "THE UNFAIR ADVANTAGE", es: "LA VENTAJA INJUSTA", de: "DER UNFAIRE VORTEIL", pt: "A VANTAGEM INJUSTA" }, problemSubtitle: {
    en: "THE AI AWAKENING (The Wedge)",
    es: "EL DESPERTAR DE LA IA (La Cuña)",
    de: "DAS KI-ERWACHEN (Der Keil)",
    pt: "O DESPERTAR DA IA (A Cunha)"
  },
  problemDesc: {
    en: "Engineering and deployment of your first Website as an Operating System (Optimized for AI & Human Trust).",
    es: "Ingeniería y despliegue de tu primer Sitio Web como Sistema Operativo (Optimizado para Confianza de IA y Humanos).",
    de: "Entwicklung und Bereitstellung Ihrer ersten Website als Betriebssystem (Optimiert für KI- und menschliches Vertrauen).",
    pt: "Engenharia e implantação do seu primeiro Site como Sistema Operacional (Otimizado para Confiança de IA e Humanos)."
  },
  typicalTickets: { en: "Typical tickets:", es: "Tickets típicos:", de: "Typische Tickets:", pt: "Tickets típicos:" },
  ourCustomers: { en: "THE PROBLEM", es: "EL PROBLEMA", de: "DAS PROBLEM", pt: "O PROBLEMA" },
  problemHeadline: {
    en: "Your business is invisible?",
    es: "¿Tu negocio es invisible?",
    de: "Ist Ihr Unternehmen unsichtbar?",
    pt: "O seu negócio é invisível?",
  },
  problemIntro: {
    en: "The best tools and practices 2 years ago no longer work in today's markets. Why?",
    es: "Las mejores herramientas y prácticas de hace 2 años ya no funcionan en los mercados actuales. ¿Por qué?",
    de: "Die besten Tools und Praktiken von vor 2 Jahren funktionieren in den heutigen Märkten nicht mehr. Warum?",
    pt: "As melhores ferramentas e práticas de 2 anos atrás não funcionam mais nos mercados de hoje. Por quê?",
  },
  problemPoint1: {
    en: "If you rent your digital infrastructure you are captive to the standard.",
    es: "Si alquilás tu infraestructura digital, quedás cautivo del estándar.",
    de: "Wenn Sie Ihre digitale Infrastruktur mieten, sind Sie an den Standard gebunden.",
    pt: "Se você aluga sua infraestrutura digital, fica cativo do padrão.",
  },
  problemPoint2: {
    en: "If you want to lead your market you are stuck with the same tech everyone has, with the corporate times to update the littlest thing because it has to work for everyone, not just for you.",
    es: "Si querés liderar tu mercado, quedás atado a la misma tecnología que tiene todo el mundo, con los tiempos corporativos para actualizar hasta el detalle más pequeño, porque tiene que funcionar para todos, no solo para vos.",
    de: "Wenn Sie Ihren Markt anführen wollen, stecken Sie mit derselben Technologie fest, die jeder hat, mit den unternehmenstypischen Zeiten, um selbst die kleinste Kleinigkeit zu aktualisieren, weil es für alle funktionieren muss, nicht nur für Sie.",
    pt: "Se você quer liderar o seu mercado, fica preso à mesma tecnologia que todo mundo tem, com os prazos corporativos para atualizar até o menor detalhe, porque precisa funcionar para todos, não só para você.",
  },
  problemHighlight: {
    en: "Your clients are no longer searching for you. They are asking AI.",
    es: "Tus clientes ya no te buscan. Le preguntan a la IA.",
    de: "Ihre Kunden suchen nicht mehr nach Ihnen. Sie fragen die KI.",
    pt: "Seus clientes já não te procuram. Eles perguntam à IA.",
  },
  problemBody: {
    en: "You can have the best marketing strategy, pay tons of ads every month, but if your digital infrastructure is not optimized for AI, you're handing over your share of the market to your competitors.",
    es: "Podés tener la mejor estrategia de marketing y pagar toneladas de publicidad cada mes, pero si tu infraestructura digital no está optimizada para IA, le estás entregando tu porción de mercado a tus competidores.",
    de: "Sie können die beste Marketingstrategie haben und jeden Monat unzählige Anzeigen schalten – aber wenn Ihre digitale Infrastruktur nicht auf KI optimiert ist, überlassen Sie Ihren Marktanteil Ihren Wettbewerbern.",
    pt: "Você pode ter a melhor estratégia de marketing e pagar toneladas de anúncios todo mês, mas se sua infraestrutura digital não está otimizada para IA, você está entregando sua fatia de mercado aos concorrentes.",
  },
  problemSubscriptions: {
    en: "You scale your business. For that, you pay for tools. Every subscription solves a task.",
    es: "Escalás tu negocio. Para eso, pagás herramientas. Cada suscripción resuelve una tarea.",
    de: "Sie skalieren Ihr Unternehmen. Dafür bezahlen Sie für Tools. Jedes Abonnement löst eine Aufgabe.",
    pt: "Você escala o seu negócio. Para isso, paga por ferramentas. Cada assinatura resolve uma tarefa.",
  },
  problemTogether: {
    en: "Together, they often create more cost, more gaps and more dependency. Sounds familiar?",
    es: "Juntas, suelen generar más costo, más vacíos y más dependencia. ¿Te suena?",
    de: "Zusammen erzeugen sie oft mehr Kosten, mehr Lücken und mehr Abhängigkeit. Kommt Ihnen bekannt vor?",
    pt: "Juntas, costumam gerar mais custo, mais lacunas e mais dependência. Soa familiar?",
  },
  problemRentNet: {
    en: "You rent the net to catch your food.",
    es: "Alquilás la red para pescar tu comida.",
    de: "Sie mieten das Netz, um Ihre Nahrung zu fangen.",
    pt: "Você aluga a rede para pescar sua comida.",
  },
  problemInfra: {
    en: "Your business creates the process, the data and the value. The infrastructure still belongs to someone else.",
    es: "Tu negocio crea el proceso, los datos y el valor. La infraestructura sigue siendo de otro.",
    de: "Ihr Unternehmen schafft den Prozess, die Daten und den Wert. Die Infrastruktur gehört weiterhin jemand anderem.",
    pt: "Seu negócio cria o processo, os dados e o valor. A infraestrutura ainda pertence a outra pessoa.",
  },
  problemOwnership: {
    en: "More tools do not build a stronger business. Ownership does.",
    es: "Más herramientas no construyen un negocio más fuerte. Ser dueño, sí.",
    de: "Mehr Tools machen ein Unternehmen nicht stärker. Eigentum schon.",
    pt: "Mais ferramentas não constroem um negócio mais forte. A propriedade sim.",
  },
  problemConnects: {
    en: "Better Technologies connects what works and builds what is missing — until isolated tools become a system you control.",
    es: "Better Technologies conecta lo que funciona y construye lo que falta — hasta que las herramientas aisladas se convierten en un sistema que controlás.",
    de: "Better Technologies verbindet, was funktioniert, und baut, was fehlt — bis isolierte Tools zu einem System werden, das Sie kontrollieren.",
    pt: "A Better Technologies conecta o que funciona e constrói o que falta — até que ferramentas isoladas se tornem um sistema que você controla.",
  },
  chooseNextMove: {
    en: "Choose Your Next Move",
    es: "Elegí tu próximo movimiento",
    de: "Wählen Sie Ihren nächsten Schritt",
    pt: "Escolha seu próximo movimento",
  },
  problemQuote: {
    en: "In 2026, so far, over 50% of online purchases were previously consulted with AI. If LLMs are not recommending you, you are an endangered species.",
    es: "En lo que va de 2026, más del 50% de las compras online fueron consultadas previamente con IA. Si los LLMs no te recomiendan, sos una especie en peligro de extinción.",
    de: "Im bisherigen Verlauf des Jahres 2026 wurden über 50% der Online-Käufe zuvor mit KI abgestimmt. Wenn LLMs Sie nicht empfehlen, sind Sie eine gefährdete Art.",
    pt: "Em 2026, até agora, mais de 50% das compras online foram previamente consultadas com IA. Se os LLMs não te recomendam, você é uma espécie em extinção.",
  },
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
  packModalIntroBefore: {
    en: "Over 50% of online shoppers now consult Generative AI before making a purchase decision. ",
    es: "Más del 50% de los compradores online ya consultan IA Generativa antes de decidir una compra. ",
    de: "Über 50% der Online-Käufer konsultieren heute generative KI, bevor sie eine Kaufentscheidung treffen. ",
    pt: "Mais de 50% dos compradores online já consultam IA Generativa antes de decidir uma compra. "
  },
  packModalIntroHighlight: {
    en: "Your customers aren't searching for you anymore; they are asking AI.",
    es: "Tus clientes ya no te buscan; le preguntan a la IA.",
    de: "Ihre Kunden suchen nicht mehr nach Ihnen; sie fragen die KI.",
    pt: "Seus clientes já não te procuram; eles perguntam à IA."
  },
  packModalIntroAfter: {
    en: " Market leaders have thrived chasing likes, so far. But the rules of the hunt have changed.",
    es: " Los líderes del mercado prosperaron persiguiendo likes, hasta ahora. Pero las reglas de la caza cambiaron.",
    de: " Marktführer sind bisher erfolgreich gewesen, indem sie Likes gejagt haben. Doch die Regeln der Jagd haben sich geändert.",
    pt: " Os líderes de mercado prosperaram perseguindo likes, até agora. Mas as regras da caçada mudaram."
  },
  packModalBodyBefore: {
    en: "Dominating this new landscape means acquiring world-class capabilities overnight. True leaders know that attempting to build an elite tech team from scratch takes years and bleeds capital; so they don't hunt alone. They plug into a superior ecosystem. We are your pack. ",
    es: "Dominar este nuevo panorama significa adquirir capacidades de clase mundial de la noche a la mañana. Los verdaderos líderes saben que intentar construir un equipo tecnológico de élite desde cero toma años y consume capital; por eso no cazan solos. Se conectan a un ecosistema superior. Nosotros somos tu manada. ",
    de: "Diese neue Landschaft zu dominieren bedeutet, über Nacht Weltklasse-Fähigkeiten zu erwerben. Wahre Führungskräfte wissen, dass der Aufbau eines Elite-Tech-Teams von Grund auf Jahre dauert und Kapital verschlingt; deshalb jagen sie nicht allein. Sie schließen sich einem überlegenen Ökosystem an. Wir sind Ihr Rudel. ",
    pt: "Dominar esse novo cenário significa adquirir capacidades de classe mundial da noite para o dia. Verdadeiros líderes sabem que tentar construir uma equipe tecnológica de elite do zero leva anos e consome capital; por isso não caçam sozinhos. Eles se conectam a um ecossistema superior. Nós somos a sua alcateia. "
  },
  packModalBodyHighlight: {
    en: "By partnering with us, you integrate strategy, engineering, and growth systems instantly,",
    es: "Al asociarte con nosotros, integrás estrategia, ingeniería y sistemas de crecimiento al instante,",
    de: "Durch die Partnerschaft mit uns integrieren Sie Strategie, Engineering und Wachstumssysteme sofort,",
    pt: "Ao se associar conosco, você integra estratégia, engenharia e sistemas de crescimento instantaneamente,"
  },
  packModalBodyAfter: {
    en: " at a fraction of the cost of an internal team. There is no other firm in the market deploying this level of integrated firepower. We hunt together. We thrive together.",
    es: " a una fracción del costo de un equipo interno. No hay otra firma en el mercado que despliegue este nivel de poder de fuego integrado. Cazamos juntos. Prosperamos juntos.",
    de: " zu einem Bruchteil der Kosten eines internen Teams. Keine andere Firma am Markt setzt dieses Maß an integrierter Schlagkraft ein. Wir jagen gemeinsam. Wir wachsen gemeinsam.",
    pt: " por uma fração do custo de uma equipe interna. Não há outra empresa no mercado implantando esse nível de poder de fogo integrado. Caçamos juntos. Prosperamos juntos."
  },
  packModalQuote: {
    en: "The strength of the wolf is the pack, and the strength of the pack is the wolf.",
    es: "La fuerza del lobo es la manada, y la fuerza de la manada es el lobo.",
    de: "Die Stärke des Wolfs ist das Rudel, und die Stärke des Rudels ist der Wolf.",
    pt: "A força do lobo é a alcateia, e a força da alcateia é o lobo."
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
    en: [
      { text: "Most agencies charge thousands for a dead digital brochure. ", bold: false },
      { text: "We build your AI-ready infrastructure", bold: true },
      { text: " for free. Why? Because we play long-term games. Talk is cheap; leaders leave evidence. We will design, code, and deploy your new high-converting digital hub entirely on us. If you have the hunger, we got the system.", bold: false },
    ],
    es: [
      { text: "La mayoría de las agencias cobran miles por un folleto digital sin vida. ", bold: false },
      { text: "Construimos tu infraestructura lista para IA", bold: true },
      { text: " de forma gratuita. ¿Por qué? Porque jugamos a largo plazo. Hablar es barato; los líderes dejan evidencia. Diseñaremos, programaremos y desplegaremos tu nuevo centro digital de alta conversión completamente por nuestra cuenta. Si tenés el hambre, nosotros tenemos el sistema.", bold: false },
    ],
    de: [
      { text: "Die meisten Agenturen verlangen Tausende für eine tote digitale Broschüre. ", bold: false },
      { text: "Wir bauen Ihre KI-fähige Infrastruktur", bold: true },
      { text: " kostenlos. Warum? Weil wir langfristig denken. Reden ist billig; Führende hinterlassen Beweise. Wir werden Ihren neuen konversionsstarken digitalen Hub komplett auf unsere Kosten gestalten, programmieren und bereitstellen. Wenn Sie den Hunger haben, haben wir das System.", bold: false },
    ],
    pt: [
      { text: "A maioria das agências cobra milhares por um folheto digital sem vida. ", bold: false },
      { text: "Nós construímos a sua infraestrutura pronta para IA", bold: true },
      { text: " gratuitamente. Por quê? Porque jogamos a longo prazo. Falar é barato; líderes deixam evidências. Vamos projetar, programar e implantar o seu novo hub digital de alta conversão totalmente por nossa conta. Se você tem a fome, nós temos o sistema.", bold: false },
    ],
  },
  termsModalCta: {
    en: "Claim AI Awakening (15-Min Assessment)",
    es: "Reclamar Despertar de IA (Evaluación de 15 min)",
    de: "KI-Erwachen sichern (15-Min-Bewertung)",
    pt: "Reivindicar Despertar de IA (Avaliação de 15 min)"
  },
  engineeringPrice: {
    en: [
      { text: "Engineering Price: $0", bold: true },
      { text: " you only cover the domain provisioning, no fine prints.", bold: false },
    ],
    es: [
      { text: "Precio de Ingeniería: $0", bold: true },
      { text: ", solo cubrís el aprovisionamiento del dominio, sin letra chica.", bold: false },
    ],
    de: [
      { text: "Engineering-Preis: $0", bold: true },
      { text: ", Sie übernehmen nur die Domain-Bereitstellung, kein Kleingedrucktes.", bold: false },
    ],
    pt: [
      { text: "Preço de Engenharia: $0", bold: true },
      { text: ", você só cobre o provisionamento do domínio, sem letras miúdas.", bold: false },
    ],
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
  aboutTeam: { en: "The Team", es: "El equipo", de: "Das Team", pt: "A equipe" },
  highPerf: {
    en: "The Better Team",
    es: "El Mejor Equipo",
    de: "Das Bessere Team",
    pt: "A Melhor Equipe"
  },



  forged: {
    en: "One Pack",
    es: "Una manada",
    de: "Ein Rudel",
    pt: "Uma alcateia"
  },

  pressure: {
    en: "From Strategy to Execution.",
    es: "De la estrategia a la ejecución.",
    de: "Von der Strategie zur Umsetzung.",
    pt: "Da estratégia à execução."
  },
  aboutTeamCopy: {
    en: "Together, we bring more than 55 years of international experience across industries. We work in 3 languages — English, Spanish and German. Every Power Unit has a responsible specialist behind it. We build the system. You lead the business.",
    es: "Juntos, sumamos más de 55 años de experiencia internacional en distintas industrias. Trabajamos en 3 idiomas — inglés, español y alemán. Cada Power Unit tiene un especialista responsable detrás. Nosotros construimos el sistema. Vos lideras el negocio.",
    de: "Gemeinsam bringen wir mehr als 55 Jahre internationale Erfahrung über verschiedene Branchen hinweg mit. Wir arbeiten in 3 Sprachen — Englisch, Spanisch und Deutsch. Hinter jeder Power Unit steht ein verantwortlicher Spezialist. Wir bauen das System. Sie führen das Geschäft.",
    pt: "Juntos, trazemos mais de 55 anos de experiência internacional em diversos setores. Trabalhamos em 3 idiomas — inglês, espanhol e alemão. Cada Power Unit tem um especialista responsável por trás. Nós construímos o sistema. Você lidera o negócio."
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
  latestInsights: { en: "What Leaders Need to Know", es: "Lo que los líderes necesitan saber", de: "Was Führungskräfte wissen müssen", pt: "O que os líderes precisam saber" },
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
  wolfQuotePart1: {
    en: "The power of the wolf is in the ",
    es: "El poder del lobo está en la ",
    de: "Die Kraft des Wolfs liegt im ",
    pt: "O poder do lobo está na "
  },
  wolfQuotePack: {
    en: "pack",
    es: "manada",
    de: "Rudel",
    pt: "alcateia"
  },
  wolfQuotePart2: {
    en: ", and the power of the pack is the ",
    es: ", y el poder de la manada es el ",
    de: ", und die Kraft des Rudels ist der ",
    pt: ", e o poder da alcateia é o "
  },
  wolfQuoteWolf: {
    en: "wolf",
    es: "lobo",
    de: "Wolf",
    pt: "lobo"
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
  scholarshipsPartnershipsEyebrow: {
    en: "STRONG SYSTEMS ARE BUILT THROUGH STRONG ALLIANCES.",
    es: "LOS SISTEMAS SÓLIDOS SE CONSTRUYEN CON ALIANZAS SÓLIDAS.",
    de: "STARKE SYSTEME ENTSTEHEN DURCH STARKE ALLIANZEN.",
    pt: "SISTEMAS FORTES SÃO CONSTRUÍDOS COM ALIANÇAS FORTES.",
  },
  scholarshipsPartnershipsTitle: {
    en: "Scholarships & Partnerships",
    es: "Becas y Alianzas",
    de: "Stipendien & Partnerschaften",
    pt: "Bolsas e Parcerias",
  },
  scholarshipsPartnershipsSubtitle: {
    en: "Want to grow with the Better Pack?",
    es: "¿Querés crecer con el Better Pack?",
    de: "Willst du mit dem Better Pack wachsen?",
    pt: "Quer crescer com o Better Pack?",
  },
  scholarshipsPartnershipsIntro: {
    en: "Build your system with our backing — or join the Better Pack and take Better Technologies into new markets. We invest in people ready to build, lead and move things forward.",
    es: "Construí tu sistema con nuestro respaldo, o sumate al Better Pack y llevá a Better Technologies a nuevos mercados. Invertimos en personas listas para construir, liderar y mover las cosas hacia adelante.",
    de: "Bau dein System mit unserer Unterstützung auf — oder tritt dem Better Pack bei und bring Better Technologies in neue Märkte. Wir investieren in Menschen, die bereit sind zu bauen, zu führen und Dinge voranzutreiben.",
    pt: "Construa seu sistema com nosso apoio — ou junte-se ao Better Pack e leve a Better Technologies a novos mercados. Investimos em pessoas prontas para construir, liderar e fazer as coisas avançarem.",
  },
  scholarshipsPillLabel: {
    en: "The Better Scholarships",
    es: "Las Becas Better",
    de: "Die Better-Stipendien",
    pt: "As Bolsas Better",
  },
  scholarshipsTitle: {
    en: "The Better Scholarships",
    es: "Las Becas Better",
    de: "Die Better-Stipendien",
    pt: "As Bolsas Better",
  },
  scholarshipsIntro: {
    en: "If you are an underdog, or you happen to live in an endangered territory, we've got your back. If you believe in what you're building, we believe in giving you a fair shot.",
    es: "Si sos un underdog, o vivís en un territorio en riesgo, te cubrimos las espaldas. Si vos creés en lo que estás construyendo, nosotros creemos en darte una oportunidad justa.",
    de: "Wenn du ein Underdog bist oder in einem gefährdeten Gebiet lebst, halten wir dir den Rücken frei. Wenn du an das glaubst, was du aufbaust, glauben wir daran, dir eine faire Chance zu geben.",
    pt: "Se você é um underdog, ou vive em um território em risco, nós te apoiamos. Se você acredita no que está construindo, nós acreditamos em te dar uma chance justa.",
  },
  scholarshipsCta: {
    en: "Apply For Scholarship",
    es: "Postular a la Beca",
    de: "Für Stipendium bewerben",
    pt: "Candidatar-se à Bolsa",
  },
  scholarshipsWhatsappMessage: {
    en: "Hi! I'm interested in applying for the Better Scholarship.",
    es: "¡Hola! Estoy interesado/a en postular a la Beca Better.",
    de: "Hallo! Ich interessiere mich für das Better-Stipendium.",
    pt: "Olá! Tenho interesse em me candidatar à Bolsa Better.",
  },
  scholarshipQ1: {
    en: "What is the Better Scholarship?",
    es: "¿Qué es la Beca Better?",
    de: "Was ist das Better-Stipendium?",
    pt: "O que é a Bolsa Better?",
  },
  scholarshipA1: {
    en: "A co-investment programme for founders and businesses with the ambition to grow, but not always the capital or conditions to move at full speed. We back potential with technology, expertise and infrastructure.",
    es: "Un programa de coinversión para fundadores y negocios con la ambición de crecer, pero que no siempre tienen el capital o las condiciones para moverse a toda velocidad. Respaldamos el potencial con tecnología, expertise e infraestructura.",
    de: "Ein Co-Investitionsprogramm für Gründer und Unternehmen mit dem Ehrgeiz zu wachsen, aber nicht immer mit dem Kapital oder den Bedingungen, um mit voller Geschwindigkeit voranzukommen. Wir unterstützen Potenzial mit Technologie, Expertise und Infrastruktur.",
    pt: "Um programa de coinvestimento para fundadores e negócios com ambição de crescer, mas que nem sempre têm o capital ou as condições para avançar a toda velocidade. Apoiamos o potencial com tecnologia, expertise e infraestrutura.",
  },
  scholarshipQ2: {
    en: "Who is considered an Underdog?",
    es: "¿A quién se considera un Underdog?",
    de: "Wer gilt als Underdog?",
    pt: "Quem é considerado um Underdog?",
  },
  scholarshipA2: {
    en: "Someone building with less — less capital, fewer connections or fewer opportunities — but with the vision and drive to make something happen.",
    es: "Alguien que construye con menos — menos capital, menos contactos o menos oportunidades — pero con la visión y la determinación para hacer que las cosas pasen.",
    de: "Jemand, der mit weniger baut — weniger Kapital, weniger Kontakte oder weniger Chancen — aber mit der Vision und dem Antrieb, etwas zu bewegen.",
    pt: "Alguém que constrói com menos — menos capital, menos contatos ou menos oportunidades — mas com a visão e a determinação para fazer algo acontecer.",
  },
  scholarshipQ3: {
    en: "What are Endangered Territories?",
    es: "¿Qué son los Territorios en Riesgo?",
    de: "Was sind gefährdete Gebiete?",
    pt: "O que são Territórios em Risco?",
  },
  scholarshipA3: {
    en: "Markets where great ideas and capable people face conditions that make building harder than it should be — from economic instability and currency devaluation to limited access to technology and capital.",
    es: "Mercados donde grandes ideas y personas capaces enfrentan condiciones que hacen que construir sea más difícil de lo que debería — desde inestabilidad económica y devaluación de la moneda hasta acceso limitado a tecnología y capital.",
    de: "Märkte, in denen großartige Ideen und fähige Menschen auf Bedingungen stoßen, die den Aufbau schwerer machen als nötig — von wirtschaftlicher Instabilität und Währungsabwertung bis hin zu eingeschränktem Zugang zu Technologie und Kapital.",
    pt: "Mercados onde grandes ideias e pessoas capazes enfrentam condições que tornam a construção mais difícil do que deveria ser — de instabilidade econômica e desvalorização da moeda ao acesso limitado a tecnologia e capital.",
  },
  scholarshipQ4: {
    en: "What does the Scholarship support?",
    es: "¿Qué cubre la Beca?",
    de: "Was unterstützt das Stipendium?",
    pt: "O que a Bolsa apoia?",
  },
  scholarshipA4: {
    en: "It's not a cash grant. We co-invest in the capabilities your business needs — from its digital foundation to market relevance and scalable infrastructure.",
    es: "No es un subsidio en efectivo. Coinvertimos en las capacidades que tu negocio necesita — desde su base digital hasta la relevancia de mercado y la infraestructura escalable.",
    de: "Es ist kein Bargeldzuschuss. Wir investieren gemeinsam in die Fähigkeiten, die dein Unternehmen braucht — von der digitalen Grundlage bis zur Marktrelevanz und skalierbaren Infrastruktur.",
    pt: "Não é uma doação em dinheiro. Coinvestimos nas capacidades que o seu negócio precisa — desde sua base digital até relevância de mercado e infraestrutura escalável.",
  },
  scholarshipQ5: {
    en: "How do I apply?",
    es: "¿Cómo postulo?",
    de: "Wie bewerbe ich mich?",
    pt: "Como me candidato?",
  },
  scholarshipA5: {
    en: "Tell us what you're building, what's holding you back and where you want to go. We review every application individually.",
    es: "Contanos qué estás construyendo, qué te está frenando y hacia dónde querés ir. Revisamos cada postulación de forma individual.",
    de: "Erzähl uns, was du aufbaust, was dich zurückhält und wohin du willst. Wir prüfen jede Bewerbung individuell.",
    pt: "Conte-nos o que você está construindo, o que está te segurando e para onde você quer ir. Analisamos cada candidatura individualmente.",
  },
  partnershipsPillLabel: {
    en: "The Better Partnerships",
    es: "Las Alianzas Better",
    de: "Die Better-Partnerschaften",
    pt: "As Parcerias Better",
  },
  partnershipsTitle: {
    en: "The Better Partnerships",
    es: "Las Alianzas Better",
    de: "Die Better-Partnerschaften",
    pt: "As Parcerias Better",
  },
  partnershipsIntro: {
    en: "Already have the network, market knowledge or ambition to bring Better Technologies somewhere new? Join the Better Pack as a partner and build with us. You bring the territory, we bring the system. Together, we build the market.",
    es: "¿Ya tenés la red de contactos, el conocimiento del mercado o la ambición para llevar a Better Technologies a un lugar nuevo? Sumate al Better Pack como partner y construí con nosotros. Vos ponés el territorio, nosotros ponemos el sistema. Juntos construimos el mercado.",
    de: "Hast du bereits das Netzwerk, die Marktkenntnis oder den Ehrgeiz, Better Technologies an einen neuen Ort zu bringen? Tritt dem Better Pack als Partner bei und bau mit uns. Du bringst das Gebiet, wir bringen das System. Gemeinsam bauen wir den Markt auf.",
    pt: "Já tem a rede de contatos, o conhecimento de mercado ou a ambição para levar a Better Technologies a um novo lugar? Junte-se ao Better Pack como parceiro e construa conosco. Você traz o território, nós trazemos o sistema. Juntos construímos o mercado.",
  },
  partnershipsCta: {
    en: "Apply For Partnership",
    es: "Postular a la Alianza",
    de: "Für Partnerschaft bewerben",
    pt: "Candidatar-se à Parceria",
  },
  partnershipsWhatsappMessage: {
    en: "Hi! I'd like to explore becoming a Better Technologies partner.",
    es: "¡Hola! Me gustaría explorar ser partner de Better Technologies.",
    de: "Hallo! Ich möchte gerne Partner von Better Technologies werden.",
    pt: "Olá! Gostaria de explorar me tornar um parceiro da Better Technologies.",
  },
  partnershipQ1: {
    en: "How can I partner with Better Technologies?",
    es: "¿Cómo puedo ser partner de Better Technologies?",
    de: "Wie kann ich Partner von Better Technologies werden?",
    pt: "Como posso ser parceiro da Better Technologies?",
  },
  partnershipA1: {
    en: "Join as a Sales Partner or train with us to become a Certified Integrator.",
    es: "Sumate como Sales Partner o entrená con nosotros para convertirte en Integrador Certificado.",
    de: "Werde Sales Partner oder trainiere mit uns, um Certified Integrator zu werden.",
    pt: "Junte-se como Sales Partner ou treine conosco para se tornar um Integrador Certificado.",
  },
  partnershipQ2: {
    en: "What does a Sales Partner do?",
    es: "¿Qué hace un Sales Partner?",
    de: "Was macht ein Sales Partner?",
    pt: "O que faz um Sales Partner?",
  },
  partnershipA2: {
    en: "You bring us the right client. We handle strategy, engineering and delivery. You share in the value you help create.",
    es: "Vos nos traés al cliente correcto. Nosotros nos ocupamos de la estrategia, la ingeniería y la entrega. Vos participás del valor que ayudás a crear.",
    de: "Du bringst uns den richtigen Kunden. Wir kümmern uns um Strategie, Engineering und Umsetzung. Du bist am Wert beteiligt, den du mit schaffst.",
    pt: "Você nos traz o cliente certo. Nós cuidamos da estratégia, engenharia e entrega. Você participa do valor que ajuda a criar.",
  },
  partnershipQ3: {
    en: "What does a Certified Integrator do?",
    es: "¿Qué hace un Integrador Certificado?",
    de: "Was macht ein Certified Integrator?",
    pt: "O que faz um Integrador Certificado?",
  },
  partnershipA3: {
    en: "You train with Better Technologies and learn to build and deploy our systems for clients in your market.",
    es: "Te entrenás con Better Technologies y aprendés a construir y desplegar nuestros sistemas para clientes en tu mercado.",
    de: "Du trainierst mit Better Technologies und lernst, unsere Systeme für Kunden in deinem Markt zu bauen und einzusetzen.",
    pt: "Você treina com a Better Technologies e aprende a construir e implantar nossos sistemas para clientes no seu mercado.",
  },
  partnershipQ4: {
    en: "Do I need technical experience?",
    es: "¿Necesito experiencia técnica?",
    de: "Brauche ich technische Erfahrung?",
    pt: "Preciso de experiência técnica?",
  },
  partnershipA4: {
    en: "Not as a Sales Partner. Certified Integrators complete our training and meet the delivery standards of the Better Ecosystem.",
    es: "No como Sales Partner. Los Integradores Certificados completan nuestro entrenamiento y cumplen con los estándares de entrega del Ecosistema Better.",
    de: "Nicht als Sales Partner. Certified Integrators absolvieren unser Training und erfüllen die Lieferstandards des Better-Ökosystems.",
    pt: "Não como Sales Partner. Os Integradores Certificados completam nosso treinamento e atendem aos padrões de entrega do Ecossistema Better.",
  },
  partnershipQ5: {
    en: "How does the partnership model work?",
    es: "¿Cómo funciona el modelo de alianza?",
    de: "Wie funktioniert das Partnerschaftsmodell?",
    pt: "Como funciona o modelo de parceria?",
  },
  partnershipA5: {
    en: "The model depends on your role, market and level of involvement. Terms are discussed directly.",
    es: "El modelo depende de tu rol, tu mercado y tu nivel de involucramiento. Las condiciones se conversan directamente.",
    de: "Das Modell hängt von deiner Rolle, deinem Markt und deinem Engagement-Level ab. Die Konditionen werden direkt besprochen.",
    pt: "O modelo depende do seu papel, mercado e nível de envolvimento. Os termos são discutidos diretamente.",
  },
  scholarshipsPartnershipsTitlePart1: {
    en: "Scholarships",
    es: "Becas",
    de: "Stipendien",
    pt: "Bolsas",
  },
  scholarshipsPartnershipsTitlePart2: {
    en: "Partnerships",
    es: "Alianzas",
    de: "Partnerschaften",
    pt: "Parcerias",
  },
  partnershipQ6: {
    en: "How do I apply?",
    es: "¿Cómo postulo?",
    de: "Wie bewerbe ich mich?",
    pt: "Como me candidato?",
  },
  partnershipA6: {
    en: "Tell us about your experience, your market and how you want to contribute. We will explore the right role together.",
    es: "Contanos sobre tu experiencia, tu mercado y cómo querés contribuir. Vamos a explorar juntos cuál es el rol ideal.",
    de: "Erzähl uns von deiner Erfahrung, deinem Markt und wie du beitragen möchtest. Gemeinsam finden wir die passende Rolle.",
    pt: "Conte-nos sobre sua experiência, seu mercado e como você quer contribuir. Vamos explorar juntos o papel ideal.",
  },
  foundationTitle: {
    en: "BETTER FOUNDATION",
    es: "BETTER FOUNDATION",
    de: "BETTER FOUNDATION",
    pt: "BETTER FOUNDATION",
  },

  foundationSubtitle: {
    en: "WE ARE NOT BEING FOUND",
    es: "NO NOS ESTÁN ENCONTRANDO",
    de: "WIR WERDEN NICHT GEFUNDEN",
    pt: "NÃO ESTAMOS SENDO ENCONTRADOS",
  },

  foundationPain: {
    en: "You have a strong product or service. But your digital presence is weak, and too few people or AI systems find your business. The result: a clear digital identity, easier to find, capturing new demand.",
    es: "Tenés un producto o servicio sólido. Pero tu presencia digital es débil, y muy poca gente o sistemas de IA encuentran tu negocio. El resultado: una identidad digital clara, más fácil de encontrar, capturando nueva demanda.",
    de: "Sie haben ein starkes Produkt oder eine starke Dienstleistung. Aber Ihre digitale Präsenz ist schwach, und zu wenige Menschen oder KI-Systeme finden Ihr Unternehmen. Das Ergebnis: eine klare digitale Identität, leichter zu finden, neue Nachfrage erschließen.",
    pt: "Você tem um produto ou serviço forte. Mas sua presença digital é fraca, e poucas pessoas ou sistemas de IA encontram o seu negócio. O resultado: uma identidade digital clara, mais fácil de encontrar, capturando nova demanda.",
  },

  foundationIncludedTitle: {
    en: "What's included",
    es: "Qué incluye",
    de: "Was ist enthalten",
    pt: "O que está incluído",
  },

  foundationIncluded: {
    en: "• Better Business Blueprint™\n• Website optimised for AI and GEO\n• Basic CRM setup\n• Lead capture ecosystem",
    es: "• Better Business Blueprint™\n• Sitio web optimizado para IA y GEO\n• Configuración básica de CRM\n• Ecosistema de captación de leads",
    de: "Better Business Blueprint™, für KI und GEO optimierte Website, grundlegendes CRM-Setup, Lead-Erfassungs-Ökosystem.",
    pt: "• Better Business Blueprint™\n• Site otimizado para IA e GEO\n• Configuração básica de CRM\n• Ecossistema de captação de leads",
  },

  foundationSystemTitle: {
    en: "How the Better System works",
    es: "Cómo funciona el Better System",
    de: "Wie das Better System funktioniert",
    pt: "Como o Better System funciona",
  },

  foundationQuantos: {
    en: "Your website, CRM and lead-capture components become digital capabilities you can control and connect.",
    es: "Tu sitio web, CRM y componentes de captación de leads se convierten en capacidades digitales que podés controlar y conectar.",
    de: "Ihre Website, CRM- und Lead-Erfassungskomponenten werden zu digitalen Fähigkeiten, die Sie steuern und verbinden können.",
    pt: "Seu site, CRM e componentes de captação de leads tornam-se capacidades digitais que você pode controlar e conectar.",
  },

  foundationHack: {
    en: "The website, CRM and lead capture work together as one system — from being found to receiving a new enquiry.",
    es: "El sitio web, CRM y captación de leads funcionan juntos como un sistema — desde ser encontrado hasta recibir una nueva consulta.",
    de: "Die Website, CRM und Lead-Erfassung arbeiten zusammen als ein System — vom gefunden werden bis zum Eingang einer neuen Anfrage.",
    pt: "O site, CRM e captação de leads funcionam juntos como um sistema — de ser encontrado a receber uma nova consulta.",
  },

  foundationPowerUnits: {
    en: "The Better Pack creates the Business Blueprint, builds the website, configures the CRM and deploys the complete lead-capture flow.",
    es: "El Better Pack crea el Business Blueprint, construye el sitio web, configura el CRM y despliega el flujo completo de captación de leads.",
    de: "Das Better Pack erstellt den Business Blueprint, baut die Website, konfiguriert das CRM und implementiert den vollständigen Lead-Erfassungs-Workflow.",
    pt: "O Better Pack cria o Business Blueprint, constrói o site, configura o CRM e implanta o fluxo completo de captação de leads.",
  },

  foundationSovereignNode: {
    en: "Better Foundation creates the first connected part of your own digital infrastructure.",
    es: "Better Foundation crea la primera parte conectada de tu propia infraestructura digital.",
    de: "Better Foundation schafft den ersten verbundenen Teil Ihrer eigenen digitalen Infrastruktur.",
    pt: "Better Foundation cria a primeira parte conectada da sua própria infraestrutura digital.",
  },

  foundationInvestment: {
    en: "1.500 USD",
    es: "1.500 USD",
    de: "1.500 USD",
    pt: "1.500 USD",
  },

  foundationScholarship: {
    en: "Underdog Scholarship: Up to 50% co-investment (bringing it down to ~$750–$1,250).",
    es: "Beca Underdog: hasta 50% de coinversión (quedando en ~$750–$1.250).",
    de: "Underdog-Stipendium: bis zu 50% Co-Investition (reduziert auf ~$750–$1.250).",
    pt: "Bolsa Underdog: até 50% de coinvestimento (reduzindo para ~$750–$1.250).",
  },

  foundationCta: {
    en: "Build Your Foundation",
    es: "Construí tu Foundation",
    de: "Bauen Sie Ihre Foundation auf",
    pt: "Construa seu Foundation",
  },

  relevanceTitle: {
    en: "DIGITAL RELEVANCE",
    es: "DIGITAL RELEVANCE",
    de: "DIGITAL RELEVANCE",
    pt: "DIGITAL RELEVANCE",
  },

  relevanceSubtitle: {
    en: "WE ARE BEING FOUND. BUT GROWTH IS STILL HARD.",
    es: "NOS ENCUENTRAN. PERO CRECER SIGUE SIENDO DIFÍCIL.",
    de: "WIR WERDEN GEFUNDEN. ABER WACHSTUM IST SCHWER.",
    pt: "SOMOS ENCONTRADOS. MAS CRESCER AINDA É DIFÍCIL.",
  },

  relevancePain: {
    en: "You have customers and revenue. But marketing remains manual, growth depends on clicks and your activities do not work together. The result: Turn existing visibility into stronger authority, trust and growth.",
    es: "Tenés clientes e ingresos. Pero el marketing sigue siendo manual, el crecimiento depende de clicks y tus actividades no trabajan en conjunto. El resultado: convertir la visibilidad existente en más autoridad, confianza y crecimiento.",
    de: "Sie haben Kunden und Umsatz. Aber Marketing bleibt manuell, Wachstum hängt von Klicks ab, und Ihre Aktivitäten arbeiten nicht zusammen. Das Ergebnis: bestehende Sichtbarkeit in stärkere Autorität, Vertrauen und Wachstum verwandeln.",
    pt: "Você tem clientes e receita. Mas o marketing continua manual, o crescimento depende de cliques e suas atividades não trabalham juntas. O resultado: transformar a visibilidade existente em mais autoridade, confiança e crescimento.",
  },

  relevanceIncludedTitle: {
    en: "What's included",
    es: "Qué incluye",
    de: "Was ist enthalten",
    pt: "O que está incluído",
  },

  relevanceIncluded: {
    en: "• Ongoing ecosystem maintenance\n• Marketing automations\n• Real-world experience design for user-generated content and Proof of Humanity\n• Ongoing business development\n• Business-to-business positioning\n• Project management",
    es: "• Mantenimiento continuo del ecosistema\n• Automatizaciones de marketing\n• Diseño de experiencias reales para contenido generado por usuarios y Proof of Humanity\n• Desarrollo de negocio continuo\n• Posicionamiento business-to-business\n• Gestión de proyectos",
    de: "• Laufende Pflege des Ökosystems\n• Marketing-Automatisierungen\n• Gestaltung realer Erlebnisse für nutzergenerierte Inhalte und Proof of Humanity\n• Laufende Geschäftsentwicklung\n• Business-to-Business-Positionierung\n• Projektmanagement",
    pt: "• Manutenção contínua do ecossistema\n• Automações de marketing\n• Design de experiências reais para conteúdo gerado por usuários e Proof of Humanity\n• Desenvolvimento de negócios contínuo\n• Posicionamento business-to-business\n• Gestão de projetos",
  },

  relevanceSystemTitle: {
    en: "How the Better System works",
    es: "Cómo funciona el Better System",
    de: "Wie das Better System funktioniert",
    pt: "Como o Better System funciona",
  },

  relevanceQuantos: {
    en: "Marketing automations and the digital capabilities required to run and maintain the ecosystem become reusable parts of your system.",
    es: "Las automatizaciones de marketing y las capacidades digitales necesarias para ejecutar y mantener el ecosistema se convierten en partes reutilizables de tu sistema.",
    de: "Marketing-Automatisierungen und die digitalen Fähigkeiten, die zur Ausführung und Pflege des Ökosystems benötigt werden, werden zu wiederverwendbaren Teilen Ihres Systems.",
    pt: "Automações de marketing e as capacidades digitais necessárias para executar e manter o ecossistema tornam-se partes reutilizáveis do seu sistema.",
  },

  relevanceHack: {
    en: "The Quantos are connected into growth workflows that distribute content, capture demand and move opportunities forward.",
    es: "Los Quantos se conectan en flujos de trabajo de crecimiento que distribuyen contenido, capturan demanda y mueven oportunidades hacia adelante.",
    de: "Die Quantos werden mit Wachstums-Workflows verbunden, die Inhalte verteilen, Nachfrage erfassen und Chancen vorantreiben.",
    pt: "Os Quantos são conectados em fluxos de trabalho de crescimento que distribuem conteúdo, capturam demanda e movem oportunidades adiante.",
  },

  relevancePowerUnits: {
    en: "The Better Pack maintains the ecosystem, designs real-world experiences, strengthens your positioning and manages the ongoing business-development work.",
    es: "El Better Pack mantiene el ecosistema, diseña experiencias reales, fortalece tu posicionamiento y gestiona el trabajo continuo de desarrollo de negocio.",
    de: "Das Better Pack pflegt das Ökosystem, gestaltet reale Erlebnisse, stärkt Ihre Positionierung und verwaltet die laufende Geschäftsentwicklung.",
    pt: "O Better Pack mantém o ecossistema, projeta experiências reais, fortalece seu posicionamento e gerencia o trabalho contínuo de desenvolvimento de negócios.",
  },

  relevanceSovereignNode: {
    en: "Your existing foundation grows into a connected system for marketing, customer communication and business development.",
    es: "Tu base existente crece hacia un sistema conectado para marketing, comunicación con clientes y desarrollo de negocio.",
    de: "Ihr bestehendes Fundament wächst zu einem vernetzten System für Marketing, Kundenkommunikation und Geschäftsentwicklung.",
    pt: "Sua base existente cresce para um sistema conectado de marketing, comunicação com clientes e desenvolvimento de negócios.",
  },

  relevanceInvestment: {
    en: "3.500 USD",
    es: "3.500 USD",
    de: "3.500 USD",
    pt: "3.500 USD",
  },

  relevanceScholarship: {
    en: "Underdog Scholarship: Up to 50% co-investment (bringing it down to ~$1,750–$2,750).",
    es: "Beca Underdog: hasta 50% de coinversión (quedando en ~$1.750–$2.750).",
    de: "Underdog-Stipendium: bis zu 50% Co-Investition (reduziert auf ~$1.750–$2.750).",
    pt: "Bolsa Underdog: até 50% de coinvestimento (reduzindo para ~$1.750–$2.750).",
  },

  relevanceCta: {
    en: "Build Your Relevance System",
    es: "Construí tu Relevance System",
    de: "Bauen Sie Ihr Relevance System auf",
    pt: "Construa seu Relevance System",
  },

  dominanceTitle: {
    en: "DIGITAL DOMINANCE",
    es: "DIGITAL DOMINANCE",
    de: "DIGITAL DOMINANCE",
    pt: "DIGITAL DOMINANCE",
  },

  dominanceSubtitle: {
    en: "WE ARE GROWING. BUT OUR SYSTEMS CANNOT KEEP UP.",
    es: "ESTAMOS CRECIENDO. PERO NUESTROS SISTEMAS NO DAN ABASTO.",
    de: "WIR WACHSEN. ABER UNSERE SYSTEME KOMMEN NICHT MIT.",
    pt: "ESTAMOS CRESCENDO. MAS NOSSOS SISTEMAS NÃO DÃO CONTA.",
  },

  dominancePain: {
    en: "You have the size, the demand and the market. But internal operations and disconnected systems are slowing the business down. The result: Build custom technology and AI infrastructure for complex growth.",
    es: "Tenés el tamaño, la demanda y el mercado. Pero las operaciones internas y los sistemas desconectados están frenando el negocio. El resultado: construir tecnología a medida e infraestructura de IA para crecimiento complejo.",
    de: "Sie haben die Größe, die Nachfrage und den Markt. Aber interne Abläufe und getrennte Systeme bremsen das Unternehmen aus. Das Ergebnis: maßgeschneiderte Technologie und KI-Infrastruktur für komplexes Wachstum.",
    pt: "Você tem o tamanho, a demanda e o mercado. Mas as operações internas e sistemas desconectados estão travando o negócio. O resultado: construir tecnologia sob medida e infraestrutura de IA para crescimento complexo.",
  },

  dominanceIncludedTitle: {
    en: "What's included",
    es: "Qué incluye",
    de: "Was ist enthalten",
    pt: "O que está incluído",
  },

  dominanceIncluded: {
    en: "• Custom business software\n• MVP systems\n• Internal AI agents with defined permissions and human oversight\n• Infrastructure for real-time global operations\n• Corporate business development\n• Strategic matchmaking\n• Investor readiness",
    es: "• Software de negocio a medida\n• Sistemas MVP\n• Agentes de IA internos con permisos definidos y supervisión humana\n• Infraestructura para operaciones globales en tiempo real\n• Desarrollo de negocio corporativo\n• Matchmaking estratégico\n• Preparación para inversores",
    de: "• Individuelle Business-Software\n• MVP-Systeme\n• Interne KI-Agenten mit definierten Berechtigungen und menschlicher Aufsicht\n• Infrastruktur für globale Echtzeit-Operationen\n• Unternehmerische Geschäftsentwicklung\n• Strategisches Matchmaking\n• Investment-Readiness",
    pt: "• Software de negócio sob medida\n• Sistemas MVP\n• Agentes de IA internos com permissões definidas e supervisão humana\n• Infraestrutura para operações globais em tempo real\n• Desenvolvimento de negócios corporativo\n• Matchmaking estratégico\n• Preparação para investidores",
  },

  dominanceSystemTitle: {
    en: "How the Better System works",
    es: "Cómo funciona el Better System",
    de: "Wie das Better System funktioniert",
    pt: "Como o Better System funciona",
  },

  dominanceQuantos: {
    en: "Custom software, MVP components, AI agents and operational tools become modular capabilities with clearly defined tasks.",
    es: "El software a medida, los componentes MVP, los agentes de IA y las herramientas operativas se convierten en capacidades modulares con tareas claramente definidas.",
    de: "Individuelle Software, MVP-Komponenten, KI-Agenten und operative Werkzeuge werden zu modularen Fähigkeiten mit klar definierten Aufgaben.",
    pt: "Software sob medida, componentes MVP, agentes de IA e ferramentas operacionais tornam-se capacidades modulares com tarefas claramente definidas.",
  },

  dominanceHack: {
    en: "The Quantos are combined into complete systems for sales, onboarding, customer service, reporting or global operations.",
    es: "Los Quantos se combinan en sistemas completos para ventas, onboarding, servicio al cliente, reporting u operaciones globales.",
    de: "Die Quantos werden zu vollständigen Systemen für Vertrieb, Onboarding, Kundenservice, Reporting oder globale Operationen kombiniert.",
    pt: "Os Quantos são combinados em sistemas completos para vendas, onboarding, atendimento ao cliente, reportagem ou operações globais.",
  },

  dominancePowerUnits: {
    en: "Master and Alpha Power Units bring together the specialists required to design, build, connect and audit the infrastructure. Corporate business development, matchmaking and investor readiness are delivered through the relevant human-led Power Units.",
    es: "Las Power Units Master y Alpha reúnen a los especialistas necesarios para diseñar, construir, conectar y auditar la infraestructura. El desarrollo de negocio corporativo, el matchmaking y la preparación para inversores se entregan a través de las Power Units lideradas por humanos.",
    de: "Master- und Alpha-Power-Units bringen die Spezialisten zusammen, die benötigt werden, um die Infrastruktur zu entwerfen, aufzubauen, zu verbinden und zu prüfen. Unternehmerische Geschäftsentwicklung, Matchmaking und Investment-Readiness werden durch die relevanten humangeführten Power Units bereitgestellt.",
    pt: "As Power Units Master e Alpha reúnem os especialistas necessários para projetar, construir, conectar e auditar a infraestrutura. Desenvolvimento de negócios corporativo, matchmaking e prontidão para investidores são entregues através das Power Units lideradas por humanos.",
  },

  dominanceSovereignNode: {
    en: "Your custom software, AI systems and operational workflows become connected infrastructure with clearly defined ownership, access and operating rules.",
    es: "Tu software a medida, sistemas de IA y flujos de trabajo operativos se convierten en infraestructura conectada con propiedad, acceso y reglas de operación claramente definidos.",
    de: "Ihre individuelle Software, KI-Systeme und operativen Workflows werden zu vernetzter Infrastruktur mit klar definiertem Eigentum, Zugang und Betriebsregeln.",
    pt: "Seu software sob medida, sistemas de IA e fluxos de trabalho operacionais tornam-se infraestrutura conectada com propriedade, acesso e regras de operação claramente definidos.",
  },

  dominanceInvestment: {
    en: "10.000 USD",
    es: "10.000 USD",
    de: "10.000 USD",
    pt: "10.000 USD",
  },

  dominanceScholarship: {
    en: "Underdog Scholarship: Tailor-made (Custom-structured, strictly for Enterprise-level operations or Whales).",
    es: "Beca Underdog: a medida (estructurada de forma personalizada, estrictamente para operaciones nivel Enterprise o Whales).",
    de: "Underdog-Stipendium: maßgeschneidert (individuell strukturiert, ausschließlich für Enterprise-Betriebe oder Whales).",
    pt: "Bolsa Underdog: sob medida (estruturada individualmente, estritamente para operações nível Enterprise ou Whales).",
  },

  dominanceCta: {
    en: "Build Your Sovereign Infrastructure",
    es: "Construí tu Sovereign Infrastructure",
    de: "Bauen Sie Ihre Sovereign Infrastructure auf",
    pt: "Construa sua Sovereign Infrastructure",
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
  // ── ALPHA FAST-TRACK ──────────────────────────────────────
  alphaBadge: {
    en: "For proactive leaders ready to execute today.",
    es: "Para líderes proactivos listos para ejecutar hoy.",
    de: "Für proaktive Führungskräfte, die heute loslegen wollen.",
    pt: "Para líderes proativos prontos para executar hoje."
  },
  alphaTitle: {
    en: "The Alpha Fast-Track",
    es: "El Alpha Fast-Track",
    de: "Der Alpha Fast-Track",
    pt: "O Alpha Fast-Track"
  },
  alphaSubheadline: {
    en: "Skip the assessment. Go straight to execution.",
    es: "Saltate la evaluación. Andá directo a la ejecución.",
    de: "Überspringen Sie die Bewertung. Direkt zur Umsetzung.",
    pt: "Pule a avaliação. Vá direto para a execução."
  },
  alphaIntro: {
    en: "You are already winning, and you are hungry for more. We reward proactivity and ambition. No introductory meetings. Lock in a 60-minute deep-dive architecture session with our elite team and let's start building today.",
    es: "Ya estás ganando, y tenés hambre de más. Premiamos la proactividad y la ambición. Sin reuniones introductorias. Reservá una sesión de arquitectura de 60 minutos con nuestro equipo de élite y empecemos a construir hoy.",
    de: "Sie gewinnen bereits und wollen mehr. Wir belohnen Proaktivität und Ambition. Keine Einführungsgespräche. Sichern Sie sich eine 60-minütige Deep-Dive-Architektursitzung mit unserem Elite-Team und lassen Sie uns heute mit dem Aufbau beginnen.",
    pt: "Você já está vencendo, e está com fome de mais. Recompensamos a proatividade e a ambição. Sem reuniões introdutórias. Garanta uma sessão de arquitetura de 60 minutos com nossa equipe de elite e vamos começar a construir hoje."
  },
  alphaDisclaimer: {
    en: "This Fast Track has a $100 commitment deposit that separates leaders from the rest of the pack. This deposit is 100% credited toward your total project invoice.",
    es: "Este Fast Track tiene un depósito de compromiso de $100 que separa a los líderes del resto de la manada. Este depósito se acredita 100% a la factura total de tu proyecto.",
    de: "Dieser Fast Track erfordert eine Verpflichtungseinlage von $100, die Führungskräfte vom Rest des Rudels unterscheidet. Diese Einlage wird zu 100% auf Ihre Gesamtprojektrechnung angerechnet.",
    pt: "Este Fast Track tem um depósito de compromisso de $100 que separa os líderes do resto da alcateia. Este depósito é 100% creditado na fatura total do seu projeto."
  },
  alphaCtaMain: {
    en: "Take the Alpha Fast-Track ($100)",
    es: "Tomar el Alpha Fast-Track ($100)",
    de: "Den Alpha Fast-Track wählen ($100)",
    pt: "Fazer o Alpha Fast-Track ($100)"
  },
  alphaScreen1Title: {
    en: "Welcome to the Elite Team.",
    es: "Bienvenido al equipo de élite.",
    de: "Willkommen im Elite-Team.",
    pt: "Bem-vindo à equipe de elite."
  },
  alphaCtaCalendar: {
    en: "Book Kickoff - Calendar",
    es: "Reservar Kickoff - Calendario",
    de: "Kickoff buchen - Kalender",
    pt: "Agendar Kickoff - Calendário"
  },
  alphaScreen2Title: {
    en: "Great! We have scheduled your Kickoff with our founder himself. Are you ready to take action and make your commitment deposit?",
    es: "¡Genial! Agendamos tu Kickoff con nuestro fundador en persona. ¿Estás listo para actuar y hacer tu depósito de compromiso?",
    de: "Großartig! Wir haben Ihren Kickoff mit unserem Gründer persönlich vereinbart. Sind Sie bereit, zu handeln und Ihre Verpflichtungseinlage zu leisten?",
    pt: "Ótimo! Agendamos seu Kickoff com o nosso fundador pessoalmente. Você está pronto para agir e fazer seu depósito de compromisso?"
  },
  alphaCtaStripe: {
    en: "Deposit Now - Stripe",
    es: "Depositar Ahora - Stripe",
    de: "Jetzt einzahlen - Stripe",
    pt: "Depositar Agora - Stripe"
  },
  alphaScreen3Body: {
    en: "You have proven with actions, not just words, that you came to lead. In Better Technologies, we reward ambition. Your exclusive strategy and engineering hour is officially locked in our agenda. Your $100 deposit has already been credited to your project account. The link to complete your ecosystem's technical details has been sent to your WhatsApp. Growth is our ultimate metric. We don't try; we do. Prepare to execute.",
    es: "Demostraste con acciones, no solo palabras, que viniste a liderar. En Better Technologies, premiamos la ambición. Tu hora exclusiva de estrategia e ingeniería quedó oficialmente reservada en nuestra agenda. Tu depósito de $100 ya fue acreditado a tu cuenta de proyecto. El link para completar los detalles técnicos de tu ecosistema fue enviado a tu WhatsApp. El crecimiento es nuestra métrica final. No intentamos; hacemos. Preparate para ejecutar.",
    de: "Sie haben mit Taten, nicht nur mit Worten bewiesen, dass Sie führen wollen. Bei Better Technologies belohnen wir Ambition. Ihre exklusive Strategie- und Engineering-Stunde ist offiziell in unserer Agenda gesichert. Ihre $100-Einlage wurde bereits Ihrem Projektkonto gutgeschrieben. Der Link zur Vervollständigung der technischen Details Ihres Ökosystems wurde an Ihr WhatsApp gesendet. Wachstum ist unsere ultimative Kennzahl. Wir versuchen nicht; wir tun. Bereiten Sie sich auf die Umsetzung vor.",
    pt: "Você provou com ações, não apenas palavras, que veio para liderar. Na Better Technologies, recompensamos a ambição. Sua hora exclusiva de estratégia e engenharia está oficialmente marcada em nossa agenda. Seu depósito de $100 já foi creditado na sua conta de projeto. O link para completar os detalhes técnicos do seu ecossistema foi enviado ao seu WhatsApp. Crescimento é a nossa métrica definitiva. Não tentamos; fazemos. Prepare-se para executar."
  },
  alphaScreen3Signature: {
    en: "— Better Technologies Elite Team",
    es: "— Equipo de Élite de Better Technologies",
    de: "— Better Technologies Elite-Team",
    pt: "— Equipe de Elite da Better Technologies"
  },
  alphaCtaAssess: {
    en: "Assess my digital presence (5-Min) →",
    es: "Evaluar mi presencia digital (5 min) →",
    de: "Meine digitale Präsenz bewerten (5 Min) →",
    pt: "Avaliar minha presença digital (5 min) →"
  },
  // ── LEADERSHIP LEAGUES ──────────────────────────────────────
  solutionsLabel: {
    en: "The Solutions",
    es: "Las Soluciones",
    de: "Die Lösungen",
    pt: "As Soluções",
  },
  solutionsIntro: {
    en: "Start where your business is. From a lone wolf to a giant whale.",
    es: "Empezá donde está tu negocio. Desde un lobo solitario hasta una ballena gigante.",
    de: "Beginnen Sie dort, wo Ihr Unternehmen steht. Vom einsamen Wolf bis zum riesigen Wal.",
    pt: "Comece de onde seu negócio está. De um lobo solitário a uma baleia gigante.",
  },
  solutionsModelIntro: {
    en: "Choose the problem that sounds like your business. The Better Pack builds the right solution around it. Every offer follows the same model:",
    es: "Elegí el problema que suena como tu negocio. El Better Pack construye la solución adecuada alrededor. Cada oferta sigue el mismo modelo:",
    de: "Wählen Sie das Problem, das zu Ihrem Unternehmen passt. Der Better Pack baut die richtige Lösung darum herum. Jedes Angebot folgt demselben Modell:",
    pt: "Escolha o problema que soa como o seu negócio. O Better Pack constrói a solução certa em torno dele. Toda oferta segue o mesmo modelo:",
  },
  solutionsFormulaQuantos: {
    en: "You own the Quantos.",
    es: "Sos dueño de los Quantos.",
    de: "Sie besitzen die Quantos.",
    pt: "Você é dono dos Quantos.",
  },
  solutionsFormulaHacks: {
    en: "We combine them into Hacks.",
    es: "Los combinamos en Hacks.",
    de: "Wir kombinieren sie zu Hacks.",
    pt: "Nós os combinamos em Hacks.",
  },
  solutionsFormulaPowerUnits: {
    en: "Power Units get the work done.",
    es: "Los Power Units hacen el trabajo.",
    de: "Power Units erledigen die Arbeit.",
    pt: "As Power Units realizam o trabalho.",
  },
  solutionsFormulaSovereignNode: {
    en: "Every new capability can become part of your Sovereign Node.",
    es: "Cada nueva capacidad puede pasar a formar parte de tu Sovereign Node.",
    de: "Jede neue Fähigkeit kann Teil Ihres Sovereign Node werden.",
    pt: "Cada nova capacidade pode se tornar parte do seu Sovereign Node.",
  },
  leagueEmergingTitle: {
    en: "The Emerging Pack (Startups & Local Heroes)",
    es: "La Manada Emergente (Startups y Héroes Locales)",
    de: "Das aufstrebende Rudel (Startups & lokale Helden)",
    pt: "A Alcateia Emergente (Startups e Heróis Locais)"
  },
  leagueEmergingCopy: {
    en: "You have a disruptive vision, a story worth telling, and the hunger to change your industry. You need the technological foundation and AI discoverability to look and act like a global leader from day one.",
    es: "Tenés una visión disruptiva, una historia que vale la pena contar y el hambre para cambiar tu industria. Necesitás la base tecnológica y la visibilidad en IA para verte y actuar como un líder global desde el día uno.",
    de: "Sie haben eine disruptive Vision, eine erzählenswerte Geschichte und den Hunger, Ihre Branche zu verändern. Sie brauchen die technologische Grundlage und KI-Auffindbarkeit, um von Tag eins an wie ein globaler Marktführer zu wirken.",
    pt: "Você tem uma visão disruptiva, uma história que vale a pena contar e a fome para mudar seu setor. Você precisa da base tecnológica e da descoberta por IA para parecer e agir como um líder global desde o primeiro dia."
  },
  leagueEmergingCta: {
    en: "Claim Your AI Awakening (15-Min Assessment)",
    es: "Reclamá tu Despertar de IA (Evaluación de 15 min)",
    de: "Sichern Sie sich Ihr KI-Erwachen (15-Min-Bewertung)",
    pt: "Reivindique seu Despertar de IA (Avaliação de 15 min)"
  },
  leagueLoneWolfTitle: {
    en: "The Lone Wolf (Established SMEs)",
    es: "El Lobo Solitario (PyMEs Establecidas)",
    de: "Der einsame Wolf (Etablierte KMUs)",
    pt: "O Lobo Solitário (PMEs Estabelecidas)"
  },
  leagueLoneWolfCopy: {
    en: "You have traction, revenue, and a solid team, but you want to dominate the entire category. This is where we plug in our Growth Systems to turn your momentum into absolute leadership, business visibility, growth, and results. We will expose where you are losing clients and map the Growth System needed to lead. (And if your current digital footprint is outdated, your new Digital identity is on us).",
    es: "Tenés tracción, ingresos y un equipo sólido, pero querés dominar toda la categoría. Acá conectamos nuestros Sistemas de Crecimiento para convertir tu impulso en liderazgo absoluto, visibilidad de negocio, crecimiento y resultados. Vamos a exponer dónde estás perdiendo clientes y mapear el Sistema de Crecimiento que necesitás para liderar. (Y si tu presencia digital actual está desactualizada, tu nueva identidad digital corre por nuestra cuenta).",
    de: "Sie haben Traktion, Umsatz und ein solides Team, wollen aber die gesamte Kategorie dominieren. Hier setzen wir unsere Wachstumssysteme ein, um Ihre Dynamik in absolute Führung, Geschäftssichtbarkeit, Wachstum und Ergebnisse zu verwandeln. Wir zeigen auf, wo Sie Kunden verlieren, und entwerfen das Wachstumssystem, das Sie zur Führung brauchen. (Und falls Ihre aktuelle digitale Präsenz veraltet ist, geht Ihre neue digitale Identität auf unsere Kosten).",
    pt: "Você tem tração, receita e uma equipe sólida, mas quer dominar toda a categoria. É aqui que conectamos nossos Sistemas de Crescimento para transformar seu impulso em liderança absoluta, visibilidade de negócio, crescimento e resultados. Vamos expor onde você está perdendo clientes e mapear o Sistema de Crescimento necessário para liderar. (E se sua presença digital atual está desatualizada, sua nova identidade digital é por nossa conta)."
  },
  leagueWhalesTitle: {
    en: "The Whales (Enterprise)",
    es: "Las Ballenas (Enterprise)",
    de: "Die Wale (Enterprise)",
    pt: "As Baleias (Enterprise)"
  },
  leagueWhalesCopy: {
    en: "You have the size; we bring the speed. We help massive organizations break operational bottlenecks, integrate AI, and execute with the agility of a startup. No credit cards required here. Send your project lead and let's map your custom architecture.",
    es: "Vos tenés el tamaño; nosotros ponemos la velocidad. Ayudamos a organizaciones masivas a romper cuellos de botella operativos, integrar IA y ejecutar con la agilidad de una startup. Acá no se pide tarjeta de crédito. Enviá a tu líder de proyecto y mapeemos tu arquitectura a medida.",
    de: "Sie haben die Größe; wir bringen die Geschwindigkeit. Wir helfen großen Organisationen, operative Engpässe zu beseitigen, KI zu integrieren und mit der Agilität eines Startups auszuführen. Keine Kreditkarte erforderlich. Schicken Sie Ihren Projektleiter, und lassen Sie uns Ihre individuelle Architektur entwerfen.",
    pt: "Você tem o tamanho; nós trazemos a velocidade. Ajudamos organizações enormes a romper gargalos operacionais, integrar IA e executar com a agilidade de uma startup. Nenhum cartão de crédito necessário aqui. Envie o líder do seu projeto e vamos mapear sua arquitetura personalizada."
  },
  leagueWhalesCta: {
    en: "Assess my Digital Relevance and contact Enterprise Team (5-Min) →",
    es: "Evaluá mi Relevancia Digital y contactá al equipo Enterprise (5 min) →",
    de: "Meine digitale Relevanz bewerten und das Enterprise-Team kontaktieren (5 Min) →",
    pt: "Avalie minha Relevância Digital e contate a equipe Enterprise (5 min) →"
  },
  assessment15min: { en: "15 min - Free Call", es: "15 min - Llamada gratuita", de: "15 Min - Kostenloser Anruf", pt: "15 min - Chamada gratuita" },
  assessment1h: { en: "1 Hour - $50", es: "1 Hora - $50", de: "1 Stunde - $50", pt: "1 Hora - $50" },
  bookAssessment: { en: "Book Assessment", es: "Reservar evaluación", de: "Bewertung buchen", pt: "Agendar avaliação" },
  goBackModal: { en: "Go Back", es: "Volver", de: "Zurück", pt: "Voltar" },
  // En tu objeto de traducciones
  lets: { en: "Let's ", es: "Empecemos ", de: "Lass uns ", pt: "Vamos " },
  startToday: { en: "Start Today", es: "hoy mismo", de: "heute beginnen", pt: "começar hoje" },

  dream: {
    en: "Just the way you dream. Only ",
    es: "Tal como lo soñaste. Solo que ",
    de: "Genau wie du es dir erträumst. Nur ",
    pt: "Exatamente como você sonhou. Só que "
  },

  better: {
    en: "Better.",
    es: "mejor.",
    de: "besser.",
    pt: "melhor."
  },
  charlotteQuoteTitle: {
    en: "Co-Founder & Chief Digital Relevance Officer",
    es: "Co-Fundadora y Chief Digital Relevance Officer",
    de: "Mitgründerin & Chief Digital Relevance Officer",
    pt: "Co-Fundadora e Chief Digital Relevance Officer",
  },
};

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
  const tx = (key: string) => ((ui as any)[key]?.[locale] ?? (ui as any)[key]?.['en'] ?? '');

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
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-4">{tx('titulonews')}</p>
          <p className="text-slate-500 uppercase tracking-[0.25em] text-[10px] font-black mb-2">{tx('globalFeed')}</p>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{tx('newsUnavailable')}</h3>
          <p className="text-slate-500 text-sm max-w-2xl mx-auto">{newsError || tx('newsError')}</p>
        </div>
      </section>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
          <div className="hidden md:block w-48"></div>
          <div className="flex-1 flex flex-col items-center text-center">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-tight max-w-2xl mx-auto break-words">
              {tx('titulonews')}
            </h2>
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
              ) : currentArticle.cover_url ? (
                <img src={currentArticle.cover_url} alt={currentArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                  <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{tx('noPreview')}</span>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">{currentArticle.source?.name || currentArticle.category || 'News'}</span>
              </div>
              {currentArticle.video_url && (
                <div className="absolute top-4 right-4 bg-black/70 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase flex items-center gap-1">
                  <span>▶</span> Video
                </div>
              )}
            </div>
            <div className="p-8 md:w-1/2 flex flex-col justify-between">
              <div>
                {currentArticle.video_url ? (
                  <div className="mb-4 rounded-xl overflow-hidden border border-slate-200">
                    <VideoPlayer videoUrl={currentArticle.video_url} videoSource={currentArticle.video_source} />
                  </div>
                ) : null}
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">{currentArticle.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-2 font-medium">{currentArticle.description || tx('clickRead')}</p>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase text-slate-400">
                  <span>{tx('published')} {new Date(currentArticle.publishedAt || currentArticle.published_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  {currentArticle.updated_at && currentArticle.updated_at !== (currentArticle.publishedAt || currentArticle.published_at) && (
                    <span className="text-blue-500">· {tx('updated')} {new Date(currentArticle.updated_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  )}
                </div>
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
  const tx = (key: string) => ((ui as any)[key]?.[locale] ?? (ui as any)[key]?.['en'] ?? '');

  return (
    <section className="py-16 bg-white border-t border-slate-100">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">

        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 uppercase tracking-tighter">
          {tx('kitchenTitle')} <span className="text-blue-600">{tx('kitchenTitle2')}</span>
        </h2>
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">{tx('century20')}</p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative bg-slate-50 border border-slate-100 rounded-3xl p-10 md:p-16 text-center overflow-hidden"
        >
          {/* Glow decorativo, sutil sobre fondo claro */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-200/30 blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-orange-200/20 blur-3xl"
          />

          <span className="absolute top-4 left-6 text-8xl md:text-9xl font-black text-slate-900/5 select-none leading-none">
            "
          </span>

          <div className="relative">
            <p className="text-2xl md:text-4xl font-light italic text-slate-800 leading-tight md:leading-tight tracking-tight max-w-3xl mx-auto">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline"
              >
                {tx('wolfQuotePart1')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-blue-600 font-bold not-italic inline-block"
              >
                {tx('wolfQuotePack')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="inline"
              >
                {tx('wolfQuotePart2')}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200 }}
                className="text-orange-500 font-bold not-italic inline-block"
              >
                {tx('wolfQuoteWolf')}
              </motion.span>
              .
            </p>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="h-1 rounded-full bg-gradient-to-r from-blue-500 to-orange-400 mx-auto mt-8"
            />
          </div>
        </motion.div>

      </div>
    </section>
  );
};


//  CASOS DE ÉXITO 
const CasosDeExito = ({ showMachinesModal, setShowMachinesModal }: { showMachinesModal: boolean; setShowMachinesModal: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const locale = useLocale() as Locale;
  const tx = (key: string) => ((ui as any)[key]?.[locale] ?? (ui as any)[key]?.['en'] ?? '');

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
      <div className="w-full max-w-7xl mx-auto">
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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tighter max-w-4xl text-white uppercase">
            {tx('openLatam')}
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-[1.05] tracking-tighter max-w-4xl text-blue-600 uppercase">
            {tx('globalCompanies')}
          </h2>
          <p className="mt-3 text-white text-[10px] md:text-[12px] uppercase tracking-widest font-bold">{tx('subtagline')}</p>
          <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
            <a href="https://wa.me/593991358652?text=Hi!%20I%27d%20like%20to%20get%20in%20touch%20with%20the%20team." className="inline-block px-8 py-3 bg-[#FF6B00] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-[10px] transition-transform active:scale-95">
              {tx('heroCtaPrimary')}
            </a>
            <a href="#mittelstand" className="inline-block px-8 py-3 border-2 border-white text-white rounded-full font-bold uppercase tracking-widest text-[10px] transition-colors hover:bg-white hover:text-slate-900">
              {tx('heroCtaSecondary')}
            </a>
          </div>
        </div>
      </section>



      {/* 3. CHAT */}
      <ChatSection />



      {/* 4. MITTELSTAND */}
      <section id="mittelstand" className="py-12 md:py-24 px-6 bg-slate-50 border-y border-slate-200">
        <div className="w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">

          {/* COLUMNA IZQUIERDA (antes derecha) */}

          <div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600 block mb-3">
              {ui.ourCustomers[locale]}
            </span>

            <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight tracking-tighter uppercase">
              {tx('problemHeadline')}
            </h2>

            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-4 text-balance">
              {tx('problemIntro')}
            </p>
            <ol className="list-decimal list-inside space-y-3 text-slate-600 text-base leading-relaxed mb-8">
              <li>{tx('problemPoint1')}</li>
              <li>{tx('problemPoint2')}</li>
            </ol>

            <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4 leading-tight">
              {tx('problemHighlight')}
            </h3>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-8 text-balance">
              {tx('problemBody')}
            </p>


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
              {ui.engineeringPrice[locale].map((part, i) =>
                part.bold ? (
                  <strong key={i} className="font-black text-slate-900">{part.text}</strong>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              )}
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
        {/* QUOTE CARD — CHARLOTTE */}
        <div className="w-full max-w-7xl mx-auto px-6 mt-10 md:mt-6 mb-16">
          <div className="relative bg-white border border-slate-100 rounded-3xl shadow-xl p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0 bg-blue-50">
                <Image src="/charlotte.jpeg" alt="Charlotte Götz" fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 font-black text-sm">Charlotte Götz</p>
                <p className="text-blue-600 font-black uppercase tracking-[0.1em] text-[10px] mt-0.5">
                  {tx('charlotteQuoteTitle')}
                </p>
              </div>

              <a href="https://www.linkedin.com/in/charlotte-goetz-public/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border border-slate-200 rounded-full px-3 py-1.5 hover:border-blue-600 hover:bg-blue-50 transition-all flex-shrink-0">
                <LinkedInIcon />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">LinkedIn</span>
              </a>
            </div>
            <p className="text-slate-800 text-lg md:text-xl leading-relaxed font-medium">
              "<mark className="bg-orange-200/70 px-1 rounded">{tx('problemQuote')}</mark>"
            </p>
          </div>
        </div>
        {/* CIERRE THE PROBLEM — full width con animaciones e impacto */}
        <div className="w-full max-w-7xl mx-auto mt-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -4 }}
            className="relative bg-gradient-to-b from-white via-slate-50/50 to-white rounded-3xl border border-slate-200 shadow-xl p-8 md:p-14 text-center overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-500/30 group"
          >
            {/* Glows decorativos de fondo con colores de la marca */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none group-hover:bg-orange-500/20 transition-all duration-500" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none group-hover:bg-blue-600/20 transition-all duration-500" />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* Subtítulo Naranja con entrada escalonada */}
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl md:text-3xl font-black text-orange-500 mb-2 tracking-tight"
              >
                {tx('problemSubscriptions')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-slate-500 text-base md:text-lg leading-relaxed mb-8 font-medium"
              >
                {tx('problemTogether')}
              </motion.p>

              {/* Línea divisora animada */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="h-1 bg-gradient-to-r from-orange-500 to-blue-600 mx-auto mb-8 rounded-full"
              />

              {/* Título Principal */}
              <motion.h3
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-xl md:text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase"
              >
                {tx('problemRentNet')}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto mb-3"
              >
                {tx('problemInfra')}
              </motion.p>

              {/* Frase Destacada Naranja / Azul */}
              <motion.p
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-blue-600 font-black text-lg md:text-xl mb-4 uppercase tracking-wide"
              >
                {tx('problemOwnership')}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-slate-600 text-lg leading-relaxed max-w-3xl mx-auto mb-10"
              >
                {tx('problemConnects')}
              </motion.p>

              {/* Botón CTA con efecto interactivo */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex justify-center"
              >
                <motion.a
                  href="https://calendar.app.google/Ntnv2PvHmPNgCnKZ6"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-blue-600 text-white font-black text-xs md:text-sm uppercase tracking-widest px-10 py-5 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 border border-blue-500"
                >
                  {tx('chooseNextMove')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
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
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                {ui.packModalIntroBefore[locale]}
                <span className="font-bold text-blue-600">{ui.packModalIntroHighlight[locale]}</span>
                {ui.packModalIntroAfter[locale]}
              </p>
              <p className="text-slate-900 font-bold text-lg italic mb-6">
                "{ui.packModalQuote[locale]}"
              </p>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {ui.packModalBodyBefore[locale]}
                <span className="font-bold text-blue-600">{ui.packModalBodyHighlight[locale]}</span>
                {ui.packModalBodyAfter[locale]}
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
                {ui.termsModalBody[locale].map((part, i) =>
                  part.bold ? (
                    <strong key={i} className="font-black text-slate-900">{part.text}</strong>
                  ) : (
                    <span key={i}>{part.text}</span>
                  )
                )}
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

      <GrowthCapabilities tx={tx} />
      <ScholarshipsPartnerships tx={tx} />


      <div className="py-16 px-6 bg-white text-center">
        <div className="w-full max-w-7xl mx-auto">
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
        <div className="w-full max-w-7xl mx-auto">


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




      {/*  NEWS FEED */}
      <NewsSection />



      {/* LATEST INSIGHTS */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6 text-center">

          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-4">{tx('stayUpdated')}</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase">{tx('latestInsights')}</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-10">{tx('blogDesc')}</p>
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-left">
              {posts.map((post) => (
                <ArticleCard
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  cover_url={post.cover_url}
                  category={post.category}
                  slug={post.slug}
                  post_url={post.post_url}
                  published_at={post.published_at}
                  updated_at={post.updated_at}
                  video_url={post.video_url}
                  locale={locale}
                  readMoreText={tx('readMore')}
                  publishedText={tx('published')}
                  updatedText={tx('updated')}
                  noImageText={tx('noImage')}
                  noDescText={tx('noDesc') as string}
                />
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





    </main >
  );
};





