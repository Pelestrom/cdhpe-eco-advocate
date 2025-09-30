import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiClient, NewsArticle } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) {
        setNotFound(true);
        return;
      }

      try {
        const articleData = await apiClient.getNewsBySlug(slug);
        if (!articleData) {
          setNotFound(true);
          return;
        }

        setArticle(articleData);

        // Load related articles from same category
        const related = await apiClient.getNewsByCategory(articleData.category);
        const filteredRelated = related
          .filter(a => a.id !== articleData.id)
          .slice(0, 3);
        setRelatedArticles(filteredRelated);
      } catch (error) {
        console.error('Error loading article:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast({
          title: "Lien copié",
          description: "Le lien de l'article a été copié dans le presse-papiers",
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-muted rounded mb-8 w-1/4"></div>
            <div className="h-12 bg-muted rounded mb-4"></div>
            <div className="h-6 bg-muted rounded mb-8 w-1/2"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !article) {
    return <Navigate to="/actualites" replace />;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/actualites" className="inline-flex items-center text-primary hover:text-primary-dark mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux actualités
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {article.category}
              </Badge>
              <time className="text-muted-foreground">
                {formatDate(article.date)}
              </time>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              {article.summary}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Partager:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('facebook')}
                  className="p-2"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('twitter')}
                  className="p-2"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('linkedin')}
                  className="p-2"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShare('copy')}
                  className="p-2"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8 rounded-2xl overflow-hidden shadow-elegant">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none mb-12">
            <div className="text-foreground space-y-6">
              {article.content.split('\n').map((paragraph, index) => (
                paragraph.trim() && <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          <Separator className="my-12" />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-8">Articles connexes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    to={`/actualites/${relatedArticle.slug}`}
                    className="group"
                  >
                    <div className="bg-card rounded-lg overflow-hidden border card-hover">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedArticle.summary}
                        </p>
                        <div className="flex items-center mt-3 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(relatedArticle.date)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Rejoignez notre mission</h3>
            <p className="text-muted-foreground mb-6">
              Ensemble, nous pouvons faire la différence pour les droits de l'homme et l'environnement.
            </p>
            <Link to="/nous-soutenir">
              <Button className="btn-hero">
                Nous soutenir
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;