"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { useLocale, useTranslations } from 'next-intl';

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
  { src: "/home1.jpeg",      alt: "Main Home",    title: "Home",                     text: "Main dashboard where you can track your wallet, accounts, and overall impact." },
  { src: "/registrate.jpeg", alt: "Registration", title: "Join the App",             text: "Sign up, explore, participate, and turn your consumption into meaningful action." },
  { src: "/home.jpeg",       alt: "Login",        title: "Start Exploring",          text: "Top up your balance, shop for products, get them delivered, and transform habits into impact." },
  { src: "/mismonedas.jpeg", alt: "Wallet",       title: "Recharge & Shop",          text: "Seamless transactions designed to generate social and environmental value." },
  { src: "/grupos.jpeg",     alt: "Groups",       title: "Build or Join Communities", text: "Join existing groups or create your own to organize circular economy events." },
  { src: "/carrito2.jpeg",   alt: "Cart",         title: "Delivery with Purpose",    text: "Every delivery fuels a network built on circular impact and sustainability." },
  { src: "/impacto.jpeg",    alt: "Impact",       title: "Your Impact",              text: "Track recycled kilograms, liters of water saved, and Becoins earned." },
  { src: "/ordenes.jpeg",    alt: "Orders",       title: "My Orders",                text: "View and manage your active or completed purchases." },
];

const belandScreenshotsEs = [
  { src: "/home1.jpeg",      alt: "Inicio",    title: "Inicio",                      text: "Panel principal para seguir tu billetera, cuentas e impacto general." },
  { src: "/registrate.jpeg", alt: "Registro",  title: "Unete a la App",              text: "Registrate, explora, participa y transforma tu consumo en accion con sentido." },
  { src: "/home.jpeg",       alt: "Acceso",    title: "Comienza a explorar",         text: "Recarga saldo, compra productos, recibelos y convierte habitos en impacto." },
  { src: "/mismonedas.jpeg", alt: "Billetera", title: "Recarga y compra",            text: "Transacciones fluidas pensadas para generar valor social y ambiental." },
  { src: "/grupos.jpeg",     alt: "Grupos",    title: "Crea o unete a comunidades",  text: "Unete a grupos existentes o crea el tuyo para organizar eventos de economia circular." },
  { src: "/carrito2.jpeg",   alt: "Carrito",   title: "Entregas con proposito",      text: "Cada entrega impulsa una red basada en impacto circular y sostenibilidad." },
  { src: "/impacto.jpeg",    alt: "Impacto",   title: "Tu impacto",                  text: "Sigue kilos reciclados, litros de agua ahorrados y Becoins ganados." },
  { src: "/ordenes.jpeg",    alt: "Ordenes",   title: "Mis ordenes",                 text: "Visualiza y gestiona compras activas o completadas." },
];

const belandScreenshotsDe = [
  { src: "/home1.jpeg",      alt: "Startseite",  title: "Startseite",                    text: "Haupt-Dashboard zum Verfolgen deiner Wallet, Konten und Gesamtauswirkung." },
  { src: "/registrate.jpeg", alt: "Registrierung", title: "App beitreten",               text: "Registriere dich, erkunde, mach mit und verwandle deinen Konsum in sinnvolle Aktionen." },
  { src: "/home.jpeg",       alt: "Anmeldung",   title: "Erkunden beginnen",             text: "Guthaben aufladen, Produkte kaufen, liefern lassen und Gewohnheiten in Wirkung umwandeln." },
  { src: "/mismonedas.jpeg", alt: "Wallet",      title: "Aufladen & Einkaufen",          text: "Nahtlose Transaktionen, die sozialen und ökologischen Mehrwert erzeugen." },
  { src: "/grupos.jpeg",     alt: "Gruppen",     title: "Communities erstellen oder beitreten", text: "Bestehenden Gruppen beitreten oder eigene für Kreislaufwirtschafts-Events erstellen." },
  { src: "/carrito2.jpeg",   alt: "Warenkorb",   title: "Lieferung mit Zweck",           text: "Jede Lieferung stärkt ein Netzwerk, das auf kreisförmiger Wirkung aufgebaut ist." },
  { src: "/impacto.jpeg",    alt: "Wirkung",     title: "Deine Wirkung",                 text: "Recycelte Kilogramm, gesparte Liter Wasser und verdiente Becoins verfolgen." },
  { src: "/ordenes.jpeg",    alt: "Bestellungen", title: "Meine Bestellungen",           text: "Aktive oder abgeschlossene Käufe anzeigen und verwalten." },
];

