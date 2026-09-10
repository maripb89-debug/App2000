function erGyldigLengde(verdi) {
   if(verdi.trim() === ""){
    return false;
   } 
   const tall = Number(verdi);
   if (!Number.isFinite(tall)) {
    return false;
   }
   return tall >=1 && tall <= 500
}
