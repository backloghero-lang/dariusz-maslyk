// Cała treść strony w jednym miejscu. Fakty pochodzą z Dariusz_Maslyk_CV.pdf.
// Artefakty w teczkach projektów to ILUSTRACJE typu pracy analityka — strona oznacza je jako przykłady.

export const PROFILE = {
  name: "Dariusz Masłyk",
  role: "Analityk biznesowo-systemowy",
  focus: ["Aplikacje mobilne", "Comarch ERP", "Integracje"],
  statement: "Od chaosu wymagań do systemu.",
  lead:
    "Analityk biznesowo-systemowy z Lublina. Projektuję aplikacje mobilne zintegrowane z Comarch ERP: " +
    "od analizy wymagań i koncepcji, przez współpracę z zespołem deweloperskim, po testy i diagnostykę integracji.",
  city: "Lublin",
  phone: "+48 791 781 843",
  phoneHref: "tel:+48791781843",
  email: "d.maslyk@onet.eu",
  linkedin: "https://www.linkedin.com/in/dariusz-maslyk",
  linkedinLabel: "Dariusz Masłyk",
  cv: "assets/Dariusz_Maslyk_CV.pdf",
};

export const FACTS = [
  { word: "Kilka tysięcy", unit: "licencji", text: "ma aplikacja, dla której realizuję inicjatywy" },
  { word: "Kilkadziesiąt", unit: "inicjatyw", text: "zrealizowanych dla Comarch Mobile" },
  { from: "2022", to: "dziś", unit: "w Comarch", text: "jako analityk biznesowo-systemowy" },
];

