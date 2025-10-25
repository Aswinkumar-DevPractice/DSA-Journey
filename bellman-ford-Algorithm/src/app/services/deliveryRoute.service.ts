import { Injectable } from '@angular/core';
import { Edge } from '../models/edge.model';

@Injectable({
  providedIn: 'root'
})
export class DeliveryRouteService  {

  constructor() { }

  /**
   * Computes the shortest delivery routes using the Bellman-Ford algorithm.
   * @Param locations List of locations (warehouses,hubs,customers)
   * @Param routes List of available delivery routes with time ,cost, mode
   * @Param startLocation The starting location for the delivery (e.g., warehouse)
   * @Params metric 'time' | 'cost' | 'combo' (weighted combination of time and cost )
   * @Params optimized by type of metric
   */

  findOptimalRoute(
    locations: string[],
    routes: Edge[],
    startLocation: string,
    metric: 'time' | 'cost' | 'combo' = 'combo',
  ) {
    const totalCost: Record<string, number> = {};
    const previousLocation: Record<string, string | null> = {};

    // Initialize distances
    locations.forEach(location => {
      totalCost[location] = Infinity;
      previousLocation[location] = null;
    });
    totalCost[startLocation] = 0;

    const numLocations = locations.length;

    // Relax edges |V| - 1 times
    for (let i = 0; i < numLocations - 1; i++) {
      for (let route of routes) {
        let routeCost: number;
        if (metric === 'time') routeCost = route.time;
        else if (metric === 'cost') routeCost = route.cost;
        else routeCost = route.time + route.cost * 0.5; // combo

        if (totalCost[route.from] + routeCost < totalCost[route.to]) {
          totalCost[route.to] = totalCost[route.from] + routeCost;
          previousLocation[route.to] = route.from;
        }
      }
    }

    // Negative cycle detection (should not occur in this scenario)
    for (let route of routes) {
      const routeCost =
        metric === 'time'
          ? route.time
          : metric === 'cost'
          ? route.cost
          : route.time + route.cost * 0.5;
      if (totalCost[route.from] + routeCost < totalCost[route.to]) {
        throw new Error('Negative weight cycle detected in routes.');
      }
    }

    return { totalCost, previousLocation };
  }

  /**
   * Reconstructs the optimal path from start to a given destination.
   * @Param previousLocation Record of previous locations from findOptimalRoute
   * @Param destination The target location to reconstruct the path to
   * @Returns An array representing the optimal path from start to destination
   */
  getOptimalPath(previousLocation: Record<string, string | null>, destination: string) {
    const path: string[] = [];
    let current: string | null = destination;
    while (current) {
      path.unshift(current);
      current = previousLocation[current];
    }
    return path;
  }

}
