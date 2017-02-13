import { Observable } from 'rxjs/Observable';

export interface IHomeService {

  /**
   * Renvoyer un observable émettant un item avec la valeur 'Hello World'
   */
  createHelloWorldObs(): Observable<string>;

  /**
   * En utilisant le service Http récupérer la liste des domaines url : '/api/domains'
   */
  findAllDomains(): Observable<string[]>;

  /**
   * En utilisant le service Http se tromper dans l'url par exemple : '/api/toto' et renvoyer un tableau contenant ['wrong url'] en cas d'erreur
   */
  emptyListIfErrors(): Observable<string[]>;

  /**
   * En utilisant le service Http récupérer le nom des sites de formations hors de Paris url : '/api/locations'
   */
  findLocationsOutsideParis(): Observable<string[]>;

  /**
   * Récupérer les sites de formations parisiens et pour chacun d'eux récupérer le nom de la session de
   * formation /api/locations/{locationId}/sessions en supprimant les doublons
   */
  findSessionsNamesInParis(): Observable<string[]>;

  /**
   * Afficher le nombre total de jours de formation effectué en utilisant '/api/sessions' voir objet PageDTO
   */
  findTotalTrainingDays(): Observable<number>;

}
