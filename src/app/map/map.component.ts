import { Component, OnInit ,AfterViewInit,Output,EventEmitter} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map; // Use the ! assertion operator only if you are absolutely sure it will be initialized
  private currentMarker: L.Marker | null = null;
  private circle: L.Circle | null = null;

  @Output() locationSelected = new EventEmitter<{ lat: number; lng: number }>();

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([36.8065, 10.1815], 13); // Initial view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  public locateUser(): void {
    this.map.locate({ setView: true, maxZoom: 16 });
    
    this.map.on('locationfound', (e: L.LocationEvent) => {
        const radius = e.accuracy / 2;
        if (this.circle) {
          this.map.removeLayer(this.circle);
        }
        L.marker(e.latlng).addTo(this.map)
          .bindPopup(`You are within ${radius.toFixed(1)} meters from this point`).openPopup();
        this.circle=L.circle(e.latlng, radius).addTo(this.map);
        this.locationSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

     this.map.on('locationerror', (error: L.ErrorEvent) => {
      console.error("Location error:", error);
      alert('Could not retrieve location. Please check your location settings.');
    });
  }

  public enableUserPointing(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latLng = e.latlng;
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }
      this.currentMarker = L.marker(e.latlng).addTo(this.map)
        .bindPopup(`You clicked at ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`)
        .openPopup();
      this.locationSelected.emit({ lat: latLng.lat, lng: latLng.lng });
    });
  }
}