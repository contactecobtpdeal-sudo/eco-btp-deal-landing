'use client'

import { useState } from 'react'

// ============================================
// HEADER COMPONENT
// ============================================
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-btp-orange-500 to-eco-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold">
                <span className="text-btp-orange-500">éco</span>
                <span className="text-anthracite-800"> BTP </span>
                <span className="text-eco-green-600">deal</span>
              </span>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
              Services
            </a>
            <a href="#avantages" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
              Avantages
            </a>
            <a href="#contact" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
              Contact
            </a>
            <a
              href="#devenir-partenaire"
              className="btn-primary"
            >
              Devenir Partenaire
            </a>
          </nav>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-anthracite-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-anthracite-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-anthracite-100">
            <nav className="flex flex-col space-y-4">
              <a href="#services" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
                Services
              </a>
              <a href="#avantages" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
                Avantages
              </a>
              <a href="#contact" className="text-anthracite-600 hover:text-eco-green-600 transition-colors font-medium">
                Contact
              </a>
              <a href="#devenir-partenaire" className="btn-primary text-center">
                Devenir Partenaire
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// ============================================
// HERO SECTION
// ============================================
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-eco-green-50 via-white to-btp-orange-50 animated-gradient" />

      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-eco-green-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-btp-orange-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 bg-eco-green-100 text-eco-green-700 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Plateforme certifiée éco-responsable
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-anthracite-900 mb-6 leading-tight">
              Construisez{' '}
              <span className="text-eco-green-600">durablement</span>
              <br />
              avec les meilleurs{' '}
              <span className="text-btp-orange-500">professionnels</span>
            </h1>

            <p className="text-lg md:text-xl text-anthracite-600 mb-8 max-w-xl mx-auto lg:mx-0">
              La première plateforme de mise en relation entre particuliers et professionnels
              du bâtiment écologique. Trouvez des artisans certifiés pour vos projets durables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#services" className="btn-primary text-center">
                Découvrir nos services
              </a>
              <a href="#contact" className="btn-outline text-center">
                Nous contacter
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-anthracite-200">
              <div>
                <div className="text-2xl md:text-3xl font-bold text-eco-green-600">500+</div>
                <div className="text-sm text-anthracite-600">Artisans certifiés</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-btp-orange-500">2000+</div>
                <div className="text-sm text-anthracite-600">Projets réalisés</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-anthracite-800">98%</div>
                <div className="text-sm text-anthracite-600">Clients satisfaits</div>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Main Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-eco-green-500 to-eco-green-600 rounded-full opacity-10" />

              {/* Inner Card */}
              <div className="absolute inset-8 bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-btp-orange-500 to-eco-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-anthracite-900 mb-2">Éco-responsable</h3>
                <p className="text-anthracite-600 text-center text-sm">
                  Des solutions durables pour un avenir meilleur
                </p>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-btp-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-eco-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// SERVICES SECTION
