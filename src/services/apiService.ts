import { supabase } from '@/integrations/supabase/client';
import type {
  Publication,
  Event,
  Category,
  Team,
  EventType,
  Media,
  Participant,
  Message,
  SupportInfo,
  AdminLog
} from './supabaseClient';

const supabaseAdmin = null;

class ApiService {
  // Publications
  async getPublications(limit?: number, offset?: number) {
    try {
      let query = (supabase as any)
        .from('publications')
        .select(`
          *,
          categories(nom),
          teams(nom),
          media(url, type)
        `)
        .eq('published', true)
        .order('date_publication', { ascending: false });

      if (limit) query = query.limit(limit);
      if (offset) query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data as Publication[];
    } catch (error) {
      console.warn('Publications table not yet created');
      return [];
    }
  }

  async getPublicationBySlug(slug: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('publications')
        .select(`
          *,
          categories(nom),
          teams(nom),
          media(url, type)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data as Publication;
    } catch (error) {
      console.warn('Publications table not yet created');
      throw error;
    }
  }

  async getFeaturedPublications() {
    try {
      const { data, error } = await (supabase as any)
        .from('publications')
        .select(`
          *,
          categories(nom),
          teams(nom),
          media(url, type)
        `)
        .eq('published', true)
        .eq('featured', true)
        .order('date_publication', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Publication[];
    } catch (error) {
      console.warn('Publications table not yet created');
      return [];
    }
  }

  // Events
  async getEvents(status?: 'a_venir' | 'termine') {
    try {
      let query = (supabase as any)
        .from('events')
        .select(`
          *,
          event_types(nom),
          media(url, type)
        `)
        .order('date_debut', { ascending: status === 'a_venir' });

      if (status) query = query.eq('statut', status);

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    } catch (error) {
      console.warn('Events table not yet created');
      return [];
    }
  }

  async getEventById(id: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .select(`
          *,
          event_types(nom),
          media(url, type)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.warn('Events table not yet created');
      throw error;
    }
  }

  // Participant registration
  async registerForEvent(eventId: string, participantData: { nom: string; email: string }) {
    try {
      const { data, error } = await (supabase as any)
        .from('event_registrations')
        .insert({
          event_id: eventId,
          name: participantData.nom,
          email: participantData.email,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email (implement this based on your email service)
      await this.sendConfirmationEmail(eventId, participantData);

      return data as any;
    } catch (error) {
      console.warn('Event registrations table not yet created');
      throw error;
    }
  }

  // Contact form
  async submitContactForm(formData: {
    nom: string;
    email: string;
    sujet?: string;
    message: string;
    origine: 'contact' | 'participation';
    ref_id?: string;
  }) {
    try {
      const { data, error } = await (supabase as any)
        .from('contact_messages')
        .insert({
          name: formData.nom,
          email: formData.email,
          message: formData.message,
          help_type: formData.sujet || 'other',
          status: 'new'
        })
        .select()
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.warn('Contact messages table not yet created');
      throw error;
    }
  }

  // Support info
  async getSupportInfo() {
    try {
      const { data, error } = await (supabase as any)
        .from('support_info')
        .select('*')
        .eq('actif', true)
        .order('created_at');

      if (error) throw error;
      return data as SupportInfo[];
    } catch (error) {
      console.warn('Support info table not yet created');
      return [];
    }
  }

  // Categories
  async getCategories() {
    try {
      const { data, error} = await (supabase as any)
        .from('categories')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data as Category[];
    } catch (error) {
      console.warn('Categories table not yet created');
      return [];
    }
  }

  // Teams
  async getTeams() {
    try {
      const { data, error } = await (supabase as any)
        .from('teams')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data as Team[];
    } catch (error) {
      console.warn('Teams table not yet created');
      return [];
    }
  }

  // Event types
  async getEventTypes() {
    try {
      const { data, error } = await (supabase as any)
        .from('event_types')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data as EventType[];
    } catch (error) {
      console.warn('Event types table not yet created');
      return [];
    }
  }

  // Email service (placeholder - implement based on your choice)
  private async sendConfirmationEmail(eventId: string, participant: { nom: string; email: string }) {
    // Get event details
    const event = await this.getEventById(eventId);
    
    // This is a placeholder - implement with your email service
    console.log('Sending confirmation email to:', participant.email);
    console.log('Event:', event.titre);
  }

  // Admin methods (require service role)
  async adminLogin(password: string): Promise<boolean> {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    return password === adminPassword;
  }

  
  async adminGetPublications() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { data, error } = await supabaseAdmin
      .from('publications')
      .select(`
        *,
        categories(nom),
        teams(nom),
        media(url, type)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Publication[];
  }

  async adminCreatePublication(publication: Partial<Publication>) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    // Generate slug from title
    const slug = this.generateSlug(publication.titre || '');
    
    const { data, error } = await supabaseAdmin
      .from('publications')
      .insert({ ...publication, slug })
      .select()
      .single();

    if (error) throw error;

    // Log admin action
    await this.logAdminAction('CREATE_PUBLICATION', { publication_id: data.id, titre: publication.titre });

    return data as Publication;
  }

  async adminUpdatePublication(id: string, updates: Partial<Publication>) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('publications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.logAdminAction('UPDATE_PUBLICATION', { publication_id: id });

    return data as Publication;
  }

  async adminDeletePublication(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await this.logAdminAction('DELETE_PUBLICATION', { publication_id: id });
  }

  // Admin - Events
  async adminGetEvents() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');
    
    const { data, error } = await supabaseAdmin
      .from('events')
      .select(`
        *,
        event_types(nom),
        media(url, type)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Event[];
  }

  async adminCreateEvent(event: Partial<Event>) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;

    await this.logAdminAction('CREATE_EVENT', { event_id: data.id, titre: event.titre });

    return data as Event;
  }

  async adminUpdateEvent(id: string, updates: Partial<Event>) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    await this.logAdminAction('UPDATE_EVENT', { event_id: id });

    return data as Event;
  }

