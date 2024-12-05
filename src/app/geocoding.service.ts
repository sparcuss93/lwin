import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  searchLocations(req?: any): Observable<any[]> {
    const viewbox = '-11.0,30.0,12.0,37.5';
    const url = `${this.baseUrl}?format=json&q=${encodeURIComponent(req)}&viewbox=${viewbox}&bounded=1`;
    return this.http.get<any[]>(url);
  }
}
