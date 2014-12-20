# Rapport
### Anton K. Andersson, aa223ap@student.lnu.se

# Inledning
Sociala medier är en del av vardagen för de flesta av oss.
Vi är aktivt uppkopplade oavsett var vi befinner oss, oavsett om vi är på fest, resande fot eller i väntrum.
Samtidigt reflekterar vi sällan över den tid vi faktiskt spenderar på att vara "sociala" online.
_Hours Lost_ vill registrera tiden vi aktivt tillfört något till sociala medier.

Användaren väljer själv att koppla upp sina sociala medier mot tjänsten och får sedan en uppskattad tid. Efter en uppskattning getts, får användaren dra i reglage för att få en mer reell uppskattning.
Den initiala uppskattningen är snäll, så att användaren själv får tänka efter över hur mycket tid en tweet eller Facebookpost tar.

# Schematisk översikt

# Serversida

## Teknikval
Servern drivs av [Node.js](https://nodejs.org) och är skriven med ramverket [Express.js](http://expressjs.com/).
För datatransport används ett REST HTTP-API och realtidsprotokollet [Socket.io](https://socket.io), som är en implementation av crossbrowser WebSocket (med inbyggda fallbacks till exempelvis longpolling).
Kommunikation sker över HTTPS. Persistent datalagring sker med [MongoDB](https://mongodb.org), med wrappern [Mongoose.js](https://mongoosejs.com).

## Cachestrategi och prestanda
Servern skickar allting gzippat.

TODO: implement massa text här

## Felhantering
TODO: implement massa text här

## Struktur, arkitektur
Servern bygger på en modulär utvecklingsstil med ett MVC-mönster, där Single Responsibility, Low Coupling och High Cohesion eftersträvas.
Moduler har byggts för de olika delarna, istället för att implementera allt i en fil.
TODO: implement massa text här

# Klientsida

## Teknikval
För att hålla nere sidans vikt, har CSS-ramverk som Bootstrap skippats. Istället har mikro-ramverk valts för presentationen. Som ramverk för JavaScript används ramverket [AngularJS](https://angularjs.org), men även mikro-ramverket [SweetAlert](http://tristanedwards.me/sweetalert).

**CSS:**
1. [Skeleton](http://getskeleton.com/)
För en responsiv grid, som är mobile-first

2. [Hover.css](http://ianlunn.github.io/Hover/)
Urvalda animationer för bättre UX

3. [Fontello](http://fontello.com/)
Urvalda ikoner från bland annat [Font Awesome](http://fortawesome.github.io/Font-Awesome/), för att endast implementera de som behövs

**JavaScript:**
1. [AngularJS](https://angularjs.org)
Stabilt ramverk, som skapar en applikation som är lätt att överblicka

2. [SweetAlert](http://tristanedwards.me/sweetalert)
Ger snyggare alertmeddelanden till användaren

3. [Socket.io](https://socket.io)
Crossbrowser, asynkron realtidskommunikation över WebSockets

## Cachestrategi
TODO: implement massa text här

## Struktur, arkitektur
Klientsidan är byggd utifrån Component Pattern, ett mönster som nyligen introducerades av [Tero Parvainen](http://teropa.info/blog/2014/10/24/how-ive-improved-my-angular-apps-by-banning-ng-controller.html).
TODO: implement massa text här om hur appen endast har datan på ett ställe, använder sig av sockets strukturerat, har brytit ut saker till direktiv för lös koppling

# Säkerhet och prestanda

# Offline-first

# Reflektion

# Risker med applikation

# Betygshöjande kriterier
1. Genomtänkt teknikval
2. Välstrukturerad och bra skriven kod
3. Asynkron realtidskommunikation via WebSockets
4. Eftersträvan att följa best practices
5. Egen idé
6. Genomarbetat UX
7. (Vältestat)