// Rozdziały scrollytellingu. `scene` to indeks stanu sceny 3D (1–5).
// Zdjęcia: Unsplash (licencja Unsplash), lokalne kopie w assets/photos. Strona zdjęcia w karcie zmienia się naprzemiennie.
export const STORY = [
  {
    scene: 1,
    code: "01", // taste-skill-ignore — identyfikator kotwicy (#krok-0X), nie jest wyświetlany
    tag: "Analiza wymagań",
    photo: "assets/photos/01-wymagania.jpg",
    photoAlt: "Zespół układa karteczki z wymaganiami na planszy",
    credit: "https://unsplash.com/photos/team-collaborating-with-sticky-notes-w00FkE6e8zE",
    title: "Chaos potrzeb",
    lead: "Każdy projekt zaczyna się od rozproszonych oczekiwań: handlowiec, magazyn, księgowość i Product Manager mówią o tym samym innymi słowami.",
    analyst: "Zbieram i porządkuję wymagania biznesowe i systemowe, a potem omawiam je z Product Managerem.",
    proof: "Comarch Mobile · kilkadziesiąt inicjatyw",
  },
  {
    scene: 2,
    code: "02", // taste-skill-ignore — identyfikator kotwicy (#krok-0X), nie jest wyświetlany
    tag: "Modelowanie procesów",
    photo: "assets/photos/02-proces.jpg",
    photoAlt: "Dwie osoby rysują schemat na tablicy",
    credit: "https://unsplash.com/photos/two-people-drawing-on-whiteboard-26MJGnCM0Wc",
    title: "Proces na papierze",
    lead: "Z rozsypanych kart powstaje proces: kto co robi, w jakiej kolejności, gdzie są decyzje i jakie dane przechodzą dalej.",
    analyst: "Modeluję procesy w BPMN i UML i buduję koncepcję rozwiązania, którą uzgadniam z PM i zespołem deweloperskim.",
    proof: "BPMN: Modelowanie Procesów · UML: Modelowanie Systemów",
  },
  {
    scene: 3,
    code: "03", // taste-skill-ignore — identyfikator kotwicy (#krok-0X), nie jest wyświetlany
    tag: "UI/UX mobile",
    photo: "assets/photos/03-mobile.jpg",
    photoAlt: "Dłoń trzymająca smartfon z aplikacją",
    credit: "https://unsplash.com/photos/smartphone-displaying-environmental-data-dashboard-sScmok4Iq1o",
    title: "Ekran w dłoni użytkownika",
    lead: "Proces trafia do aplikacji mobilnej. Każdy krok musi być zrozumiały dla osoby, która zamówienie składa w terenie.",
    analyst: "Przygotowuję dokumentację analityczno-techniczną i koncepcje UI/UX, dopracowane po konsultacjach i recenzjach krzyżowych.",
    proof: "UI/UX aplikacji mobilnych · makiety na bazie Figmy",
  },
  {
    scene: 4,
    code: "04", // taste-skill-ignore — identyfikator kotwicy (#krok-0X), nie jest wyświetlany
    tag: "Integracje",
    photo: "assets/photos/04-erp-www.jpg",
    photoAlt: "Laptop z wykresami raportów",
    credit: "https://unsplash.com/photos/graphs-of-performance-analytics-on-a-laptop-screen-JKUTrJ4vK00",
    title: "Mobile, WWW i ERP",
    lead: "System to nie tylko aplikacja w terenie. Przedstawiciele pracują w aplikacji mobilnej, kierownicy w Module Zarządzania (WWW), a oba kanały wymieniają dane z Comarch ERP przez API.",
    analyst: "Wspieram zespół deweloperski podczas implementacji rozwiązań w aplikacji mobilnej i w Module Zarządzania zintegrowanych z Comarch ERP.",
    extra: {
      title: "Moduł Zarządzania · WWW dla kierowników",
      items: ["Uprawnienia przedstawicieli", "Zadania w terenie", "Raporty", "Podgląd wizyt", "CRM"],
    },
    proof: "Comarch ERP XL · Altum · Optima · REST API",
  },
  {
    scene: 5,
    code: "05", // taste-skill-ignore — identyfikator kotwicy (#krok-0X), nie jest wyświetlany
    tag: "Testy i diagnostyka",
    photo: "assets/photos/05-diagnoza.jpg",
    photoAlt: "Ekran laptopa z kodem",
    credit: "https://unsplash.com/photos/turned-on-macbook-pro-wit-programming-codes-display-f77Bh3inUpE",
    title: "Test i diagnoza",
    lead: "Gdy coś nie działa, odpowiedź jest w danych: w logach, w odpowiedzi API, w rekordzie w bazie.",
    analyst: "Prowadzę testy projektanckie oraz analizę integracji i diagnostykę z wykorzystaniem logów, API, SQL, JSON i XML.",
    proof: "T-SQL: MS SQL Server · logi · JSON · XML",
  },
];

