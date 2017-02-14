import { Observable } from 'rxjs/Observable';
import './rxjs.extension';
import { Session } from '../session/session';

export interface IEmployeeService {

  /**
   * Récupère les sessions de formation de l'utilisateur connecté.
   * Pour récupérer le login de l'utilisateur connecté : SecurityService#getCurrentUser()
   */
  findSessions(): Observable<Session[]>;

  /**
   * Récupère depuis le serveur l'id de l'utilisateur ayant le login passé en paramètre.
   * @param login le nom d'utilisateur de l'utilisateur connecté
   */
  findEmployeeIdByLogin(login: string): Observable<number>;

}