  async adminDeleteEvent(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await this.logAdminAction('DELETE_EVENT', { event_id: id });
  }

  // Admin - Media upload
  async adminUploadMedia(file: File): Promise<Media> {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `media/${fileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    // Save metadata to database
    const mediaType = file.type.startsWith('image/') ? 'image' :
                     file.type.startsWith('video/') ? 'video' :
                     file.type.startsWith('audio/') ? 'audio' : 'document';

    const { data, error } = await supabaseAdmin
      .from('media')
      .insert({
        nom_fichier: file.name,
        url: publicUrl,
        type: mediaType,
        taille: file.size,
        mime_type: file.type,
        uploaded_by: 'admin'
      })
      .select()
      .single();

    if (error) throw error;

    await this.logAdminAction('UPLOAD_MEDIA', { media_id: data.id, filename: file.name });

    return data as Media;
  }

  async adminGetMedia() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Media[];
  }

  async adminDeleteMedia(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    // Get media info first
    const { data: media } = await supabaseAdmin
      .from('media')
      .select('url')
      .eq('id', id)
      .single();

    if (media) {
      // Extract file path from URL and delete from storage
      const filePath = media.url.split('/').slice(-2).join('/');
      await supabase.storage.from('media').remove([filePath]);
    }

    // Delete from database
    const { error } = await supabaseAdmin
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await this.logAdminAction('DELETE_MEDIA', { media_id: id });
  }

  // Admin - Messages
  async adminGetMessages() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Message[];
  }

  async adminMarkMessageAsRead(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('messages')
      .update({ lu: true })
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Participants
  async adminGetParticipants(eventId?: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    let query = supabaseAdmin
      .from('participants')
      .select(`
        *,
        events(titre, date_debut)
      `)
      .order('inscription_date', { ascending: false });

    if (eventId) query = query.eq('event_id', eventId);

    const { data, error } = await query;
    if (error) throw error;
    return data as Participant[];
  }

  // Admin - Categories, Teams, Event Types management
  async adminCreateCategory(category: { nom: string; description?: string }) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async adminDeleteCategory(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async adminCreateTeam(team: { nom: string; description?: string }) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  }

  async adminDeleteTeam(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async adminCreateEventType(eventType: { nom: string; description?: string }) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('event_types')
      .insert(eventType)
      .select()
      .single();

    if (error) throw error;
    return data as EventType;
  }

  async adminDeleteEventType(id: string) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { error } = await supabaseAdmin
      .from('event_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Utility functions
  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\\w\\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async logAdminAction(action: string, details?: Record<string, any>) {
    if (!supabaseAdmin) return;
    
    try {
      await supabaseAdmin
        .from('admin_logs')
        .insert({
          action,
          details
        });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }
}

export const apiService = new ApiService();
