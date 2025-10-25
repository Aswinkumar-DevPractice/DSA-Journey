import { Component } from '@angular/core';
import { Edge } from 'src/app/models/edge.model';
import * as L from 'leaflet';
import { DeliveryRouteService } from 'src/app/services/deliveryRoute.service';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-delivery-map',
  templateUrl: './delivery-map.component.html',
  styleUrls: ['./delivery-map.component.scss']
})
export class DeliveryMapComponent {
 sourceLocations: string[] = ['Warehouse A', 'Hub B', 'Hub C', 'Hub D', 'Hub E', 'Customer D'];
  optimizationMode: 'time' | 'cost' | 'combo' = 'combo'; // default selection

  deliveryRoutes: Edge[] = [
    { from: 'Warehouse A', to: 'Hub B', time: 30, cost: 5, mode: 'Bike' },
    { from: 'Warehouse A', to: 'Hub C', time: 45, cost: 8, mode: 'Van' },
    { from: 'Hub B', to: 'Hub D', time: 20, cost: 3, mode: 'Bike' },
    { from: 'Hub B', to: 'Hub C', time: 15, cost: 2, mode: 'Van' },
    { from: 'Hub C', to: 'Hub D', time: 30, cost: 6, mode: 'Van' },
    { from: 'Hub C', to: 'Hub E', time: 10, cost: 4, mode: 'Drone' },
    { from: 'Hub E', to: 'Hub D', time: 10, cost: 4, mode: 'Drone' },
    { from: 'Hub D', to: 'Customer D', time: 15, cost: 2, mode: 'Van' },
    { from: 'Hub E', to: 'Customer D', time: 15, cost: 3, mode: 'Drone' }
  ];

  nodeCoords: Record<string, [number, number]> = {
    'Warehouse A': [13.010, 80.230],
    'Hub B': [13.012, 80.250],
    'Hub C': [13.020, 80.240],
    'Hub D': [13.030, 80.245],
    'Hub E': [13.025, 80.260],
    'Customer D': [13.035, 80.255]
  };

  result: any;
  route: string[] | null = null;
  pathEdges: Edge[] = [];
  map!: L.Map;
  mapInitialized: boolean = false;
  constructor(private deliveryRouteService: DeliveryRouteService) {}

  ngOnInit() {
    this.calculateAndRender();
  }

  calculateAndRender(){
   this.result = this.deliveryRouteService.findOptimalRoute(
      this.sourceLocations,
      this.deliveryRoutes,
      'Warehouse A',
      this.optimizationMode
    );
    this.route = this.deliveryRouteService.getOptimalPath(
      this.result.previousLocation,
      'Customer D'
    );
    if (this.route) {
      this.buildPathEdges();
      this.renderMap();
    }
  };

  buildPathEdges() {
    this.pathEdges = [];
    for (let i = 0; i < this.route!.length - 1; i++) {
      const edge = this.deliveryRoutes.find(
        e => e.from === this.route![i] && e.to === this.route![i + 1]
      );
      if (edge) this.pathEdges.push(edge);
    }
  }

  /**
   * Initialize or re-render Leaflet map with routes and optimal path
   */
  renderMap(){
    if(this.mapInitialized){
      this.map.remove();
    }
    this.initMap();
   
  }

  initMap() {
    this.map = L.map('map').setView([13.020, 80.245], 13);
     this.mapInitialized = true;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add markers for each location
    Object.entries(this.nodeCoords).forEach(([name, coord]) => {
      L.marker(coord).addTo(this.map).bindPopup(name);
    });

    // Draw all routes
    this.deliveryRoutes.forEach(edge => {
      const from = this.nodeCoords[edge.from];
      const to = this.nodeCoords[edge.to];
      let color = 'blue';
      switch (edge.mode) {
        case 'Bike': color = 'green'; break;
        case 'Van': color = 'orange'; break;
        case 'Drone': color = 'red'; break;
        case 'Truck': color = 'purple'; break;
      }
      L.polyline([from, to], { color, weight: 3, opacity: 0.6 })
        .addTo(this.map)
        .bindPopup(`${edge.from} → ${edge.to}<br>Mode: ${edge.mode}<br>Time: ${edge.time} min<br>Cost: $${edge.cost}`);
    });

    // Highlight optimal path
    const pathCoords = this.pathEdges.map(e => this.nodeCoords[e.from]);
    pathCoords.push(this.nodeCoords[this.route![this.route!.length - 1]]);
    L.polyline(pathCoords, { color: 'gold', weight: 6, opacity: 0.9 }).addTo(this.map);
  }

  /**
   * Trigger recalculation when optimization mode changes
   */
  onOptimizationChange(mode: 'time' | 'cost' | 'combo') {
    this.optimizationMode = mode;
    this.calculateAndRender();
  }

}
