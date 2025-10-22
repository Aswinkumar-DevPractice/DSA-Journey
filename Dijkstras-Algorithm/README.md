# DijkstrasAlgorithm

🧭 Chennai Route Optimizer

Find the best route from Tambaram to Anna Nagar using the smartest logic based on your priority — time, cost, distance, or a balanced combo of time and cost.

📌 What Is This?

This is a web-based Angular app that helps users find the most efficient route between two locations in Chennai:

Start: Tambaram

Destination: Anna Nagar

You can choose how you want to optimize the route:

🕒 Time: Fastest route

💰 Cost: Cheapest route

📏 Distance: Shortest route

⚖️ Combined: A smart balance between time and cost

It displays the best path, total time, cost, distance, and the transport modes used (e.g., train, metro, taxi).

🧠 How It Works (In Simple Terms)

The app uses a smart algorithm called Dijkstra's Algorithm behind the scenes to calculate the best route.

Here's the process in a simple analogy:

🧩 Step-by-Step (Layman's View)

🏙️ Imagine a Map of Stops
Think of places like Tambaram, Anna Nagar, Egmore, etc., connected by various transport options like train, bus, metro, taxi.

🛣️ Each Connection Has Info
Every connection has:

Time it takes (in minutes)

Cost (in ₹)

Distance (in kilometers)

Transport mode (e.g., train or taxi)

🧠 Smart Brain (Algorithm) Figures Out Best Route
When you select "time", the algorithm looks for the fastest path.
When you select "cost", it finds the cheapest.
For "combined", it balances both time and cost (50% each).

📊 It Calculates and Shows Results
Once calculated, it shows:

🚶 Path you would follow (e.g., Tambaram → Mount → Anna Nagar)

🕒 Total time

💰 Total cost

📏 Total distance

🚇 Transport modes used

💻 How to Run This App Locally

You’ll need Node.js, Angular CLI, and npm installed.

1. Clone the Repo
git clone https://github.com/Aswinkumar-DevPractice/DSA-Journey.git
cd Dijkstras-Algorithm

2. Install Dependencies
npm install

3. Run the App
ng serve


Then go to: http://localhost:4200

🧱 Project Structure
src/
├── app/
│   ├── route-comparator/          # Main component UI
│   │   ├── route-comparator.component.ts
│   │   ├── route-comparator.component.html
│   │   └── route-comparator.component.scss
│   └── services/
│       └── route.service.ts       # Main logic for route calculation

🧮 How the Logic Works (Technical in Simple Words)
✅ Graph

All routes are stored in a list called graph.

Each item looks like:

{
  from: 'Tambaram',
  to: 'Anna Nagar',
  mode: 'taxi',
  time: 35,
  cost: 775,
  distance: 28
}

✅ Dijkstra’s Algorithm

This algorithm finds the shortest path between two points.

In this app, "shortest" can mean:

Minimum time

Minimum cost

Minimum distance

Or a mix (combined score)

✅ Combined Score

For combined optimization:

We normalize time and cost (scale them from 0 to 1).

Apply weights (50% time, 50% cost).

Add them together to form a score.

Choose the path with the lowest score.

Example:

score = (time / maxTime) * 0.5 + (cost / maxCost) * 0.5

🧠 Step-by-Step Algorithm Explanation (Layman's + Code Walkthrough)

This section explains how the route is calculated using a step-by-step approach.

🎯 Goal

To find the best route from Tambaram to Anna Nagar based on one of four options:

🕒 Fastest route (least time)

💰 Cheapest route (least cost)

📏 Shortest route (least distance)

⚖️ Balanced route (time + cost combined)

🗺️ 1. The Map (Graph)

The route data is stored in the form of a graph. Each route connection is called an edge:
export interface RouteEdge {
  from: string;
  to: string;
  mode: 'walk' | 'train' | 'metro' | 'bus' | 'self_drive' | 'taxi';
  time: number;
  cost: number;
  distance: number;
}
An example entry:

{ from: 'Tambaram', to: 'St. Thomas Mount', mode: 'train', time: 25, cost: 30, distance: 15 }
✅ This means you can go from Tambaram to St. Thomas Mount by train in 25 minutes, spending ₹30, and covering 15 km.

All such connections are stored in a list called graph.

🔄 2. What Is Dijkstra’s Algorithm?

This is a popular algorithm used to find the shortest path in a network (like maps or graphs).

💡 In our case:

"Shortest" could mean least time, least cost, least distance, or a smart mix.

🧮 3. How We Apply the Algorithm

Here’s a step-by-step view of what your code does:

✅ Step 1: Prepare Everything
const distances = new Map<string, number>();
const previous = new Map<string, string | null>();
const visited = new Set<string>();

🧠 These help the algorithm keep track of:

distances: The best known time/cost/distance to reach each place

previous: Which node (stop) we came from to reach this place

visited: Stops we've already visited

Then we initialize:

distances.set(start, 0); // Tambaram = 0
previous.set(start, null);

✅ Step 2: Visit All Unvisited Stops
while (unvisitedNodes.length > 0) {
  // Find the stop with the shortest known distance
  // Visit it and check its neighbors
}

We keep checking the nearest unvisited stop.

✅ Step 3: Explore Neighbors
const neighbors = this.graph.filter((e) => e.from === currentNode);

Here we find all direct connections (edges) from the current stop.

Then for each edge, we calculate the new possible distance:

if (factor === 'combined') {
  edgeValue = this.calculateCombinedScore(edge, timeWeight, costWeight);
} else {
  edgeValue = edge[factor];
}

This is where we calculate how "good" or "bad" this path is:

For single optimization (like time), we just use edge.time

For combined, we use a formula:

normalizedTime = edge.time / MAX_TIME
normalizedCost = edge.cost / MAX_COST

score = (normalizedTime * 0.5) + (normalizedCost * 0.5)

This balances both time and cost fairly.

✅ Step 4: Update Best Known Path
if (newDist < (distances.get(edge.to) ?? Infinity)) {
  distances.set(edge.to, newDist);
  previous.set(edge.to, currentNode);
}
If we found a better path to the neighbor, we update our memory of how to get there.

✅ Step 5: Reconstruct Final Path

Once we reach the destination:
This function walks back from Anna Nagar to Tambaram using the previous map to figure out the actual path.

So it returns something like:
['Tambaram', 'St. Thomas Mount', 'Anna Nagar East', 'Anna Nagar']

✅ Step 6: Sum Up Totals (Time, Cost, Distance, Modes)
finalTotal.time += edgeToUse.time;
finalTotal.cost += edgeToUse.cost;
finalTotal.distance += edgeToUse.distance;
finalModes.push(edgeToUse.mode);

We loop through the path and calculate:

Total time

Total cost

Total distance

List of transport modes (e.g., train, metro, walk)

📦 Final Output: RouteResult

All the above data is returned in this structure:
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
Example:

{
  path: ['Tambaram', 'St. Thomas Mount', 'Anna Nagar East', 'Anna Nagar'],
  modes: ['train', 'metro', 'walk'],
  total: {
    time: 65,
    cost: 70,
    distance: 28
  },
  optimizationType: 'Time Only'
}

✅ Where the Algorithm is Called in the App

In your Angular component:

calculateBestRoute() {
  if (this.optimizationFactor === 'combined') {
    this.bestRoute = this.routeService.findCompromiseRoute(0.5, 0.5);
  } else {
    this.bestRoute = this.routeService.findBestRoute(this.optimizationFactor);
  }
}

Every time the user changes the dropdown (time/cost/distance/combined), this function re-runs the algorithm and updates the screen.

🎉 That’s It!

You've now learned:

How route data is stored

What Dijkstra’s algorithm does

How the code calculates the best route

How combined optimization works

How everything connects to the UI

🖥️ UI Features
Feature	Description
🧭 Route Selector	Choose what to optimize: time, cost, distance, both
🛤️ Path View	Shows all stops from start to end
📊 Stats	Shows total time, cost, distance
🧾 Transport Modes	Shows all the types of transport used
🗺️ Map Nodes Preview	Displays all available nodes in the network
⚠️ Limitations

It’s currently hardcoded for Tambaram → Anna Nagar

Doesn’t use real-time traffic or data from Google Maps

You can't input your own route points (yet)

No graphical map (only text-based view)

🚀 Future Ideas

 Allow users to choose custom source/destination

 Let users adjust time-cost weight (e.g., 70% time, 30% cost)

 Show the route on a map using Google Maps or Leaflet.js

 Support return trips

 Add more transport options and nodes

👨‍💻 Tech Stack

Angular: Frontend framework

TypeScript: Strong typing & better structure

SCSS: For styling

Dijkstra Algorithm: Core pathfinding logic

🙌 Acknowledgments

Inspired by Chennai’s growing multi-modal transport systems.
This project is a simplified educational prototype and does not reflect live route timings or fares.

📄 License

This project is open source and free to use.

# 🧠 Step-by-Step Algorithm Explanation (Layman's + Code Walkthrough)

This section explains how the route is calculated using a step-by-step approach.

🎯 Goal
To find the best route from Tambaram to Anna Nagar based on one of four options:
🕒 Fastest route (least time)
💰 Cheapest route (least cost)
📏 Shortest route (least distance)
⚖️ Balanced route (time + cost combined)

🗺️ 1. The Map (Graph)
The route data is stored in the form of a graph. Each route connection is called an edge:
export interface RouteEdge {
from: string;
to: string;
mode: 'walk' | 'train' | 'metro' | 'bus' | 'self_drive' | 'taxi';
time: number;
cost: number;
distance: number;
}

An example entry:
{ from: 'Tambaram', to: 'St. Thomas Mount', mode: 'train', time: 25, cost: 30, distance: 15 }

✅ This means you can go from Tambaram to St. Thomas Mount by train in 25 minutes, spending ₹30, and covering 15 km.
All such connections are stored in a list called graph.

🔄 2. What Is Dijkstra’s Algorithm?
This is a popular algorithm used to find the shortest path in a network (like maps or graphs).
💡 In our case:
"Shortest" could mean least time, least cost, least distance, or a smart mix.

🧮 3. How We Apply the Algorithm
Here’s a step-by-step view of what your code does:

✅ Step 1: Prepare Everything
const distances = new Map<string, number>();
const previous = new Map<string, string | null>();
const visited = new Set<string>();

🧠 These help the algorithm keep track of:
distances: The best known time/cost/distance to reach each place
previous: Which node (stop) we came from to reach this place
visited: Stops we've already visited
Then we initialize:
distances.set(start, 0); // Tambaram = 0
previous.set(start, null);

✅ Step 2: Visit All Unvisited Stops
while (unvisitedNodes.length > 0) {
// Find the stop with the shortest known distance
// Visit it and check its neighbors
}

We keep checking the nearest unvisited stop.

✅ Step 3: Explore Neighbors
const neighbors = this.graph.filter((e) => e.from === currentNode);

Here we find all direct connections (edges) from the current stop.
Then for each edge, we calculate the new possible distance:
if (factor === 'combined') {
edgeValue = this.calculateCombinedScore(edge, timeWeight, costWeight);
} else {
edgeValue = edge[factor];
}

This is where we calculate how "good" or "bad" this path is:
For single optimization (like time), we just use edge.time
For combined, we use a formula:
normalizedTime = edge.time / MAX_TIME
normalizedCost = edge.cost / MAX_COST

score = (normalizedTime * 0.5) + (normalizedCost * 0.5)

This balances both time and cost fairly.

✅ Step 4: Update Best Known Path
if (newDist < (distances.get(edge.to) ?? Infinity)) {
distances.set(edge.to, newDist);
previous.set(edge.to, currentNode);
}

If we found a better path to the neighbor, we update our memory of how to get there.

✅ Step 5: Reconstruct Final Path
Once we reach the destination:
this.reconstructPath(start, end, previous);

This function walks back from Anna Nagar to Tambaram using the previous map to figure out the actual path.
So it returns something like:
['Tambaram', 'St. Thomas Mount', 'Anna Nagar East', 'Anna Nagar']

✅ Step 6: Sum Up Totals (Time, Cost, Distance, Modes)
finalTotal.time += edgeToUse.time;
finalTotal.cost += edgeToUse.cost;
finalTotal.distance += edgeToUse.distance;
finalModes.push(edgeToUse.mode);

We loop through the path and calculate:
Total time
Total cost
Total distance
List of transport modes (e.g., train, metro, walk)

📦 Final Output: RouteResult
All the above data is returned in this structure:
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

Example:
{
path: ['Tambaram', 'St. Thomas Mount', 'Anna Nagar East', 'Anna Nagar'],
modes: ['train', 'metro', 'walk'],
total: {
time: 65,
cost: 70,
distance: 28
},
optimizationType: 'Time Only'
}

✅ Where the Algorithm is Called in the App
In your Angular component:
calculateBestRoute() {
if (this.optimizationFactor === 'combined') {
this.bestRoute = this.routeService.findCompromiseRoute(0.5, 0.5);
} else {
this.bestRoute = this.routeService.findBestRoute(this.optimizationFactor);
}
}

Every time the user changes the dropdown (time/cost/distance/combined), this function re-runs the algorithm and updates the screen.

🎉 That’s It!
You've now learned:
How route data is stored
What Dijkstra’s algorithm does
How the code calculates the best route
How combined optimization works
How everything connects to the UI

Here is a clear **layman + code walkthrough** of how Dijkstra’s Algorithm works inside your Chennai Route Optimizer, structured for readability and correctness based on verified algorithm behavior.[^1][^2][^3]

***

# 🧠 Step-by-Step Algorithm Explanation

(Layman’s Explanation + Code Walkthrough)

***

## 🎯 Goal

Find the **best possible route from Tambaram to Anna Nagar** using Dijkstra’s algorithm, based on any one of these preferences:

- 🕒 **Fastest** (least time)
- 💰 **Cheapest** (least cost)
- 📏 **Shortest** (least distance)
- ⚖️ **Balanced** (optimized mix of time + cost)

***

## 🗺️ 1. The Map (Graph)

Each connection between two points in Chennai (like bus, train, or metro routes) is represented as an **edge**.

```typescript
export interface RouteEdge {
  from: string;
  to: string;
  mode: 'walk' | 'train' | 'metro' | 'bus' | 'self_drive' | 'taxi';
  time: number;
  cost: number;
  distance: number;
}
```

Example:

```typescript
{ from: 'Tambaram', to: 'St. Thomas Mount', mode: 'train', time: 25, cost: 30, distance: 15 }
```

This means:
You can go from **Tambaram** to **St. Thomas Mount** by **train** in **25 minutes**, spending **₹30**, and covering **15 km**.

The entire route data is stored as a **graph** — a collection of all such objects.

***

## 🔄 2. What Is Dijkstra’s Algorithm?

Dijkstra’s algorithm finds the **shortest path** between two points in a weighted graph.
In your project, the “shortest” can mean:

- fewest minutes,
- lowest rupees,
- least kilometers, or
- minimum combined normalized score for time and cost.[^2][^1]

***

## 🧮 3. Step-by-Step Algorithm Logic

### Step 1: Initialize Everything

We first create placeholders to store travel information:

```typescript
const distances = new Map<string, number>();
const previous = new Map<string, string | null>();
const visited = new Set<string>();
```

- **distances** → keeps the least known value (time/cost/distance) to each place
- **previous** → remembers the last stop used to reach each point
- **visited** → tracks stops already evaluated

Set the starting point:

```typescript
distances.set(start, 0);
previous.set(start, null);
```


***

### Step 2: Visit the Nearest Unvisited Stop

Keep visiting stops until all have been checked:

```typescript
while (unvisitedNodes.length > 0) {
  // find the node with smallest distance so far
  // visit it and update its neighbors
}
```

Always pick the **node with the smallest current distance**.[^2]

***

### Step 3: Explore Its Neighbors

Find all routes (edges) starting from the current node:

```typescript
const neighbors = this.graph.filter((e) => e.from === currentNode);
```

For each neighboring connection, compute the total travel value:

```typescript
if (factor === 'combined') {
  edgeValue = this.calculateCombinedScore(edge, timeWeight, costWeight);
} else {
  edgeValue = edge[factor];
}
```

If optimization = **combined**, use a weighted score between time and cost.

***

### Step 4: Calculate Balanced Score (if selected)

For balanced optimization, time and cost are **normalized** (scaled between 0 and 1):

$$
\text{score} = (time / maxTime) * 0.5 + (cost / maxCost) * 0.5
$$

This ensures both metrics contribute equally, like in **Weighted Sum-Dijkstra’s Algorithm**.[^3]

***

### Step 5: Update the Path If Better

If the new total distance/time/cost is better, update it:

```typescript
if (newDist < (distances.get(edge.to) ?? Infinity)) {
  distances.set(edge.to, newDist);
  previous.set(edge.to, currentNode);
}
```

This ensures we always keep the **most optimal route** discovered so far.

***

### Step 6: Build Final Path

Once Anna Nagar is reached, reconstruct the path from finish to start using the previous map:

```typescript
this.reconstructPath(start, end, previous);
```

This retrieves a chain like:

```json
["Tambaram", "St. Thomas Mount", "Anna Nagar East", "Anna Nagar"]
```


***

### Step 7: Summarize the Result

Finally, sum up all travel values for that route:

```typescript
finalTotal.time += edgeToUse.time;
finalTotal.cost += edgeToUse.cost;
finalTotal.distance += edgeToUse.distance;
finalModes.push(edgeToUse.mode);
```

Result is structured as:

```typescript
export interface RouteResult {
  path: string[];
  modes: string[];
  total: { time: number; cost: number; distance: number };
  optimizationType: string;
}
```

Example Output:

```json
{
  "path": ["Tambaram", "St. Thomas Mount", "Anna Nagar East", "Anna Nagar"],
  "modes": ["train", "metro", "walk"],
  "total": { "time": 65, "cost": 70, "distance": 28 },
  "optimizationType": "Time Only"
}
```


***

## 🧩 Integration With Angular App

Triggered from your Angular component:

```typescript
calculateBestRoute() {
  if (this.optimizationFactor === 'combined') {
    this.bestRoute = this.routeService.findCompromiseRoute(0.5, 0.5);
  } else {
    this.bestRoute = this.routeService.findBestRoute(this.optimizationFactor);
  }
}
```

Whenever the user changes the optimization type (time, cost, distance, or combined), this method reruns the algorithm and refreshes the result on-screen.

***

## 🎉 Summary

You’ve now seen:

- How the city routes are modelled as a **graph**
- How **Dijkstra’s algorithm** finds the optimal route
- How **combined weights** balance time and cost
- How it integrates into your Angular app’s logic

This balances mathematical accuracy with real-user clarity — essentially transforming classical Dijkstra’s logic into a multi-factor Chennai route optimizer.[^4][^3][^2]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.w3schools.com/dsa/dsa_algo_graphs_dijkstra.php

[^2]: https://dev.to/dipakahirav/understanding-dijkstras-algorithm-a-step-by-step-guide-3g9b

[^3]: https://www.jcscm.net/fp/145.pdf

[^4]: https://www.upperinc.com/glossary/route-optimization/dijkstras-algorithm/

[^5]: https://www.wscubetech.com/resources/dsa/dijkstra-algorithm

[^6]: https://stackoverflow.com/questions/50204824/adjusting-dijkstra-for-transit-routing-minimize-route-changes

[^7]: https://www.youtube.com/watch?v=_Zhx4b3ygNg

[^8]: https://www.ijeast.com/papers/186-190,Tesma608, IJEAST.pdf

[^9]: https://www.geeksforgeeks.org/dsa/dijkstras-shortest-path-algorithm-greedy-algo-7/

[^10]: https://stackoverflow.com/questions/26547816/understanding-time-complexity-calculation-for-dijkstra-algorithm

[^11]: https://www.javacodegeeks.com/2023/10/navigating-efficiency-and-perfection-an-exploration-of-alternative-approaches-to-dijkstras-algorithm.html

[^12]: https://www.freecodecamp.org/news/dijkstras-shortest-path-algorithm-visual-introduction/

[^13]: https://www.baeldung.com/cs/dijkstra-time-complexity

[^14]: https://stackoverflow.com/questions/1413859/optimizing-dijkstra-for-dense-graph

[^15]: https://github.com/kaisnb/dijkstra-ts

[^16]: https://www.geeksforgeeks.org/dsa/introduction-to-dijkstras-shortest-path-algorithm/

[^17]: https://codesignal.com/learn/courses/interview-prep-the-last-mile-in-typescript/lessons/advanced-graph-algorithms-in-typescript

[^18]: https://en.wikipedia.org/wiki/Dijkstra's_algorithm

[^19]: https://takeuforward.org/data-structure/dijkstras-algorithm-using-priority-queue-g-32/

[^20]: https://www.sciencedirect.com/science/article/pii/S1569843224002619
