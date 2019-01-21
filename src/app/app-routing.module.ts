import { NgModule } from '@angular/core';
import {RouterModule, Routes, Router} from '@angular/router';

import { AuthGuard } from './_guard';
import { LoginComponent } from './login';
import { DashboardComponent } from './dashboard';
import { RegisterComponent } from './register';
import { ChangepasswordComponent } from './login/changepassword/changepassword.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  {path: 'login', component: LoginComponent, runGuardsAndResolvers: 'always'},
  {path: 'register', component: RegisterComponent, runGuardsAndResolvers: 'always'},
  {path: 'logout', component: LoginComponent, runGuardsAndResolvers: 'always'},
  {path: 'change-password', component: ChangepasswordComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  {path: 'employee-detail', component: EmployeeDetailComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  {path: 'super-admin', component: SuperAdminComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
  {path: 'forgot-password', component: ForgotpasswordComponent},
  {path: 'reset-password', component: ChangepasswordComponent},
  {path: '**', redirectTo: 'dashboard'},
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
//   exports: [RouterModule]
// })


// export class AppRoutingModule { }

export const routing = RouterModule.forRoot(routes);