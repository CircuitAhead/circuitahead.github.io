const CircuitAheadI18n = (() => {
  const STORAGE_KEY = "circuitahead-language";

  const commonPairs = [
    ["Main navigation", "Navigazione principale"],
    ["Mobile navigation", "Navigazione mobile"],
    ["Open navigation", "Apri navigazione"],
    ["CircuitAhead home", "Home CircuitAhead"],
    ["Products", "Prodotti"],
    ["Principles", "Principi"],
    ["About", "Chi siamo"],
    ["Support", "Supporto"],
    ["Contact", "Contatti"],
    ["Contact us", "Contattaci"],
    ["Privacy contact", "Contatto privacy"],
    ["Privacy contacts", "Contatti privacy"],
    ["Policy", "Informativa"],
    ["Home", "Home"],
    ["Privacy", "Privacy"],
    ["Legal", "Note legali"],
    ["Product", "Prodotto"],
    ["Local-first", "Local-first"],
    ["Backup", "Backup"],
    ["REMORIQ", "REMORIQ"],
    ["CircuitAhead", "CircuitAhead"]
  ];

  const pagePairs = {
    home: [
      ["Independent software development", "Sviluppo software indipendente"],
      ["Software built for", "Software creato per"],
      ["what comes next.", "ciò che viene dopo."],
      ["CircuitAhead creates thoughtful digital products designed to make everyday technology simpler, more useful and more respectful of the people who use it.", "CircuitAhead crea prodotti digitali curati, pensati per rendere la tecnologia di ogni giorno più semplice, più utile e più rispettosa delle persone che la usano."],
      ["Explore our products", "Scopri i nostri prodotti"],
      ["Discover CircuitAhead", "Scopri CircuitAhead"],
      ["Purposeful", "Con uno scopo"],
      ["Privacy-minded", "Attento alla privacy"],
      ["Built to last", "Pensato per durare"],
      ["Human centered", "Al centro le persone"],
      ["Privacy first", "Privacy prima di tutto"],
      ["Technology should make life", "La tecnologia dovrebbe rendere la vita"],
      ["clearer.", "più semplice."],
      ["We believe useful software begins with a simple question:", "Crediamo che un software utile nasca da una domanda semplice:"],
      ["does this genuinely make something better?", "migliora davvero qualcosa?"],
      ["CircuitAhead is built around focused ideas, careful design and technology that serves people rather than getting in their way.", "CircuitAhead nasce da idee focalizzate, progettazione attenta e tecnologia che aiuta le persone invece di complicare loro la vita."],
      ["OUR PRODUCTS", "I NOSTRI PRODOTTI"],
      ["One idea at a time.", "Un'idea alla volta."],
      ["Built properly.", "Costruita bene."],
      ["We focus on products with a clear purpose, designed to remain useful long after the novelty wears off.", "Ci concentriamo su prodotti con uno scopo chiaro, pensati per restare utili anche quando l'effetto novità è passato."],
      ["In development", "In sviluppo"],
      ["PRIVATE DIGITAL MEMORY", "MEMORIA DIGITALE PRIVATA"],
      ["A private second memory for the things you don't want to lose.", "Una seconda memoria privata per le cose che non vuoi perdere."],
      ["REMORIQ helps you capture, organize and rediscover useful information while keeping privacy and control at the center of the experience.", "REMORIQ ti aiuta a raccogliere, organizzare e ritrovare informazioni utili mantenendo privacy e controllo al centro dell'esperienza."],
      ["Privacy focused", "Privacy al centro"],
      ["No account required", "Nessun account richiesto"],
      ["Discover REMORIQ", "Scopri REMORIQ"],
      ["YOUR PRIVATE SECOND MEMORY", "LA TUA SECONDA MEMORIA PRIVATA"],
      ["Keep what matters", "Conserva ciò che conta"],
      ["Ready when you need it.", "Pronto quando ti serve."],
      ["Remember", "Ricorda"],
      ["Protect", "Proteggi"],
      ["Archive", "Archivio"],
      ["HOW WE THINK", "COME PENSIAMO"],
      ["Less noise.", "Meno rumore."],
      ["Better software.", "Software migliore."],
      ["Purpose first", "Prima lo scopo"],
      ["Technology should solve a real problem, not create complexity just to appear sophisticated.", "La tecnologia dovrebbe risolvere un problema reale, non creare complessità solo per sembrare sofisticata."],
      ["Privacy by design", "Privacy fin dalla progettazione"],
      ["Respect for users and their information should be part of the architecture, not an afterthought.", "Il rispetto per gli utenti e per le loro informazioni deve far parte dell'architettura, non essere aggiunto in un secondo momento."],
      ["Built ahead", "Pensato per il futuro"],
      ["Good products should remain clear, maintainable and ready to evolve.", "I buoni prodotti devono restare chiari, manutenibili e pronti a evolvere."],
      ["OUR DIRECTION", "LA NOSTRA DIREZIONE"],
      ["Build useful things.", "Crea cose utili."],
      ["Build them well.", "Creale bene."],
      ["CircuitAhead is looking forward — exploring better ways for software to fit naturally into everyday life.", "CircuitAhead guarda avanti, esplorando modi migliori perché il software si integri in modo naturale nella vita di ogni giorno."],
      ["GET IN TOUCH", "CONTATTI"],
      ["Want to talk?", "Vuoi parlarne?"],
      ["Explore", "Esplora"],
      ["Connect", "Contatti"],
      ["Software for a smarter tomorrow.", "Software per un domani più intelligente."]
    ],

    remoriq: [
      ["How it works", "Come funziona"],
      ["Android · In development", "Android · In sviluppo"],
      ["Your private", "La tua"],
      ["second memory.", "seconda memoria privata."],
      ["Capture the things you don't want to lose. REMORIQ helps understand what they are, suggests what you can do with them and keeps you in control.", "Raccogli le cose che non vuoi perdere. REMORIQ aiuta a capire cosa sono, suggerisce cosa puoi farne e lascia a te il controllo."],
      ["See how it works", "Scopri come funziona"],
      ["Privacy by design", "Privacy fin dalla progettazione"],
      ["No REMORIQ account", "Nessun account REMORIQ"],
      ["Core use works offline", "Le funzioni principali funzionano offline"],
      ["GOOD MORNING", "BUONGIORNO"],
      ["Search your memory", "Cerca nella tua memoria"],
      ["YOUR SECOND MEMORY", "LA TUA SECONDA MEMORIA"],
      ["Capture and process", "Carica ed elabora"],
      ["Remember", "Ricorda"],
      ["Dates and reminders", "Date e promemoria"],
      ["Protect", "Proteggi"],
      ["Keep sensitive things safer", "Proteggi i contenuti sensibili"],
      ["Archive", "Archivio"],
      ["Find it again later", "Ritrovalo quando serve"],
      ["READY WHEN YOU NEED IT", "PRONTO QUANDO TI SERVE"],
      ["Everything in its place.", "Tutto al suo posto."],
      ["SHARED TO REMORIQ", "CONDIVISO CON REMORIQ"],
      ["Receipt detected", "Scontrino rilevato"],
      ["CORE STORAGE", "ARCHIVIAZIONE CORE"],
      ["WHY REMORIQ", "PERCHÉ REMORIQ"],
      ["Your phone already holds your life.", "Il tuo telefono contiene già la tua vita."],
      ["Finding it shouldn't be hard.", "Ritrovarla non dovrebbe essere difficile."],
      ["Messages, receipts, screenshots, PDFs, links, warranties, reminders and useful information end up scattered across different apps and folders.", "Messaggi, scontrini, screenshot, PDF, link, garanzie, promemoria e informazioni utili finiscono sparsi tra app e cartelle diverse."],
      ["REMORIQ is designed to give that information one place where it can become useful again.", "REMORIQ è progettata per dare a queste informazioni un unico posto in cui possano tornare utili."],
      ["HOW IT WORKS", "COME FUNZIONA"],
      ["From anything", "Da qualsiasi contenuto"],
      ["to something useful.", "a qualcosa di utile."],
      ["REMORIQ is built around one simple flow. You bring the content. It helps make sense of it. You decide what happens next.", "REMORIQ nasce attorno a un flusso semplice. Tu porti il contenuto. L'app aiuta a capirlo. Tu decidi cosa succede dopo."],
      ["Capture", "Acquisisci"],
      ["Share text, links, images, PDFs, documents, files, QR codes and other useful content into REMORIQ.", "Condividi con REMORIQ testo, link, immagini, PDF, documenti, file, codici QR e altri contenuti utili."],
      ["Understand", "Comprendi"],
      ["REMORIQ analyzes the content and identifies useful information without forcing you through unnecessary forms.", "REMORIQ analizza il contenuto e individua le informazioni utili senza costringerti a compilare moduli inutili."],
      ["Suggest", "Suggerisce"],
      ["It can suggest the most useful next step: remember it, archive it, register an expense or keep track of an important date.", "Può suggerire il passo successivo più utile: ricordarlo, archiviarlo, registrare una spesa o tenere traccia di una data importante."],
      ["You confirm", "Confermi tu"],
      ["Nothing important should happen behind your back. You review the result and remain in control.", "Nulla di importante dovrebbe accadere senza che tu lo sappia. Controlli il risultato e resti tu al comando."],
      ["ONE APP, ONE MEMORY", "UNA SOLA APP, UNA SOLA MEMORIA"],
      ["Built around the things", "Costruita attorno alle cose"],
      ["you actually need.", "di cui hai davvero bisogno."],
      ["Different types of information, one coherent experience.", "Tipi diversi di informazioni, un'unica esperienza coerente."],
      ["One Inbox", "Un'unica Inbox"],
      ["Bring content into REMORIQ and let the app help determine what it is and where it belongs.", "Porta i contenuti in REMORIQ e lascia che l'app aiuti a capire cosa sono e dove devono andare."],
      ["Share", "Condividi"],
      ["Review", "Controlla"],
      ["Save", "Salva"],
      ["Receipts & expenses", "Scontrini e spese"],
      ["Turn receipt information into useful, structured expense data with review where recognition is uncertain.", "Trasforma le informazioni degli scontrini in dati di spesa utili e strutturati, controllando solo ciò che il riconoscimento non considera certo."],
      ["Remember what matters", "Ricorda ciò che conta"],
      ["Keep dates, reminders, warranties and other time-sensitive information from disappearing into old messages and files.", "Evita che date, promemoria, garanzie e altre informazioni legate al tempo spariscano tra vecchi messaggi e file."],
      ["Find it again", "Ritrovalo"],
      ["Keep useful content organized so the information you saved can become useful again when you need it.", "Mantieni organizzati i contenuti utili, così ciò che hai salvato può tornare utile quando ne hai bisogno."],
      ["Protect sensitive content", "Proteggi i contenuti sensibili"],
      ["Privacy controls, app protection and structured sharing are designed to reduce unnecessary exposure of personal information.", "Controlli per la privacy, protezione dell'app e condivisione strutturata sono progettati per ridurre l'esposizione non necessaria delle informazioni personali."],
      ["Your data can move", "I tuoi dati possono spostarsi"],
      ["Export, import, backup, restore and portable REMORIQ packages are part of the product's data-ownership philosophy.", "Esportazione, importazione, backup, ripristino e pacchetti REMORIQ portabili fanno parte della filosofia di proprietà dei dati del prodotto."],
      ["PRIVATE BY DESIGN", "PRIVATA FIN DALLA PROGETTAZIONE"],
      ["Your memory should", "La tua memoria dovrebbe"],
      ["belong to you.", "appartenere a te."],
      ["REMORIQ is designed as a local-first, accountless application. Your core content does not depend on a REMORIQ cloud or REMORIQ backend to remain useful.", "REMORIQ è progettata come applicazione local-first e senza account. I tuoi contenuti principali non dipendono da un cloud o da un backend REMORIQ per restare utili."],
      ["No REMORIQ account required", "Nessun account REMORIQ richiesto"],
      ["No REMORIQ email/password or identity service is needed for core use.", "Per le funzioni principali non servono email/password REMORIQ né un servizio di identità REMORIQ."],
      ["Core content stored locally", "Contenuti core salvati localmente"],
      ["The device is the primary system of record for normal use.", "Il dispositivo è il principale sistema di conservazione per l'uso normale."],
      ["Designed to work offline", "Progettata per funzionare offline"],
      ["Ordinary core workflows do not require an always-on connection.", "I normali flussi principali non richiedono una connessione sempre attiva."],
      ["Your data remains portable", "I tuoi dati restano portabili"],
      ["Export, backup, restore and migration are treated as user ownership features.", "Esportazione, backup, ripristino e migrazione sono considerate funzioni legate alla proprietà dei dati dell'utente."],
      ["Read the privacy information", "Leggi l'informativa sulla privacy"],
      ["Core data · local-first", "Dati core · local-first"],
      ["DATA OWNERSHIP", "PROPRIETÀ DEI DATI"],
      ["Your data isn't", "I tuoi dati non sono"],
      ["a hostage.", "in ostaggio."],
      ["REMORIQ is designed around the principle that access to your own information should not depend on keeping a subscription active.", "REMORIQ è progettata attorno al principio che l'accesso alle tue informazioni non debba dipendere dal mantenere attivo un abbonamento."],
      ["Export", "Esporta"],
      ["Take your information out when you need it.", "Porta fuori le tue informazioni quando ne hai bisogno."],
      ["Create portable backups in destinations you choose.", "Crea backup portabili nelle destinazioni che scegli."],
      ["Restore", "Ripristina"],
      ["Recover and move your information without a REMORIQ account.", "Recupera e sposta le tue informazioni senza un account REMORIQ."],
      ["Create structured data packages when information needs to move between people.", "Crea pacchetti dati strutturati quando le informazioni devono passare da una persona all'altra."],
      ["THE IDEA", "L'IDEA"],
      ["“REMORIQ should understand", "“REMORIQ dovrebbe capire"],
      ["before it asks.”", "prima di chiedere.”"],
      ["The goal is not to give you another database to maintain. The goal is to reduce the amount of work required to keep useful information useful.", "L'obiettivo non è darti un altro database da mantenere. È ridurre il lavoro necessario per mantenere utili le informazioni che contano."],
      ["Android release in preparation", "Release Android in preparazione"],
      ["REMORIQ is", "REMORIQ sta"],
      ["coming to Android.", "arrivando su Android."],
      ["Development is focused on release readiness, real-device validation and Google Play testing.", "Lo sviluppo è concentrato sulla preparazione della release, sulla validazione su dispositivi reali e sui test Google Play."],
      ["Contact support", "Contatta il supporto"],
      ["Back to CircuitAhead", "Torna a CircuitAhead"],
      ["REMORIQ · Your private second memory.", "REMORIQ · La tua seconda memoria privata."]
    ],

    privacy: [
      ["REMORIQ · Android", "REMORIQ · Android"],
      ["PRIVACY POLICY", "PRIVACY POLICY"],
      ["Your memory.", "La tua memoria."],
      ["Your data.", "I tuoi dati."],
      ["This policy describes how REMORIQ accesses, uses, stores and, when necessary, shares data while you use the app.", "Questa informativa descrive come REMORIQ accede, utilizza, conserva e, quando necessario, condivide i dati durante l'utilizzo dell'app."],
      ["Last updated", "Ultimo aggiornamento"],
      ["29 October 2026", "29 ottobre 2026"],
      ["The user's device is the primary storage system for core content.", "Il dispositivo dell'utente è il principale sistema di conservazione dei contenuti core."],
      ["No account", "Nessun account"],
      ["REMORIQ does not require a REMORIQ account, email address or password.", "REMORIQ non richiede un account, email o password REMORIQ."],
      ["Portable data", "Dati portabili"],
      ["Backup, export, restore and migration are part of the product philosophy.", "Backup, esportazione, ripristino e migrazione fanno parte della filosofia del prodotto."],
      ["No mandatory REMORIQ cloud", "Niente cloud REMORIQ obbligatorio"],
      ["Normal use of the app does not depend on a proprietary REMORIQ backend.", "Il normale utilizzo dell'app non dipende da un backend proprietario REMORIQ."],
      ["ON THIS PAGE", "IN QUESTA PAGINA"],
      ["1. Controller and contacts", "1. Titolare e contatti"],
      ["2. REMORIQ principles", "2. Principi di REMORIQ"],
      ["3. Data processed", "3. Dati trattati"],
      ["4. Data received by CircuitAhead", "4. Dati ricevuti da CircuitAhead"],
      ["5. Third-party services", "5. Servizi di terze parti"],
      ["6. Sharing", "6. Condivisione"],
      ["7. Permissions", "7. Permessi"],
      ["8. Security", "8. Sicurezza"],
      ["9. Retention and deletion", "9. Conservazione ed eliminazione"],
      ["10. Accounts", "10. Account"],
      ["11. Support", "11. Supporto"],
      ["12. Changes", "12. Modifiche"],
      ["REMORIQ Privacy Policy", "Informativa sulla privacy di REMORIQ"],
      ["This policy applies to the REMORIQ Android application, developed and published under the CircuitAhead name.", "La presente informativa riguarda l'applicazione Android REMORIQ, sviluppata e pubblicata con il nome CircuitAhead."],
      ["REMORIQ is designed as a local-first and offline-first application for its core features. This means that normal use of personal content does not require a REMORIQ account or a REMORIQ server intended to receive or synchronize that content.", "REMORIQ è progettata come applicazione local-first e offline-first per le funzionalità principali. Questo significa che il normale utilizzo dei contenuti personali non richiede un account REMORIQ né un server REMORIQ destinato a ricevere o sincronizzare tali contenuti."],
      ["Controller, developer and contacts", "Titolare, sviluppatore e contatti"],
      ["REMORIQ is developed by", "REMORIQ è sviluppata da"],
      [", who publishes the software under the name", ", che pubblica il software con il nome"],
      ["Developer", "Sviluppatore"],
      ["Application", "Applicazione"],
      ["REMORIQ data processing principles", "Principi di trattamento di REMORIQ"],
      ["REMORIQ is designed according to the following principles:", "REMORIQ è progettata secondo i seguenti principi:"],
      ["local use of data as a fundamental product setting;", "utilizzo locale dei dati come impostazione fondamentale del prodotto;"],
      ["no mandatory REMORIQ account;", "assenza di un account REMORIQ obbligatorio;"],
      ["offline operation of core features where technically possible;", "funzionamento offline delle funzionalità principali quando tecnicamente possibile;"],
      ["user control over suggested actions;", "controllo dell'utente sulle azioni suggerite;"],
      ["ability to export, import, back up, restore and migrate your data;", "possibilità di esportare, importare, effettuare backup, ripristinare e migrare i propri dati;"],
      ["minimization of personal content sent to external services.", "minimizzazione dell'invio di contenuti personali verso servizi esterni."],
      ["Important", "Importante"],
      ["“Local-first” does not mean that no technical data can ever leave the device. Android components, Google Play or third-party SDKs used by the app may process technical or diagnostic data according to their own practices and policies.", "\"Local-first\" non significa che nessun dato tecnico possa mai lasciare il dispositivo. Componenti Android, Google Play o SDK di terze parti utilizzati dall'app possono trattare dati tecnici o diagnostici secondo le proprie modalità e informative."],
      ["Types of data and content processed", "Tipi di dati e contenuti trattati"],
      ["REMORIQ may process information selected, created or confirmed by the user in order to provide its features.", "REMORIQ può trattare informazioni scelte, create o confermate dall'utente per fornire le proprie funzionalità."],
      ["Imported content", "Contenuti importati"],
      ["Text, shared messages, URLs, images, screenshots, PDFs, documents, files, QR codes and other content selected by the user.", "Testo, messaggi condivisi, URL, immagini, screenshot, PDF, documenti, file, codici QR e altri contenuti scelti dall'utente."],
      ["Receipts and expenses", "Ricevute e spese"],
      ["Amounts, dates, merchants, categories, items, budgets and information confirmed by the user.", "Importi, date, esercizi commerciali, categorie, articoli, budget e informazioni confermate dall'utente."],
      ["Reminders and warranties", "Promemoria e garanzie"],
      ["Titles, dates, deadlines, purchases, warranties and information needed to remember important events.", "Titoli, date, scadenze, acquisti, garanzie e informazioni necessarie per ricordare eventi importanti."],
      ["Preferences", "Preferenze"],
      ["Display name chosen by the user, language and app settings. This data does not constitute a REMORIQ account.", "Nome visualizzato scelto dall'utente, lingua e impostazioni dell'app. Questi dati non costituiscono un account REMORIQ."],
      ["Scans", "Scansioni"],
      ["Images or information needed for OCR, barcodes or QR codes when the user uses those features.", "Immagini o informazioni necessarie per OCR, codici a barre o QR quando l'utente utilizza tali funzioni."],
      ["Optional voice input", "Voce facoltativa"],
      ["When available and enabled by the user, REMORIQ may use on-device voice recognition provided by Android. The app is not designed to store the audio recording of dictation.", "Quando disponibile e attivata dall'utente, REMORIQ può utilizzare il riconoscimento vocale on-device fornito da Android. L'app non è progettata per archiviare la registrazione audio della dettatura."],
      ["What content CircuitAhead receives", "Quali contenuti riceve CircuitAhead"],
      ["CircuitAhead does not operate a REMORIQ backend used to normally receive or synchronize content stored in the application.", "CircuitAhead non gestisce un backend REMORIQ utilizzato per ricevere o sincronizzare normalmente i contenuti salvati nell'applicazione."],
      ["Texts, receipts, images, PDFs, reminders, warranties and other content stored during normal use remain primarily in the app's private space on the device, unless the user explicitly chooses a destination, export, sharing action or external service.", "Testi, ricevute, immagini, PDF, promemoria, garanzie e altri contenuti memorizzati nel normale utilizzo rimangono principalmente nello spazio privato dell'app sul dispositivo, salvo quando l'utente sceglie esplicitamente una destinazione, un'esportazione, una condivisione o un servizio esterno."],
      ["Personal content in the REMORIQ archive is not sent to a CircuitAhead server for the normal operation of the app.", "I contenuti personali dell'archivio REMORIQ non vengono inviati a un server CircuitAhead per il normale funzionamento dell'app."],
      ["Third-party services and components", "Servizi e componenti di terze parti"],
      ["Some features may use Android, Google or other technical libraries. Processing performed by those components may also be subject to their respective policies and terms.", "Alcune funzioni possono utilizzare componenti Android, Google o altre librerie tecniche. Il trattamento effettuato da tali componenti può essere soggetto anche alle rispettive informative e condizioni."],
      ["Used for features such as text recognition, code scanning, language identification and optional translation.", "Utilizzato per funzioni quali riconoscimento del testo, lettura di codici, identificazione della lingua e traduzione facoltativa."],
      ["Content processing is designed to occur locally for supported features, but Google SDKs may process technical, diagnostic, app, device or installation information.", "L'elaborazione del contenuto è progettata per avvenire localmente nelle funzioni supportate, ma gli SDK Google possono trattare informazioni tecniche, diagnostiche, relative all'app, al dispositivo o all'installazione."],
      ["Purchases for REMORIQ Pro or other products distributed through Google Play are handled by Google Play.", "Le eventuali transazioni relative a REMORIQ Pro o altri prodotti distribuiti attraverso Google Play vengono gestite da Google Play."],
      ["REMORIQ may store information locally to verify purchase status, but CircuitAhead does not directly receive or handle payment card numbers.", "REMORIQ può conservare localmente informazioni necessarie a verificare lo stato dell'acquisto, ma CircuitAhead non riceve né gestisce direttamente i numeri delle carte di pagamento."],
      ["System services", "Servizi di sistema"],
      ["Features such as file selection, notifications, biometrics, calendar, camera or voice recognition may involve Android components or apps installed on the device.", "Funzioni come selezione dei file, notifiche, biometria, calendario, fotocamera o riconoscimento vocale possono coinvolgere componenti Android o applicazioni installate sul dispositivo."],
      ["Storage", "Archiviazione"],
      ["Providers selected by the user", "Provider scelti dall'utente"],
      ["When the user chooses to export or back up to an external provider, such as a cloud service available in the Android file picker, the file is delivered to the destination selected by the user.", "Quando l'utente sceglie di esportare o effettuare un backup verso un provider esterno, ad esempio un servizio cloud disponibile nel selettore file Android, il file viene consegnato alla destinazione scelta dall'utente."],
      ["Subsequent retention is governed by the selected provider.", "La conservazione successiva è regolata dal provider selezionato."],
      ["Data sharing and export", "Condivisione ed esportazione dei dati"],
      ["REMORIQ allows the user to export, share or create packages containing selected information.", "REMORIQ consente all'utente di esportare, condividere o creare pacchetti contenenti informazioni selezionate."],
      ["These operations are initiated by the user and may deliver data to other applications, people or providers selected by the user.", "Queste operazioni vengono avviate dall'utente e possono consegnare i dati ad altre applicazioni, persone o provider scelti dall'utente."],
      ["Some REMORIQ packages may be protected using encryption. Files exported in other formats, printed documents or content shared through external apps should not automatically be considered encrypted by REMORIQ.", "Alcuni pacchetti REMORIQ possono essere protetti mediante cifratura. File esportati in altri formati, documenti stampati o contenuti condivisi attraverso applicazioni esterne non devono essere considerati automaticamente cifrati da REMORIQ."],
      ["Permissions and access to device features", "Permessi e accesso alle funzioni del dispositivo"],
      ["Depending on the features selected by the user, REMORIQ may request or use access to device resources such as:", "REMORIQ può richiedere o utilizzare, a seconda delle funzioni scelte dall'utente, accesso a risorse del dispositivo come:"],
      ["camera for scanning and content capture;", "fotocamera per scansioni e acquisizione di contenuti;"],
      ["microphone for optional voice dictation;", "microfono per dettatura vocale facoltativa;"],
      ["notifications for reminders and alerts;", "notifiche per promemoria e avvisi;"],
      ["Android file and document picker for import, export and backup;", "selettore Android di file e documenti per importazione, esportazione e backup;"],
      ["biometric authentication or device credentials for protection features, when enabled.", "autenticazione biometrica o credenziali del dispositivo per funzioni di protezione, quando attivate."],
      ["Permissions are used to provide the requested function and can be managed from Android settings.", "I permessi vengono utilizzati per fornire la funzione richiesta e possono essere gestiti dalle impostazioni Android."],
      ["Security", "Sicurezza"],
      ["REMORIQ uses security mechanisms provided by Android and measures designed to reduce unauthorized access to data.", "REMORIQ utilizza meccanismi di sicurezza messi a disposizione da Android e misure progettate per ridurre l'accesso non autorizzato ai dati."],
      ["core content stored in Android's private app space;", "contenuti core conservati nello spazio privato dell'app Android;"],
      ["use of Android Keystore for appropriate security material;", "utilizzo di Android Keystore per materiale di sicurezza appropriato;"],
      ["optional app protection with PIN and, when available, biometric authentication managed by the system;", "possibilità di protezione dell'app mediante PIN e, quando disponibile, autenticazione biometrica gestita dal sistema;"],
      ["portable REMORIQ packages protected using encryption where provided by the feature;", "pacchetti REMORIQ portabili protetti mediante cifratura nelle funzioni che la prevedono;"],
      ["integrity and validation checks in backup, restore and import flows.", "controlli di integrità e validazione nei flussi di backup, ripristino e importazione."],
      ["No computer system can guarantee absolute security.", "Nessun sistema informatico può tuttavia garantire sicurezza assoluta."],
      ["Retention and deletion", "Conservazione ed eliminazione"],
      ["Data stored in the app", "Dati conservati nell'app"],
      ["Content stored locally remains on the device until the user deletes it, clears app data or uninstalls REMORIQ, subject to the normal behavior of the operating system.", "I contenuti memorizzati localmente restano sul dispositivo finché l'utente non li elimina, cancella i dati dell'app oppure disinstalla REMORIQ, fatti salvi i normali comportamenti del sistema operativo."],
      ["Backups and exported copies", "Backup e copie esportate"],
      ["Backups, exported files and shared copies are stored in the destination selected by the user and are not automatically deleted when REMORIQ is uninstalled.", "Backup, file esportati e copie condivise vengono conservati nella destinazione scelta dall'utente e non vengono automaticamente eliminati quando REMORIQ viene disinstallata."],
      ["The user must delete those copies directly from the relevant destination or service with which they were shared.", "L'utente deve eliminare tali copie direttamente dalla relativa destinazione o dal servizio con cui sono state condivise."],
      ["Data managed by external services", "Dati gestiti da servizi esterni"],
      ["Retention periods for information processed by Google Play, Android or other external providers are determined by their respective policies.", "I tempi di conservazione di informazioni trattate da Google Play, Android o altri provider esterni sono determinati dalle rispettive politiche."],
      ["REMORIQ does not create a user account", "REMORIQ non crea un account utente"],
      ["REMORIQ does not require the creation of a REMORIQ account and therefore there is no REMORIQ account to delete through a remote service.", "REMORIQ non richiede la creazione di un account REMORIQ e non dispone quindi di un account REMORIQ da cancellare attraverso un servizio remoto."],
      ["To remove locally stored data, the user can use the app's features, clear app data from Android settings or uninstall REMORIQ.", "Per rimuovere i dati memorizzati localmente l'utente può utilizzare le funzioni dell'app, cancellare i dati dell'app dalle impostazioni Android o disinstallare REMORIQ."],
      ["Purchases made through Google Play remain managed by the relevant Google account and Google Play procedures.", "Eventuali acquisti effettuati tramite Google Play restano gestiti dal relativo account Google e dalle procedure di Google Play."],
      ["Support communications", "Comunicazioni con il supporto"],
      ["If the user contacts CircuitAhead by email, CircuitAhead receives the sender's email address and the information the user voluntarily chooses to include in the message.", "Se l'utente contatta CircuitAhead tramite email, CircuitAhead riceve l'indirizzo email del mittente e le informazioni che l'utente decide volontariamente di inserire nel messaggio."],
      ["This data is used to respond to the request, diagnose reported issues and maintain a reasonable support history when necessary.", "Questi dati vengono utilizzati per rispondere alla richiesta, diagnosticare eventuali problemi segnalati e mantenere una cronologia ragionevole dell'assistenza quando necessario."],
      ["Do not send unnecessary sensitive data.", "Non inviare dati sensibili non necessari."],
      ["When contacting support, avoid attaching documents, passwords, PIN codes or personal REMORIQ content unless strictly necessary to resolve the issue and you have consciously decided to share it.", "Quando contatti il supporto, evita di allegare documenti, password, codici PIN o contenuti personali di REMORIQ salvo quando siano strettamente necessari alla risoluzione del problema e tu abbia deciso consapevolmente di condividerli."],
      ["Changes to this policy", "Modifiche a questa informativa"],
      ["This policy may be updated when REMORIQ introduces, changes or removes features that affect data processing, or when regulatory or distribution-platform requirements change.", "Questa informativa può essere aggiornata quando REMORIQ introduce, modifica o rimuove funzionalità che incidono sul trattamento dei dati oppure quando cambiano i requisiti normativi o delle piattaforme di distribuzione."],
      ["The date of the latest update is shown at the top of the page.", "La data dell'ultimo aggiornamento viene indicata nella parte superiore della pagina."],
      ["If a future version introduces network services, advertising, analytics or other processing methods not described here, the policy and Google Play declarations will be updated to reflect the actual behavior of the distributed version.", "Qualora una futura versione introduca servizi di rete, pubblicità, analytics o altre modalità di trattamento non descritte qui, l'informativa e le dichiarazioni Google Play saranno aggiornate per riflettere il comportamento effettivo della versione distribuita."],
      ["PRIVACY QUESTIONS", "DOMANDE SULLA PRIVACY"],
      ["Would you like more information?", "Vuoi maggiori informazioni?"],
      ["For questions about this policy or the processing of data in REMORIQ, you can contact CircuitAhead.", "Per domande relative alla presente informativa o al trattamento dei dati in REMORIQ puoi contattare CircuitAhead."],
      ["REMORIQ Privacy Policy.", "Privacy Policy di REMORIQ."]
    ],

    support: [
      ["Official REMORIQ support", "Supporto ufficiale REMORIQ"],
      ["SUPPORT", "SUPPORTO"],
      ["How can we", "Come possiamo"],
      ["help you?", "aiutarti?"],
      ["Find the main information about REMORIQ quickly, or contact CircuitAhead directly if you need assistance.", "Trova rapidamente le informazioni principali su REMORIQ oppure contatta direttamente CircuitAhead se hai bisogno di assistenza."],
      ["Write to support", "Scrivi al supporto"],
      ["Frequently asked questions", "Domande frequenti"],
      ["Support email", "Email di assistenza"],
      ["HOW WE CAN HELP", "IN COSA POSSIAMO AIUTARTI"],
      ["Start with the", "Parti dal"],
      ["right problem.", "problema giusto."],
      ["The most common support areas for REMORIQ.", "Le aree più comuni di assistenza per REMORIQ."],
      ["App problems", "Problemi con l'app"],
      ["Unexpected closures, unusual behavior, visual issues or features that do not respond as expected.", "Chiusure inattese, comportamento anomalo, problemi grafici o funzioni che non rispondono come previsto."],
      ["How to report a problem", "Come segnalare un problema"],
      ["Backup and transfer", "Backup e trasferimento"],
      ["Information about backup, restore, export, import and moving data to another device.", "Informazioni su backup, ripristino, esportazione, importazione e passaggio dei dati a un altro dispositivo."],
      ["Read the FAQ", "Leggi le FAQ"],
      ["REMORIQ Pro and purchases", "REMORIQ Pro e acquisti"],
      ["Questions about purchases made through Google Play and the status of Pro features.", "Domande relative agli acquisti effettuati attraverso Google Play e allo stato delle funzionalità Pro."],
      ["Contact support", "Contatta il supporto"],
      ["Privacy and security", "Privacy e sicurezza"],
      ["Information about data processing, local storage, permissions and content protection.", "Informazioni sul trattamento dei dati, conservazione locale, permessi e protezione dei contenuti."],
      ["Read the Privacy Policy", "Leggi la Privacy Policy"],
      ["BEFORE CONTACTING US", "PRIMA DI CONTATTARCI"],
      ["A little information can", "Poche informazioni possono"],
      ["make a big difference.", "fare molta differenza."],
      ["If you are reporting a technical issue, these details can help us understand what happened more quickly.", "Se stai segnalando un problema tecnico, questi dettagli possono aiutarci a capire più rapidamente cosa è successo."],
      ["Describe what you were doing", "Descrivi cosa stavi facendo"],
      ["Explain the steps that happened before the problem and what you expected to happen.", "Indica i passaggi che hanno preceduto il problema e cosa ti aspettavi che accadesse."],
      ["Include device and Android version", "Indica dispositivo e Android"],
      ["The device model and Android version can help reproduce the issue.", "Modello del dispositivo e versione di Android possono essere utili per riprodurre il problema."],
      ["Include the REMORIQ version", "Indica la versione di REMORIQ"],
      ["If possible, tell us the version of the app where the issue occurred.", "Se possibile, comunica la versione dell'app con cui si è verificato il problema."],
      ["Add a screenshot only if useful", "Aggiungi uno screenshot solo se utile"],
      ["Before sending it, check that it does not contain personal information that is not necessary.", "Prima di inviarlo controlla che non contenga informazioni personali che non sono necessarie."],
      ["PROTECT YOUR DATA", "PROTEGGI I TUOI DATI"],
      ["We don't need", "Non abbiamo bisogno"],
      ["your secrets.", "dei tuoi segreti."],
      ["When you contact support, do not send passwords, PINs, credentials, full payment card numbers or personal documents that are not necessary to resolve the issue.", "Quando contatti il supporto, non inviare password, PIN, credenziali, numeri completi di carte di pagamento o documenti personali non necessari alla risoluzione del problema."],
      ["FREQUENTLY ASKED QUESTIONS", "DOMANDE FREQUENTI"],
      ["The answers", "Le risposte"],
      ["that matter most.", "più importanti."],
      ["Essential information about how REMORIQ works and how it manages data.", "Informazioni essenziali sul funzionamento e sulla gestione dei dati in REMORIQ."],
      ["Where is my data stored?", "Dove vengono salvati i miei dati?"],
      ["REMORIQ is designed as a local-first application. The device is the primary storage system for content used by core features.", "REMORIQ è progettata come applicazione local-first. Il dispositivo è il principale sistema di conservazione dei contenuti utilizzati nelle funzioni core."],
      ["If you choose to create backups, export files or share content, those copies are stored in the destination you select.", "Se scegli di creare backup, esportare file o condividere contenuti, tali copie vengono conservate nella destinazione da te scelta."],
      ["Do I need to create a REMORIQ account?", "Devo creare un account REMORIQ?"],
      ["No. REMORIQ does not require a REMORIQ account, email address or password to use its core features.", "No. REMORIQ non richiede un account REMORIQ, un indirizzo email o una password REMORIQ per utilizzare le funzionalità principali."],
      ["Any Google account used by the device or Google Play is separate from REMORIQ.", "L'eventuale account Google utilizzato dal dispositivo o da Google Play è separato da REMORIQ."],
      ["Does REMORIQ work without Internet?", "REMORIQ funziona senza Internet?"],
      ["Core features are designed to remain useful offline.", "Le funzionalità principali sono progettate per rimanere utili anche offline."],
      ["Some operations may still require Internet when they depend on Google Play, an external provider or the optional download of components required by certain features.", "Alcune operazioni possono comunque richiedere Internet quando dipendono da Google Play, da un provider esterno o dal download facoltativo di componenti necessari a determinate funzioni."],
      ["What happens to my data if I uninstall REMORIQ?", "Cosa succede ai dati se disinstallo REMORIQ?"],
      ["Uninstalling the app may remove data stored in the app's private space.", "La disinstallazione può rimuovere i dati conservati nello spazio privato dell'app."],
      ["Backups, packages or files that you exported to other destinations are not automatically deleted together with the app.", "Backup, pacchetti o file che hai esportato verso altre destinazioni non vengono automaticamente eliminati insieme all'app."],
      ["Before uninstalling REMORIQ or changing devices, it is therefore advisable to make sure you have the backup you need.", "Prima di disinstallare REMORIQ o cambiare dispositivo è quindi opportuno verificare di disporre del backup necessario."],
      ["Can I move my data to another phone?", "Posso spostare i miei dati su un altro telefono?"],
      ["REMORIQ is designed to make data portable through backup, export, import, restore and transfer features supported by the app.", "REMORIQ è progettata per rendere i dati portabili attraverso funzioni di backup, esportazione, importazione, ripristino e trasferimento supportate dall'app."],
      ["The goal is to prevent user data from depending on an account or a proprietary CircuitAhead cloud.", "L'obiettivo è evitare che i dati dell'utente dipendano da un account o da un cloud proprietario CircuitAhead."],
      ["Can support recover my data?", "Il supporto può recuperare i miei dati?"],
      ["Because core content is not normally synchronized with a REMORIQ server, CircuitAhead does not automatically have a remote copy of your personal data.", "Poiché i contenuti core non vengono normalmente sincronizzati con un server REMORIQ, CircuitAhead non dispone automaticamente di una copia remota dei tuoi dati personali."],
      ["This is why backups and portability tools are particularly important.", "Per questo motivo backup e strumenti di portabilità sono particolarmente importanti."],
      ["Who handles REMORIQ Pro purchases?", "Chi gestisce gli acquisti REMORIQ Pro?"],
      ["Purchases distributed through Google Play are processed through Google Play's payment infrastructure.", "Gli acquisti distribuiti tramite Google Play vengono elaborati attraverso l'infrastruttura di pagamento di Google Play."],
      ["CircuitAhead does not directly handle the full card numbers used for payment.", "CircuitAhead non gestisce direttamente i numeri completi delle carte utilizzate per il pagamento."],
      ["If you have a problem with purchase status, you can contact support describing the issue without sending unnecessary payment data.", "Se riscontri un problema relativo allo stato di un acquisto puoi contattare il supporto indicando il problema, senza inviare dati di pagamento non necessari."],
      ["Can I request deletion of my REMORIQ account?", "Posso chiedere la cancellazione del mio account REMORIQ?"],
      ["REMORIQ does not create a REMORIQ account, so there is no remote REMORIQ account to delete.", "REMORIQ non crea un account REMORIQ, quindi non esiste un account remoto REMORIQ da cancellare."],
      ["Local data can be managed from the app or removed using the appropriate Android features.", "I dati locali possono essere gestiti dall'app o rimossi tramite le funzioni Android appropriate."],
      ["Where can I read the Privacy Policy?", "Dove posso leggere l'informativa sulla privacy?"],
      ["The official REMORIQ Privacy Policy is available on the CircuitAhead website.", "La Privacy Policy ufficiale di REMORIQ è disponibile sul sito CircuitAhead."],
      ["Open the Privacy Policy", "Apri la Privacy Policy"],
      ["REPORT A PROBLEM", "SEGNALA UN PROBLEMA"],
      ["If something isn't working,", "Se qualcosa non funziona,"],
      ["we want to know.", "vogliamo saperlo."],
      ["Write to us explaining what happened. The clearer the description, the easier it will be to analyze the reported behavior.", "Scrivici spiegando cosa è successo. Più la descrizione è chiara, più semplice sarà analizzare il comportamento segnalato."],
      ["Official REMORIQ support.", "Supporto ufficiale REMORIQ."]
    ]
  };

  const pageMeta = {
    home: {
      en: {
        title: "CircuitAhead — Software for a smarter tomorrow",
        description: "CircuitAhead creates thoughtful, reliable and privacy-focused software designed around real people and real needs.",
        ogTitle: "CircuitAhead",
        ogDescription: "Thoughtful software for a smarter tomorrow."
      },
      it: {
        title: "CircuitAhead — Software per un domani più intelligente",
        description: "CircuitAhead crea software curato, affidabile e attento alla privacy, progettato attorno a persone ed esigenze reali.",
        ogTitle: "CircuitAhead",
        ogDescription: "Software curato per un domani più intelligente."
      }
    },
    remoriq: {
      en: {
        title: "REMORIQ — Your private second memory | CircuitAhead",
        description: "REMORIQ is a private, local-first second memory for Android. Capture useful information, organize it, act on it and keep control of your data.",
        ogTitle: "REMORIQ — Your private second memory",
        ogDescription: "A local-first second memory designed to help you keep, understand and rediscover what matters."
      },
      it: {
        title: "REMORIQ — La tua seconda memoria privata | CircuitAhead",
        description: "REMORIQ è una seconda memoria privata e local-first per Android. Raccogli informazioni utili, organizzale, agisci e mantieni il controllo dei tuoi dati.",
        ogTitle: "REMORIQ — La tua seconda memoria privata",
        ogDescription: "Una seconda memoria local-first progettata per aiutarti a conservare, capire e ritrovare ciò che conta."
      }
    },
    privacy: {
      en: {
        title: "REMORIQ Privacy Policy | CircuitAhead",
        description: "Privacy Policy for REMORIQ, the Android application developed and published by CircuitAhead."
      },
      it: {
        title: "Privacy Policy di REMORIQ | CircuitAhead",
        description: "Informativa sulla privacy di REMORIQ, applicazione Android sviluppata e pubblicata da CircuitAhead."
      }
    },
    support: {
      en: {
        title: "REMORIQ Support | CircuitAhead",
        description: "Official support for REMORIQ. Assistance, frequently asked questions, backup, privacy, purchases and CircuitAhead contacts."
      },
      it: {
        title: "Supporto REMORIQ | CircuitAhead",
        description: "Supporto ufficiale per REMORIQ. Assistenza, domande frequenti, backup, privacy, acquisti e contatti CircuitAhead."
      }
    }
  };

  const getPageId = () => {
    const firstSegment = window.location.pathname
      .split("/")
      .filter(Boolean)[0];

    if (!firstSegment) return "home";
    if (["remoriq", "privacy", "support"].includes(firstSegment)) {
      return firstSegment;
    }
    return "home";
  };

  const buildMaps = (pageId) => {
    const pairs = [
      ...commonPairs,
      ...(pagePairs[pageId] || [])
    ];

    const toItalian = new Map();
    const toEnglish = new Map();

    pairs.forEach(([en, it]) => {
      toItalian.set(en, it);
      toEnglish.set(it, en);
    });

    return { toItalian, toEnglish };
  };

  const normalize = (value) => value.replace(/\s+/g, " ").trim();

  const translateValue = (value, language, maps) => {
    if (!value) return value;
    const normalized = normalize(value);
    const map = language === "it" ? maps.toItalian : maps.toEnglish;
    return map.get(normalized) || value;
  };

  const translateTextNodes = (language, maps) => {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-i18n-ignore]")) return NodeFilter.FILTER_REJECT;
          if (["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          return normalize(node.nodeValue || "")
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    let current;
    while ((current = walker.nextNode())) nodes.push(current);

    const map = language === "it" ? maps.toItalian : maps.toEnglish;

    nodes.forEach((node) => {
      const raw = node.nodeValue || "";
      const normalized = normalize(raw);
      const translated = map.get(normalized);
      if (!translated || translated === normalized) return;

      const leading = raw.match(/^\s*/)?.[0] || "";
      const trailing = raw.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${translated}${trailing}`;
    });
  };

  const translateAttributes = (language, maps) => {
    ["aria-label", "title"].forEach((attribute) => {
      document.querySelectorAll(`[${attribute}]`).forEach((element) => {
        if (element.closest("[data-i18n-ignore]")) return;
        const value = element.getAttribute(attribute);
        const translated = translateValue(value, language, maps);
        if (translated !== value) element.setAttribute(attribute, translated);
      });
    });
  };

  const updateMeta = (pageId, language) => {
    const meta = pageMeta[pageId]?.[language];
    if (!meta) return;

    document.title = meta.title;

    const description = document.querySelector('meta[name="description"]');
    if (description && meta.description) {
      description.setAttribute("content", meta.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && meta.ogTitle) {
      ogTitle.setAttribute("content", meta.ogTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription && meta.ogDescription) {
      ogDescription.setAttribute("content", meta.ogDescription);
    }
  };

  const updateMailSubjects = (language) => {
    const subjects = {
      "Supporto REMORIQ": "REMORIQ Support",
      "REMORIQ - Acquisti": "REMORIQ - Purchases",
      "REMORIQ - Segnalazione problema": "REMORIQ - Problem report"
    };

    document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.includes("?")) return;

      const [base, query] = href.split("?", 2);
      const params = new URLSearchParams(query);
      const subject = params.get("subject");
      if (!subject) return;

      const english = subjects[subject] || subject;
      const italian = Object.entries(subjects)
        .find(([, en]) => en === subject)?.[0] || subject;

      const nextSubject = language === "it"
        ? (subjects[subject] ? subject : italian)
        : (subjects[subject] || english);

      params.set("subject", nextSubject);
      link.setAttribute(
        "href",
        `${base}?${params.toString().replace(/\+/g, "%20")}`
      );
    });
  };

  const addLanguageStyles = () => {
    if (document.querySelector("#circuitahead-language-styles")) return;

    const style = document.createElement("style");
    style.id = "circuitahead-language-styles";
    style.textContent = `
      .site-language-switcher {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        padding: 4px;
        border: 1px solid var(--border);
        border-radius: 11px;
        background: rgba(255,255,255,.78);
      }
      .site-language-switcher button {
        min-width: 34px;
        height: 30px;
        padding: 0 8px;
        border: 0;
        border-radius: 8px;
        color: var(--text-light);
        background: transparent;
        cursor: pointer;
        font-size: .72rem;
        font-weight: 760;
        letter-spacing: .04em;
        transition: background 180ms ease, color 180ms ease, box-shadow 180ms ease;
      }
      .site-language-switcher button:hover {
        color: var(--navy-950);
      }
      .site-language-switcher button.active {
        color: var(--blue-700);
        background: var(--surface-blue);
        box-shadow: inset 0 0 0 1px rgba(18,104,255,.08);
      }
      .site-language-switcher--mobile {
        display: none;
      }
      @media (max-width: 1020px) {
        .site-language-switcher--desktop {
          display: none;
        }
        .site-language-switcher--mobile {
          display: flex;
          width: fit-content;
          margin-top: 14px;
        }
        .mobile-nav.open {
          max-height: 540px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  const updateControls = (language) => {
    document.querySelectorAll(".site-language-switcher button").forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const createLanguageSwitcher = (modifier) => {
    const wrapper = document.createElement("div");
    wrapper.className = `site-language-switcher site-language-switcher--${modifier}`;
    wrapper.setAttribute("data-i18n-ignore", "true");
    wrapper.setAttribute("role", "group");
    wrapper.setAttribute("aria-label", "Language / Lingua");

    ["it", "en"].forEach((language) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.language = language;
      button.textContent = language.toUpperCase();
      button.setAttribute(
        "aria-label",
        language === "it" ? "Italiano" : "English"
      );
      wrapper.appendChild(button);
    });

    return wrapper;
  };

  const installLanguageControls = (onSelect) => {
    addLanguageStyles();

    const headerInner = document.querySelector(".header-inner");
    const contact = document.querySelector(".header-contact");
    if (headerInner && !document.querySelector(".site-language-switcher--desktop")) {
      const desktop = createLanguageSwitcher("desktop");
      if (contact) {
        headerInner.insertBefore(desktop, contact);
      } else {
        headerInner.appendChild(desktop);
      }
    }

    const mobileNav = document.querySelector(".mobile-nav");
    if (mobileNav && !document.querySelector(".site-language-switcher--mobile")) {
      mobileNav.appendChild(createLanguageSwitcher("mobile"));
    }

    document.querySelectorAll(".site-language-switcher button").forEach((button) => {
      button.addEventListener("click", () => {
        const language = button.dataset.language;
        if (!language) return;
        localStorage.setItem(STORAGE_KEY, language);
        onSelect(language);
      });
    });
  };

  const detectLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "it" || saved === "en") return saved;

    const languages = Array.isArray(navigator.languages) && navigator.languages.length
      ? navigator.languages
      : [navigator.language || ""];

    const prefersItalian = languages.some((language) =>
      String(language).toLowerCase().startsWith("it")
    );

    let italyTimezone = false;
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      italyTimezone = timeZone === "Europe/Rome";
    } catch (_) {
      italyTimezone = false;
    }

    return prefersItalian || italyTimezone ? "it" : "en";
  };

  const init = () => {
    const pageId = getPageId();
    const maps = buildMaps(pageId);

    const applyLanguage = (language) => {
      document.documentElement.lang = language;
      document.documentElement.dataset.siteLanguage = language;
      translateTextNodes(language, maps);
      translateAttributes(language, maps);
      updateMeta(pageId, language);
      updateMailSubjects(language);
      updateControls(language);
    };

    installLanguageControls(applyLanguage);
    applyLanguage(detectLanguage());
  };

  return { init };
})();


document.addEventListener("DOMContentLoaded", () => {

  CircuitAheadI18n.init();

  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const year = document.querySelector("#current-year");


  /* ---------------------------------------------------------
     HEADER
     --------------------------------------------------------- */

  const updateHeader = () => {
    if (window.scrollY > 15) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener(
    "scroll",
    updateHeader,
    { passive: true }
  );


  /* ---------------------------------------------------------
     MOBILE MENU
     --------------------------------------------------------- */

  const closeMenu = () => {
    if (!menuButton || !mobileNav) return;

    menuButton.classList.remove("active");
    mobileNav.classList.remove("open");

    menuButton.setAttribute(
      "aria-expanded",
      "false"
    );
  };


  menuButton?.addEventListener("click", () => {

    const isOpen =
      menuButton.classList.toggle("active");

    mobileNav?.classList.toggle(
      "open",
      isOpen
    );

    menuButton.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

  });


  mobileLinks.forEach((link) => {
    link.addEventListener(
      "click",
      closeMenu
    );
  });


  window.addEventListener("resize", () => {
    if (window.innerWidth > 1020) {
      closeMenu();
    }
  });


  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */

  const reduceMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  if (reduceMotion) {

    revealElements.forEach((element) => {
      element.classList.add("visible");
    });

  } else {

    const observer =
      new IntersectionObserver(
        (entries, revealObserver) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -45px 0px"
        }
      );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  }


  /* ---------------------------------------------------------
     YEAR
     --------------------------------------------------------- */

  if (year) {
    year.textContent =
      String(new Date().getFullYear());
  }

});