// Teczki projektów. `artefacts` = przykłady typów dokumentów analityka (ilustracje).
export const CASES = [
  {
    id: "promo",
    code: "A",
    title: "Promocje pakietowe",
    area: "Obsługa złożonych reguł handlowych w aplikacji mobilnej.",
    tags: ["Comarch Mobile", "Reguły handlowe", "Zamówienia"],
    cover: "promo",
    artefacts: [
      { kind: "story", label: "User story", title: "Pakiet w zamówieniu", text: "Jako handlowiec chcę widzieć, że produkty w zamówieniu tworzą pakiet promocyjny, żeby od razu znać warunki dla klienta." },
      { kind: "decision", label: "Tablica decyzyjna", title: "Kiedy reguła działa" },
      { kind: "screen", label: "Makieta", title: "Pakiet na ekranie zamówienia" },
      { kind: "test", label: "Scenariusz testu", title: "Weryfikacja reguły", steps: ["Dodaj wszystkie produkty pakietu", "Sprawdź naliczenie warunków pakietu", "Usuń jeden produkt — pakiet znika"] },
    ],
  },
  {
    id: "ai",
    code: "B",
    title: "Asystent zamówień AI",
    area: "Wsparcie użytkownika podczas przygotowania zamówienia.",
    tags: ["Comarch Mobile", "Proces zamówienia", "AI"],
    cover: "ai",
    artefacts: [
      { kind: "story", label: "User story", title: "Pomoc przy kompletowaniu", text: "Jako użytkownik chcę otrzymać podpowiedź podczas przygotowania zamówienia, żeby szybciej je skompletować." },
      { kind: "sequence", label: "Diagram sekwencji", title: "Kto z kim rozmawia" },
      { kind: "screen-ai", label: "Makieta", title: "Podpowiedź w formularzu" },
      { kind: "test", label: "Kryteria akceptacji", title: "Kiedy uznajemy, że działa", steps: ["Podpowiedź pojawia się w trakcie przygotowania zamówienia", "Użytkownik może ją przyjąć lub pominąć", "Zamówienie zapisuje się standardową ścieżką"] },
    ],
  },
  {
    id: "data",
    code: "C",
    title: "Przepływ dokumentów: oferta → zamówienie → faktura",
    area: "Powiązania dokumentów handlowych między aplikacją mobilną a ERP, w tym spinacze nagłówkowe FV.",
    tags: ["Comarch Mobile", "Comarch ERP", "Dokumenty handlowe"],
    cover: "data",
    artefacts: [
      { kind: "erd", label: "Model danych", title: "Oferta → zamówienie → faktura" },
      { kind: "sql", label: "Zapytanie diagnostyczne", title: "Gdzie urwał się łańcuch" },
      { kind: "test", label: "Scenariusz testu", title: "Pełny łańcuch", steps: ["Utwórz ofertę i przekształć ją w zamówienie", "Zrealizuj zamówienie do faktury", "Sprawdź powiązania i spinacz nagłówkowy FV"] },
    ],
  },
  {
    id: "tele",
    code: "D",
    title: "Telemetria aplikacji",
    area: "Zdarzenia z aplikacji mobilnej zbierane w standardzie OpenTelemetry, przesyłane do Azure i pokazywane na dashboardach w Grafanie.",
    tags: ["Comarch Mobile", "OpenTelemetry", "Azure · Grafana"],
    cover: "tele",
    artefacts: [
      { kind: "story", label: "User story", title: "Decyzje na danych", text: "Jako Product Manager chcę widzieć, z których funkcji aplikacji korzystają użytkownicy, żeby planować rozwój na podstawie danych." },
      { kind: "pipeline", label: "Przepływ danych", title: "Od zdarzenia do wykresu" },
      { kind: "telemetry", label: "Dashboard", title: "Zdarzenia z aplikacji" },
      { kind: "events", label: "Słownik zdarzeń", title: "Co mierzymy i kiedy" },
    ],
  },
];

