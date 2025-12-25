import { Singleton } from "../pattern/singleton";

/**
 * A* Pathfinding Algorithm Implementation
 *
 * Features:
 * - Binary heap priority queue for O(log n) operations
 * - Support for 8-directional movement
 * - Diagonal movement with correct cost (√2)
 * - Obstacle detection
 * - Path reconstruction
 * - Non-blocking frame-by-frame execution
 */

// ============================================================================
// Type Definitions
// ============================================================================

/** Position in the grid */
export interface GridPosition {
    x: number;
    z: number;
}

/** Cell state in the map */
export enum CellState {
    WALKABLE = 0,
    OBSTACLE = 1
}

/** A* node for pathfinding */
interface AStarNode {
    x: number;
    z: number;
    g: number;              // Cost from start to this node
    h: number;              // Heuristic cost from this node to end
    f: number;              // Total cost (g + h)
    parent: AStarNode | null;
    closed: boolean;
    opened: boolean;
}

/** Grid cell data */
interface GridCell {
    state: CellState;
    node: AStarNode | null;
}

/** Pathfinding result */
export interface PathResult {
    found: boolean;
    path: GridPosition[];
    cost: number;
}

/** Direction offset with movement cost */
interface Direction {
    dx: number;
    dz: number;
    cost: number;
}

// ============================================================================
// Min Heap Priority Queue
// ============================================================================

class MinHeap<T> {
    private heap: T[] = [];
    private compare: (a: T, b: T) => number;

    constructor(compareFn: (a: T, b: T) => number) {
        this.compare = compareFn;
    }

