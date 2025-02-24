import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  private apiUrl = 'http://localhost:5000/api/routes/best-route'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  getBestRoute(start: { lat: number; lng: number }, end: { lat: number; lng: number }): Observable<any> {
    const startString = start.lat.toString()+","+start.lng.toString();
    const endString = end.lat.toString()+","+end.lng.toString();
    
    const params = new HttpParams()
      .set('getStart', startString)
      .set('getEnd', endString);

    return this.http.get<any>(this.apiUrl, { params });
  }
}
