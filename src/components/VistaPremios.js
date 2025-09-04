import { memo, useRef } from 'react';
import { Plus, Trash2, Gift } from 'lucide-react';

const VistaPremios = memo(({
                               premios,
                               nuevoPremio,
                               setNuevoPremio,
                               cantidadPremio,
                               setCantidadPremio,
                               agregarPremio,
                               eliminarPremio
                           }) => {
    const inputPremioRef = useRef(null);
    const inputCantidadRef = useRef(null);

    const handleKeyPressPremio = (e) => {
        if (e.key === 'Enter') {
            if (nuevoPremio.trim()) {
                agregarPremio();
                setTimeout(() => {
                    if (inputPremioRef.current) {
                        inputPremioRef.current.focus();
                    }
                }, 50);
            }
        }
    };

    const handleAgregar = () => {
        if (nuevoPremio.trim()) {
            agregarPremio();
            setTimeout(() => {
                if (inputPremioRef.current) {
                    inputPremioRef.current.focus();
                }
            }, 50);
        }
    };

    return (
        <div className="pb-20">
            <h2 className="ruleta-title" style={{ fontSize: '2rem', marginBottom: '24px' }}>
                🎁 Premios
            </h2>

            <div className="glass-card">
                <h3 className="text-white font-bold mb-4">
                    Agregar Premio
                </h3>

                <div style={{ marginBottom: '16px' }}>
                    <input
                        ref={inputPremioRef}
                        type="text"
                        value={nuevoPremio}
                        onChange={(e) => setNuevoPremio(e.target.value)}
                        onKeyPress={handleKeyPressPremio}
                        className="input-field"
                        maxLength={30}
                        style={{ width: '100%', marginBottom: '12px' }}
                        autoComplete="off"
                        spellCheck="false"
                    />

                    <div className="flex items-center gap-2">
                        <label className="text-white font-bold">Cantidad:</label>
                        <input
                            ref={inputCantidadRef}
                            type="number"
                            min="1"
                            value={cantidadPremio}
                            onChange={(e) => {
                                const valor = e.target.value;
                                setCantidadPremio(valor);
                            }}
                            onBlur={(e) => {
                                let valor = parseInt(e.target.value);
                                if (isNaN(valor) || valor < 1) {
                                    setCantidadPremio(1);
                                } else {
                                    setCantidadPremio(valor);
                                }
                            }}
                            className="input-field"
                            style={{ width: '80px', textAlign: 'center' }}
                        />
                        <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>unidades</span>
                        <button
                            onClick={handleAgregar}
                            disabled={!nuevoPremio.trim()}
                            className="btn-add"
                            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                            type="button"
                        >
                            <Plus size={18} />
                            Agregar
                        </button>
                    </div>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 flex items-center">
                        Premios configurados
                        <span style={{
                            marginLeft: 'auto',
                            fontSize: '12px',
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '999px'
                        }}>
                            {premios.length}
                        </span>
                    </h4>
                    {premios.map((premio, index) => (
                        <div key={`premio-${index}-${premio.nombre}`} className="list-item" style={{ marginBottom: '12px' }}>
                            <div>
                                <div className="text-white font-bold" style={{ fontSize: '16px' }}>{premio.nombre}</div>
                                <div className="text-yellow" style={{ fontSize: '11px', fontWeight: '600' }}>
                                    Total: <b>{premio.cantidad}</b>
                                </div>
                            </div>
                            <button
                                onClick={() => eliminarPremio(index)}
                                className="delete-btn"
                                type="button"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    {premios.length === 0 && (
                        <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.6)', padding: '48px 0' }}>
                            <Gift size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
                            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No hay premios</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

VistaPremios.displayName = 'VistaPremios';

export default VistaPremios;