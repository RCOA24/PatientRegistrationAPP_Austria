import { Routes } from '@angular/router';
import { PatientsComponent } from './pages/patients/patients.component';

export const routes: Routes = [
    { path: '', redirectTo: 'patients', pathMatch: 'full' },
    { path: 'patients', component: PatientsComponent }
];
