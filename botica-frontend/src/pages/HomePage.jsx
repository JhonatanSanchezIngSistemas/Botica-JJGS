import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = () => {
    return (
        <>
            <Navbar transparent={true} />
            {/* Hero Section */}
            <header className="vh-100 d-flex align-items-center justify-content-center text-white text-center"
                style={{ background: 'linear-gradient(135deg, #0056b3 0%, #28a745 100%)' }}>
                <div className="container">
                    <h1 className="display-3 fw-bold mb-3">Botica JJGS</h1>
                    <p className="lead mb-4 fs-3">Gestión farmacéutica inteligente, segura y eficiente.</p>
                    <a href="/login" className="btn btn-light btn-lg fw-bold px-5 rounded-pill shadow">Acceder al Sistema</a>
                </div>
            </header>

            {/* Sección Info */}
            <section className="py-5">
                <div className="container">
                    <div className="row text-center g-4">
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h3 className="text-primary">Misión</h3>
                                <p>Brindar tecnología de punta para la administración de salud.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h3 className="text-success">Visión</h3>
                                <p>Ser el estándar en sistemas de gestión para boticas en el Perú.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 border rounded shadow-sm h-100">
                                <h3 className="text-primary">Contacto</h3>
                                <p>Soporte 24/7 para tu negocio.<br /><strong>Jhonatan Sanchez</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
