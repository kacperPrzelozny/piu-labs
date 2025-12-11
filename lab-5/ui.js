export class UI {
    constructor(store) {
        this.store = store;
        this.container = document.getElementById('shapes-container');
        this.countSquare = document.getElementById('count-square');
        this.countCircle = document.getElementById('count-circle');
        
        this.initEventListeners();
        this.update(store.state);
    }

    initEventListeners() {
        document.getElementById('add-square').addEventListener('click', () => {
            this.store.addShape('square');
        });

        document.getElementById('add-circle').addEventListener('click', () => {
            this.store.addShape('circle');
        });

        document.getElementById('recolor-square').addEventListener('click', () => {
            this.store.recolor('square');
        });

        document.getElementById('recolor-circle').addEventListener('click', () => {
            this.store.recolor('circle');
        });

        this.container.addEventListener('click', (e) => {
            const shapeEl = e.target.closest('.shape');
            if (shapeEl) {
                const id = shapeEl.dataset.id;
                this.store.removeShape(id);
            }
        });
    }

    update(state) {
        this.updateCounters();
        this.updateList(state.shapes);
    }

    updateCounters() {
        const counts = this.store.getCounts();
        this.countSquare.textContent = counts.square;
        this.countCircle.textContent = counts.circle;
    }

    updateList(shapes) {
        const currentElements = Array.from(this.container.children);
        const currentIds = currentElements.map(el => el.dataset.id);
        const newIds = shapes.map(s => s.id);

        currentElements.forEach(el => {
            if (!newIds.includes(el.dataset.id)) {
                el.remove();
            }
        });

        shapes.forEach(shape => {
            let el = this.container.querySelector(`[data-id="${shape.id}"]`);
            
            if (!el) {
                el = document.createElement('div');
                el.className = `shape ${shape.type}`;
                el.dataset.id = shape.id;
                el.style.backgroundColor = shape.color;
                this.container.appendChild(el);
            } else {
                if (el.style.backgroundColor !== shape.color) {
                    el.style.backgroundColor = shape.color;
                }
            }
        });
    }
}