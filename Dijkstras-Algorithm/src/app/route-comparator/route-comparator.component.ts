import { Component } from '@angular/core';
import { RouteResult, RouteService } from '../services/route.service';

@Component({
  selector: 'app-route-comparator',
  templateUrl: './route-comparator.component.html',
  styleUrls: ['./route-comparator.component.scss']
})
export class RouteComparatorComponent {

 optimizationFactor: 'time' | 'cost' | 'distance' | 'combined' = 'time';
  bestRoute?: RouteResult | null = null;
  constructor(private routeService: RouteService) {}

  ngOnInit(): void {
    this.calculateBestRoute();
  }

  calculateBestRoute() {
    if (this.optimizationFactor === 'combined') {
    this.bestRoute = this.routeService.findCompromiseRoute(0.5, 0.5); // time:cost = 50:50
  } else {
    this.bestRoute = this.routeService.findBestRoute(this.optimizationFactor);
  }

  console.log('Best route for', this.optimizationFactor, this.bestRoute);
  }

  onOptimizationChange(event: Event) {
  
  const selectElement = event.target as HTMLSelectElement;
  this.optimizationFactor = selectElement.value as 'time' | 'cost' | 'distance' | 'combined';
  this.calculateBestRoute();
  }

}
