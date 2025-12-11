import { generateId, getRandomColor } from './helpers.js';

class Store {
    constructor() {
        this.subscribers = [];
        this.state = {
            shapes: []
        };
        this.init();
    }

    init() {
        const savedState = localStorage.getItem('shapesAppState');
        if (savedState) {
            this.state = JSON.parse(savedState);
        }
    }

    subscribe(observer) {
        this.subscribers.push(observer);
    }

    notify() {
        localStorage.setItem('shapesAppState', JSON.stringify(this.state));
        this.subscribers.forEach(observer => observer.update(this.state));
    }

    getShapes() {
        return this.state.shapes;
    }

    getCounts() {
        return this.state.shapes.reduce((acc, shape) => {
            acc[shape.type] = (acc[shape.type] || 0) + 1;
            return acc;
        }, { square: 0, circle: 0 });
    }

    addShape(type) {
        const newShape = {
            id: generateId(),
            type: type,
            color: getRandomColor()
        };
        this.state.shapes.push(newShape);
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter(shape => shape.id !== id);
        this.notify();
    }

    recolor(type) {
        this.state.shapes = this.state.shapes.map(shape => {
            if (shape.type === type) {
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });
        this.notify();
    }
}

export const store = new Store();