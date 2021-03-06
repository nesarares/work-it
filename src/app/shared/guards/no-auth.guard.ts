import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * A guard used to restrict the user`s permissions to login on specific routes, if he is already logged in
   * @param next: ActivatedRouteSnapshot, the route user wants to navigate
   * @param state: RouterStateSnapshot, the current route state
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      take(1),
      map(user => !user),
      tap(notAuthenticated => {
        if (!notAuthenticated) {
          console.log('access denied - user is already logged');
          this.router.navigate(['/']);
        }
      })
    );
  }
}
