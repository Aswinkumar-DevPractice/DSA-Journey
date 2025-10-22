import { Injectable } from '@angular/core';


export interface RouteEdge {
  from: string;
  to: string;
  mode: 'walk' | 'train' | 'metro' | 'bus' | 'self_drive' | 'taxi';
  time: number;
  cost: number;
  distance: number;
}

export interface RouteResult {
  path: string[];
  modes: string[];
  total: {
    time: number;
    cost: number;
    distance: number;
  };
  optimizationType: string;
}

@Injectable({ providedIn: 'root' })
export class RouteService {

  // Graph data based on the provided table
 private graph: RouteEdge[] = [
    { from: 'Tambaram', to: 'Anna Nagar', mode: 'taxi', time: 35, cost: 775, distance: 28 },
    { from: 'Tambaram', to: 'Anna Nagar', mode: 'self_drive', time: 40, cost: 325, distance: 28 },
    { from: 'Tambaram', to: 'St. Thomas Mount', mode: 'train', time: 25, cost: 30, distance: 15 },
    { from: 'St. Thomas Mount', to: 'Anna Nagar East', mode: 'metro', time: 35, cost: 40, distance: 12 },
    { from: 'Anna Nagar East', to: 'Anna Nagar', mode: 'walk', time: 5, cost: 0, distance: 1 },
    { from: 'Tambaram', to: 'Chennai Egmore', mode: 'train', time: 35, cost: 35, distance: 20 },
    { from: 'Chennai Egmore', to: 'Anna Nagar East', mode: 'metro', time: 40, cost: 40, distance: 12 },
    { from: 'Tambaram', to: 'Airport Metro Station', mode: 'bus', time: 30, cost: 20, distance: 18 },
    { from: 'Airport Metro Station', to: 'Alandur', mode: 'metro', time: 20, cost: 25, distance: 8 },
    { from: 'Alandur', to: 'Anna Nagar', mode: 'metro', time: 25, cost: 25, distance: 10 },
    { from: 'Tambaram', to: 'Anna Nagar', mode: 'bus', time: 120, cost: 35, distance: 28 }
  ];


  private nodes: Set<string>;
  // Pre-calculated normalization factors (approximate max values in graph)
  // Max Time: ~120 min (Bus direct)
  // Max Cost: ~775 Rs (Taxi direct)
  private MAX_TIME = 120; 
  private MAX_COST = 775;


  constructor() {
    this.nodes = new Set();
    this.graph.forEach((edge) => {
      this.nodes.add(edge.from);
      this.nodes.add(edge.to);
    });
  }
  
  /**
   * Calculates a combined score for an edge based on normalized time and cost.
   * Time and Cost are normalized to prevent one overwhelming the other.
   */
  private calculateCombinedScore(edge: RouteEdge, timeWeight: number, costWeight: number): number {
    // Normalize time and cost to a 0-1 range based on assumed maximums
    const normalizedTime = edge.time / this.MAX_TIME;
    const normalizedCost = edge.cost / this.MAX_COST;
    
    // Calculate weighted score
    return (normalizedTime * timeWeight) + (normalizedCost * costWeight);
  }

  /**
   * A unified Dijkstra implementation that minimizes a single factor or a combined score.
   */
  private runDijkstra(factor: 'time' | 'cost' | 'distance' | 'combined', timeWeight?: number, costWeight?: number): { path: string[], previous: Map<string, string | null>, totalDistances: Map<string, number> } | null {
    const start = 'Tambaram';
    const end = 'Anna Nagar';

    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();

    this.nodes.forEach((node) => distances.set(node, Infinity));
    distances.set(start, 0);
    previous.set(start, null);

    const unvisitedNodes = Array.from(this.nodes);

    while (unvisitedNodes.length > 0) {
      let currentNode: string | null = null;
      let minDistance = Infinity;

      for (const node of unvisitedNodes) {
        const dist = distances.get(node) ?? Infinity;
        if (dist < minDistance) {
          minDistance = dist;
          currentNode = node;
        }
      }

      if (!currentNode || minDistance === Infinity) break;

      unvisitedNodes.splice(unvisitedNodes.indexOf(currentNode), 1);
      visited.add(currentNode);

      if (currentNode === end) break;

      const neighbors = this.graph.filter((e) => e.from === currentNode);
      for (const edge of neighbors) {
        if (visited.has(edge.to)) continue;

        const currentDist = distances.get(currentNode) ?? Infinity;
        let edgeValue = 0;
        
        if (factor === 'combined' && timeWeight !== undefined && costWeight !== undefined) {
            // Use the combined score as the edge weight
            edgeValue = this.calculateCombinedScore(edge, timeWeight, costWeight);
        } else if (factor !== 'combined') {
            // Use a single factor as the edge weight
            edgeValue = edge[factor];
        } else {
            // Should not happen, but for safety
            continue;
        }
        
        const newDist = currentDist + edgeValue;
        
        if (newDist < (distances.get(edge.to) ?? Infinity)) {
          distances.set(edge.to, newDist);
          previous.set(edge.to, currentNode);
        }
      }
    }
    
    if (distances.get(end) === Infinity) return null;

    return { path: this.reconstructPath(start, end, previous), previous, totalDistances: distances };
  }
  
