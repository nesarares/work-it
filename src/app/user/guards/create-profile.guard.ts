import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CreateProfileGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  /**
   * A guard used to restrict the user`s permissions to create a profile if he already has one.
   * @param _next: ActivatedRouteSnapshot, the route user wants to navigate
   * @param _state: RouterStateSnapshot, the current route state
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      take(1),
      tap(user => {
        if (user.userProfile) {
          console.log('access denied - user already has a profile');
          this.router.navigate([`/user/${user.uid}`]);
        }
      }),
      map(user => !user.userProfile)
    );
  }
}