    get size(): number {
        return this.heap.length;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    push(item: T): void {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;

        const result = this.heap[0];
        const last = this.heap.pop()!;

        if (this.heap.length > 0) {
            this.heap[0] = last;
            this.bubbleDown(0);
        }

        return result;
    }

    peek(): T | undefined {
        return this.heap[0];
    }

    clear(): void {
        this.heap = [];
    }

    /** Update item position after its priority changed */
    update(item: T): void {
        const index = this.heap.indexOf(item);
        if (index !== -1) {
            this.bubbleUp(index);
            this.bubbleDown(index);
        }
    }

    private bubbleUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    private bubbleDown(index: number): void {
        const length = this.heap.length;
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;

            if (leftChild < length && this.compare(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }
            if (rightChild < length && this.compare(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) break;
            this.swap(index, smallest);
            index = smallest;
        }
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}

// ============================================================================
// A* Pathfinding Class
// ============================================================================

export class AStar extends Singleton {

    // Grid data
    private grid: GridCell[][] = [];
    private maxX: number = 0;
    private maxZ: number = 0;

    // Pathfinding state
    private openList: MinHeap<AStarNode>;
    private startPos: GridPosition | null = null;
    private endPos: GridPosition | null = null;
    private isSearching: boolean = false;
    private currentResult: PathResult | null = null;

    // Callback when path is found
    private onPathFound: ((result: PathResult) => void) | null = null;

    // 8 directions: 4 cardinal + 4 diagonal
    private static readonly STRAIGHT_COST = 1;
    private static readonly DIAGONAL_COST = Math.SQRT2; // ~1.414

    private static readonly DIRECTIONS: Direction[] = [
        // Cardinal directions (cost = 1)
        { dx: 0, dz: 1, cost: AStar.STRAIGHT_COST },   // North
        { dx: 1, dz: 0, cost: AStar.STRAIGHT_COST },   // East
        { dx: 0, dz: -1, cost: AStar.STRAIGHT_COST },  // South
        { dx: -1, dz: 0, cost: AStar.STRAIGHT_COST },  // West
        // Diagonal directions (cost = √2)
        { dx: 1, dz: 1, cost: AStar.DIAGONAL_COST },   // NE
        { dx: 1, dz: -1, cost: AStar.DIAGONAL_COST },  // SE
        { dx: -1, dz: -1, cost: AStar.DIAGONAL_COST }, // SW
        { dx: -1, dz: 1, cost: AStar.DIAGONAL_COST },  // NW
    ];

    constructor() {
        super();
        this.openList = new MinHeap<AStarNode>((a, b) => a.f - b.f);
    }

    // ========================================================================
    // Public API
    // ========================================================================

    /**
     * Initialize the pathfinding grid
     * @param mapData 2D array where 0 = walkable, 1 = obstacle
     */
    public initMap(mapData: number[][]): void {
        if (!mapData || mapData.length === 0 || mapData[0].length === 0) {
            console.error("[AStar] Invalid map data");
            return;
        }

        this.maxX = mapData.length;
        this.maxZ = mapData[0].length;
        this.grid = [];

        for (let x = 0; x < this.maxX; x++) {
            this.grid[x] = [];
            for (let z = 0; z < this.maxZ; z++) {
                this.grid[x][z] = {
                    state: mapData[x][z] as CellState,
                    node: null
                };
            }
        }
    }

    /**
     * Update a cell's walkability state
     */
    public setCellState(x: number, z: number, state: CellState): void {
        if (this.isValidPosition(x, z)) {
            this.grid[x][z].state = state;
        }
    }

    /**
     * Get a cell's walkability state
     */
    public getCellState(x: number, z: number): CellState | null {
        if (this.isValidPosition(x, z)) {
            return this.grid[x][z].state;
        }
        return null;
    }

    /**
     * Find path synchronously (blocking)
     * Use for small grids or when immediate result is needed
     */
    public findPathSync(start: GridPosition, end: GridPosition): PathResult {
        this.startSearch(start, end);

        while (this.isSearching) {
            this.step();
        }

        return this.currentResult || { found: false, path: [], cost: 0 };
    }

    /**
     * Start async pathfinding
     * Call update() each frame to progress the search
     */
    public findPathAsync(
        start: GridPosition,
        end: GridPosition,
        callback?: (result: PathResult) => void
    ): void {
        this.onPathFound = callback || null;
        this.startSearch(start, end);
    }

    /**
     * Process one step of the pathfinding algorithm
     * Call this in update loop for non-blocking search
     * @param maxIterations Max nodes to process per call (default: 100)
     * @returns true if search is still in progress
     */
    public update(maxIterations: number = 100): boolean {
        if (!this.isSearching) return false;

        for (let i = 0; i < maxIterations && this.isSearching; i++) {
            this.step();
        }

        return this.isSearching;
    }

    /**
     * Stop current pathfinding operation
     */
    public stop(): void {
        this.isSearching = false;
        this.cleanup();
    }

    /**
     * Check if pathfinding is in progress
     */
    public isRunning(): boolean {
        return this.isSearching;
    }

    /**
     * Get the last pathfinding result
     */
    public getResult(): PathResult | null {
        return this.currentResult;
    }

    /**
     * Get grid dimensions
     */
    public getGridSize(): { width: number; height: number } {
        return { width: this.maxX, height: this.maxZ };
    }

    // ========================================================================
    // Private Methods
    // ========================================================================

    private startSearch(start: GridPosition, end: GridPosition): void {
        // Validate positions
        if (!this.isValidPosition(start.x, start.z)) {
            console.error(`[AStar] Invalid start position: (${start.x}, ${start.z})`);
            this.currentResult = { found: false, path: [], cost: 0 };
            return;
        }
        if (!this.isValidPosition(end.x, end.z)) {
            console.error(`[AStar] Invalid end position: (${end.x}, ${end.z})`);
            this.currentResult = { found: false, path: [], cost: 0 };
            return;
        }

        // Check if start or end is an obstacle
        if (this.grid[start.x][start.z].state === CellState.OBSTACLE) {
            console.warn(`[AStar] Start position is an obstacle`);
            this.currentResult = { found: false, path: [], cost: 0 };
            return;
        }
        if (this.grid[end.x][end.z].state === CellState.OBSTACLE) {
            console.warn(`[AStar] End position is an obstacle`);
            this.currentResult = { found: false, path: [], cost: 0 };
            return;
        }

        // Reset state
        this.cleanup();
        this.startPos = start;
        this.endPos = end;
        this.isSearching = true;
        this.currentResult = null;

        // Create start node
        const startNode = this.createNode(start.x, start.z, 0);
        startNode.opened = true;
        this.openList.push(startNode);
    }

    private step(): void {
        if (!this.isSearching || !this.endPos) return;

        // No more nodes to explore
        if (this.openList.isEmpty()) {
            this.finishSearch(false);
            return;
        }

        // Get node with lowest f cost
        const current = this.openList.pop()!;
        current.closed = true;

        // Check if we reached the goal
        if (current.x === this.endPos.x && current.z === this.endPos.z) {
            this.finishSearch(true, current);
            return;
        }

        // Explore neighbors
        this.exploreNeighbors(current);
    }

    private exploreNeighbors(current: AStarNode): void {
        for (const dir of AStar.DIRECTIONS) {
            const nx = current.x + dir.dx;
            const nz = current.z + dir.dz;

            // Skip invalid positions
            if (!this.isValidPosition(nx, nz)) continue;

            // Skip obstacles
            if (this.grid[nx][nz].state === CellState.OBSTACLE) continue;

            // Skip diagonal movement if blocked by adjacent obstacles (corner cutting)
            if (dir.cost === AStar.DIAGONAL_COST) {
                if (!this.canMoveDiagonally(current.x, current.z, dir.dx, dir.dz)) {
                    continue;
                }
            }

            // Get or create neighbor node
            let neighbor = this.grid[nx][nz].node;
            if (!neighbor) {
                neighbor = this.createNode(nx, nz, Infinity);
            }

            // Skip if already in closed list
            if (neighbor.closed) continue;

            // Calculate new g cost
            const newG = current.g + dir.cost;

            // Check if this path is better
            if (newG < neighbor.g) {
                neighbor.g = newG;
                neighbor.f = newG + neighbor.h;
                neighbor.parent = current;

                if (!neighbor.opened) {
                    neighbor.opened = true;
                    this.openList.push(neighbor);
                } else {
                    // Update position in heap
                    this.openList.update(neighbor);
                }
            }
        }
    }

    private canMoveDiagonally(x: number, z: number, dx: number, dz: number): boolean {
        // Check adjacent cells to prevent corner cutting
        const cell1 = this.grid[x + dx]?.[z];
        const cell2 = this.grid[x]?.[z + dz];

        if (!cell1 || !cell2) return false;

        return cell1.state !== CellState.OBSTACLE &&
               cell2.state !== CellState.OBSTACLE;
    }

    private createNode(x: number, z: number, g: number): AStarNode {
        const h = this.heuristic(x, z);
        const node: AStarNode = {
            x,
            z,
            g,
            h,
            f: g + h,
            parent: null,
            closed: false,
            opened: false
        };
        this.grid[x][z].node = node;
        return node;
    }

    /**
     * Heuristic function: Octile distance
     * Better than Manhattan for 8-directional movement
     */
    private heuristic(x: number, z: number): number {
        if (!this.endPos) return 0;

        const dx = Math.abs(x - this.endPos.x);
        const dz = Math.abs(z - this.endPos.z);

        // Octile distance: accounts for diagonal movement
        return AStar.STRAIGHT_COST * (dx + dz) +
               (AStar.DIAGONAL_COST - 2 * AStar.STRAIGHT_COST) * Math.min(dx, dz);
    }

    private finishSearch(found: boolean, endNode?: AStarNode): void {
        this.isSearching = false;

        if (found && endNode) {
            const path = this.reconstructPath(endNode);
            this.currentResult = {
                found: true,
                path,
                cost: endNode.g
            };
        } else {
            this.currentResult = {
                found: false,
                path: [],
                cost: 0
            };
        }

        // Trigger callback
        if (this.onPathFound) {
            this.onPathFound(this.currentResult);
            this.onPathFound = null;
        }
    }

    private reconstructPath(endNode: AStarNode): GridPosition[] {
        const path: GridPosition[] = [];
        let current: AStarNode | null = endNode;

        while (current) {
            path.unshift({ x: current.x, z: current.z });
            current = current.parent;
        }

        return path;
    }

    private cleanup(): void {
        this.openList.clear();

        // Clear node references in grid
        for (let x = 0; x < this.maxX; x++) {
            for (let z = 0; z < this.maxZ; z++) {
                if (this.grid[x]?.[z]) {
                    this.grid[x][z].node = null;
                }
            }
        }
    }

    private isValidPosition(x: number, z: number): boolean {
        return x >= 0 && x < this.maxX && z >= 0 && z < this.maxZ;
    }

    // ========================================================================
    // Utility Methods
    // ========================================================================

    /**
     * Check if a straight line path exists between two points
     * Uses Bresenham's line algorithm
     */
    public hasLineOfSight(start: GridPosition, end: GridPosition): boolean {
        let x0 = start.x;
        let z0 = start.z;
        const x1 = end.x;
        const z1 = end.z;

        const dx = Math.abs(x1 - x0);
        const dz = Math.abs(z1 - z0);
        const sx = x0 < x1 ? 1 : -1;
        const sz = z0 < z1 ? 1 : -1;
        let err = dx - dz;

        while (true) {
            if (!this.isValidPosition(x0, z0) ||
                this.grid[x0][z0].state === CellState.OBSTACLE) {
                return false;
            }

            if (x0 === x1 && z0 === z1) break;

            const e2 = 2 * err;
            if (e2 > -dz) {
                err -= dz;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                z0 += sz;
            }
        }

        return true;
    }

    /**
     * Smooth a path by removing unnecessary waypoints
     * Uses line-of-sight checks
     */
    public smoothPath(path: GridPosition[]): GridPosition[] {
        if (path.length <= 2) return path;

        const smoothed: GridPosition[] = [path[0]];
        let current = 0;

        while (current < path.length - 1) {
            let furthest = current + 1;

            // Find furthest visible point
            for (let i = path.length - 1; i > current + 1; i--) {
                if (this.hasLineOfSight(path[current], path[i])) {
                    furthest = i;
                    break;
                }
            }

            smoothed.push(path[furthest]);
            current = furthest;
        }

        return smoothed;
    }

    /**
     * Get all walkable neighbors of a position
     */
    public getWalkableNeighbors(pos: GridPosition): GridPosition[] {
        const neighbors: GridPosition[] = [];

        for (const dir of AStar.DIRECTIONS) {
            const nx = pos.x + dir.dx;
            const nz = pos.z + dir.dz;

            if (this.isValidPosition(nx, nz) &&
                this.grid[nx][nz].state === CellState.WALKABLE) {
                neighbors.push({ x: nx, z: nz });
            }
        }

        return neighbors;
    }

    /**
     * Calculate the distance between two positions
     */
    public static distance(a: GridPosition, b: GridPosition): number {
        const dx = Math.abs(a.x - b.x);
        const dz = Math.abs(a.z - b.z);
        return AStar.STRAIGHT_COST * (dx + dz) +
               (AStar.DIAGONAL_COST - 2 * AStar.STRAIGHT_COST) * Math.min(dx, dz);
    }
}
