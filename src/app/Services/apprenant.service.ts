import { SessionComponent } from './../formateur/session/session.component';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserStorageService } from './storage/user-storage.service';
import { Observable, catchError, map, throwError } from 'rxjs';

const URL="http://localhost:8080/api/apprenant/";

@Injectable({
  providedIn: 'root'
})
export class ApprenantService {

  constructor( private http: HttpClient) { }

  userId = UserStorageService.getUserId();
  token = UserStorageService.getToken();

  getProfile():Observable<any>{
    return this.http.get<any>(URL+'getApprenant?userId='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  getSessions():Observable<any>{
    return this.http.get<any>(URL+'sessions?id='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  getCurrentSessions():Observable<any>{
    return this.http.get<any>(URL+'sessionsDate?id='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  addProfile(profile:any):Observable<any>{
    return this.http.post(URL+'apprenant?userId='+this.userId,profile,{
      headers: this.createAuthorizationHeader(),
    });
  }
  postuler(code:any):Observable<any>{
    console.log(URL+'postuler?code='+code+'&id='+this.userId)
    return this.http.post(URL+'postuler?code='+code+'&id='+this.userId,{},{
      headers: this.createAuthorizationHeader(),
    });
  }
  comment(comment:any,sessionId:number):Observable<any>{
    return this.http.post(URL+sessionId+'/addComment?userId='+this.userId,comment,{
      headers: this.createAuthorizationHeader(),
    })
  }
  getComment(id:number):Observable<any>{
    return this.http.get<any>(URL+'comments?id='+id,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  evaluation(evaluation:any,sessionId:number):Observable<any>{
    return this.http.post(URL+sessionId+'/evaluation?userId='+this.userId,evaluation,{
      headers: this.createAuthorizationHeader(),
    })
  }
  star(evaluation:any,sessionId:number):Observable<any>{
    return this.http.post(URL+sessionId+'/star?userId='+this.userId+'&evaluation='+evaluation,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  send(email:any,nom:any,code:any):Observable<any>{
    return this.http.post(URL+'send?email='+email+'&nom='+nom+'&code='+code,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  code(code:any):Observable<any>{
    return this.http.post(URL+'codeConfirm?userId='+this.userId+'&code='+code,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  presence(sessionId:any,present:boolean):Observable<any>{
    return this.http.post(URL+'presence?apprenantId='+this.userId+'&sessionId='+sessionId+'&present='+present,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  donnee(sessionId:any,donnee:any):Observable<any>{
    return this.http.post(URL+'donnee?apprenantId='+this.userId+'&sessionId='+sessionId,donnee,{
      headers: this.createAuthorizationHeader(),
    })
  }
  ajoutAuPresent(code:any):Observable<any>{
    return this.http.post(URL+'ajoutPresent?apprenantId='+this.userId+'&code='+code,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  isPresent(sessionId:any):Observable<any>{
    return this.http.get<any>(URL+'isPresent?apprenantId='+this.userId+'&sessionId='+sessionId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  getDonnee(sessionId:any):Observable<any>{
    return this.http.get<any>(URL+'donneee?apprenantId='+this.userId+'&sessionId='+sessionId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  modifyCertificateApp(certId:number):Observable<any>{
    return this.http.post(URL+`certificate/modifyApp/${certId}/${this.userId}`,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  modifyCertificate(certId:number,demId:number):Observable<any>{
    return this.http.post(URL+`certificate/modify/${certId}/${demId}`,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  uploadImage(file: File):Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', file);
    console.log(formData)

    return this.http.post(URL+`${this.userId}/upload`, formData, { 
      responseType: 'text',
      headers: this.createAuthorizationHeader(),
     });
  }
 
  getImage(): Observable<Blob> {
    return this.http.get(URL+`${this.userId}/image`, { responseType: 'blob',
    headers: this.createAuthorizationHeader(), 
  }).pipe(
    map(response => response)
  );
  }
  getFormateurImage(formateurId:number): Observable<Blob> {
    return this.http.get(URL+`${formateurId}/imageFormateur`, { responseType: 'blob',
    headers: this.createAuthorizationHeader(), 
  }).pipe(
    map(response => response)
  );
  }
  Certificate(id: number): Observable<Blob> {
    return this.http.get(URL + `certificate/${id}`, { responseType: 'blob',
    headers: this.createAuthorizationHeader(), 
    }).pipe(
      map(response => response)
    )
  }
  CertificateappDem(id: number): Observable<any> {
    return this.http.get(URL + `certif/${this.userId}/demande/${id}`, {
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
  demandeByApp():Observable<any>{
    return this.http.get<any>(URL+'demandesByApp?id='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  SessionByDemande(demandeId:number):Observable<any>{
    return this.http.get<any>(URL+'sessionByDemandde?id='+demandeId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  PresenceBySessions(demandeId:any[]):Observable<any>{
    return this.http.get<any>(URL+`PresenceByDemande/${demandeId}?apprenantId=${this.userId}`,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  sendConfirmation(email:any,nom:any,demandeId:any):Observable<any>{
    return this.http.post(URL+'sendConfirmation?email='+email+'&nom='+nom+'&demandeId='+demandeId,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  demandeIdByCode(code:string):Observable<number>{
    return this.http.get<number>(URL+'demandeId?code='+code,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  addTache(tache:string):Observable<any>{
    return this.http.post(URL+'addTache?tache='+tache+'&id='+this.userId,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  getTache():Observable<any>{
    return this.http.get<any>(URL+'tacheByApprenant?apprenantId='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  deletetache(id: number): Observable<any>{
    return this.http.delete(URL+'deleteTache?id='+id,{
      headers: this.createAuthorizationHeader()
    });
  }
  addQuestion(question:any):Observable<any>{
    return this.http.post(URL+'sendQuestion?id='+this.userId,question,{
      headers: this.createAuthorizationHeader(),
    })
  }
  getAllQuestions():Observable<any>{
    return this.http.get<any>(URL+'allQuestions',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  getQuestionsByApprenantId():Observable<any>{
    return this.http.get<any>(URL+'mesQuestions?apprenantId='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  deleteAnswer(id: number): Observable<any>{
    return this.http.delete(URL+'deleteAnswer?id='+id,{
      headers: this.createAuthorizationHeader()
    });
  }
  addAnswer(answerDetails:any,questionId:number):Observable<any>{
    return this.http.post(URL+'answer?apprenantId='+this.userId+'&questionId='+questionId,answerDetails,{
      headers: this.createAuthorizationHeader(),
    })
  }
  updateAnswer(id: number, answerDetails: any): Observable<any> {
    return this.http.put(URL + 'updateAnswer?id=' + id, answerDetails, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getTheme():Observable<any>{
    return this.http.get<any>(URL+'Theme?apprenantId='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
  }
  checkAnswer(answerDetails:any):Observable<any>{
    return this.http.post(URL+'checkComment?comment='+answerDetails,{},{
      headers: this.createAuthorizationHeader(),
    })
  }
  private createAuthorizationHeader(): HttpHeaders{
   
    console.log('Token:', this.token);
    return new HttpHeaders().set(
      'Authorization', 'Bearer '+ this.token
    )
  }
}
