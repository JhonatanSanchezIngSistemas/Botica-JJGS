import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiShield, FiZap, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button/Button';
import styles from './LandingPage.module.css';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.landing}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay}></div>
                <motion.div
                    className={styles.heroContent}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={styles.heroTitle}>
                        Sistema de Gestión Farmacéutica Profesional
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Gestiona tu botica con herramientas profesionales: inventario inteligente,
                        control de ventas en tiempo real, y reportes detallados. Todo en una sola plataforma.
                    </p>
                    <div className={styles.heroButtons}>
                        <Button
                            variant="primary"
                            size="lg"
                            glow
                            icon={<FiArrowRight />}
                            onClick={() => navigate('/login')}
                        >
                            Empezar Ahora
                        </Button>
                    </div>
                </motion.div>
            </section>

            {/* Características Section */}
            <section id="caracteristicas" className={styles.features}>
                <div className={styles.blob1}></div>
                <div className={styles.blob2}></div>

                <div className={styles.sectionHeader}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Características Principales
                    </motion.h2>
                    <p>Todo lo que necesitas para escalar tu negocio farmacéutico.</p>
                </div>

                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className={styles.featureCard}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            <div className={styles.featureIcon}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Precios Section */}
            <section id="precios" className={styles.pricing}>
                <div className={styles.sectionHeader}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Precios y Planes
                    </motion.h2>
                    <p>Elige el plan que mejor se ajuste a tu negocio.</p>
                </div>

                <div className={styles.pricingGrid}>
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            key={index}
                            className={`${styles.pricingCard} ${plan.featured ? styles.featured : ''}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                        >
                            {plan.featured && <div className={styles.badge}>MÁS POPULAR</div>}
                            <h3>{plan.name}</h3>
                            <div className={styles.price}>S/ {plan.price}</div>
                            <p className={styles.period}>por mes</p>
                            <ul className={styles.features}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx}>✓ {feature}</li>
                                ))}
                            </ul>
                            <Button 
                                variant={plan.featured ? 'primary' : 'secondary'}
                                onClick={() => navigate('/login')}
                            >
                                Contratar Ahora
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contacto Section */}
            <section id="contacto" className={styles.contact}>
                <div className={styles.sectionHeader}>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        Ponte en Contacto
                    </motion.h2>
                    <p>¿Tienes preguntas? Estamos aquí para ayudarte.</p>
                </div>

                <div className={styles.contactGrid}>
                    <motion.div
                        className={styles.contactCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <FiPhone className={styles.contactIcon} />
                        <h3>Teléfono</h3>
                        <p>+51 (1) 2234-5678</p>
                        <p className={styles.subtext}>Lun - Sab: 8:00 AM - 8:00 PM</p>
                    </motion.div>

                    <motion.div
                        className={styles.contactCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <FiMail className={styles.contactIcon} />
                        <h3>Email</h3>
                        <p>contacto@boticajjgs.com</p>
                        <p className={styles.subtext}>Respuesta en 24 horas</p>
                    </motion.div>

                    <motion.div
                        className={styles.contactCard}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <FiMapPin className={styles.contactIcon} />
                        <h3>Ubicación</h3>
                        <p>Lima, Perú</p>
                        <p className={styles.subtext}>Soporte farmacéutico local</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h4>ENCAPBOT</h4>
                        <p>Solución integral para farmacias modernas</p>
                    </div>
                    <div className={styles.footerSection}>
                        <h4>Enlaces Rápidos</h4>
                        <ul>
                            <li><a href="#caracteristicas">Características</a></li>
                            <li><a href="#precios">Precios</a></li>
                            <li><a href="#contacto">Contacto</a></li>
                        </ul>
                    </div>
                    <div className={styles.footerSection}>
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="/">Términos de Servicio</a></li>
                            <li><a href="/">Privacidad</a></li>
                            <li><a href="/">Regulado por DIGEMID</a></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2025 ENCAPBOT. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

const features = [
    {
        icon: <FiBarChart2 />,
        title: 'Predicción de Stock IA',
        description: 'Nuestro algoritmo analiza tus ventas históricas y predice qué medicamentos necesitarás la próxima semana.'
    },
    {
        icon: <FiZap />,
        title: 'Gestión Rápida',
        description: 'Procesamiento ágil de inventario y ventas con actualización en tiempo real. Máxima eficiencia.'
    },
    {
        icon: <FiShield />,
        title: 'Regulado por DIGEMID',
        description: 'Cumplimiento total con regulaciones farmacéuticas peruanas y estándares internacionales de seguridad.'
    }
];

const pricingPlans = [
    {
        name: 'Starter',
        price: '99',
        features: [
            'Gestión de hasta 500 medicamentos',
            'Reportes básicos',
            'Soporte por email',
            'Dashboard con 3 usuarios'
        ]
    },
    {
        name: 'Professional',
        price: '299',
        featured: true,
        features: [
            'Medicamentos ilimitados',
            'Reportes avanzados con IA',
            'Soporte prioritario 24/7',
            'Dashboard con 10 usuarios',
            'Predicción de stock',
            'Análisis de ventas'
        ]
    },
    {
        name: 'Enterprise',
        price: '699',
        features: [
            'Todo en Professional',
            'Usuarios ilimitados',
            'Integraciones personalizadas',
            'Consultoría farmacéutica',
            'API privada',
            'Capacitación en sitio'
        ]
    }
];

export default LandingPage;
