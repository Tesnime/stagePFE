import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './admin/home/home.component';
import { HomeForComponent } from './formateur/home-for/home-for.component';
import { ProfileComponent } from './formateur/profile/profile.component';
import { CourssComponent } from './formateur/courss/courss.component';
import { EvalComponent } from './formateur/eval/eval.component';
import { DemandeComponent } from './formateur/demande/demande.component';
import { SessionComponent } from './formateur/session/session.component';
// import { VacationComponent } from './formateur/modal/vacation/vacation.component';
import { AgendaComponent } from './formateur/agenda/agenda.component';
import { SessionsComponent } from './formateur/sessions/sessions.component';
import { DemandesComponent } from './admin/demandes/demandes.component';
import { SessionsAdComponent } from './admin/sessions/sessionsAd.component';
import { HomeApComponent } from './apprenant/home-ap/home-ap.component';
import { MonProfileComponent } from './apprenant/mon-profile/mon-profile.component';
import { ChatComponent } from './chat/chat/chat.component';
import { EvaluationComponent } from './apprenant/modal/evaluation/evaluation.component';
import { RepportComponent } from './admin/modal/repport/repport.component';
import { StatComponent } from './admin/modal/stat/stat.component';
import { StarComponent } from './apprenant/modal/star/star.component';
import { AccueilComponent } from './accueil/accueil/accueil.component';
import { RapportFormateurComponent } from './admin/modal/rapport-formateur/rapport-formateur.component';
import { AppSessionsComponent } from './apprenant/app-sessions/app-sessions.component';
import { SessionTerminerComponent } from './apprenant/modal/session-terminer/session-terminer.component';
import { VacationComponent } from './admin/modal/vacation/vacation.component';
import { CommoditesComponent } from './admin/modal/commodites/commodites.component';
import { FeuilleDePresenceComponent } from './admin/modal/feuille-de-presence/feuille-de-presence.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
// import { DemandeComponent } from './formateur/modal/demande/demande.component';
// import { CoursComponent } from './formateur/cours/cours.component';

export const routes: Routes = [
    {
        path:'',
        component:AccueilComponent
    },
    {
      path:'login',
      component:LoginComponent
  },
    {
        path:'signup',
        component:SignupComponent
    },
    {
        path:'formateur',
        children:[
          { 
          path:'home',
          component:HomeForComponent
        }, 
        { 
          path:'profile',
          component:ProfileComponent
        }, 
        { 
          path:'cours',
          component:CourssComponent
        },
        { 
          path:'evaluation',
          component:EvalComponent
        },
        { 
          path:'demande',
          component:DemandeComponent
        }, 
        { 
          path:'session',
          component:SessionComponent
        },
        // { 
        //   path:'vacation/:id',
        //   component:VacationComponent
        // },
        { 
          path:'sessions',
          component:SessionsComponent
        },
        { 
          path:'agenda',
          component:AgendaComponent
        },
        {
          path:'chat',
          component:ChatComponent
        },
        ]
    },
    {
        path:'apprenant',
        children:[
          { 
          path:'home',
          component:HomeApComponent
        },
        { 
          path:'profile',
          component:MonProfileComponent
        },
        {
          path:'chat',
          component:ChatComponent
        }, 
        {
          path:'session',
          component:AppSessionsComponent
        },
        { 
          path:'evaluation',
          component:EvaluationComponent
        },
        { 
          path:'sessionTerminer',
          component:SessionTerminerComponent
        },
        ]
    },
    {
        path:'admin',
        children:[
          {
          path:'home',
          component:HomeComponent
        },
        { 
          path:'stat',
          component:StatComponent
        },
        { 
          path:'sessions',
          component:SessionsAdComponent
        },
        {
          path:'chat',
          component:ChatComponent
        },
        { 
          path:'rapport',
          component:RepportComponent
        },
        { 
          path:'rapportFormateur',
          component:RapportFormateurComponent
        },
        { 
          path:'vacation',
          component:VacationComponent
        },
        { 
          path:'commodites',
          component:CommoditesComponent
        },
        { 
          path:'presence',
          component:FeuilleDePresenceComponent
        },
        { 
          path:'agenda',
          component:CalendarComponent
        },
        ]
    }
];
