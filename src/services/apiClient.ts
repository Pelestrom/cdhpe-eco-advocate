// Legacy API Client - Now using Supabase directly
// This file is kept for backward compatibility
// New code should use apiService from './apiService'

import { apiService } from './apiService';
import type { Publication, Event as SupabaseEvent } from './supabaseClient';

// Export Event type for backward compatibility
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  time: string;
  location: string;
  type: string;
  image: string;
  imageUrl?: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  price: string | null;
  isFree: boolean;
  status: 'upcoming' | 'past';
  tags: string[];
  registrationDeadline: string;
}

// Legacy interfaces for backward compatibility
export interface NewsArticle {
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

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  helpType: 'donation' | 'volunteer' | 'partnership' | 'other';
}

// Legacy API client for backward compatibility
class LegacyApiClient {
  // Convert Supabase Publication to legacy NewsArticle format
  private convertPublicationToNewsArticle(publication: Publication): NewsArticle {
    return {
      id: publication.id,
      slug: publication.slug,
      title: publication.titre,
      summary: publication.chapeau,
      content: publication.contenu_long,
      date: publication.date_publication,
      image: publication.media?.url || '/api/placeholder/600/400',
      category: publication.categories?.nom || 'Non catégorisé',
      author: publication.teams?.nom || 'CDHPE',
      featured: publication.featured
    };
  }

  // Convert Supabase Event to legacy Event format
  private convertSupabaseEventToLegacy(event: SupabaseEvent): Event {
    const imageUrl = event.media?.url || '/api/placeholder/800/500';
    return {
      id: event.id,
      title: event.titre,
      description: event.description_long,
      date: event.date_debut,
      endDate: event.date_fin || event.date_debut,
      time: event.heure || '09:00',
      location: event.lieu,
      type: event.event_types?.nom || 'Événement',
      status: event.statut === 'a_venir' ? 'upcoming' : 'past',
      maxParticipants: event.max_participants || 100,
      currentParticipants: event.participants_count || 0,
      image: imageUrl,
      imageUrl: imageUrl,
      organizer: 'CDHPE',
      isFree: event.gratuit,
      price: event.prix || null,
      registrationDeadline: event.date_debut,
      tags: event.keywords || []
    };
  }

  async getNews(): Promise<NewsArticle[]> {
    const publications = await apiService.getPublications();
    return publications.map(p => this.convertPublicationToNewsArticle(p));
  }

  async getFeaturedNews(): Promise<NewsArticle[]> {
    const publications = await apiService.getFeaturedPublications();
    return publications.map(p => this.convertPublicationToNewsArticle(p));
  }

  async getNewsBySlug(slug: string): Promise<NewsArticle | null> {
    try {
      const publication = await apiService.getPublicationBySlug(slug);
      return this.convertPublicationToNewsArticle(publication);
    } catch (error) {
      return null;
    }
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    // This would need to be implemented in apiService if needed
    const publications = await apiService.getPublications();
    return publications
      .filter(p => p.categories?.nom === category)
      .map(p => this.convertPublicationToNewsArticle(p));
  }

  async getEvents(): Promise<Event[]> {
    const events = await apiService.getEvents();
    return events.map(e => this.convertSupabaseEventToLegacy(e));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    const events = await apiService.getEvents('a_venir');
    return events.map(e => this.convertSupabaseEventToLegacy(e));
  }

  async getPastEvents(): Promise<Event[]> {
    const events = await apiService.getEvents('termine');
    return events.map(e => this.convertSupabaseEventToLegacy(e));
  }

  async getEventById(id: string): Promise<Event | null> {
    try {
      const event = await apiService.getEventById(id);
      return this.convertSupabaseEventToLegacy(event);
    } catch (error) {
      return null;
    }
  }

  async submitContactForm(data: ContactForm): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.submitContactForm({
        nom: data.name,
        email: data.email,
        message: data.message,
        origine: 'contact',
        sujet: `Contact - ${data.helpType}`
      });
      
      return {
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de l\'envoi du message.'
      };
    }
  }

  async registerForEvent(eventId: string, participantData: { name: string; email: string; }): Promise<{ success: boolean; message: string }> {
    try {
      await apiService.registerForEvent(eventId, {
        nom: participantData.name,
        email: participantData.email
      });
      
      return {
        success: true,
        message: 'Votre inscription a été confirmée. Vous recevrez un email de confirmation.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Une erreur s\'est produite lors de l\'inscription.'
      };
    }
  }
}

export const apiClient = new LegacyApiClient();