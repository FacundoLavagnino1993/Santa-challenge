import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ForecastService {
  private readonly apiForecast = '/api/forecast';
  private readonly lat: string = '-34.6083';
  private readonly long: string = '-58.3712';

  constructor(private http: HttpClient) {}

  getForecast = () => {
    return this.http.get(`${this.apiForecast}/forecast?lat=${this.lat}&long=${this.long}`);
  };
}
