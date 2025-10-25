export interface Edge {
  from: string;
  to: string;
  time: number;
  cost: number;
  mode: string; // e.g., 'Bike', 'Van', 'Drone', 'Truck'
}
