import { memo } from 'react';
import { Play, Settings, Gift, History } from 'lucide-react';

const NavigationBar = memo(({ vistaActiva, setVistaActiva }) => {
    const navegacionItems = [
        { id: 'ruleta', icon: Play, label: 'Ruleta' },
        { id: 'config', icon: Settings, label: 'Config' },
        { id: 'premios', icon: Gift, label: 'Premios' },
        // { id: 'historial', icon: History, label: 'Historial' }
    ];

    return (
        <div className="nav-bar">
            <div className="nav-container">
                {navegacionItems.map(({ id, icon: Icon, label }) => (
                    <button
                        key={id}
                        onClick={() => setVistaActiva(id)}
                        className={`nav-button ${vistaActiva === id ? 'active' : ''}`}
                    >
                        <Icon size={20} className="nav-icon" />
                        <span className="nav-label">{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;