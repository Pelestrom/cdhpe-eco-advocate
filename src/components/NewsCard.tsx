import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  image: string;
  category: string;
  author: string;
  featured: boolean;
}

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/actualites/${article.slug}`} className="block group">
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-3d">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium animate-glow">
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold leading-tight hover:text-primary transition-colors">
              {article.title}
            </h3>
            <p className="text-muted-foreground text-sm">
              {article.summary}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
              </div>
              <span className="text-primary hover:text-primary-dark font-medium transition-colors">
                Lire la suite →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;