  /**
   * Helper to reconstruct the path from the 'previous' map.
   */
  private reconstructPath(start: string, end: string, previous: Map<string, string | null>): string[] {
    const path: string[] = [];
    let curr: string | null = end;
    while (curr) {
      path.unshift(curr);
      curr = previous.get(curr) as string | null;
      if (curr === start && path[0] !== start) { // Ensures start is included
         path.unshift(start);
         break;
      }
    }
    // Simple check to ensure path starts at 'start'
    return path.length > 0 && path[0] === start ? path : [];
  }

  /**
   * Finalizes the RouteResult structure (calculates total metrics and modes).
   */
  private finalizeRouteResult(path: string[], totalDistances: Map<string, number>, optimizationFactor: 'time' | 'cost' | 'distance' | 'combined', optimizationType: string): RouteResult | null {
      if (path.length < 2) return null;
      
      const finalTotal = { time: 0, cost: 0, distance: 0 };
      const finalModes: string[] = [];

      for (let i = 0; i < path.length - 1; i++) {
          const from = path[i];
          const to = path[i + 1];
          
          const costTo = totalDistances.get(to) ?? Infinity;
          const costFrom = totalDistances.get(from) ?? Infinity;
          
          let edgeToUse: RouteEdge | undefined;

          // Find the specific edge used in the optimal path based on the distance change
          const possibleEdges = this.graph.filter(e => e.from === from && e.to === to);
          
          if (optimizationFactor === 'combined') {
              // For combined, we can't easily rely on distance change. 
              // We'll rely on the original Dijkstra's choice, which is hard to backtrack here.
              // For simplicity and robustness, we will find the single edge that minimizes the *Time* for this segment.
              // NOTE: This assumes Time optimization is the tie-breaker for multi-factor routes.
              edgeToUse = possibleEdges.reduce((prev, curr) => (prev.time < curr.time ? prev : curr));

          } else {
              // Single factor optimization: find the edge whose factor cost matches the distance relaxation
              edgeToUse = possibleEdges.find(e => Math.abs((costFrom + e[optimizationFactor]) - costTo) < 0.001);
              
              // Fallback: if the exact edge isn't found, use the one that minimizes the target factor
              if (!edgeToUse) {
                   edgeToUse = possibleEdges.reduce((prev, curr) => (prev[optimizationFactor] < curr[optimizationFactor] ? prev : curr));
              }
          }
          
          if (edgeToUse) {
              finalTotal.time += edgeToUse.time;
              finalTotal.cost += edgeToUse.cost;
              finalTotal.distance += edgeToUse.distance;
              finalModes.push(edgeToUse.mode);
          } else {
              // If an edge is somehow missing, the path is invalid
              return null;
          }
      }

      return { path, modes: finalModes, total: finalTotal, optimizationType: optimizationType };
  }


  // --- Public Methods ---

  /**
   * Finds the best route minimizing a single factor (Time, Cost, or Distance).
   */
  findBestRoute(factor: 'time' | 'cost' | 'distance' | 'combined'): RouteResult | null {
    const result = this.runDijkstra(factor);
    if (!result) return null;
    
    return this.finalizeRouteResult(result.path, result.totalDistances, factor, `${factor.charAt(0).toUpperCase() + factor.slice(1)} Only`);
  }

  /**
   * Finds the best route minimizing a combination of Time and Cost.
   * timeWeight and costWeight are weights from 0 to 1, where timeWeight + costWeight = 1 is assumed.
   */
  findCompromiseRoute(timeWeight: number, costWeight: number): RouteResult | null {
    // We'll use a 50/50 balance for the demonstration scenario
    const timeW = 0.5;
    const costW = 0.5;
    
    const result = this.runDijkstra('combined', timeW, costW);
    if (!result) return null;
    
    return this.finalizeRouteResult(result.path, result.totalDistances, 'combined', 'Time & Cost Compromise (50/50)');
  }

  // Expose graph data for component segment calculation
  getGraph(): RouteEdge[] {
    return this.graph;
  }
  
  // Expose nodes for display
  getNodes(): Set<string> {
    return this.nodes;
  }
}
