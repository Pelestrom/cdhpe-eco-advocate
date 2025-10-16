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
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (limit) query = query.limit(limit);
      if (offset) query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;
      if (error) throw error;
      return data as Publication[];
    } catch (error) {
      console.error('Error fetching publications:', error);
      return [];
    }
  }

  async getPublicationBySlug(slug: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('publications')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return data as Publication;
    } catch (error) {
      console.error('Error fetching publication:', error);
      throw error;
    }
  }

  async getFeaturedPublications() {
    try {
      const { data, error } = await (supabase as any)
        .from('publications')
        .select('*')
        .eq('published', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data as Publication[];
    } catch (error) {
      console.error('Error fetching featured publications:', error);
      return [];
    }
  }

  // Events
  async getEvents(status?: 'upcoming' | 'past') {
    try {
      let query = (supabase as any)
        .from('events')
        .select('*')
        .order('date', { ascending: status === 'upcoming' });

      if (status) query = query.eq('status', status);

      const { data, error } = await query;
      if (error) throw error;
      return data as Event[];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }

  async getEventById(id: string) {
    try {
      const { data, error } = await (supabase as any)
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Event;
    } catch (error) {
      console.error('Error fetching event:', error);
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

      return data as Participant;
    } catch (error) {
      console.error('Error registering for event:', error);
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
          help_type: formData.origine
        })
        .select()
        .single();

      if (error) throw error;
      return data as Message;
    } catch (error) {
      console.error('Error submitting contact form:', error);
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
      console.error('Error fetching support info:', error);
      return [];
    }
  }

  // Categories
  async getCategories() {
    try {
      const { data, error } = await (supabase as any)
        .from('categories')
        .select('*')
        .order('nom');

      if (error) throw error;
      return data as Category[];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async adminCreateCategory(category: { nom: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async adminUpdateCategory(id: string, updates: { nom?: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  }

  async adminDeleteCategory(id: string) {
    const { error } = await (supabase as any)
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  async adminCreateTeam(team: { nom: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('teams')
      .insert(team)
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  }

  async adminUpdateTeam(id: string, updates: { nom?: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('teams')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Team;
  }

  async adminDeleteTeam(id: string) {
    const { error } = await (supabase as any)
      .from('teams')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
      console.error('Error fetching event types:', error);
      return [];
    }
  }

  async adminCreateEventType(eventType: { nom: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('event_types')
      .insert(eventType)
      .select()
      .single();

    if (error) throw error;
    return data as EventType;
  }

  async adminUpdateEventType(id: string, updates: { nom?: string; description?: string }) {
    const { data, error } = await (supabase as any)
      .from('event_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as EventType;
  }

  async adminDeleteEventType(id: string) {
    const { error } = await (supabase as any)
      .from('event_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
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
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'cdhpe@admin';
    return password === adminPassword;
  }

  // Admin - Publications
  async adminGetPublications() {
    const { data, error } = await (supabase as any)
      .from('publications')
      .select(`
        *,
        categories:categorie_id (id, nom),
        teams:equipe_id (id, nom)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Publication[];
  }

  async adminCreatePublication(publication: Partial<any>) {
    // Map 'texte' to 'text' and 'image' to 'photo' for database constraint
    let type = publication.type_media_principal || 'texte';
    if (type === 'texte') type = 'text';
    if (type === 'image') type = 'photo';

    const { data, error } = await (supabase as any)
      .from('publications')
      .insert({ 
        title: publication.title || publication.titre,
        summary: publication.summary || publication.chapeau,
        content: publication.content || publication.contenu_long,
        type: type,
        categorie_id: publication.categorie_id || null,
        equipe_id: publication.equipe_id || null,
        author: publication.author || 'CDHPE',
        featured: publication.featured || false,
        published: publication.published !== undefined ? publication.published : true,
        image_url: publication.image_url || null,
        media_url: publication.media_url || null,
        slug: this.generateSlug(publication.title || publication.titre),
        category: 'General'
      })
      .select()
      .single();

    if (error) throw error;

    return data as Publication;
  }

  async adminUpdatePublication(id: string, updates: Partial<any>) {
    const updateData: any = {};
    
    if (updates.title || updates.titre) updateData.title = updates.title || updates.titre;
    if (updates.summary || updates.chapeau) updateData.summary = updates.summary || updates.chapeau;
    if (updates.content || updates.contenu_long) updateData.content = updates.content || updates.contenu_long;
    
    // Map 'texte' to 'text' and 'image' to 'photo' for database constraint
    if (updates.type_media_principal) {
      let type = updates.type_media_principal;
      if (type === 'texte') type = 'text';
      if (type === 'image') type = 'photo';
      updateData.type = type;
    }
    
    if (updates.categorie_id !== undefined) updateData.categorie_id = updates.categorie_id || null;
    if (updates.equipe_id !== undefined) updateData.equipe_id = updates.equipe_id || null;
    if (updates.author) updateData.author = updates.author;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.published !== undefined) updateData.published = updates.published;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null;
    if (updates.media_url !== undefined) updateData.media_url = updates.media_url || null;

    const { data, error } = await (supabase as any)
      .from('publications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Publication;
  }

  async adminDeletePublication(id: string) {
    const { error } = await (supabase as any)
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Events
  async adminGetEvents() {
    const { data, error } = await (supabase as any)
      .from('events')
      .select(`
        *,
        event_types:type_event_id (id, nom),
        media:media_id (id, url)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map database columns to Event interface
    return (data || []).map((event: any) => ({
      id: event.id,
      titre: event.title || '',
      description_long: event.description || '',
      statut: event.status === 'upcoming' ? 'a_venir' : 'termine',
      date_debut: event.date,
      date_fin: event.end_date,
      heure: event.time,
      lieu: event.location || '',
      type_event_id: event.type_event_id,
      keywords: event.keywords || [],
      media_id: event.media_id,
      participants_count: event.current_participants || 0,
      max_participants: event.max_participants || 100,
      prix: event.price,
      gratuit: event.is_free !== undefined ? event.is_free : true,
      created_at: event.created_at,
      updated_at: event.updated_at,
      event_types: event.event_types,
      media: event.media
    })) as Event[];
  }

  async adminCreateEvent(event: Partial<any>) {
    // Handle empty time field - if empty string, set to null or a default value
    let timeValue = event.time || event.heure;
    if (timeValue === '' || timeValue === undefined) {
      timeValue = '00:00:00'; // Default time if not provided
    }

    const { data, error } = await (supabase as any)
      .from('events')
      .insert({
        title: event.title || event.titre,
        description: event.description || event.description_long,
        date: event.date || event.date_debut,
        end_date: event.end_date || event.date_fin || null,
        time: timeValue,
        location: event.location || event.lieu,
        type_event_id: event.type_event_id || null,
        keywords: event.keywords || [],
        media_id: event.media_id || null,
        status: event.status || (event.statut === 'a_venir' ? 'upcoming' : 'past') || 'upcoming',
        max_participants: event.max_participants || 100,
        current_participants: 0,
        is_free: event.is_free !== undefined ? event.is_free : event.gratuit !== undefined ? event.gratuit : true,
        price: event.price || event.prix || null,
        registration_deadline: event.registration_deadline || event.date || event.date_debut || null,
        image_url: event.image_url || null,
        organizer: event.organizer || 'CDHPE'
      })
      .select()
      .single();

    if (error) throw error;

    return data as Event;
  }

  async adminUpdateEvent(id: string, updates: Partial<any>) {
    const updateData: any = {};
    
    if (updates.title || updates.titre) updateData.title = updates.title || updates.titre;
    if (updates.description || updates.description_long) updateData.description = updates.description || updates.description_long;
    if (updates.date || updates.date_debut) updateData.date = updates.date || updates.date_debut;
    if (updates.end_date !== undefined || updates.date_fin !== undefined) updateData.end_date = updates.end_date || updates.date_fin || null;
    
    // Handle empty time field
    if (updates.time || updates.heure) {
      let timeValue = updates.time || updates.heure;
      if (timeValue === '') timeValue = '00:00:00';
      updateData.time = timeValue;
    }
    
    if (updates.location || updates.lieu) updateData.location = updates.location || updates.lieu;
    if (updates.type_event_id !== undefined) updateData.type_event_id = updates.type_event_id || null;
    if (updates.keywords !== undefined) updateData.keywords = updates.keywords;
    if (updates.media_id !== undefined) updateData.media_id = updates.media_id || null;
    if (updates.status || updates.statut) {
      updateData.status = updates.status || (updates.statut === 'a_venir' ? 'upcoming' : 'past');
    }
    if (updates.max_participants) updateData.max_participants = updates.max_participants;
    if (updates.is_free !== undefined) updateData.is_free = updates.is_free;
    else if (updates.gratuit !== undefined) updateData.is_free = updates.gratuit;
    if (updates.price !== undefined || updates.prix !== undefined) updateData.price = updates.price || updates.prix || null;
    if (updates.registration_deadline !== undefined) updateData.registration_deadline = updates.registration_deadline || null;
    if (updates.image_url !== undefined) updateData.image_url = updates.image_url || null;
    if (updates.organizer) updateData.organizer = updates.organizer;

    const { data, error } = await (supabase as any)
      .from('events')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data as Event;
  }

  async adminDeleteEvent(id: string) {
    const { error } = await (supabase as any)
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Media upload
  async adminUploadMedia(file: File): Promise<Media> {
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

    const { data, error } = await (supabase as any)
      .from('media')
      .insert({
        name: file.name,
        url: publicUrl,
        type: mediaType,
        size_bytes: file.size,
        mime_type: file.type
      })
      .select()
      .single();

    if (error) throw error;

    return data as Media;
  }

  async adminGetMedia() {
    const { data, error } = await (supabase as any)
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Media[];
  }

  async adminDeleteMedia(id: string) {
    // Get media info first
    const { data: media } = await (supabase as any)
      .from('media')
      .select('url')
      .eq('id', id)
      .maybeSingle();

    if (media) {
      // Extract file path from URL and delete from storage
      const filePath = media.url.split('/').slice(-2).join('/');
      await supabase.storage.from('media').remove([filePath]);
    }

    // Delete from database
    const { error } = await (supabase as any)
      .from('media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Messages
  async adminGetMessages() {
    const { data, error } = await (supabase as any)
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Message[];
  }

  async adminUpdateMessageStatus(id: string, status: string) {
    const { data, error } = await (supabase as any)
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Message;
  }

  async adminDeleteMessage(id: string) {
    const { error } = await (supabase as any)
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Participants
  async adminGetParticipants() {
    const { data, error } = await (supabase as any)
      .from('event_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Participant[];
  }

  async adminUpdateParticipantStatus(id: string, status: string) {
    const { data, error } = await (supabase as any)
      .from('event_registrations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Participant;
  }

  async adminDeleteParticipant(id: string) {
    const { error } = await (supabase as any)
      .from('event_registrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Support Info
  async adminGetSupportInfo() {
    try {
      const { data, error } = await (supabase as any)
        .from('support_info')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SupportInfo[];
    } catch (error) {
      console.error('Error fetching support info:', error);
      return [];
    }
  }

  async adminCreateSupportInfo(info: {
    type: string;
    nom: string;
    details: Record<string, any>;
    actif: boolean;
  }) {
    const { data, error } = await (supabase as any)
      .from('support_info')
      .insert(info)
      .select()
      .single();

    if (error) throw error;
    return data as SupportInfo;
  }

  async adminUpdateSupportInfo(id: string, updates: Partial<SupportInfo>) {
    const { data, error } = await (supabase as any)
      .from('support_info')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as SupportInfo;
  }

  async adminDeleteSupportInfo(id: string) {
    const { error } = await (supabase as any)
      .from('support_info')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Admin - Logs
  async adminGetLogs() {
    try {
      const { data, error } = await (supabase as any)
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AdminLog[];
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  }


  // Remove log action method since we don't have a logs table
  private async logAdminAction(action: string, details?: Record<string, any>) {
    // Placeholder - no logging for now
    console.log('Admin action:', action, details);
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