const belandScreenshotsPt = [
  { src: "/home1.jpeg",      alt: "Início",     title: "Início",                       text: "Painel principal para acompanhar sua carteira, contas e impacto geral." },
  { src: "/registrate.jpeg", alt: "Registro",   title: "Entrar no App",                text: "Cadastre-se, explore, participe e transforme seu consumo em ação significativa." },
  { src: "/home.jpeg",       alt: "Login",      title: "Começar a explorar",           text: "Recarregue saldo, compre produtos, receba em casa e transforme hábitos em impacto." },
  { src: "/mismonedas.jpeg", alt: "Carteira",   title: "Recarregar & Comprar",         text: "Transações fluidas projetadas para gerar valor social e ambiental." },
  { src: "/grupos.jpeg",     alt: "Grupos",     title: "Criar ou entrar em comunidades", text: "Entre em grupos existentes ou crie o seu para organizar eventos de economia circular." },
  { src: "/carrito2.jpeg",   alt: "Carrinho",   title: "Entrega com propósito",        text: "Cada entrega alimenta uma rede construída sobre impacto circular e sustentabilidade." },
  { src: "/impacto.jpeg",    alt: "Impacto",    title: "Seu impacto",                  text: "Acompanhe quilos reciclados, litros de água economizados e Becoins ganhos." },
  { src: "/ordenes.jpeg",    alt: "Pedidos",    title: "Meus pedidos",                 text: "Visualize e gerencie suas compras ativas ou concluídas." },
];

const belandTags = ["React Native", "Payments", "Delivery", "Circular Economy"];

