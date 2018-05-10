import {DashboardComponent} from './components/dashboard/dashboard.component';
import {ActivatorService} from './services/activator.service';
import {LoginComponent} from './components/login/login.component';
import {Routes} from '@angular/router';
import {NotesComponent} from './components/notes/notes.component';
import {RegisterComponent} from './components/register/register.component';
import {DebtComponent} from './components/debt/debt.component';
import {FriendsComponent} from './components/friends/friends.component';
import {ChatComponent} from './components/chat/chat.component';
import {ProfileComponent} from './components/profile/profile.component';

export const routes: Routes = [
  {path: 'notes', component: NotesComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [ActivatorService]},
  {path: 'debt', component: DebtComponent, canActivate: [ActivatorService]},
  {path: 'friends', component: FriendsComponent, canActivate: [ActivatorService]},
  {path: 'chat', component: ChatComponent, canActivate: [ActivatorService]},
  {path: 'profile', component: ProfileComponent, canActivate: [ActivatorService]},
  {path: 'debt/:id', component: DebtComponent, canActivate: [ActivatorService]},
  {path: '**', component: DashboardComponent}
];
