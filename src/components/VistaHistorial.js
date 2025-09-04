import { memo } from 'react';

import { History } from 'lucide-react';



const VistaHistorial = memo(({ historial, setHistorial }) => {

    const limpiarHistorial = () => {

        setHistorial([]);

        localStorage.removeItem('ruletaPremios');

    };



    return (

        <div className="pb-20">

            <div className="flex items-center justify-between mb-6">

                <h2 className="ruleta-title" style={{ fontSize: '2rem', marginBottom: '0' }}>

                    📚 Historial de Sorteos

                </h2>

                {historial.length > 0 && (

                    <button

                        onClick={limpiarHistorial}

                        style={{

                            background: 'rgba(239, 68, 68, 0.2)',

                            color: '#fca5a5',

                            border: 'none',

                            padding: '8px 12px',

                            borderRadius: '8px',

                            fontSize: '12px',

                            cursor: 'pointer'

                        }}

                    >

                        Limpiar

                    </button>

                )}

            </div>



            {historial.length === 0 ? (

                <div className="text-center" style={{ color: 'rgba(255, 255, 255, 0.7)', padding: '96px 0' }}>

                    <History size={64} style={{ margin: '0 auto 16px', opacity: 0.5 }} />

                    <p style={{ fontSize: '20px', marginBottom: '8px' }}>No hay sorteos registrados</p>

                </div>

            ) : (

                <div className="space-y-4">

                    {historial.map((entrada, idx) => (

                        <div key={entrada.id} className="glass-card" style={{ marginBottom: '16px' }}>

                            <div className="flex items-center justify-between mb-4">

                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', fontWeight: '500' }}>

                                    {entrada.fecha}

                                </div>

                                <div style={{

                                    background: '#3b82f6',

                                    color: 'white',

                                    fontSize: '12px',

                                    padding: '4px 8px',

                                    borderRadius: '999px'

                                }}>

                                    #{historial.length - idx}

                                </div>

                            </div>



                            <div className="space-y-4">

                                {entrada.ganadores.map((ganador, gIdx) => (

                                    <div key={`historial-${entrada.id}-ganador-${gIdx}`} className="flex items-center justify-between" style={{

                                        background: 'rgba(255, 255, 255, 0.1)',

                                        borderRadius: '12px',

                                        padding: '12px'

                                    }}>

                                        <div className="flex items-center gap-2">

                                            <span style={{ fontSize: '24px' }}>

                                                {ganador.posicion === 1 ? '🥇' : ganador.posicion === 2 ? '🥈' : ganador.posicion === 3 ? '🥉' : '🏆'}

                                            </span>

                                            <span className="text-white font-bold">

                                                {ganador.ganador}

                                            </span>

                                        </div>

                                        <span className="text-yellow" style={{ fontSize: '14px', fontWeight: '500' }}>

                                            {ganador.premio}

                                        </span>

                                    </div>

                                ))}

                            </div>



                            <div className="flex justify-between" style={{

                                color: 'rgba(255, 255, 255, 0.5)',

                                fontSize: '12px',

                                marginTop: '12px'

                            }}>

                                <span>{entrada.totalParticipantes} participantes</span>

                                <span>{entrada.ganadores.length} ganador{entrada.ganadores.length === 1 ? '' : 'es'}</span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

});



VistaHistorial.displayName = 'VistaHistorial';



export default VistaHistorial;