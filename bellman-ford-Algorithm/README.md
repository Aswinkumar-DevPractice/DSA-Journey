# 📦 Smart Delivery Route Optimizer (Angular + Bellman–Ford + Leaflet.js)

## 🚀 Real-Time Route Optimization Based on Time, Cost, and Mode

An interactive route optimization tool built with **Angular**, **TypeScript**, and **Leaflet.js**.  
It demonstrates how to apply the **Bellman–Ford algorithm** to real-world logistics — dynamically finding the most efficient delivery route based on **time**, **cost**, or a **combined metric**.

---

## 🧭 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Algorithm: Bellman–Ford Explained](#️-algorithm-bellmanford-explained)
- [Implementation Walkthrough](#-implementation-walkthrough)
- [Leaflet.js Integration](#-leafletjs-integration)
- [User Interaction](#-user-interaction)
- [How to Run](#-how-to-run)
- [License Notice](#️-license-notice)

---

## 🧠 Overview

Modern logistics networks often contain multiple routes between warehouses, hubs, and customers — each with varying **time**, **cost**, and **transport modes** (bike, van, drone, etc.).  
This project solves the problem of finding the **optimal balance** between time and cost.

It:
- Models all delivery hubs and routes as graph nodes and edges.
- Uses Bellman–Ford to compute the shortest (optimal) path.
- Visualizes all routes with **Leaflet.js**, highlighting the best one dynamically.

---

## 🧩 Key Features
- ✅ Interactive map with visual route overlays  
- ✅ Optimization modes: **Min Time**, **Min Cost**, **Combo (Time + Cost)**  
- ✅ Real-time re-calculation on mode toggle  
- ✅ Clean Angular architecture (Models + Services + Components)  
- ✅ BSD-compliant Leaflet visuals  
- ✅ Easy to extend with live API or geolocation data  

---

## 📁 Project Structure
```

src/
├─ app/
│   ├─ models/
│   │   └─ edge.model.ts
│   ├─ services/
│   │   └─ delivery-route.service.ts
│   ├─ components/
│   │   └─ delivery-map/
│   │       ├─ delivery-map.component.ts
│   │       ├─ delivery-map.component.html
│   │       └─ delivery-map.component.css
│   └─ app.module.ts
│
├─ assets/
│   └─ leaflet/
│       ├─ marker-icon.png
│       ├─ marker-icon-2x.png
│       └─ marker-shadow.png
│
└─ index.html

```

---

## ⚙️ Algorithm: Bellman–Ford Explained

The **Bellman–Ford algorithm** computes the shortest path from a single source node to all others — even when edge weights (time/cost) are negative.

### Why Bellman–Ford?
Unlike Dijkstra’s algorithm, Bellman–Ford supports **negative weights** and **custom weight metrics**, perfect for dynamic logistics optimization.

### Weighted Formula
\[
w(u,v) =
\begin{cases}
time(u,v), & \text{if optimizing for time} \\
cost(u,v), & \text{if optimizing for cost} \\
time(u,v) + 0.5 × cost(u,v), & \text{if optimizing for combo}
\end{cases}
\]

### Time Complexity
\[
O(|V| × |E|)
\]
where |V| = delivery points, |E| = routes.

---

## 🛠️ Implementation Walkthrough

### 1️⃣ Edge Model
```

export interface Edge {
from: string;
to: string;
time: number;
cost: number;
mode: string; // e.g., 'Bike', 'Van', 'Drone'
}

```
Defines the structure of each route between two nodes.

---

### 2️⃣ DeliveryRouteService (Bellman–Ford Logic)
Core logic for calculating optimal routes.
Handles dynamic weight evaluation based on the selected metric (time, cost, or combo).

---

### 3️⃣ DeliveryMapComponent
Bridges UI, algorithm, and map rendering:
- Builds the network graph
- Calls the service for optimization
- Draws routes dynamically on the Leaflet map
- Reacts instantly to user metric changes

---

## 🗺️ Leaflet.js Integration

All routes and locations are visualized with **Leaflet**.  

Color-coded by **transport mode**, while the **optimal route** is shown in **gold**.

```

L.Icon.Default.mergeOptions({
iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
iconUrl: 'assets/leaflet/marker-icon.png',
shadowUrl: 'assets/leaflet/marker-shadow.png'
});

```
Safely reinitializes maps without memory leaks using:
```

if (this.map) this.map.remove();

```

---

## 🧑‍💻 User Interaction

| Mode | Description | Behavior |
|------|--------------|-----------|
| **Min Time** | Finds the fastest route | Ignores cost |
| **Min Cost** | Finds the cheapest route | Ignores time |
| **Combo** | Balances time & cost | Uses hybrid metric |

When the mode changes, the Bellman–Ford algorithm recomputes routes instantly, visually updating the map.

---

## 🏃 How to Run

**Clone the repository**
```

git clone https://github.com/Aswinkumar-DevPractice/DSA-Journey.git
cd bellman-ford-Algorithm

```

**Install dependencies**
```

npm install

```

**Run the development server**
```

ng serve

```

**Open in your browser**
```

http://localhost:4200

```

---

## ⚖️ License Notice

This project includes **Leaflet.js**, licensed under the **BSD 2-Clause License**.

© 2010–2025 Volodymyr Agafonkin  
© 2010–2011 CloudMade  
See `licenses/leaflet-BSD-2-Clause.txt` for details.

---

## 🧩 Summary

**Smart Delivery Route Optimizer** showcases:
- Real-time decision-making using **graph algorithms**
- Interactive Angular UI integration
- Visual data analytics with Leaflet maps

# 🧮 Mathematical Explanation: Bellman–Ford Algorithm

The **Bellman–Ford algorithm** is a classic **single-source shortest path** algorithm in graph theory.  
It calculates the *minimum* "cost" (or "distance") from a starting vertex to all other vertices in a weighted directed graph — even when some edge weights are negative.

---

## 🚚 Context: Delivery Optimization

In this **Smart Delivery Route Optimizer** project:

- **Vertices (V)** represent delivery locations such as warehouses, hubs, and customers.  
- **Edges (E)** represent routes between these locations, each having a **time** and **cost**.  
- The algorithm determines the **optimal delivery route** from a source (e.g., Warehouse A) to a destination (e.g., Customer D) based on a chosen optimization metric.

---

## 🧠 Problem Definition

Let the graph be defined as:

\[
G = (V, E)
\]

Where:  
- \( V \): set of vertices (delivery points)  
- \( E \): set of edges (routes) with associated weights \( w(u, v) \)  
- \( s \): source vertex (the starting point, e.g., a warehouse)

The goal is to find the shortest path from \( s \) to every other vertex \( v \in V \).

---

### Weight Function

In this project, the **edge weight** is dynamically defined as:

\[
w(u,v)=
\begin{cases}
time(u,v), & \text{if optimizing for time} \\
cost(u,v), & \text{if optimizing for cost} \\
time(u,v) + 0.5 \times cost(u,v), & \text{if optimizing for combo}
\end{cases}
\]

This flexibility allows multi-criteria decisions combining **time** and **cost**.

---

## ⚙️ Algorithm Steps

### Initialization

Each node’s initial distance is defined as:

\[
distance[v] =
\begin{cases}
0, & \text{if } v = s \\
\infty, & \text{otherwise}
\end{cases}
\]

All nodes start with an *infinite* distance, except the **source**, which starts at \( 0 \).

---


 


### 2️⃣ Relaxation (Repeated |V| − 1 times)
For each edge \((u,v) \in E\):

\[
\text{if } distance[u] + w(u,v) < distance[v] \text{ then } distance[v] = distance[u] + w(u,v)
\]

This process ensures all shortest paths with at most \(|V| - 1\) edges are correctly computed.

---

### 3️⃣ Negative Cycle Check
After relaxations:

\[
\text{if } distance[u] + w(u,v) < distance[v] \text{ then a negative weight cycle exists.}
\]

In a delivery context, this implies **inconsistent data** (e.g., routes that lower total cost infinitely) and should be flagged.

---

## 🔢 Example (Simplified)

Consider the network below:

| Route            | Time (min) | Cost ($) |
|------------------|------------|----------|
| Warehouse A → Hub B | 30 | 5 |
| Hub B → Hub D | 20 | 3 |
| Hub D → Customer D | 15 | 2 |

If optimizing for **Combo**:

\[
w(u,v) = time(u,v) + 0.5 \times cost(u,v)
\]

Then:

| Edge | Calculation | Weight |
|------|--------------|--------|
| A → B | 30 + 0.5×5 | 32.5 |
| B → D | 20 + 0.5×3 | 21.5 |
| D → C | 15 + 0.5×2 | 16 |

Total optimal path cost:

\[
32.5 + 21.5 + 16 = 70
\]

Thus, the Bellman–Ford algorithm finds the **shortest weighted route** considering both time and cost.

---

## 🧩 Pseudocode
```
function BellmanFord(G, s):
for each vertex v in G:
distance[v] ← ∞
predecessor[v] ← null
distance[s] ← 0

for i from 1 to |V| − 1:
    for each edge (u, v) in E:
        if distance[u] + w(u, v) < distance[v]:
            distance[v] ← distance[u] + w(u, v)
            predecessor[v] ← u

for each edge (u, v) in E:
    if distance[u] + w(u, v) < distance[v]:
        error "Graph contains a negative weight cycle"

return distance, predecessor
```


---

## 🧭 Time Complexity

\[
O(|V| \times |E|)
\]

Where:  
- \(|V|\): number of vertices (locations)  
- \(|E|\): number of edges (routes)

Bellman–Ford is slower than Dijkstra’s algorithm but much more **flexible**, supporting both **negative weights** and **dynamic metrics** like time + cost.

---

## ⚖️ Why Bellman–Ford (and Not Dijkstra)?

| Feature | Bellman–Ford | Dijkstra |
|----------|---------------|-----------|
| Handles negative weights | ✅ Yes | ❌ No |
| Easy to implement | ✅ Moderate | ✅ Moderate |
| Dynamic weight customization | ✅ Excellent | ⚠️ Limited |
| Efficiency | ❌ O(V×E) (Slower) | ✅ O(E + V log V) (Faster) |
| Suitable for time–cost optimization | ✅ Perfect fit | ⚠️ Not ideal |

Bellman–Ford’s adaptability makes it ideal for multi-criteria logistics optimization where metrics change dynamically.

---

## 🧩 Role in This Project

| Step | Description |
|------|--------------|
| **Input** | Locations (V) and Delivery Routes (E) |
| **Processing** | Bellman–Ford algorithm in `DeliveryRouteService` |
| **Output** | Optimal route + total time/cost |
| **Visualization** | Rendered dynamically on Leaflet.js map |

Bellman–Ford acts as the **decision engine**, computing the best path, while Angular and Leaflet handle visualization and user interaction.

---

## 📐 Conceptual Formula Summary

\[
distance[v] = \min_{\text{all paths from s to v}} \sum_{(u,v) \in path} w(u,v)
\]

\[
w(u,v) =
\begin{cases}
time(u,v), & \text{if metric = "time"} \\
cost(u,v), & \text{if metric = "cost"} \\
time(u,v) + 0.5×cost(u,v), & \text{if metric = "combo"}
\end{cases}
\]

---

## 💬 Intuitive Analogy

Imagine a **delivery manager** recalculating routes between checkpoints:

- Each route has a **travel time** (minutes), **cost** (dollars), and **mode** (bike, van, drone).  
- The algorithm keeps asking:  
  “If I reach this hub through a different route, can I get here *faster* or *cheaper*?”

After several passes, no further improvements are possible — revealing the **most efficient delivery path**.

---

### 🔍 Summary

- **Problem Type:** Single-source shortest path  
- **Handles Negative Weights:** Yes  
- **Core Technique:** Iterative relaxation  
- **Used In:** Multi-criteria delivery route optimization  
- **Algorithmic Role:** Backbone of time–cost–mode optimization in Angular + Leaflet application  

---




 




