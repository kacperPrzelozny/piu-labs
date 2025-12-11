import { store } from './store.js';
import { UI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI(store);
    store.subscribe(ui);
});