/* Enkel klient-side innlogging med localStorage. Ingen backend —
   passord lagres i klartekst kun fordi dette er en øvingsoppgave.

   localStorage er en liten "database" som ligger i nettleseren til
   hver enkelt bruker. Den lagrer bare tekst (strenger), så objekter
   og lister må gjøres om til JSON-tekst med JSON.stringify() før de
   lagres, og tilbake til vanlige JS-objekter med JSON.parse() når de
   hentes ut igjen. Dataene overlever at man laster siden på nytt,
   men de ligger kun på DENNE maskinen/nettleseren — ikke på en server. */

// Nøklene (navnene) vi lagrer under i localStorage. Egne konstanter
// gjør at vi ikke skriver feil hvis vi bruker samme streng flere steder.
const AUTH_USERS_KEY = "ut-brukere"; // her ligger LISTEN over alle registrerte brukere
const AUTH_SESSION_KEY = "ut-innlogget-epost"; // her ligger e-posten til den som ER innlogget nå

// Henter listen over alle brukere fra localStorage.
// Returnerer alltid et array — tomt array [] hvis ingen er registrert ennå,
// eller hvis dataene av en eller annen grunn er ødelagt/ugyldige.
function getUsers() {
  try {
    // localStorage.getItem henter teksten som ligger lagret (eller null hvis den ikke finnes).
    // JSON.parse gjør teksten om til et ekte JS-array igjen.
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || [];
  } catch (e) {
    // Hvis JSON.parse feiler (f.eks. ødelagte data), gir vi opp og sier "ingen brukere".
    return [];
  }
}

// Lagrer HELE brukerlisten tilbake til localStorage.
// Vi kan ikke lagre et array direkte — det må gjøres om til tekst først (JSON.stringify).
function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

// Leter gjennom brukerlisten etter én bruker med en gitt e-postadresse.
// .find() går gjennom arrayet og returnerer det FØRSTE elementet som
// matcher, eller undefined hvis ingen matcher.
// Vi bruker .toLowerCase() på begge sider slik at "Ola@Mail.com" og
// "ola@mail.com" regnes som samme e-post (store/små bokstaver skal ikke telle).
// .trim() fjerner mellomrom foran/bak, i tilfelle brukeren har tastet inn ekstra mellomrom.
function findUser(epost) {
  return getUsers().find((u) => u.epost.toLowerCase() === epost.trim().toLowerCase());
}

// Markerer en bruker som "innlogget" ved å lagre e-posten deres i en egen nøkkel.
// Dette er selve "sesjonen" — så lenge denne nøkkelen finnes i localStorage,
// regner vi brukeren som innlogget (se currentUser()).
function setSession(epost) {
  localStorage.setItem(AUTH_SESSION_KEY, epost);
}

// Finner ut HVEM som er innlogget akkurat nå (brukes f.eks. på en fremtidig profilside).
// Henter e-posten fra sesjonen, og slår den opp i brukerlisten for å få hele brukerobjektet.
// Returnerer null hvis ingen er innlogget.
function currentUser() {
  const epost = localStorage.getItem(AUTH_SESSION_KEY);
  return epost ? findUser(epost) : null;
}

// Logger ut ved å rett og slett slette sesjons-nøkkelen.
// Selve brukeren/passordet blir IKKE slettet — bare "hvem er innlogget nå"-merket.
function logoutUser() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

// Oppretter en ny bruker. Kalles fra register-skjemaet.
// Parametere: navn, epost og passord — alt som tekst, rett fra input-feltene.
// Returnerer et resultat-objekt: { ok: true } ved suksess,
// eller { ok: false, feil: "..." } med en feilmelding vi kan vise brukeren.
function registerUser(navn, epost, passord) {
  // Steg 1: sjekk om e-posten allerede er i bruk — kan ikke ha to brukere med samme e-post.
  if (findUser(epost)) {
    return { ok: false, feil: "Det finnes allerede en bruker med denne e-postadressen." };
  }
  // Steg 2: hent eksisterende liste, legg til den nye brukeren som et nytt objekt.
  const users = getUsers();
  users.push({ navn: navn.trim(), epost: epost.trim(), passord });
  // Steg 3: lagre den oppdaterte listen tilbake til localStorage.
  saveUsers(users);
  // Steg 4: logg brukeren rett inn etter registrering (slipper å logge inn på nytt manuelt).
  setSession(epost.trim());
  return { ok: true };
}

// Logger inn en eksisterende bruker. Kalles fra login-skjemaet.
// Returnerer samme type resultat-objekt som registerUser().
function loginUser(epost, passord) {
  // Steg 1: finn brukeren med denne e-posten.
  const user = findUser(epost);
  // Steg 2: sjekk at brukeren faktisk finnes OG at passordet stemmer.
  // (!user er true hvis findUser ikke fant noen — da hopper vi rett i feil-grenen
  // uten å prøve å lese user.passord, som ellers ville krasjet.)
  if (!user || user.passord !== passord) {
    return { ok: false, feil: "Feil e-post eller passord." };
  }
  // Steg 3: alt stemte — logg inn.
  setSession(user.epost);
  return { ok: true };
}