// Mapa powiązań: doświadczenie → kompetencje → projekty.
export const MAP = {
  experience: [
    { id: "comarch", label: "Comarch", sub: "2022 – dziś", note: "Analityk biznesowo-systemowy w Comarch Mobile — aplikacja mobilna i Moduł Zarządzania (WWW) dla kierowników: wymagania, koncepcje, UI/UX, testy, integracje." },
    { id: "aldi", label: "ALDI Polska", sub: "2021 – 2022", note: "Kierownik sklepu: sprzedaż w oparciu o KPI i regularność dostaw." },
    { id: "specjal", label: "GK SPECJAŁ", sub: "2019 – 2021", note: "Kierownik zmiany: magazyn, dokumentacja logistyczna, trasy i rozliczenia kierowców." },
    { id: "komfort", label: "Sklepy Komfort", sub: "2019", note: "Zastępca kierownika salonu: plany sprzedażowe, obieg dokumentów i zamówień, akcje promocyjne." },
    { id: "auchan", label: "Auchan", sub: "2016 – 2018", note: "Manager: działy sezonowe, budżetowanie, cele handlowe." },
  ],
  // Kolejność w kolumnie: najpierw kompetencje analityczne i techniczne, na dole domena i praca z ludźmi.
  skills: [
    { id: "req", label: "Wymagania i koncepcje", group: "Analiza", note: "Analiza wymagań biznesowych i systemowych, koncepcje rozwiązań, Inżynieria Wymagań." },
    { id: "model", label: "BPMN · UML", group: "Analiza", note: "Modelowanie procesów i systemów — certyfikaty BPMN (2023) i UML (2025)." },
    { id: "ux", label: "UI/UX mobile", group: "Analiza", note: "Koncepcje UI/UX aplikacji mobilnych i makiety na bazie Figmy." },
    { id: "test", label: "Testy projektanckie", group: "Analiza", note: "Weryfikacja rozwiązań w trakcie i po implementacji." },
    { id: "sql", label: "SQL · API · logi", group: "Technika", note: "T-SQL, MS SQL Server, REST API, JSON, XML i logi w diagnostyce integracji." },
    { id: "ai", label: "AI w pracy", group: "Technika", note: "ChatGPT, Claude, Gemini, NotebookLM: dokumentacja, prototypy koncepcji, proste agenty, automatyzacja Jira." },
    { id: "kom", label: "Komunikacja i współpraca", group: "Praca z ludźmi", note: "Uzgadnianie celów i rozwiązań z centralą, przełożonymi, Product Managerem i zespołami." },
    { id: "team", label: "Prowadzenie zespołu", group: "Praca z ludźmi", note: "Organizacja pracy, wdrażanie nowych osób i rozwój zespołu." },
    { id: "kpi", label: "Sprzedaż i KPI", group: "Domena", note: "Rozumiem, jak handel mierzy wynik — i czego oczekuje od narzędzi." },
    { id: "zam", label: "Zamówienia i promocje", group: "Domena", note: "Znam zamówienia i akcje promocyjne od strony osoby, która je realizuje." },
    { id: "mag", label: "Magazyn i dokumenty", group: "Domena", note: "Obieg dokumentów, magazyn i logistyka z codziennej pracy operacyjnej." },
  ],
  // Prawa kolumna: projekty (Comarch) i obszary odpowiedzialności w handlu. `at` = firmy, w których powstały.
  projects: [
    { id: "promo", label: "Promocje pakietowe", sub: "Projekt · Comarch", at: ["comarch"], note: "Złożone reguły handlowe w aplikacji mobilnej." },
    { id: "asys", label: "Asystent zamówień AI", sub: "Projekt · Comarch", at: ["comarch"], note: "Wsparcie użytkownika w przygotowaniu zamówienia." },
    { id: "docs", label: "Przepływ oferta → zamówienie → faktura", sub: "Projekt · Comarch", at: ["comarch"], note: "Powiązania dokumentów handlowych między aplikacją a ERP, spinacze nagłówkowe FV." },
    { id: "tele", label: "Telemetria aplikacji", sub: "Projekt · Comarch", at: ["comarch"], note: "Zdarzenia z aplikacji w OpenTelemetry, dane w Azure, dashboardy w Grafanie." },
    { id: "kom-area", label: "Komunikacja z centralą i zespołami", sub: "Obszar", area: true, at: ["comarch", "aldi", "auchan"], note: "Przekazywanie celów i ustaleń między centralą, przełożonymi a zespołem — w handlu i w projektach IT." },
    { id: "team-area", label: "Zarządzanie zespołem", sub: "Obszar · handel", area: true, at: ["aldi", "auchan"], note: "Grafiki, wdrażanie nowych osób, rozwój zespołu i realizacja celów sklepu lub działu." },
    { id: "log-area", label: "Logistyka magazynowa", sub: "Obszar · handel", area: true, at: ["aldi", "auchan", "komfort", "specjal"], note: "Przyjęcia towaru, stany, dostawy z sieci i od dostawców, kompletacja i wydania." },
    { id: "doc-area", label: "Przepływ dokumentów", sub: "Obszar · handel", area: true, at: ["komfort", "aldi", "specjal"], note: "Zamówienia, dokumenty sprzedaży i dokumentacja logistyczna — od wystawienia do rozliczenia." },
    { id: "promo-area", label: "Akcje promocyjne i sezonowe", sub: "Obszar · handel", area: true, at: ["komfort", "auchan"], note: "Przygotowanie akcji promocyjnych, ekspozycji i działów sezonowych." },
    { id: "route-area", label: "Planowanie tras dostaw", sub: "Obszar · logistyka", area: true, at: ["specjal"], note: "Planowanie tras i rozliczanie kierowców z ich realizacji." },
  ],
  edges: [
    ["comarch", "req"], ["comarch", "model"], ["comarch", "ux"], ["comarch", "test"], ["comarch", "sql"], ["comarch", "ai"], ["comarch", "kom"],
    ["aldi", "kpi"], ["aldi", "zam"], ["aldi", "mag"], ["aldi", "kom"], ["aldi", "team"],
    ["specjal", "mag"], ["specjal", "team"],
    ["komfort", "zam"], ["komfort", "mag"], ["komfort", "kpi"],
    ["auchan", "kpi"], ["auchan", "zam"], ["auchan", "mag"], ["auchan", "req"], ["auchan", "kom"], ["auchan", "team"],
    ["kpi", "promo"], ["zam", "promo"], ["req", "promo"], ["ux", "promo"], ["test", "promo"],
    ["zam", "asys"], ["ux", "asys"], ["ai", "asys"], ["req", "asys"], ["model", "asys"],
    ["mag", "docs"], ["sql", "docs"], ["test", "docs"], ["model", "docs"],
    ["req", "tele"], ["sql", "tele"], ["ai", "tele"],
    ["kom", "kom-area"], ["team", "team-area"], ["mag", "log-area"], ["mag", "doc-area"], ["zam", "doc-area"],
    ["zam", "promo-area"], ["kpi", "promo-area"], ["mag", "route-area"],
  ],
};

