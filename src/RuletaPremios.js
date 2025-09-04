import { useState, useRef, useCallback, useEffect } from 'react';
import './RuletaPremios.css';

// Importar componentes
import VistaRuleta from './components/VistaRuleta';
import VistaConfiguracion from './components/VistaConfiguracion';
import VistaPremios from './components/VistaPremios';
import VistaHistorial from './components/VistaHistorial';
import NavigationBar from './components/NavigationBar';

const RuletaPremios = () => {
    // Estados principales
    const [participantes, setParticipantes] = useState(['Carmen', 'Ivan', 'Jose', 'Marcelo', 'Pedro', 'Karen', 'Pamela']);
    const [premios, setPremios] = useState([
        { nombre: '1mer Mayor', cantidad: 1 },
        { nombre: '2do Premio', cantidad: 2 }
    ]);
    const [numeroGanadores, setNumeroGanadores] = useState(1);
    const [nuevoParticipante, setNuevoParticipante] = useState('');
    const [nuevoPremio, setNuevoPremio] = useState('');
    const [cantidadPremio, setCantidadPremio] = useState('1'); // String en lugar de number

    // Estados de la ruleta
    const [girando, setGirando] = useState(false);
    const [ganadores, setGanadores] = useState([]);
    const [anguloActual, setAnguloActual] = useState(0);
    const [velocidadGiro, setVelocidadGiro] = useState(0);
    const [animandoGiro, setAnimandoGiro] = useState(false);
    const [mostrandoResultado, setMostrandoResultado] = useState(false);
    const [animacionActiva, setAnimacionActiva] = useState('');
    const [sonidoHabilitado, setSonidoHabilitado] = useState(true);

    // Estados de UI
    const [vistaActiva, setVistaActiva] = useState('ruleta');
    const [historial, setHistorial] = useState([]);

    const ruletaRef = useRef(null);
    const audioContextRef = useRef(null);

    const [mostrarArdillaSecreta, setMostrarArdillaSecreta] = useState(false);

    // Colores para la ruleta (pasados como prop si es necesario)
    const colores = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
        '#F1948A', '#85C1E9', '#F8D7DA', '#D5DBDB', '#AED6F1', '#A9DFBF'
    ];

    // Cargar datos del localStorage
    useEffect(() => {
        const datosGuardados = localStorage.getItem('ruletaPremios');
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                setHistorial(datos.historial || []);
            } catch (e) {
                console.error('Error cargando datos:', e);
            }
        }
    }, []);

    // Crear contexto de audio
    useEffect(() => {
        if (sonidoHabilitado && !audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.log('Audio no disponible');
            }
        }
    }, [sonidoHabilitado]);

    // Funciones de sonido
    const reproducirSonido = useCallback((frecuencia, duracion, tipo = 'sine') => {
        if (!sonidoHabilitado || !audioContextRef.current) return;

        try {
            const oscilador = audioContextRef.current.createOscillator();
            const ganancia = audioContextRef.current.createGain();

            oscilador.connect(ganancia);
            ganancia.connect(audioContextRef.current.destination);

            oscilador.frequency.setValueAtTime(frecuencia, audioContextRef.current.currentTime);
            oscilador.type = tipo;

            ganancia.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
            ganancia.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duracion);

            oscilador.start(audioContextRef.current.currentTime);
            oscilador.stop(audioContextRef.current.currentTime + duracion);
        } catch (e) {
            console.log('Error reproduciendo sonido');
        }
    }, [sonidoHabilitado]);

    const sonidoSuspenso = useCallback(() => {
        if (!sonidoHabilitado) return;

        let frecuencia = 80;
        const intervalo = setInterval(() => {
            reproducirSonido(frecuencia, 0.1, 'square');
            frecuencia += 5;
            if (frecuencia > 200) {
                clearInterval(intervalo);
                setTimeout(() => {
                    reproducirSonido(523, 0.5, 'triangle');
                    setTimeout(() => reproducirSonido(659, 0.5, 'triangle'), 200);
                    setTimeout(() => reproducirSonido(784, 1, 'triangle'), 400);
                }, 100);
            }
        }, 150);
    }, [sonidoHabilitado, reproducirSonido]);

    const sonidoCelebracion = useCallback(() => {
        if (!sonidoHabilitado) return;

        const notas = [262, 330, 392, 523, 659, 784];
        notas.forEach((nota, index) => {
            setTimeout(() => reproducirSonido(nota, 0.3, 'triangle'), index * 100);
        });
    }, [sonidoHabilitado, reproducirSonido]);

    const efectoArdillaSecreta = useCallback(() => {
        setMostrarArdillaSecreta(true);
        sonidoCelebracion();
        setTimeout(() => setMostrarArdillaSecreta(false), 8000);
    }, [sonidoCelebracion]);

    // Efectos de celebración
    const efectoConfetti = useCallback(() => {
        setAnimacionActiva('confetti');
        sonidoCelebracion();
        setTimeout(() => setAnimacionActiva(''), 4000);
    }, [sonidoCelebracion]);

    const efectoArdillaBailando = useCallback(() => {
        setAnimacionActiva('ardilla');
        sonidoCelebracion();
        setTimeout(() => setAnimacionActiva(''), 6000);
    }, [sonidoCelebracion]);

    const efectoFocaAplaudiendo = useCallback(() => {
        setAnimacionActiva('foca');
        sonidoCelebracion();
        setTimeout(() => setAnimacionActiva(''), 5000);
    }, [sonidoCelebracion]);

    const efectoFuegosArtificiales = useCallback(() => {
        setAnimacionActiva('fuegos');
        sonidoCelebracion();
        setTimeout(() => setAnimacionActiva(''), 6000);
    }, [sonidoCelebracion]);

    // Procesar resultados del sorteo
    const procesarResultados = useCallback(() => {
        const participantesDisponibles = [...participantes];
        const ganadoresSeleccionados = [];

        for (let i = 0; i < numeroGanadores && participantesDisponibles.length > 0; i++) {
            const indiceAleatorio = Math.floor(Math.random() * participantesDisponibles.length);
            ganadoresSeleccionados.push(participantesDisponibles.splice(indiceAleatorio, 1)[0]);
        }

        const premiosAsignados = [];
        let indicePremio = 0;

        ganadoresSeleccionados.forEach((ganador, index) => {
            let cantidad = 1; // Valor por defecto para "Premio Participación"
            let premioNombre = '🎈 Premio Participación';

            if (indicePremio < premios.length) {
                if (premiosAsignados.filter(p => p.premio === premios[indicePremio].nombre).length < premios[indicePremio].cantidad) {
                    premioNombre = premios[indicePremio].nombre;
                    cantidad = premios[indicePremio].cantidad;
                } else {
                    indicePremio++;
                    if (indicePremio < premios.length) {
                        premioNombre = premios[indicePremio].nombre;
                        cantidad = premios[indicePremio].cantidad;
                    }
                }
            }

            premiosAsignados.push({
                ganador,
                premio: premioNombre,
                cantidad, // Añadir cantidad
                posicion: index + 1
            });
        });

        setGanadores(premiosAsignados);
        setGirando(false);
        setMostrandoResultado(true);

        const nuevoHistorial = [{
            fecha: new Date().toLocaleString(),
            ganadores: premiosAsignados,
            premio: 'Sorteo General',
            totalParticipantes: participantes.length,
            id: Date.now()
        }, ...historial].slice(0, 20);

        setHistorial(nuevoHistorial);
        localStorage.setItem('ruletaPremios', JSON.stringify({ historial: nuevoHistorial }));

        setTimeout(() => {
            const efectos = [efectoConfetti, efectoArdillaBailando, efectoFocaAplaudiendo, efectoFuegosArtificiales];
            const efectoRandom = efectos[Math.floor(Math.random() * efectos.length)];
            efectoRandom();
        }, 500);
    }, [participantes, numeroGanadores, premios, historial, efectoConfetti, efectoArdillaBailando, efectoFocaAplaudiendo, efectoFuegosArtificiales]);

    // Animación manual de la ruleta
    useEffect(() => {
        let animationFrame;

        const animar = () => {
            if (animandoGiro && velocidadGiro > 0) {
                setAnguloActual(prev => prev + velocidadGiro);

                setVelocidadGiro(prev => {
                    const nuevaVelocidad = Math.max(0, prev * 0.98);

                    if (nuevaVelocidad <= 0.5) {
                        setAnimandoGiro(false);
                        setTimeout(() => procesarResultados(), 100);
                        return 0;
                    }
                    return nuevaVelocidad;
                });

                animationFrame = requestAnimationFrame(animar);
            }
        };

        if (animandoGiro) {
            animationFrame = requestAnimationFrame(animar);
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [animandoGiro, velocidadGiro, procesarResultados]);

    const agregarParticipante = useCallback(() => {
        if (nuevoParticipante.trim() && !participantes.includes(nuevoParticipante.trim())) {
            setParticipantes(prev => [...prev, nuevoParticipante.trim()]);
            setNuevoParticipante('');
        }
    }, [nuevoParticipante, participantes]);

    const eliminarParticipante = useCallback((index) => {
        if (participantes.length > 2) {
            setParticipantes(participantes.filter((_, i) => i !== index));
        }
    }, [participantes]);

    const agregarPremio = useCallback(() => {
        if (nuevoPremio.trim()) {
            setPremios(prev => [...prev, { nombre: nuevoPremio.trim(), cantidad: parseInt(cantidadPremio) || 1 }]);
            setNuevoPremio('');
            setCantidadPremio('1');
        }
    }, [nuevoPremio, cantidadPremio]);

    const eliminarPremio = useCallback((index) => {
        setPremios(premios.filter((_, i) => i !== index));
    }, [premios]);

    const girarRuleta = useCallback(() => {
        if (girando || participantes.length < numeroGanadores || animandoGiro) return;

        setGirando(true);
        setGanadores([]);
        setMostrandoResultado(false);

        sonidoSuspenso();

        setAnimandoGiro(true);
        setVelocidadGiro(25);
    }, [girando, participantes, numeroGanadores, animandoGiro, sonidoSuspenso]);

    const reiniciarRuleta = useCallback(() => {
        setAnguloActual(0);
        setVelocidadGiro(0);
        setAnimandoGiro(false);
        setGanadores([]);
        setGirando(false);
        setMostrandoResultado(false);
        setAnimacionActiva('');
    }, []);

    // Componente de efectos
    const AnimacionEfecto = () => {
        if (!animacionActiva) return null;

        return (
            <div className="efecto-overlay">
                <div className="efecto-bg" />

                <div className="efecto-content">
                    {animacionActiva === 'confetti' && (
                        <div>
                            <div style={{ fontSize: '120px', animation: 'bounce 1s infinite' }}>🎉</div>
                            <div className="efecto-texto">
                                Felicidades :)
                            </div>
                        </div>
                    )}

                    {animacionActiva === 'ardilla' && (
                        <div>
                            <div className="efecto-ardilla">🐿️</div>
                            <div className="efecto-texto">
                                Ja,ja..ay no
                            </div>
                            <div className="efecto-musica">
                                {['🎵', '🎶', '🎼', '🎺', '🎸', '🎤'].map((nota, i) => (
                                    <span
                                        key={i}
                                        className="nota-musical"
                                        style={{ animationDelay: `${i * 0.1}s` }}
                                    >
                                        {nota}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {animacionActiva === 'foca' && (
                        <div>
                            <div style={{ fontSize: '120px', animation: 'bounce 0.6s infinite' }}>🦭</div>
                            <div className="efecto-texto">
                                Foca aplaudiendo, ja,ja
                            </div>
                            <div className="efecto-musica">
                                {[...Array(4)].map((_, i) => (
                                    <span
                                        key={i}
                                        style={{
                                            fontSize: '60px',
                                            animation: 'pulse 0.8s infinite',
                                            animationDelay: `${i * 0.2}s`
                                        }}
                                    >
                                        👏
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {animacionActiva === 'fuegos' && (
                        <div>
                            <div style={{ fontSize: '100px', animation: 'bounce 1s infinite' }}>🎆</div>
                            <div className="efecto-texto">
                                Felicidades ;)
                            </div>
                        </div>
                    )}

                    {mostrarArdillaSecreta && (
                        <div className="ardilla-secreta-overlay">
                            <div className="ardilla-secreta-bg" />

                            <div className="ardilla-secreta-content">
                                <div className="ardilla-especial">🐿️</div>

                                <div className="texto-misterioso">
                                    ¡Ardilla Súper Secreta Descubierta!
                                </div>

                                {/* Explosión de elementos alrededor */}
                                <div className="explosion-elementos">
                                    {[...Array(20)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="elemento-flotante"
                                            style={{
                                                top: `${20 + Math.random() * 60}%`,
                                                left: `${20 + Math.random() * 60}%`,
                                                animationDelay: `${i * 0.1}s`,
                                                animationDuration: `${3 + Math.random() * 2}s`
                                            }}
                                        >
                                            {['🌟', '✨', '💫', '🎊', '🎉', '💖', '🔥', '⭐', '🌈', '💎'][i % 10]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        );
    };

    return (
        <div className="ruleta-container">
            <AnimacionEfecto />

            <div className="ruleta-content">
                <div className="text-center mb-6">
                    <h1 className="ruleta-title">
                        La ruletita
                    </h1>
                </div>

                {vistaActiva === 'ruleta' && (
                    <VistaRuleta
                        sonidoHabilitado={sonidoHabilitado}
                        setSonidoHabilitado={setSonidoHabilitado}
                        ruletaRef={ruletaRef}
                        anguloActual={anguloActual}
                        girando={girando}
                        animandoGiro={animandoGiro}
                        numeroGanadores={numeroGanadores}
                        setNumeroGanadores={setNumeroGanadores}
                        participantes={participantes}
                        mostrandoResultado={mostrandoResultado}
                        ganadores={ganadores}
                        girarRuleta={girarRuleta}
                        reiniciarRuleta={reiniciarRuleta}
                        velocidadGiro={velocidadGiro}
                        efectoArdillaSecreta={efectoArdillaSecreta}
                    />
                )}

                {vistaActiva === 'config' && (
                    <VistaConfiguracion
                        participantes={participantes}
                        nuevoParticipante={nuevoParticipante}
                        setNuevoParticipante={setNuevoParticipante}
                        agregarParticipante={agregarParticipante}
                        eliminarParticipante={eliminarParticipante}
                        colores={colores}
                    />
                )}

                {vistaActiva === 'premios' && (
                    <VistaPremios
                        premios={premios}
                        nuevoPremio={nuevoPremio}
                        setNuevoPremio={setNuevoPremio}
                        cantidadPremio={cantidadPremio}
                        setCantidadPremio={setCantidadPremio}
                        agregarPremio={agregarPremio}
                        eliminarPremio={eliminarPremio}
                    />
                )}

                {/*{vistaActiva === 'historial' && (*/}
                {/*    <VistaHistorial*/}
                {/*        historial={historial}*/}
                {/*        setHistorial={setHistorial}*/}
                {/*    />*/}
                {/*)}*/}
            </div>

            <NavigationBar
                vistaActiva={vistaActiva}
                setVistaActiva={setVistaActiva}
            />
        </div>
    );
};

export default RuletaPremios;