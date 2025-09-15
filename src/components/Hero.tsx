import { ArrowRight, Heart, Shield, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Hero Background with Gradient */}
      <div className="hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Défendre les
                  <span className="block text-white/90">
                    Droits & l'Environnement
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                  Le Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement 
                  œuvre pour un avenir juste, équitable et durable pour tous.
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/nous-soutenir">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4 text-lg">
                    Rejoignez notre mission
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/actualites">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg"
                  >
                    Découvrir nos actions
                  </Button>
                </Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-white/70">Personnes aidées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">25+</div>
                  <div className="text-sm text-white/70">Formations données</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">10+</div>
                  <div className="text-sm text-white/70">Ans d'expérience</div>
                </div>
              </div>
            </div>

            {/* Right Content - Mission Cards */}
            <div className="space-y-6 animate-slide-up">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Droits de l'Homme</h3>
                </div>
                <p className="text-white/80">
                  Protection et promotion des droits fondamentaux, accompagnement juridique 
                  et sensibilisation aux enjeux de justice sociale.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Protection Environnementale</h3>
                </div>
                <p className="text-white/80">
                  Conservation de la biodiversité, lutte contre la pollution et 
                  promotion du développement durable.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-white/20 rounded-full">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Engagement Communautaire</h3>
                </div>
                <p className="text-white/80">
                  Formation des leaders locaux et mobilisation citoyenne pour 
                  un changement social positif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </section>
  );
};

export default Hero;