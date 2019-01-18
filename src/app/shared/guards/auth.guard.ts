import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * A guard used to restrict the user`s permissions to navigate on specific routes, if he is not logged in
   * @param _next: ActivatedRouteSnapshot, the route user wants to navigate
   * @param _state: RouterStateSnapshot, the current route state
   */
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      map(user => !!user && _next.paramMap.get('id') === user.uid),
      tap(authenticated => {
        if (!authenticated) {
          console.log('access denied');
          this.router.navigate(['/']);
        }
      })
    );
  }
}
