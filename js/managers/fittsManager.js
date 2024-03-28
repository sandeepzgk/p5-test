class FittsManager {
    static instance;

    constructor() {
        if (FittsManager.instance) {
            return FittsManager.instance;
        }
        FittsManager.instance = this;
    }

    static randomAB(a, b) {
        return Math.random() * (b - a) + a;
    }

    static projectPointOnLine(p0, p1, q) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const l2 = dx * dx + dy * dy;
        if (l2 === 0) return p0; // p0 and p1 are the same point

        const t = ((q.x - p0.x) * dx + (q.y - p0.y) * dy) / l2;
        return {
            x: p0.x + t * dx,
            y: p0.y + t * dy
        };
    }

    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    static isLeft(p0, p1, p2) {
        return ((p1.x - p0.x) * (p2.y - p0.y) - (p2.x - p0.x) * (p1.y - p0.y));
    }

    static minus(v1, v2) {
        return { x: v1.x - v2.x, y: v1.y - v2.y };
    }

    static distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static mean(points) {
        const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        return { x: sum.x / points.length, y: sum.y / points.length };
    }

    static variance(points, mean) {
        const sum = points.reduce((acc, p) => acc + Math.pow(FittsManager.distance(p, mean), 2), 0);
        return sum / points.length;
    }

    static covariance(points1, mean1, points2, mean2) {
        if (points1.length !== points2.length) throw new Error("Points arrays must have the same length.");
        let sum = 0;
        for (let i = 0; i < points1.length; i++) {
            sum += FittsManager.dot(FittsManager.minus(points1[i], mean1), FittsManager.minus(points2[i], mean2));
        }
        return sum / points1.length;
    }

    static shannonsIndexDifficulty(distance, width) {
        return Math.log2(distance / width + 1);
    }

    static effectiveWidth(sigma) {
        return 4.133 * sigma;
    }

    static fittsIndexDifficulty(meanDistance, effectiveWidth) {
        return Math.log2(meanDistance / effectiveWidth + 1);
    }

    static pathLength(points) {
        let length = 0;
        for (let i = 0; i < points.length - 1; i++) {
            length += this.distance(points[i], points[i + 1]);
        }
        return length;
    }

    static pathEfficiency(pathLength, targetDistance) {
        return targetDistance / pathLength;
    }

    static clickEfficiency(pathLength, targetWidth) {
        return targetWidth / pathLength;
    }
}

// Fitts manager
const fittsManager = new FittsManager();