// ============================================
function Services() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Mise en relation',
      description: 'Connectez-vous instantanément avec des artisans qualifiés et certifiés éco-responsables dans votre région.',
      color: 'eco-green',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Artisans certifiés',
      description: 'Tous nos partenaires sont vérifiés et possèdent les certifications nécessaires (RGE, Qualibat, etc.).',
      color: 'btp-orange',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Devis gratuits',
      description: 'Recevez plusieurs devis détaillés et comparatifs gratuitement pour vos projets de construction durable.',
      color: 'eco-green',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Matériaux écologiques',
      description: 'Accédez à un catalogue de matériaux durables et éco-responsables pour vos projets de rénovation.',
      color: 'btp-orange',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Aides financières',
      description: 'Bénéficiez de conseils sur les aides disponibles : MaPrimeRénov\', CEE, éco-PTZ et subventions locales.',
      color: 'eco-green',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Suivi de projet',
      description: 'Suivez l\'avancement de vos travaux en temps réel grâce à notre plateforme intuitive et sécurisée.',
      color: 'btp-orange',
    },
  ]

  return (
    <section id="services" className="py-20 bg-anthracite-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-eco-green-100 text-eco-green-700 rounded-full text-sm font-medium mb-4">
            Nos Services
          </span>
          <h2 className="section-title">
            Une solution complète pour vos{' '}
            <span className="text-eco-green-600">projets durables</span>
          </h2>
          <p className="section-subtitle">
            Découvrez tous les services que nous proposons pour faciliter vos projets
            de construction et rénovation écologique.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-anthracite-100"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                service.color === 'eco-green'
                  ? 'bg-eco-green-100 text-eco-green-600'
                  : 'bg-btp-orange-100 text-btp-orange-600'
              }`}>
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-anthracite-900 mb-3">
                {service.title}
              </h3>
              <p className="text-anthracite-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// AVANTAGES SECTION
// ============================================
function Avantages() {
  return (
    <section id="avantages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-btp-orange-100 text-btp-orange-700 rounded-full text-sm font-medium mb-4">
              Pourquoi nous choisir ?
            </span>
            <h2 className="section-title text-left">
              La plateforme de confiance pour le{' '}
              <span className="text-eco-green-600">BTP écologique</span>
            </h2>

            <div className="space-y-6 mt-8">
              {[
                {
                  title: 'Sélection rigoureuse',
                  description: 'Chaque artisan est vérifié, assuré et possède les certifications requises.',
                },
                {
                  title: 'Économies garanties',
                  description: 'Comparez les devis et bénéficiez des meilleures offres du marché.',
                },
                {
                  title: 'Accompagnement personnalisé',
                  description: 'Un conseiller dédié vous accompagne tout au long de votre projet.',
                },
                {
                  title: 'Impact environnemental réduit',
                  description: 'Contribuez à la transition écologique avec des solutions durables.',
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-eco-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-eco-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-anthracite-900 mb-1">{item.title}</h3>
                    <p className="text-anthracite-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - CTA Card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-eco-green-600 to-eco-green-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Rejoignez le réseau des professionnels éco-responsables
                </h3>
                <p className="text-eco-green-100 mb-8 text-lg">
                  Vous êtes artisan ? Développez votre activité en rejoignant notre plateforme
                  et accédez à de nouveaux clients engagés.
                </p>

                <StripeButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// STRIPE BUTTON (Simulation)
// ============================================
function StripeButton() {
  const handleClick = () => {
    // Simulation d'une redirection vers Stripe Checkout
    // En production, remplacez par votre vraie URL Stripe
    const stripeCheckoutUrl = 'https://checkout.stripe.com/pay/votre-session-id'

    // Pour la démo, on affiche une alerte
    alert(
      '🔗 Redirection vers Stripe Checkout...\n\n' +
      'En production, ce bouton redirigera vers:\n' +
      stripeCheckoutUrl + '\n\n' +
      'Pour activer Stripe:\n' +
      '1. Créez un compte sur stripe.com\n' +
      '2. Configurez vos produits/prix\n' +
      '3. Intégrez l\'API Stripe dans /api/checkout'
    )
  }

  return (
    <button
      onClick={handleClick}
      id="devenir-partenaire"
      className="w-full sm:w-auto bg-white text-eco-green-700 hover:bg-eco-green-50 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
    >
      <span>Devenir Partenaire</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  )
}

// ============================================
// CONTACT SECTION
// ============================================
function Contact() {
  return (
    <section id="contact" className="py-20 bg-anthracite-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-eco-green-100 text-eco-green-700 rounded-full text-sm font-medium mb-4">
            Contact
          </span>
          <h2 className="section-title">
            Une question ?{' '}
            <span className="text-btp-orange-500">Contactez-nous</span>
          </h2>
          <p className="section-subtitle">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form className="bg-white rounded-2xl p-8 shadow-lg border border-anthracite-100">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-anthracite-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  id="nom"
                  className="w-full px-4 py-3 rounded-lg border border-anthracite-200 focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-anthracite-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-anthracite-200 focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all outline-none"
                  placeholder="jean@exemple.fr"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="sujet" className="block text-sm font-medium text-anthracite-700 mb-2">
                Sujet
              </label>
              <select
                id="sujet"
                className="w-full px-4 py-3 rounded-lg border border-anthracite-200 focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all outline-none bg-white"
              >
                <option value="">Sélectionnez un sujet</option>
                <option value="devis">Demande de devis</option>
                <option value="partenariat">Devenir partenaire</option>
                <option value="info">Demande d&apos;information</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-anthracite-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-anthracite-200 focus:ring-2 focus:ring-eco-green-500 focus:border-transparent transition-all outline-none resize-none"
                placeholder="Décrivez votre projet ou votre question..."
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              onClick={(e) => {
                e.preventDefault()
                alert('Formulaire envoyé ! (simulation)')
              }}
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
  return (
    <footer className="bg-anthracite-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-btp-orange-500 to-eco-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="ml-3 text-xl font-bold">
                <span className="text-btp-orange-400">éco</span>
                <span className="text-white"> BTP </span>
                <span className="text-eco-green-400">deal</span>
              </span>
            </div>
            <p className="text-anthracite-400 max-w-md mb-6">
              La plateforme de référence pour la mise en relation entre particuliers
              et professionnels du bâtiment écologique en France.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 bg-anthracite-800 hover:bg-eco-green-600 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Liens rapides</h4>
            <ul className="space-y-3">
              {['Accueil', 'Services', 'Avantages', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-anthracite-400 hover:text-eco-green-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-anthracite-400">
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-eco-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>contact@eco-btp-deal.fr</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-eco-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>01 23 45 67 89</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-eco-green-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-anthracite-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-anthracite-500 text-sm">
            © 2025 Éco BTP Deal. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#mentions" className="text-anthracite-500 hover:text-eco-green-400 text-sm transition-colors">
              Mentions légales
            </a>
            <a href="#confidentialite" className="text-anthracite-500 hover:text-eco-green-400 text-sm transition-colors">
              Politique de confidentialité
            </a>
            <a href="#cgv" className="text-anthracite-500 hover:text-eco-green-400 text-sm transition-colors">
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Avantages />
      <Contact />
      <Footer />
    </main>
  )
}