// ─── DICCIONARIO MULTI-IDIOMA ─────────────────────────────────────────────────
const ui = {
  // Hero
  openLatam:       { en: "We open LATAM for",    es: "Abrimos LATAM para",        de: "Wir öffnen LATAM für",       pt: "Abrimos LATAM para" },
  globalCompanies: { en: "Global companies",      es: "empresas globales",          de: "Globale Unternehmen",        pt: "empresas globais" },
  subtagline:      {
    en: "Nearshoring Operator · Supply Chain Partner · Talent Hub · Entry & Ops Partner",
    es: "Operador de nearshoring · Partner de supply chain · Hub de talento · Partner de entrada y operaciones",
    de: "Nearshoring-Betreiber · Supply-Chain-Partner · Talent Hub · Markteinstieg & Ops",
    pt: "Operador de nearshoring · Parceiro de supply chain · Hub de talentos · Parceiro de entrada e operações",
  },
  getInTouch: { en: "Get in touch", es: "Contactar ahora", de: "Kontakt aufnehmen", pt: "Entre em contato" },

  // News section
  loadingFeed:       { en: "Loading Intelligence Feed...", es: "Cargando feed de inteligencia...", de: "Intelligence Feed wird geladen...", pt: "Carregando feed de inteligência..." },
  globalFeed:        { en: "Global Intelligence Feed",     es: "Feed global de inteligencia",     de: "Globaler Intelligence Feed",        pt: "Feed global de inteligência" },
  inTimesOf:         { en: "In times of",                  es: "En tiempos de",                   de: "In Zeiten von",                     pt: "Em tempos de" },
  changeTurbulence:  { en: "Change and Turbulence",        es: "Cambio y Turbulencia",            de: "Wandel und Turbulenz",              pt: "Mudança e Turbulência" },
  liveUpdates:       { en: "Live updates // April 2026",   es: "Actualizaciones en vivo // Abril 2026", de: "Live-Updates // April 2026",   pt: "Atualizações ao vivo // Abril 2026" },
  systemActive:      { en: "System Active",                es: "Sistema activo",                  de: "System aktiv",                      pt: "Sistema ativo" },
  newsUnavailable:   { en: "News currently unavailable.",  es: "Noticias no disponibles por ahora.", de: "Nachrichten derzeit nicht verfügbar.", pt: "Notícias indisponíveis no momento." },
  newsError:         { en: "We could not fetch the latest intelligence right now. Please try again soon.", es: "No pudimos cargar la inteligencia mas reciente. Intenta nuevamente pronto.", de: "Wir konnten die neuesten Informationen gerade nicht abrufen. Bitte versuche es bald erneut.", pt: "Não conseguimos carregar as informações mais recentes. Tente novamente em breve." },
  noPreview:         { en: "No Preview Available",         es: "Sin vista previa",                de: "Keine Vorschau verfügbar",          pt: "Sem pré-visualização" },
  clickRead:         { en: "Click to read the full coverage of this digital transformation update.", es: "Haz clic para leer la cobertura completa de esta actualizacion de transformacion digital.", de: "Klicke, um die vollständige Berichterstattung zu lesen.", pt: "Clique para ler a cobertura completa desta atualização de transformação digital." },
  read:              { en: "Read →",                       es: "Leer →",                          de: "Lesen →",                           pt: "Ler →" },
  prevArticle:       { en: "Previous article",             es: "Articulo anterior",               de: "Vorheriger Artikel",                pt: "Artigo anterior" },
  nextArticle:       { en: "Next article",                 es: "Siguiente articulo",              de: "Nächster Artikel",                  pt: "Próximo artigo" },

  // Chat section
  kitchenTitle:   { en: "OUR KITCHEN IS ALWAYS", es: "NUESTRA COCINA SIEMPRE ESTA", de: "UNSERE KÜCHE IST IMMER",      pt: "NOSSA COZINHA ESTÁ SEMPRE" },
  kitchenOpen:    { en: "OPEN",                   es: "ABIERTA",                     de: "GEÖFFNET",                    pt: "ABERTA" },
  century20:      { en: "The 20th century said the future would be built elsewhere. Today, we see a better alternative. We think differently.", es: "El siglo XX decia que el futuro se construiria en otro lugar. Hoy vemos una mejor alternativa. Pensamos diferente.", de: "Das 20. Jahrhundert sagte, die Zukunft würde anderswo gebaut. Heute sehen wir eine bessere Alternative. Wir denken anders.", pt: "O século XX dizia que o futuro seria construído em outro lugar. Hoje vemos uma alternativa melhor. Pensamos diferente." },
  followSocial:   { en: "See for yourself - Follow us on Social Media.", es: "Compruebalo tu mismo - Siguenos en redes sociales.", de: "Überzeuge dich selbst - Folge uns in den sozialen Medien.", pt: "Veja por si mesmo - Siga-nos nas redes sociais." },
  howCanHelp:     { en: "How can",                es: "Como puede ayudarte hoy",     de: "Wie kann",                    pt: "Como pode" },
  theTeam:        { en: "the team",               es: "el equipo",                   de: "das Team",                    pt: "a equipe" },
  helpToday:      { en: " help you today?",        es: "?",                           de: " dir heute helfen?",          pt: " te ajudar hoje?" },
  connectTeam:    { en: "Connect with the team",  es: "Conectar con el equipo",      de: "Mit dem Team verbinden",      pt: "Conectar com a equipe" },
  goBack:         { en: "← Go back",              es: "← Volver",                    de: "← Zurück",                    pt: "← Voltar" },
  whatWeSell:     { en: "What we sell:",           es: "Que vendemos:",               de: "Was wir verkaufen:",          pt: "O que vendemos:" },
  indAccel:       { en: "Industrial Acceleration", es: "Aceleracion industrial",      de: "Industrielle Beschleunigung", pt: "Aceleração industrial" },
  relocate:       { en: "Relocating global production to LATAM with speed and cost efficiency.", es: "Relocalizamos produccion global en LATAM con velocidad y eficiencia de costos.", de: "Verlagerung globaler Produktion nach LATAM mit Geschwindigkeit und Kosteneffizienz.", pt: "Relocalização da produção global para a LATAM com velocidade e eficiência de custos." },
  opSetup:        { en: " Operational setup in PY / MX / CO",   es: " Setup operativo en PY / MX / CO",      de: " Operativer Aufbau in PY / MX / CO",   pt: " Configuração operacional em PY / MX / CO" },
  supplierNet:    { en: " Industrial supplier networks",         es: " Redes industriales de proveedores",    de: " Industrielle Lieferantennetzwerke",    pt: " Redes industriais de fornecedores" },
  costOpt:        { en: " Cost optimization (30–60%)",          es: " Optimizacion de costos (30–60%)",      de: " Kostenoptimierung (30–60%)",          pt: " Otimização de custos (30–60%)" },
  localMgmt:      { en: " Local operational management",        es: " Gestion operativa local",              de: " Lokales Betriebsmanagement",          pt: " Gestão operacional local" },
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

  // Casos de éxito
  successStories: { en: "Our Success Stories",        es: "Nuestros casos de exito",        de: "Unsere Erfolgsgeschichten",          pt: "Nossos casos de sucesso" },
  builtByUs:      { en: "Built by us.",                es: "Construido por nosotros.",        de: "Von uns gebaut.",                    pt: "Construído por nós." },
  usedByPeople:   { en: "Used by people.",             es: "Usado por personas.",             de: "Von Menschen genutzt.",              pt: "Usado por pessoas." },
  circularEco:    { en: "A",                           es: "Un",                              de: "Ein",                                pt: "Um" },
  circularEco2:   { en: "circular ecosystem",          es: "ecosistema circular",             de: "kreisförmiges Ökosystem",            pt: "ecossistema circular" },
  circularEco3:   { en: "that integrates payments, delivery, and rewards within a single system, driving a network where every", es: "que integra pagos, entregas y recompensas en un solo sistema, impulsando una red donde cada", de: "das Zahlungen, Lieferung und Belohnungen in einem System integriert und ein Netzwerk antreibt, in dem jede", pt: "que integra pagamentos, entregas e recompensas em um único sistema, impulsionando uma rede onde cada" },
  positiveAction: { en: "positive action",             es: "accion positiva",                 de: "positive Aktion",                    pt: "ação positiva" },
  strengthens:    { en: "strengthens the entire community.", es: "fortalece a toda la comunidad.", de: "die gesamte Gemeinschaft stärkt.", pt: "fortalece toda a comunidade." },
  viewApp:        { en: "View the app",                es: "Ver la app",                      de: "App ansehen",                        pt: "Ver o app" },

  // Mittelstand
  problemTitle:   { en: "The Problem we solve",        es: "El problema que resolvemos",      de: "Das Problem, das wir lösen",         pt: "O problema que resolvemos" },
  problemDesc:    { en: "Long supply chains in Asia and the Middle East are under pressure due to conflict. Latin America is the obvious alternative — but hard to operationalize.", es: "Las cadenas de suministro largas en Asia y Medio Oriente estan bajo presion por los conflictos. Latinoamerica es la alternativa obvia, pero dificil de operar.", de: "Lange Lieferketten in Asien und dem Nahen Osten stehen durch Konflikte unter Druck. Lateinamerika ist die naheliegende Alternative — aber schwer zu operationalisieren.", pt: "As longas cadeias de suprimento na Ásia e no Oriente Médio estão sob pressão. A América Latina é a alternativa óbvia — mas difícil de operacionalizar." },
  typicalTickets: { en: "Typical tickets:",            es: "Tickets tipicos:",                de: "Typische Tickets:",                  pt: "Tickets típicos:" },
  ourCustomers:   { en: "Our Customers:",              es: "Nuestros clientes:",              de: "Unsere Kunden:",                     pt: "Nossos Clientes:" },
  midSized1:      { en: "Mid-Sized",                   es: "Empresas globales",               de: "Mittelständische",                   pt: "Empresas Globais" },
  midSized2:      { en: "Global Companies",            es: "de tamano medio",                 de: "Globale Unternehmen",                pt: "de Médio Porte" },
  employees:      { en: "50–500 employees",            es: "50–500 empleados",                de: "50–500 Mitarbeiter",                 pt: "50–500 funcionários" },
  multiOps:       { en: "Operations across multiple countries / regions", es: "Operaciones en multiples paises / regiones", de: "Betrieb in mehreren Ländern / Regionen", pt: "Operações em vários países / regiões" },
  longChains:     { en: "Dependent on long supply chains", es: "Dependientes de cadenas de suministro largas", de: "Abhängig von langen Lieferketten", pt: "Dependentes de longas cadeias de suprimento" },
  tradModels:     { en: "Traditional business models", es: "Modelos de negocio tradicionales", de: "Traditionelle Geschäftsmodelle",    pt: "Modelos de negócios tradicionais" },

  // Pricing
  whatWeDeliver:  { en: "What",         es: "Que",           de: "Was wir",      pt: "O que" },
  weDeliver:      { en: "we deliver",   es: "entregamos",    de: "liefern",      pt: "entregamos" },
  tailorMade:     { en: "Tailor made",  es: "A medida",      de: "Maßgeschneidert", pt: "Sob medida" },
  oppValidation:  { en: " Opportunity Validation: Problem + viable solution hypothesis",  es: " Validacion de oportunidad: problema + hipotesis de solucion viable", de: " Chancenvalidierung: Problem + tragfähige Lösungshypothese", pt: " Validação de oportunidade: problema + hipótese de solução viável" },
  feasibility:    { en: " Feasibility Study: Financial overview + Operational forecast",  es: " Estudio de factibilidad: overview financiero + pronostico operativo", de: " Machbarkeitsstudie: Finanzübersicht + Betriebsprognose", pt: " Estudo de viabilidade: visão financeira + previsão operacional" },
  solutionEng:    { en: " Solution engineering",          es: " Ingenieria de solucion",       de: " Lösungsengineering",        pt: " Engenharia de solução" },
  functionalMvp:  { en: " Functional MVP",                es: " MVP funcional",                de: " Funktionaler MVP",          pt: " MVP funcional" },
  betaTesting:    { en: " Beta testing (with real users)", es: " Beta testing (con usuarios reales)", de: " Beta-Test (mit echten Nutzern)", pt: " Beta testing (com usuários reais)" },
  localDigital:   { en: " Local + Digital operations",    es: " Operaciones locales + digitales", de: " Lokale + digitale Operationen", pt: " Operações locais + digitais" },
  successOri:     { en: " Success oriented business execution", es: " Ejecucion orientada a resultados", de: " Erfolgsorientierte Geschäftsausführung", pt: " Execução orientada ao sucesso" },
  reducedCosts:   { en: " Reduced operational costs",    es: " Reduccion de costos operativos", de: " Reduzierte Betriebskosten", pt: " Custos operacionais reduzidos" },
  fasterScaling:  { en: " Faster and better scaling",    es: " Escalamiento mas rapido y mejor", de: " Schnelleres und besseres Skalieren", pt: " Escalonamento mais rápido e melhor" },

  // Team
  aboutTeam:      { en: "About our Team",        es: "Sobre nuestro equipo",    de: "Über unser Team",             pt: "Sobre nossa equipe" },
  highPerf:       { en: "High",                  es: "Ejecucion de",            de: "Hochleistungs-",              pt: "Execução de" },
  highPerfEm:     { en: "Performance execution", es: "alto rendimiento",        de: "Ausführung",                  pt: "alto desempenho" },
  forged:         { en: "Forged in high",        es: "Forjados en entornos de", de: "Geformt in",                  pt: "Forjados em" },
  pressure:       { en: "pressure environments", es: "alta presion",            de: "Hochdruckumgebungen",         pt: "ambientes de alta pressão" },

  // Cierre
  closingLine:    { en: "Understand the past — build what's next.", es: "Comprende el pasado — construye lo que viene.", de: "Verstehe die Vergangenheit — baue die Zukunft.", pt: "Entenda o passado — construa o futuro." },
  letsStart:      { en: "LET'S START",           es: "COMENCEMOS",              de: "LASST UNS",                   pt: "VAMOS COMEÇAR" },
  today:          { en: "TODAY",                 es: "HOY",                     de: "HEUTE BEGINNEN",              pt: "HOJE" },

  // Latest Insights
  stayUpdated:    { en: "Stay updated with us",  es: "Mantente actualizado con nosotros", de: "Bleib auf dem Laufenden", pt: "Fique atualizado conosco" },
  latestInsights: { en: "Latest Insights",        es: "Ultimos insights",        de: "Neueste Einblicke",           pt: "Últimos insights" },
  blogDesc:       { en: "Explore our blog for industry trends, tech updates, and innovation stories.", es: "Explora nuestro blog para ver tendencias, actualizaciones tecnologicas e historias de innovacion.", de: "Erkunden Sie unseren Blog für Branchentrends, Tech-Updates und Innovationsgeschichten.", pt: "Explore nosso blog para tendências do setor, atualizações de tecnologia e histórias de inovação." },
  noPostsYet:     { en: "No posts available yet.", es: "Aun no hay posts disponibles.", de: "Noch keine Beiträge verfügbar.", pt: "Ainda não há posts disponíveis." },
  readMore:       { en: "Read More →",            es: "Leer mas →",              de: "Weiterlesen →",               pt: "Ler mais →" },
  noImage:        { en: "NO IMAGE",               es: "SIN IMAGEN",              de: "KEIN BILD",                   pt: "SEM IMAGEM" },
  noDesc:         { en: "No description available", es: "No hay descripcion disponible", de: "Keine Beschreibung verfügbar", pt: "Sem descrição disponível" },

  // Footer
  dontMiss:       { en: "Don't miss a move",      es: "No te pierdas ningun movimiento", de: "Verpasse keine Bewegung",  pt: "Não perca nenhum movimento" },
  followJourney:  { en: "Follow our",             es: "Sigue nuestro",           de: "Folge unserem",               pt: "Siga nossa" },
  journey:        { en: "journey",                es: "camino",                  de: "Weg",                         pt: "jornada" },
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
const Avatar = ({ member }: { member: (typeof team)[0] }) => {
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
          if (!response.ok) { console.warn('Servicio de noticias externas no disponible.'); return null; }
          return await response.json();
        } catch (err) { console.error('Error fetchExternal:', err); return null; }
      };
      const fetchLocal = async () => {
        try {
          const response = await fetch('/api/local-news');
          if (!response.ok) { console.warn('Servicio de noticias locales no disponible.'); return null; }
          return await response.json();
        } catch (err) { console.error('Error fetchLocal:', err); return null; }
      };
      try {
        const [externalData, localData] = await Promise.all([fetchExternal(), fetchLocal()]);
        if (externalData) { /* setExternalNews(externalData) */ }
        if (localData) { /* setLocalNews(localData) */ }
      } catch (err) { console.error("Error general en fetchNews:", err); }
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
      <section className="py-24 bg-white border-t border-slate-100">
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
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-8">
          <div className="hidden md:block w-48"></div>
          <div className="flex-1 flex flex-col items-center text-center">
            <div className="mt-8 inline-flex flex-col items-center"></div>
            <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mt-6 mb-4 block italic">{tx('globalFeed')}</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              {tx('inTimesOf')} <br />
              <span className="text-blue-600 italic underline decoration-slate-200">{tx('changeTurbulence')}</span>
            </h2>
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
            <div className="flex gap-2">
              {articles.map((article: any, index: number) => (
                <button key={index} onClick={() => setCurrentIndex(index)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${index === currentIndex ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {new Date(article.publishedAt).toLocaleDateString(dateLang, { month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <button onClick={goToNext} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" aria-label={tx('nextArticle') as string}>
              <span className="text-slate-500 font-black">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── CHAT SECTION ────────────────────────────────────────────────────────────
const ChatSection = () => {
  const locale = useLocale() as Locale;
  const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

  const [step, setStep] = useState<number>(1);
  const [selection, setSelection] = useState<string>("");
  const options = (ui.chatOptions as any)[locale] ?? ui.chatOptions.en;

  const handleWhatsApp = (option: string) => {
    const phoneNumber = "593995269974";
    const msgFn = (ui.whatsappMsg as any)[locale] ?? ui.whatsappMsg.en;
    const message = encodeURIComponent(msgFn(option));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">WE DELIVER</p>
        <p className="text-dark-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">REAL TIME CERTAINTY (RTC)</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 uppercase tracking-tighter">
          {tx('kitchenTitle')} <span className="italic underline decoration-blue-100"> {tx('kitchenOpen')} </span>
        </h2>
        <p className="text-blue-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">{tx('century20')}</p>
        <p className="text-dark-600 uppercase tracking-[0.2em] text-[10px] mb-4 font-bold">{tx('followSocial')}</p>
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better.technologies?igsh=cjQ1c3F4OWpoYWhq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
        <div className="relative bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 transition-all hover:border-blue-600/30 text-center">
          {step === 1 ? (
            <>
              <p className="text-xl text-slate-600 mb-8 font-light">
                {tx('howCanHelp')} <span className="text-slate-900 font-semibold underline decoration-blue-600 underline-offset-4">{tx('theTeam')}</span>{tx('helpToday')}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {options.map((opt: string) => (
                  <button key={opt} onClick={() => { setSelection(opt); setStep(2); }} className="text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full border-2 border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 transition-all active:scale-95 shadow-sm">{opt}</button>
                ))}
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
    </section>
  );
};

// ─── CASOS DE ÉXITO ──────────────────────────────────────────────────────────
const CasosDeExito = () => {
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
    <section className="py-24 px-6 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
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
            <a href="https://beland.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 self-start bg-blue-600 text-white px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 active:scale-95">
              {tx('viewApp')} <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN HOME ───────────────────────────────────────────────────────────────
export default function Home() {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;
  const tx = (key: keyof typeof ui) => (ui[key] as any)[locale] ?? (ui[key] as any)['en'];

  const [posts, setPosts] = useState<any[]>([]);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const teamMap = { en: team, es: teamEs, de: teamDe, pt: teamPt };
  const teamData = teamMap[locale] ?? team;

  // ── Fetch posts con traducción multi-idioma ────────────────────────────────
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
            // fallback a originales
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
    video.muted = true; video.playsInline = true;
    const tryPlay = () => { video.play().catch(() => {}); };
    video.addEventListener("loadedmetadata", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    tryPlay();
    video.addEventListener("touchstart", tryPlay, { once: true });
    return () => {
      video.removeEventListener("loadedmetadata", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
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
        <video ref={heroVideoRef} className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover" autoPlay loop muted playsInline preload="auto">
          <source src={`https://res.cloudinary.com/djp2qzp9f/video/upload/q_auto,vc_h264/${isMobile ? "c_fill,ar_9:16" : "c_fill,ar_16:9"}/v1775676329/IMG_2919_l50wan.mp4`} type="video/mp4" />
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
          <a href="https://wa.me/593995269974?text=Hi!%20I%27d%20like%20to%20get%20in%20touch%20with%20the%20team." className="mt-3 inline-block px-8 py-3 bg-[#FF6B00] text-white rounded-full font-bold shadow-lg uppercase tracking-widest text-[10px] transition-transform active:scale-95">
            {tx('getInTouch')}
          </a>
        </div>
      </section>

      {/* 2. NEWS FEED */}
      <NewsSection />

      {/* 3. CHAT */}
      <ChatSection />

      {/* 4. MITTELSTAND */}
      <section id="mittelstand" className="py-16 md:py-40 px-6 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
            <h3 className="text-xl font-bold mb-6 uppercase tracking-wider text-slate-900">{tx('problemTitle')}</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">{tx('problemDesc')}</p>
            <div className="space-y-4 mb-8">
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">BCG Digital Ventures</p>
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">McKinsey &amp; Company</p>
              <p className="text-base line-through decoration-red-600 decoration-2 font-bold italic text-slate-400">Accenture</p>
            </div>
            <div className="pt-6 border-t border-slate-100">
              <p className="text-sm font-bold italic text-slate-900 tracking-tight">{tx('typicalTickets')} <span className="text-blue-600">€150k - €1M+</span></p>
            </div>
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 text-slate-900 leading-[1.1] tracking-tighter">
              {tx('ourCustomers')} <br />
              <span className="text-blue-600">{tx('midSized1')}<br />{tx('midSized2')}</span>
            </h2>
            <ul className="space-y-6 text-xl text-slate-600 font-medium mb-10">
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />{tx('employees')}</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />{tx('multiOps')}</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />{tx('longChains')}</li>
              <li className="flex items-center gap-4"><span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />{tx('tradModels')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="pt-10 pb-40 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-20 text-slate-900 uppercase tracking-tighter">
            {tx('whatWeDeliver')} <span className="text-blue-600"> {tx('weDeliver')} </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50">
              <div className="flex flex-col gap-4 mb-10">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">72h Validation Challenge</h3>
                <span className="self-start bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€3k – €10k</span>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="font-bold flex items-start gap-2"><span className="text-blue-600 mt-0.5">→</span>{tx('oppValidation')}</li>
                <li className="font-bold flex items-start gap-2"><span className="text-blue-600 mt-0.5">→</span>{tx('feasibility')}</li>
              </ul>
            </div>
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50 shadow-xl shadow-slate-100">
              <div className="flex flex-col gap-4 mb-10">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">MVP Stage — 90 days</h3>
                <span className="self-start bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black italic">€30k – €120k</span>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('solutionEng')}</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('functionalMvp')}</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('betaTesting')}</li>
              </ul>
            </div>
            <div className="group border-2 border-slate-100 p-12 rounded-3xl hover:border-blue-600 transition-all duration-500 bg-slate-50/50">
              <div className="flex flex-col gap-4 mb-10">
                <h3 className="text-2xl font-bold text-slate-900 uppercase">Growth / Scale</h3>
                <span className="self-start bg-slate-900 text-white px-4 py-1 rounded-full text-xs font-black italic">{tx('tailorMade')}</span>
              </div>
              <ul className="space-y-4 text-slate-600">
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('localDigital')}</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('successOri')}</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('reducedCosts')}</li>
                <li className="font-bold flex items-center gap-2"><span className="text-blue-600">✓</span>{tx('fasterScaling')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EQUIPO */}
      <section id="about" className="pt-12 pb-24 px-6 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-2">{tx('aboutTeam')}</p>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6">
            {tx('highPerf')} <em className="italic underline decoration-blue-100">{tx('highPerfEm')}</em>
          </h2>
          <div className="border-l-[3px] border-blue-600 pl-5 bg-slate-50 py-4 pr-5 rounded-r-2xl mb-8">
            <p className="text-slate-900 font-black italic text-sm leading-relaxed tracking-tight">
              {tx('forged')} <br /><span className="text-blue-600">{tx('pressure')}</span>
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
      <CasosDeExito />

      {/* CIERRE */}
      <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] uppercase mb-6 text-center py-16 px-6">
        <span className="block mb-4">{tx('closingLine')}</span>
        <span className="block">
          {tx('letsStart')}{" "}
          <em className="italic underline decoration-blue-100">{tx('today')}</em>
        </span>
      </h2>

      {/* LATEST INSIGHTS */}
      <section className="py-24 bg-slate-50">
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
                  <a href={`/${locale}/blog/${post.slug}`} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors">{tx('readMore')}</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center"><p className="text-slate-400 text-sm">{tx('noPostsYet')}</p></div>
          )}
          <a href={`/${locale}/blog`} className="inline-block bg-slate-900 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors">
            {t('viewAllPosts')}
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center bg-white border-t border-slate-100">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mb-4">{tx('dontMiss')}</p>
        <h3 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-10">
          {tx('followJourney')} <em className="italic underline decoration-blue-100">{tx('journey')}</em>
        </h3>
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://www.linkedin.com/company/bettertechnologies/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all"><LinkedInIcon /> LinkedIn</a>
          <a href="https://www.instagram.com/better.technologies?igsh=cjQ1c3F4OWpoYWhq" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-slate-900 font-black text-[11px] uppercase tracking-widest hover:border-[#d6249f] hover:text-[#d6249f] transition-all"><InstagramIcon /> Instagram</a>
        </div>
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2026 Better Technologies.</p>
      </footer>

    </main>
  );
}