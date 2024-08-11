import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserStorageService } from './storage/user-storage.service';

const URL="http://localhost:8080/api/formateur/";

@Injectable({
  providedIn: 'root'
})
export class FormateurService {

  constructor( private http: HttpClient) { }

  userId=UserStorageService.getUserId();
  token = UserStorageService.getToken();

  addProfile(profile:any):Observable<any>{
    return this.http.post(URL+'AjoutProfile?userId='+this.userId,profile,{
      headers: this.createAuthorizationHeader(),
    })
  }

  
  autre(profile:any):Observable<any>{
    return this.http.put(URL + 'AjoutAutre?userId=' + this.userId, profile, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // uploadCV(cv:any):Observable<any>{
  //   const formData: FormData = new FormData();
  //   formData.append('id', this.userId.toString());
  //   formData.append('cv', cv, cvFile.name);
  //   return this.http.put(URL + 'addCv?id=' + this.userId+'&cv='+cv, {}, {
  //     headers: this.createAuthorizationHeader(),
  //   });
  // }
  uploadCV(cv: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', cv);  
    console.log(formData)

    return this.http.post(URL+`${this.userId}/addCV`, formData, { 
      responseType: 'text',
      headers: this.createAuthorizationHeader(),
    });
  }

  // uploadImage(file: File):Observable<any>{
  //   const formData: FormData = new FormData();
  //   formData.append('file', file);
  //   console.log(formData)
  
  //   return this.http.post(URL+`${this.userId}/upload`, formData, { 
  //     responseType: 'text',
  //     headers: this.createAuthorizationHeader(),
  //    });
  // }
  form(form:any):Observable<any>{
    return this.http.post(URL+'ajoutFormat?id='+this.userId,form,{
      headers: this.createAuthorizationHeader(),
    })
  }

  editForm(form:any,id:number):Observable<any>{
    return this.http.post(URL+'updateForm?id='+id,form,{
      headers: this.createAuthorizationHeader(),
    })
  }

  expr(expr:any):Observable<any>{
    return this.http.post(URL+'ajoutExpr?id='+this.userId,expr,{
      headers: this.createAuthorizationHeader(),
    })
  }

  editExpr(expr:any,id:number):Observable<any>{
    return this.http.post(URL+'updateExpr?id='+id,expr,{
      headers: this.createAuthorizationHeader(),
    })
  }

  deleteFormation(id: number): Observable<any>{
    return this.http.delete(URL+'deleteForma?id='+id,{
      responseType:'text',
      headers: this.createAuthorizationHeader()
    });
  }

  deleteDemande(id: number): Observable<any>{
    return this.http.delete(URL+'deleteDemande?id='+id,{
      responseType:'text',
      headers: this.createAuthorizationHeader()
    });
  }

  deleteExpr(id: number): Observable<any>{
    return this.http.delete(URL+'deleteExpr?id='+id,{
      responseType:'text',
      headers: this.createAuthorizationHeader()
    });
  }

  formations():Observable<any>{
    return this.http.get<any>(URL+'format?userId='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}
formByid(id : number):Observable<any>{
  return this.http.get<any>(URL+'formByid?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
exprByid(id : number):Observable<any>{
  return this.http.get<any>(URL+'exprByid?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}

exprs():Observable<any>{
  return this.http.get<any>(URL+'expr?userId='+this.userId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}

  cours():Observable<any>{
    return this.http.get<any>(URL+'cours?id='+this.userId,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}

  profile():Observable<any>{
    console.log(URL+'profile?userId='+this.userId)
  return this.http.get<any>(URL+'profile?userId='+this.userId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}

    addCours(cours:any):Observable<any>{
      return this.http.post(URL+'ajoutCours?id='+this.userId,cours,{
        headers: this.createAuthorizationHeader(),
      })
    }
    evaluation(evaluation:any,sessionId:number):Observable<any>{
      return this.http.post(URL+sessionId+'/evaluation?userId='+this.userId,evaluation,{
        headers: this.createAuthorizationHeader(),
      })
    }
    postuler(demande:any):Observable<any>{
      return this.http.post(URL+'postuler?userId='+this.userId,demande,{
        headers: this.createAuthorizationHeader(),
      })
    }

    demandes():Observable<any>{
      return this.http.get<any>(URL+'demande?id='+this.userId,{
        headers: this.createAuthorizationHeader(),
      }).pipe(
        map(response => response)
      )
  }

  demandeProp():Observable<any>{
    return this.http.get<any>(URL+'demandeProposer',{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}
postulerDem(demandeId:number):Observable<any>{
  return this.http.post(URL+'addFormateur?demandeId='+demandeId+'&formateurId='+this.userId,{},{
    headers: this.createAuthorizationHeader(),
  })
}
  demande(id:number):Observable<any>{
    return this.http.get<any>(URL+'demandeId?id='+id,{
      headers: this.createAuthorizationHeader(),
    }).pipe(
      map(response => response)
    )
}
sessions(id:number):Observable<any>{
  return this.http.get<any>(URL+'session?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
session(id:number):Observable<any>{
  return this.http.get<any>(URL+'sessionId?id='+id,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
sessionByFormateur():Observable<any>{
  return this.http.get<any>(URL+'sessionFormateur?userId='+this.userId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
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
  return this.http.post(URL+'presence?formateurId='+this.userId+'&sessionId='+sessionId+'&present='+present,{},{
    headers: this.createAuthorizationHeader(),
  })
}
donnee(sessionId:any,donnee:any):Observable<any>{
  return this.http.post(URL+'donnee?formateurId='+this.userId+'&sessionId='+sessionId,donnee,{
    headers: this.createAuthorizationHeader(),
  })
}

isPresent(sessionId:any):Observable<any>{
  return this.http.get<any>(URL+'isPresent?formateurId='+this.userId+'&sessionId='+sessionId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
getDonnee(sessionId:any):Observable<any>{
  return this.http.get<any>(URL+'donneee?formateurId='+this.userId+'&sessionId='+sessionId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
}
total():Observable<any>{
  return this.http.get<any>(URL+'totalSessions?formateurId='+this.userId,{
    headers: this.createAuthorizationHeader(),
  }).pipe(
    map(response => response)
  )
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

getCV(): Observable<Blob> {
  return this.http.get(URL+`${this.userId}/cv`, { responseType: 'blob',
  headers: this.createAuthorizationHeader(), 
});
}
apprenatperSession():Observable<any>{
  return this.http.get<any>(URL+'averageApprenants?formateurId='+this.userId,{
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

  private createAuthorizationHeader(): HttpHeaders{
   
    console.log('Token:', this.token);
    return new HttpHeaders().set(
      'Authorization', 'Bearer '+ this.token
    )
  }
}