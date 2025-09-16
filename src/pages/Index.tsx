import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Target, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsArticle, apiClient } from '@/services/apiClient';

const Index = () => {
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        const news = await apiClient.getFeaturedNews();
        setFeaturedNews(news.slice(0, 3)); // Get first 3 featured articles
      } catch (error) {
        console.error('Error loading featured news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedNews();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Mission & Vision Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Notre <span className="gradient-text">Mission</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Nous œuvrons pour la promotion et la protection des droits de l'homme tout en 
              préservant notre environnement pour les générations futures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Notre Vision</h3>
              <p className="text-muted-foreground">
                Une société où les droits humains sont respectés et l'environnement protégé 
                pour assurer un développement durable et équitable.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-secondary/5 to-primary/5 border border-secondary/10">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Nos Valeurs</h3>
              <p className="text-muted-foreground">
                Justice, transparence, solidarité et respect de la dignité humaine guident 
                toutes nos actions et décisions.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Notre Impact</h3>
              <p className="text-muted-foreground">
                Plus de 500 personnes accompagnées, 25 formations dispensées et de nombreuses 
                victoires juridiques pour la protection des droits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Dernières <span className="gradient-text">Actualités</span>
            </h2>
            <Link to="/actualites">
              <Button variant="outline" className="btn-outline-hero">
                Voir toutes les actualités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Rejoignez notre combat pour la justice
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Ensemble, nous pouvons créer un monde plus juste où les droits de l'homme 
            sont respectés et l'environnement protégé.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/nous-soutenir">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-4">
                Nous soutenir
              </Button>
            </Link>
            <Link to="/evenement">
              <Button 
                size="lg" 
                className="btn-transparent font-semibold px-8 py-4"
              >
                Nos événements
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
