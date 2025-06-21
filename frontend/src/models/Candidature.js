class Candidature {
    constructor(id, etat, dateSoumission, disponibilite, cv, lettreMotivation) {
      this._id = id;
      this._etat = etat;
      this._dateSoumission = dateSoumission;
      this._disponibilite = disponibilite;
      this._cv = cv;
      this._lettreMotivation = lettreMotivation;
    }
  
    // Getters
    get id() {
      return this._id;
    }
  
    get etat() {
      return this._etat;
    }
  
    get dateSoumission() {
      return this._dateSoumission;
    }
  
    get disponibilite() {
      return this._disponibilite;
    }
  
    get cv() {
      return this._cv;
    }
  
    get lettreMotivation() {
      return this._lettreMotivation;
    }
  
    // Setters
    set id(newId) {
      this._id = newId;
    }
  
    set etat(newEtat) {
      this._etat = newEtat;
    }
  
    set dateSoumission(newDateSoumission) {
      this._dateSoumission = newDateSoumission;
    }
  
    set disponibilite(newDisponibilite) {
      this._disponibilite = newDisponibilite;
    }
  
    set cv(newCv) {
      this._cv = newCv;
    }
  
    set lettreMotivation(newLettreMotivation) {
      this._lettreMotivation = newLettreMotivation;
    }
  }
  