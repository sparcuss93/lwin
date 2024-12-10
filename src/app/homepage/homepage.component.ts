import { Component, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { GeocodingService } from '../geocoding.service'; // Import the service
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Locations } from '../location';


@Component({
    selector: 'app-homepage',
    standalone: true,
    imports: [MapComponent,FormsModule,CommonModule],
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
    @ViewChild(MapComponent) mapComponent!: MapComponent;
    departurePoint : Locations = new Locations("",0,0) ;
    destinationPoint: Locations = new Locations("",0,0) ;
    destinationResults: any[] = []; 
    departureResults: any[] = [];

    constructor(private geocodingService: GeocodingService) {} // Inject the service

    onLocationFound(location: { lat: number; lng: number }) {
        this.departurePoint.coord = location;
        
    }

    onDestinationFound(location: { lat: number; lng: number }) {
      this.destinationPoint.coord = location;
    }

    searchDestination(query: string): void {
        if (query.length < 3) {
            this.destinationResults = []; // Clear results if input is too short
            return;
        }

        this.geocodingService.searchLocations(query).subscribe(
            (results) => {
                this.destinationResults = results; // Update the search results
            },
            (error) => {
                console.error('Error fetching search results:', error);
                this.destinationResults = []; // Clear results on error
            }
        );
    }


    searchDparture(query: string): void {
      if (query.length < 3) {
          this.departureResults = []; 
          return;
      }

      this.geocodingService.searchLocations(query).subscribe(
          (results) => {
              this.departureResults = results; 
          },
          (error) => {
              console.error('Error fetching search results:', error);
              this.departureResults = []; 
          }
      );
    }

    selectDestination(result: any): void {
        const { lat, lon, display_name } = result;
        this.destinationPoint =new Locations(display_name,lat,lon);// Update input with selected name
        this.mapComponent.map.setView([lat, lon], 13); // Center the map
        this.mapComponent.pointarr([lat,lon]) ;// Add marker if needed
        this.destinationResults = []; // Clear search results
    }

    selectDeparture(result: any): void {
        const { lat, lon, display_name } = result;
        this.departurePoint= new Locations(display_name,lat,lon);
        this.mapComponent.map.setView([lat, lon], 13); 
        this.mapComponent.pointdep({lat,lon});
        this.departureResults = []; 
    }

    
}   
