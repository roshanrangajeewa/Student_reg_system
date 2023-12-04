import { Injectable } from '@angular/core';

// ADD IMPORTS
import {HttpClient} from "@angular/common/http";
import { environment } from 'src/environments/environment';
import {Observable} from  'rxjs';
import { ResponseApi } from '../dtos/response-api';
import { Student } from '../dtos/student';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private endpoint:string=environment.endpoint;
  private myApiUrl:string=this.endpoint+"api/Student";

  constructor(private http:HttpClient) { }

  getList():Observable<ResponseApi>{
    return this.http.get<ResponseApi>(this.myApiUrl);
    
  }

  add(reqest:Student):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(this.myApiUrl,reqest);
    
  }

  update(reqest:Student):Observable<ResponseApi>{
    return this.http.put<ResponseApi>(this.myApiUrl,reqest);
    
  }

  delete(id:number):Observable<ResponseApi>{
    return this.http.delete<ResponseApi>(`${this.myApiUrl}/${id}`);
    
  }
}