// Linia metra kariery. Lata zgodne z CV.
export const METRO = {
  origin: { year: 2011, label: "KUL · logika", sub: "Magister filozofii, specjalizacja: logika" },
  lines: [
    {
      id: "trade", label: "Handel i sprzedaż", color: "amber",
      stations: [
        { from: 2016, to: 2018, label: "Auchan Retail Polska", sub: "Manager" },
        { from: 2019, to: 2019, label: "Sklepy Komfort S.A.", sub: "Zastępca kierownika salonu" },
        { from: 2021, to: 2022, label: "ALDI Polska", sub: "Kierownik sklepu" },
      ],
    },
    {
      id: "logistics", label: "Magazyn i logistyka", color: "violet",
      stations: [{ from: 2019, to: 2021, label: "Grupa Kapitałowa SPECJAŁ", sub: "Kierownik zmiany" }],
    },
    {
      id: "analysis", label: "Analiza systemowa", color: "cyan",
      stations: [
        { from: 2022, to: 2026, label: "Comarch", sub: "Analityk biznesowo-systemowy", main: true },
      ],
      certs: [
        { year: 2023, label: "Inżynieria Wymagań" },
        { year: 2023, label: "BPMN: Modelowanie Procesów" },
        { year: 2024, label: "T-SQL: MS SQL Server" },
        { year: 2025, label: "UML: Modelowanie Systemów" },
        { year: 2026, label: "AI Academy" },
      ],
    },
  ],
};

export const SKILL_GROUPS = [
  { title: "Analiza i projektowanie", items: ["Wymagania biznesowe i systemowe", "Koncepcje rozwiązań", "Dokumentacja", "BPMN", "UML", "UI/UX aplikacji mobilnych", "Testy projektanckie", "Agile / Scrum"] },
  { title: "Integracje i dane", items: ["SQL / T-SQL", "MS SQL Server", "REST API", "Logi", "JSON", "XML"] },
  { title: "Systemy i narzędzia", items: ["Comarch ERP XL", "Comarch ERP Altum", "Comarch ERP Optima", "Jira", "TFS", "GitHub"] },
  { title: "AI w pracy analityka", items: ["ChatGPT", "Claude", "Gemini", "NotebookLM", "Prompt engineering", "Proste agenty", "Automatyzacja Jira", "Makiety z Figmy"] },
];
