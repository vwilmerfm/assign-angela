import { memo } from 'react';
import { Play, RotateCcw, Trophy, Users, Volume2, VolumeX } from 'lucide-react';

const VistaRuleta = memo(({
                              sonidoHabilitado,
                              setSonidoHabilitado,
                              ruletaRef,
                              anguloActual,
                              girando,
                              animandoGiro,
                              numeroGanadores,
                              setNumeroGanadores,
                              participantes,
                              mostrandoResultado,
                              ganadores,
                              girarRuleta,
                              reiniciarRuleta,
                              velocidadGiro,
                              efectoArdillaSecreta
                          }) => {
    // Depuración detallada
    console.log('Props recibidas en VistaRuleta:', {
        participantes,
        ganadores,
        mostrandoResultado,
        typeofParticipantes: typeof participantes,
        typeofGanadores: typeof ganadores
    });

    // Función para crear segmentos de la ruleta dentro de VistaRuleta
    const crearSegmentosRuleta = () => {
        if (!participantes || participantes.length === 0) return null;

        const segmentoPorParticipante = 360 / participantes.length;
        const colores = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
            '#F1948A', '#85C1E9', '#F8D7DA', '#D5DBDB', '#AED6F1', '#A9DFBF'
        ];

        return participantes.map((participante, index) => {
            const anguloInicio = index * segmentoPorParticipante;
            const anguloFin = (index + 1) * segmentoPorParticipante;
            const anguloMedio = (anguloInicio + anguloFin) / 2;

            const radianes1 = (anguloInicio * Math.PI) / 180;
            const radianes2 = (anguloFin * Math.PI) / 180;

            const radio = 140;
            const x1 = 150 + radio * Math.cos(radianes1);
            const y1 = 150 + radio * Math.sin(radianes1);
            const x2 = 150 + radio * Math.cos(radianes2);
            const y2 = 150 + radio * Math.sin(radianes2);

            const largeArcFlag = segmentoPorParticipante > 180 ? 1 : 0;
            const pathData = `M 150 150 L ${x1} ${y1} A ${radio} ${radio} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            const radioTexto = 90;
            const xTexto = 150 + radioTexto * Math.cos((anguloMedio * Math.PI) / 180);
            const yTexto = 150 + radioTexto * Math.sin((anguloMedio * Math.PI) / 180);

            // Determinar el texto a mostrar: participante por defecto, premio si hay resultado
            let textoSegmento = participante.length > 8 ? `${participante.slice(0, 8)}...` : participante;
            if (mostrandoResultado && ganadores && ganadores.length > 0) {
                const ganador = ganadores.find(g => g.ganador === participante);
                if (ganador) {
                    textoSegmento = ganador.premio.length > 8 ? `${ganador.premio.slice(0, 8)}...` : ganador.premio;
                }
            }

            return (
                <g key={index}>
                    <path
                        d={pathData}
                        fill={colores[index % colores.length]}
                        stroke="white"
                        strokeWidth="3"
                    />
                    <text
                        x={xTexto}
                        y={yTexto}
                        fill="white"
                        fontSize={participantes.length > 8 ? "10" : "12"}
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${anguloMedio}, ${xTexto}, ${yTexto})`}
                    >
                        {textoSegmento}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className="pb-20">
            <div className="sound-toggle">
                <button
                    onClick={() => setSonidoHabilitado(!sonidoHabilitado)}
                    className={`sound-btn ${sonidoHabilitado ? 'enabled' : 'disabled'}`}
                >
                    {sonidoHabilitado ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                <button
                    onClick={efectoArdillaSecreta}
                    className="boton-misterioso"
                    title="Osito? 🤔"
                >
                    ✨
                </button>
            </div>

            <div className="ruleta-wrapper">
                <div className="ruleta-shadow"></div>

                <svg
                    ref={ruletaRef}
                    width="300"
                    height="300"
                    className="ruleta-svg"
                    style={{
                        transform: `rotate(${anguloActual}deg)`,
                        transformOrigin: '150px 150px'
                    }}
                >
                    <circle cx="150" cy="150" r="148" fill="white" stroke="#333" strokeWidth="6"/>
                    {crearSegmentosRuleta()}
                    <circle cx="150" cy="150" r="25" fill="#333" stroke="white" strokeWidth="3"/>
                    <circle cx="150" cy="150" r="15" fill="gold" stroke="#333" strokeWidth="2"/>
                    <text x="150" y="157" textAnchor="middle" fill="#333" fontSize="12" fontWeight="bold">
                        ★
                    </text>
                </svg>

                <div className="aguja-container">
                    <div className="aguja"></div>
                </div>

                {(girando || animandoGiro) && (
                    <div className="girando-overlay">
                    </div>
                )}
            </div>

            <div className="glass-card slider-container">
                <label className="slider-label">
                    <Users size={18} />
                    Nro de ganadores: <span className="text-yellow">{numeroGanadores}</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max={Math.min(10, participantes.length)}
                    value={numeroGanadores}
                    onChange={(e) => setNumeroGanadores(parseInt(e.target.value))}
                    className="slider"
                />
                <div className="slider-info">
                    <span>1</span>
                    <span>{Math.min(10, participantes.length)}</span>
                </div>
            </div>

            {mostrandoResultado && ganadores.length > 0 && (
                <div className="glass-card ganadores-card">
                    <h2 className="ganadores-title">
                        <Trophy size={24} />
                        Ganadores
                    </h2>
                    <div className="space-y-4">
                        {ganadores.map((item, index) => (
                            <div key={`ganador-${index}-${item.ganador}`} className="ganador-item">
                                <div className="ganador-info">
                                    <h3>🏆 #{item.posicion} {item.ganador}</h3>
                                    <p>{item.cantidad} {item.premio}</p>
                                </div>
                                <div className="ganador-medal">
                                    {item.posicion === 1 ? '🥇' : item.posicion === 2 ? '🥈' : item.posicion === 3 ? '🥉' : '🏆'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <button
                    onClick={girarRuleta}
                    disabled={girando || participantes.length < numeroGanadores || animandoGiro}
                    className="btn-girar"
                >
                    <Play size={28} />
                    {(girando || animandoGiro) ? 'Girando..' : 'Girar'}
                </button>

                <button onClick={reiniciarRuleta} className="btn-secondary">
                    <RotateCcw size={20} />
                    Reiniciar
                </button>
            </div>
        </div>
    );
});

VistaRuleta.displayName = 'VistaRuleta';

export default VistaRuleta;