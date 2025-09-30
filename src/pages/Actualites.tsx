import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, NewsArticle } from '@/services/apiClient';

const Actualites = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    const loadNews = async () => {
      try {
        const allNews = await apiClient.getNews();
        setNews(allNews);
        setFilteredNews(allNews);
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [news, searchTerm, selectedCategory]);

  const categories = Array.from(new Set(news.map(article => article.category)));

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredNews.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Actualités</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez nos dernières actions, analyses et prises de position en faveur 
            des droits de l'homme et de la protection de l'environnement.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher dans les actualités..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-ring"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 focus-ring">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <>
            {filteredNews.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  Aucun article trouvé pour votre recherche.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {currentArticles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        onClick={() => handlePageChange(page)}
                        className={currentPage === page ? "btn-hero" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Actualites;