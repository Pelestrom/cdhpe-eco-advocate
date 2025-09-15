import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/services/apiClient';

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
    <Card className={`card-hover ${featured ? 'lg:col-span-2' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={article.image}
            alt={article.title}
            className={`w-full object-cover transition-transform duration-300 hover:scale-105 ${
              featured ? 'h-64' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/90 text-foreground">
              {article.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className={`font-bold leading-tight hover:text-primary transition-colors ${
            featured ? 'text-xl lg:text-2xl' : 'text-lg'
          }`}>
            <Link to={`/actualites/${article.slug}`}>
              {article.title}
            </Link>
          </h3>
          
          <p className={`text-muted-foreground ${
            featured ? 'text-base' : 'text-sm'
          }`}>
            {article.summary}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
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
          
          <Link
            to={`/actualites/${article.slug}`}
            className="text-primary hover:text-primary-dark font-medium transition-colors"
          >
            Lire la suite →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;