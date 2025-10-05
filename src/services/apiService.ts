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
    let query = supabase
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
  }

  async getPublicationBySlug(slug: string) {
    const { data, error } = await supabase
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
  }

  async getFeaturedPublications() {
    const { data, error } = await supabase
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
  }

  // Events
  async getEvents(status?: 'a_venir' | 'termine') {
    let query = supabase
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
  }

  async getEventById(id: string) {
    const { data, error } = await supabase
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
  }

  // Participant registration
  async registerForEvent(eventId: string, participantData: { nom: string; email: string }) {
    const { data, error } = await supabase
      .from('participants')
      .insert({
        event_id: eventId,
        nom: participantData.nom,
        email: participantData.email,
        confirmed: false
      })
      .select()
      .single();

    if (error) throw error;

    // Send confirmation email (implement this based on your email service)
    await this.sendConfirmationEmail(eventId, participantData);

    return data as Participant;
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
    const { data, error } = await supabase
      .from('messages')
      .insert(formData)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  // Support info
  async getSupportInfo() {
    const { data, error } = await supabase
      .from('support_info')
      .select('*')
      .eq('actif', true)
      .order('created_at');

    if (error) throw error;
    return data as SupportInfo[];
  }

  // Categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data as Category[];
  }

  // Teams
  async getTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data as Team[];
  }

  // Event types
  async getEventTypes() {
    const { data, error } = await supabase
      .from('event_types')
      .select('*')
      .order('nom');

    if (error) throw error;
    return data as EventType[];
  }

  // Email service (placeholder - implement based on your choice)
  private async sendConfirmationEmail(eventId: string, participant: { nom: string; email: string }) {
    // Get event details
    const event = await this.getEventById(eventId);
    
    // This is a placeholder - implement with your email service
    console.log('Sending confirmation email to:', participant.email);
    console.log('Event:', event.titre);
    
    // Example implementation with fetch to your email endpoint
    // await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: participant.email,
    //     subject: `Confirmation d'inscription - ${event.titre}`,
    //     html: `
    //       <h2>Bonjour ${participant.nom},</h2>
    //       <p>Votre inscription à l'événement "${event.titre}" a été confirmée.</p>
    //       <p><strong>Date:</strong> ${new Date(event.date_debut).toLocaleDateString('fr-FR')}</p>
    //       <p><strong>Lieu:</strong> ${event.lieu}</p>
    //       <p>Nous vous remercions de votre participation.</p>
    //       <p>L'équipe CDHPE</p>
    //     `
    //   })
    // });
  }

  // Admin methods (require service role)
  async adminLogin(password: string): Promise<boolean> {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    return password === adminPassword;
  }

  // Admin - Publications
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

  // Admin - Support Info
  async adminGetSupportInfo() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('support_info')
      .select('*')
      .order('created_at');

    if (error) throw error;
    return data as SupportInfo[];
  }

  async adminUpdateSupportInfo(id: string, updates: Partial<SupportInfo>) {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('support_info')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SupportInfo;
  }

  // Admin - Logs
  private async logAdminAction(action: string, details?: Record<string, any>) {
    if (!supabaseAdmin) return;

    await supabaseAdmin
      .from('admin_logs')
      .insert({
        action,
        details
      });
  }

  async adminGetLogs() {
    if (!supabaseAdmin) throw new Error('Admin client not configured');

    const { data, error } = await supabaseAdmin
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data as AdminLog[];
  }

  // Utility functions
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim();
  }
}

export const apiService = new ApiService();