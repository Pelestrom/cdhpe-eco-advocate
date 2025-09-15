// API Client for CDHPE - Ready for future Supabase integration
export interface NewsArticle {
  id: number;
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

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  type: string;
  status: 'upcoming' | 'past';
  maxParticipants: number;
  currentParticipants: number;
  image: string;
  organizer: string;
  isFree: boolean;
  price: string | null;
  registrationDeadline: string;
  tags: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  helpType: 'donation' | 'volunteer' | 'partnership' | 'other';
}

class ApiClient {
  // News methods
  async getNews(): Promise<NewsArticle[]> {
    // Currently loads from JSON, will be replaced with Supabase API
    const response = await import('../data/news.json');
    return response.default;
  }

  async getFeaturedNews(): Promise<NewsArticle[]> {
    const news = await this.getNews();
    return news.filter(article => article.featured);
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    const news = await this.getNews();
    return news.find(article => article.slug === slug) || null;
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    const news = await this.getNews();
    return news.filter(article => article.category === category);
  }

  // Events methods
  async getEvents(): Promise<Event[]> {
    // Currently loads from JSON, will be replaced with Supabase API
    const response = await import('../data/events.json');
    return response.default as Event[];
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.status === 'upcoming');
  }

  async getPastEvents(): Promise<Event[]> {
    const events = await this.getEvents();
    return events.filter(event => event.status === 'past');
  }

  async getEventById(id: number): Promise<Event | null> {
    const events = await this.getEvents();
    return events.find(event => event.id === id) || null;
  }

  // Contact form submission
  async submitContactForm(data: ContactForm): Promise<{ success: boolean; message: string }> {
    // Currently simulates submission, will be replaced with Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    console.log('Contact form submitted:', data);
    return {
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    };
  }

  // Event registration
  async registerForEvent(eventId: number, participantData: { name: string; email: string; }): Promise<{ success: boolean; message: string }> {
    // Currently simulates registration, will be replaced with Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    console.log('Event registration:', { eventId, participantData });
    return {
      success: true,
      message: 'Votre inscription a été confirmée. Vous recevrez un email de confirmation.'
    };
  }
}

export const apiClient = new ApiClient();