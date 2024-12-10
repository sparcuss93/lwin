import { Component, OnInit ,AfterViewInit,Output,EventEmitter} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit, AfterViewInit {
  public map!: L.Map; // Use the ! assertion operator only if you are absolutely sure it will be initialized
  public depMarker: L.Marker | null = null;
  public arrMarker: L.Marker | null = null;
  public circle: L.Circle | null = null;
  private routingControl: L.Routing.Control | null = null;

  @Output() departureSelected = new EventEmitter<{ lat: number; lng: number }>();
  @Output() destinationSelected = new EventEmitter<{ lat: number; lng: number }>();

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
        this.pointdep(e.latlng);
        this.circle=L.circle(e.latlng, radius).addTo(this.map);
        this.departureSelected.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

     this.map.on('locationerror', (error: L.ErrorEvent) => {
      console.error("Location error:", error);
      alert('Could not retrieve location. Please check your location settings.');
    });
  }

  public enableUserPointing(): void {
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latLng = e.latlng;
      this.pointarr(latLng);
      this.destinationSelected.emit({ lat: latLng.lat, lng: latLng.lng });
    });
  }

  public pointdep = (latlng: any): void => {
    console.log('this in point:', this);
    if (this.depMarker) {
      this.map.removeLayer(this.depMarker);
    }
    this.depMarker = L.marker(latlng).addTo(this.map)
      .openPopup();
  };

  public pointarr = (latlng: any): void => {
    console.log('this in point:', this);
    if (this.arrMarker) {
      this.map.removeLayer(this.arrMarker);
    }
    this.arrMarker = L.marker(latlng).addTo(this.map)
      .openPopup();
  };

  public plotRoute(start:{ lat: number; lng: number}, end: { lat: number; lng: number}): void {
    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ],
      routeWhileDragging: true,
      show: true
    }).addTo(this.map);
  }

  
}