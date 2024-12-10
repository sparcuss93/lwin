export class Locations {
    name: string;
    coord: { lat: number; lng: number };
  
    constructor(name: string, lat: number, lng: number) {
      this.name = name;
      this.coord = { lat, lng };
    }
  }