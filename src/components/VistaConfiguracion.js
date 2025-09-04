import { memo, useRef } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const VistaConfiguracion = memo(({
                                     participantes,
                                     nuevoParticipante,
                                     setNuevoParticipante,
                                     agregarParticipante,
                                     eliminarParticipante,
                                     colores
                                 }) => {
    const inputRef = useRef(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            agregarParticipante();
            // Mantener foco después de agregar
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 50);
        }
    };

    const handleAgregar = () => {
        agregarParticipante();
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
    };

    return (
        <div className="pb-20">
            <h2 className="ruleta-title" style={{ fontSize: '2rem', marginBottom: '24px' }}>
                ⚙️ Configuración
            </h2>

            <div className="glass-card">
                <h3 className="text-white font-bold mb-4 flex items-center">
                    Participantes
                    <span style={{
                        marginLeft: 'auto',
                        fontSize: '12px',
                        background: '#3b82f6',
                        padding: '4px 8px',
                        borderRadius: '999px'
                    }}>
                        {participantes.length}
                    </span>
                </h3>

                <div className="form-row">
                    <input
                        ref={inputRef}
                        type="text"
                        value={nuevoParticipante}
                        onChange={(e) => setNuevoParticipante(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="input-field"
                        maxLength={15}
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <button
                        onClick={handleAgregar}
                        disabled={!nuevoParticipante.trim() || participantes.includes(nuevoParticipante.trim())}
                        className="btn-add"
                        type="button"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="list-container">
                    {participantes.map((participante, index) => (
                        <div key={`participant-${index}-${participante}`} className="list-item">
                            <div className="list-item-content">
                                <div
                                    className="color-dot"
                                    style={{ backgroundColor: colores[index % colores.length] }}
                                />
                                <span>{participante}</span>
                            </div>
                            {participantes.length > 2 && (
                                <button
                                    onClick={() => eliminarParticipante(index)}
                                    className="delete-btn"
                                    type="button"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {participantes.length <= 2 && (
                    <p className="text-yellow" style={{ fontSize: '14px', marginTop: '16px' }}>
                        Se requieren por lo menos 3 participantes
                    </p>
                )}
            </div>
        </div>
    );
});

VistaConfiguracion.displayName = 'VistaConfiguracion';

export default VistaConfiguracion;