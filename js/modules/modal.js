export const initModal = () => {
    let currentSelectingTarget = null;
    const modal = document.getElementById('team-modal');
    const searchInput = document.getElementById('team-search-input');

    const filterTeams = (query) => {
        const q = query.toLowerCase().trim();
        const pinnedSection = document.getElementById('section-pinned');
        
        if (pinnedSection) {
            pinnedSection.style.display = q.length > 0 ? 'none' : 'block';
        }

        document.querySelectorAll('.team-card').forEach(card => {
            const name = card.querySelector('span').textContent.toLowerCase();
            card.style.display = name.includes(q) ? 'flex' : 'none';
        });
    };

    const openTeamModal = (targetType) => {
        currentSelectingTarget = targetType;
        if (searchInput) {
            searchInput.value = '';
            filterTeams('');
        }
        modal?.classList.add('active');
        setTimeout(() => searchInput?.focus(), 100);
    };

    const closeTeamModal = () => {
        modal?.classList.remove('active');
    };

    document.getElementById('btn-open-modal-home')?.addEventListener('click', () => openTeamModal('home'));
    document.getElementById('btn-open-modal-away')?.addEventListener('click', () => openTeamModal('away'));
    document.getElementById('modal-close-btn')?.addEventListener('click', closeTeamModal);

    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeTeamModal();
    });

    document.querySelectorAll('.team-card').forEach(card => {
        card.addEventListener('click', () => {
            if (!currentSelectingTarget) return;

            const teamName = card.dataset.team;
            const logoFileName = card.dataset.logo;
            const type = currentSelectingTarget;

            document.getElementById(`input-${type}-name`).value = teamName.toUpperCase();
            document.getElementById(`display-${type}-name`).textContent = teamName.toUpperCase();
            document.getElementById(`display-${type}-logo`).src = `logos/${logoFileName}`;

            closeTeamModal();
        });
    });

    searchInput?.addEventListener('input', (e) => filterTeams(e.target.value));
};