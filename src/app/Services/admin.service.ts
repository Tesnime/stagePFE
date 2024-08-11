import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserStorageService } from './storage/user-storage.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

const URL="http://localhost:8080/api/admin/";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private sessionsSubject = new BehaviorSubject<any[]>([]);
  sessions$ = this.sessionsSubject.asObservable();

  addSessions(session: any) {
    const currentSessions = this.sessionsSubject.value;
    this.sessionsSubject.next([...currentSessions, session]);
  }

  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { }

  userId=UserStorageService.getUserId();
  token = UserStorageService.getToken();

  demandes():Observable<any>{
    return this.http.get<any>(URL+'demandes',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}
nbDemandes():Observable<any>{
  return this.http.get<any>(URL+'nbDemandes',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
demandeById(id :number):Observable<any>{
  return this.http.get<any>(URL+'demandeById?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
formations(id:number):Observable<any>{
  return this.http.get<any>(URL+'format?userId='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
exprs(id:number):Observable<any>{
  return this.http.get<any>(URL+'expr?userId='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
refus(demande:any,id:number):Observable<any>{
  return this.http.post(URL+'refus?id='+id,demande,{
    headers: this.createAuthorizationHeader(),
  })
}
accept(id:number):Observable<any>{
  return this.http.post(URL+'accept?id='+id,{},{
    headers: this.createAuthorizationHeader(),
  })
}
terminer(id:any):Observable<any>{
  return this.http.post(URL+'terminer?id='+id,{},{
    headers: this.createAuthorizationHeader(),
  })
}
addSession(session:any,id:number):Observable<any>{
  return this.http.post(URL+'addSession?id='+id,session,{
    headers: this.createAuthorizationHeader(),
  })
}
sessionsBydemande(id:number):Observable<any>{
  return this.http.get<any>(URL+'sessionByDemande?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
sessions():Observable<any>{
  return this.http.get<any>(URL+'allSessions',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
formateurs():Observable<any>{
  return this.http.get<any>(URL+'allFormateurs',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
stat(id:number):Observable<any>{
  // console.log(URL+'stat?id='+id);
  return this.http.get<any>(URL+'stat?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
deleteSession(id: number): Observable<any>{
  return this.http.delete(URL+'deleteSession?id='+id,{
    // responseType:'text',
    headers: this.createAuthorizationHeader()
  });
}
updateDemande(id: number, demandeDetails: any): Observable<any> {
  return this.http.put(URL + 'updateDemande?id=' + id, demandeDetails, {
    headers: this.createAuthorizationHeader(),
  });
}
// getPresenceRate(sessionId: number): Observable<number> {
//   return this.http.get<number>(URL +'presenceRate?', {
//     headers: this.createAuthorizationHeader(),
//   });
// }
getOverallPresenceRate(): Observable<any> {
  return this.http.get<number>(URL +'overallPresenceRate' ,  {
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
DemandeTheme():Observable<any>{
  // console.log(URL+'stat?id='+id);
  return this.http.get<any>(URL+'demandeTheme',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
demandesAccepter():Observable<any>{
  return this.http.get<any>(URL+'demandesAccep',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
demandesTerminer():Observable<any>{
  return this.http.get<any>(URL+'demandesterm',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
// getFormateurImage(formateurId:number): Observable<Blob> {
//   return this.http.get(URL+`${formateurId}/image`, { responseType: 'blob',
//   headers: this.createAuthorizationHeader(), 
// }).pipe(
//   map(response => response)
// );
// }
getFormateurImage(formateurId: number): Observable<Blob> {
  return this.http.get(`${URL}${formateurId}/image`, {
    responseType: 'blob',
    headers: this.createAuthorizationHeader()
  }).pipe(
    map(response => response)
  );
}
addFormateur(demandeId:any,formateurId:any):Observable<any>{
  return this.http.post(URL+'fomateurToDemande?demandeId='+demandeId+'&formateurId='+formateurId,{},{
    headers: this.createAuthorizationHeader(),
  })
}
session(id:number):Observable<any>{
  return this.http.get<any>(URL+'sessionById?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
updateSession(session:any,id:number):Observable<any>{
  return this.http.post(URL+'updateSession?id='+id,session,{
    headers: this.createAuthorizationHeader(),
  })
}
proposerFormation(demande:any):Observable<any>{
  return this.http.post(URL+'proposerSession?',demande,{
    headers: this.createAuthorizationHeader(),
  })
}
getCV(id:number): Observable<Blob> {
  return this.http.get(URL+`${id}/cv`, { responseType: 'blob',
  headers: this.createAuthorizationHeader(), 
});
}
getComment(id:number):Observable<any>{
  return this.http.get<any>(URL+'comments?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
getTot():Observable<any>{
  return this.http.get<any>(URL+'tot?',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
listePresence(sessionId:any):Observable<any>{
    return this.http.get<any>(URL+'listePresence?sessionId='+sessionId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  nbPresence(sessionId:number):Observable<any>{
    return this.http.get<any>(URL+'nbrePresent?sessionId='+sessionId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  interet():Observable<any>{
    return this.http.get<any>(URL+'groupedByInterests',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  diff():Observable<any>{
    return this.http.get<any>(URL+'groupedByDifficultes',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  star(sessionID:any):Observable<any>{
    return this.http.get<any>(URL+'getStar?demandeId='+sessionID,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  // upload(file: File): Observable<any> {
  //   const formData: FormData = new FormData();
  //   formData.append('file', file, file.name);
  //   console.log(formData)
  //   return this.http.post(URL+'upload', formData,{
  //     headers: this.createAuthorizationHeader(),
  //   }).pipe(
  //     map(response => response)
  //   );
  // }
  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post(URL + 'upload', formData, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text' 
    });
  }
  getCertificate():Observable<any>{
    return this.http.get<any>(URL+'getCertificate',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  Certificate(id: number): Observable<Blob> {
    return this.http.get(URL + `certificate/${id}`, { responseType: 'blob',
    headers: this.createAuthorizationHeader(), 
    }).pipe(
      map(response => response)
    )
  }
  modifyCertificate(certId:number,demId:number):Observable<any>{
    return this.http.post(URL+`certificate/modify/${certId}/${demId}`,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  firstSession(formateur:number):Observable<any>{
    return this.http.get<any>(URL+'first-session?formateurId='+formateur,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  demande(id:number):Observable<any>{
    return this.http.get<any>(URL+'demande?id='+id,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}
getDemandesByFormateurId(formateurId: number): Observable<any[]> {
  return this.http.get<any[]>(`${URL}demande?id=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getthemePercentage(formateurId: number): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(`${URL}themePercentages?formateurId=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getPercentage(formateurId: number): Observable<{ [key: string]: number }> {
  return this.http.get<{ [key: string]: number }>(`${URL}percentages?formateurId=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getTaux(formateurId: number): Observable<any> {
  return this.http.get<any>(`${URL}taux?formateurId=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getTauxStar(formateurId: number): Observable<any> {
  return this.http.get<any>(`${URL}StarMoy?formateurId=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getEval(formateurId: number): Observable<any> {
  return this.http.get<any>(`${URL}response-distributions?id=${formateurId}`,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  );
}
getDemandeSession():Observable<any>{
  return this.http.get<any>(URL+'grouped-by-demande',{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
getPresenceByApprenant(id:number,sessionId:number):Observable<any>{
  return this.http.get<any>(URL+'presenceByApprenant?apprenantId='+id+'&sessionId='+sessionId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
getFormateurPresenc(id:number,sessionId:number):Observable<any>{
  return this.http.get<any>(URL+'presenceByFormateur?formateurId='+id+'&sessionId='+sessionId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
firstAndLastSession(demandeId:number):Observable<any>{
  return this.http.get<any>(URL+'fistLastSession?demandeId='+demandeId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
SessionbyDemande(demandeId:number):Observable<any>{
  return this.http.get<any>(URL+'sessionsByDemande?demandeId='+demandeId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}

private createAuthorizationHeader(): HttpHeaders{
   
  // console.log('Token:', this.token);
  return new HttpHeaders().set(
    'Authorization', 'Bearer '+ this.token
  )
}
}
