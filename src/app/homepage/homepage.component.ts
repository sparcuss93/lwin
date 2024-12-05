import { Component,ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

  @ViewChild(MapComponent) mapComponent!: MapComponent;
  departurePoint: string = '';

  onLocationFound(location: { lat: number; lng: number }) {
    this.departurePoint = `${location.lat}, ${location.lng}`;
  }
}
