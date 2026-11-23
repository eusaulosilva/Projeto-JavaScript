(function () {
    'use strict';

    if (typeof document === 'undefined') return;

    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('tool-search');
        const filterButtons = Array.from(document.querySelectorAll('.filter-pill'));
        const cards = Array.from(document.querySelectorAll('.tool-card'));
        const emptyState = document.getElementById('empty-state');

        let activeCategory = 'all';

        function normalize(text) {
            return text
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        }

        function applyFilters() {
            const query = normalize(searchInput ? searchInput.value.trim() : '');
            let visibleCount = 0;

            cards.forEach((card) => {
                const category = card.dataset.category || '';
                const searchable = normalize(card.textContent + ' ' + (card.dataset.keywords || ''));
                const matchesCategory = activeCategory === 'all' || category === activeCategory;
                const matchesQuery = query === '' || searchable.includes(query);
                const visible = matchesCategory && matchesQuery;

                card.hidden = !visible;
                if (visible) visibleCount += 1;
            });

            if (emptyState) {
                emptyState.hidden = visibleCount > 0;
            }
        }

        filterButtons.forEach((button) => {
            button.addEventListener('click', () => {
                activeCategory = button.dataset.filter || 'all';
                filterButtons.forEach((btn) => {
                    const isCurrent = btn === button;
                    btn.classList.toggle('is-active', isCurrent);
                    btn.setAttribute('aria-pressed', String(isCurrent));
                });
                applyFilters();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', applyFilters);
        }
    });
})();

