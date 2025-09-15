import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Wallet, Smartphone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.jpg"
                alt="CDHPE Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold gradient-text">CDHPE</h3>
                <p className="text-sm text-muted-foreground">Droits & Environnement</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement.
              Ensemble pour un avenir juste et durable.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/actualites"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Actualités
                </Link>
              </li>
              <li>
                <Link
                  to="/evenement"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Évènements
                </Link>
              </li>
              <li>
                <Link
                  to="/nous-soutenir"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Nous soutenir
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Kinshasa, République Démocratique du Congo
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  +243 XX XXX XXXX
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  contact@cdhpe.org
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media & Payment */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-foreground mb-3">Paiements mobiles</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Wave: +243 XXX XXX XXX
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Orange Money: +243 XXX XXX XXX
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Restez informé de nos actions et événements
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} CDHPE. Tous droits réservés.
            </p>
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Politique de confidentialité
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Mentions légales
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;