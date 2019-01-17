import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoProfileGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.auth.user$.pipe(
      take(1),
      tap(user => {
        if (!user.userProfile) {
          console.log('access denied - user does not have a profile');
          this.router.navigate([`/user/${user.uid}/create-profile`]);
        }
      }),
      map(user => !!user.userProfile)
    );
  }
}
