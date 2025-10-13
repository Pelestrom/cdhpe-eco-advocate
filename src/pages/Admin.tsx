import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, FileText, Calendar, Users, Image, MessageSquare, Settings, Activity, Plus, Edit as EditIcon, Trash2, Save, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/apiService';
import FileUploader from '@/components/FileUploader';
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
} from '@/services/supabaseClient';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('publications');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Data states
  const [publications, setPublications] = useState<Publication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [supportInfo, setSupportInfo] = useState<SupportInfo[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);

  // Modal states
  const [showPublicationModal, setShowPublicationModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [editingEventType, setEditingEventType] = useState<EventType | null>(null);

  // Form states
  const [publicationForm, setPublicationForm] = useState({
    titre: '',
    chapeau: '',
    contenu_long: '',
    type_media_principal: 'texte' as 'texte' | 'image' | 'video' | 'audio',
    categorie_id: '',
    equipe_id: '',
    featured: false,
    published: true,
    image_url: ''
  });

  const [eventForm, setEventForm] = useState({
    titre: '',
    description_long: '',
    statut: 'a_venir' as 'a_venir' | 'termine',
    date_debut: '',
    date_fin: '',
    heure: '',
    lieu: '',
    type_event_id: '',
    keywords: [] as string[],
    keywordInput: '',
    max_participants: 100,
    prix: '',
    gratuit: true,
    image_url: ''
  });

  const [categoryForm, setCategoryForm] = useState({ nom: '', description: '' });
  const [teamForm, setTeamForm] = useState({ nom: '', description: '' });
  const [eventTypeForm, setEventTypeForm] = useState({ nom: '', description: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isValid = await apiService.adminLogin(password);
      if (isValid) {
        setIsAuthenticated(true);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
        loadAllData();
      } else {
        toast({
          title: "Accès refusé",
          description: "Mot de passe incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [
        publicationsData,
        eventsData,
        categoriesData,
        teamsData,
        eventTypesData,
        mediaData,
        participantsData,
        messagesData,
        supportInfoData,
        logsData
      ] = await Promise.all([
        apiService.adminGetPublications(),
        apiService.adminGetEvents(),
        apiService.getCategories(),
        apiService.getTeams(),
        apiService.getEventTypes(),
        apiService.adminGetMedia(),
        apiService.adminGetParticipants(),
        apiService.adminGetMessages(),
        apiService.adminGetSupportInfo(),
        apiService.adminGetLogs()
      ]);

      setPublications(publicationsData);
      setEvents(eventsData);
      setCategories(categoriesData);
      setTeams(teamsData);
      setEventTypes(eventTypesData);
      setMedia(mediaData);
      setParticipants(participantsData);
      setMessages(messagesData);
      setSupportInfo(supportInfoData);
      setLogs(logsData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des données",
        variant: "destructive"
      });
    }
  };

  // Publication handlers
  const handleSavePublication = async () => {
    try {
      if (editingPublication) {
        const updated = await apiService.adminUpdatePublication(editingPublication.id, publicationForm);
        setPublications(publications.map(p => p.id === editingPublication.id ? updated : p));
        toast({ title: "Publication mise à jour avec succès" });
      } else {
        const created = await apiService.adminCreatePublication(publicationForm);
        setPublications([created, ...publications]);
        toast({ title: "Publication créée avec succès" });
      }
      setShowPublicationModal(false);
      resetPublicationForm();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Supprimer cette publication ?')) return;
    try {
      await apiService.adminDeletePublication(id);
      setPublications(publications.filter(p => p.id !== id));
      toast({ title: "Publication supprimée" });
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  // Event handlers
  const handleSaveEvent = async () => {
    try {
      if (editingEvent) {
        const updated = await apiService.adminUpdateEvent(editingEvent.id, eventForm);
        setEvents(events.map(e => e.id === editingEvent.id ? updated : e));
        toast({ title: "Événement mis à jour" });
      } else {
        const created = await apiService.adminCreateEvent(eventForm);
        setEvents([created, ...events]);
        toast({ title: "Événement créé" });
      }
      setShowEventModal(false);
      resetEventForm();
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return;
    try {
      await apiService.adminDeleteEvent(id);
      setEvents(events.filter(e => e.id !== id));
      toast({ title: "Événement supprimé" });
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  // Category handlers
  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const updated = await apiService.adminUpdateCategory(editingCategory.id, categoryForm);
        setCategories(categories.map(c => c.id === editingCategory.id ? updated : c));
        toast({ title: "Catégorie mise à jour" });
      } else {
        const created = await apiService.adminCreateCategory(categoryForm);
        setCategories([...categories, created]);
        toast({ title: "Catégorie créée" });
      }
      setShowCategoryModal(false);
      setCategoryForm({ nom: '', description: '' });
      setEditingCategory(null);
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    try {
      await apiService.adminDeleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast({ title: "Catégorie supprimée" });
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  // Team handlers
  const handleSaveTeam = async () => {
    try {
      if (editingTeam) {
        const updated = await apiService.adminUpdateTeam(editingTeam.id, teamForm);
        setTeams(teams.map(t => t.id === editingTeam.id ? updated : t));
        toast({ title: "Équipe mise à jour" });
      } else {
        const created = await apiService.adminCreateTeam(teamForm);
        setTeams([...teams, created]);
        toast({ title: "Équipe créée" });
      }
      setShowTeamModal(false);
      setTeamForm({ nom: '', description: '' });
      setEditingTeam(null);
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Supprimer cette équipe ?')) return;
    try {
      await apiService.adminDeleteTeam(id);
      setTeams(teams.filter(t => t.id !== id));
      toast({ title: "Équipe supprimée" });
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  // Event Type handlers
  const handleSaveEventType = async () => {
    try {
      if (editingEventType) {
        const updated = await apiService.adminUpdateEventType(editingEventType.id, eventTypeForm);
        setEventTypes(eventTypes.map(et => et.id === editingEventType.id ? updated : et));
        toast({ title: "Type mis à jour" });
      } else {
        const created = await apiService.adminCreateEventType(eventTypeForm);
        setEventTypes([...eventTypes, created]);
        toast({ title: "Type créé" });
      }
      setShowEventTypeModal(false);
      setEventTypeForm({ nom: '', description: '' });
      setEditingEventType(null);
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const handleDeleteEventType = async (id: string) => {
    if (!confirm('Supprimer ce type ?')) return;
    try {
      await apiService.adminDeleteEventType(id);
      setEventTypes(eventTypes.filter(et => et.id !== id));
      toast({ title: "Type supprimé" });
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  // Media handler
  const handleFileUpload = async (file: File) => {
    try {
      const uploaded = await apiService.adminUploadMedia(file);
      setMedia([uploaded, ...media]);
      toast({ title: "Fichier uploadé" });
      return uploaded;
    } catch (error) {
      toast({ title: "Erreur", variant: "destructive" });
      throw error;
    }
  };

  // Reset forms
  const resetPublicationForm = () => {
    setPublicationForm({
      titre: '',
      chapeau: '',
      contenu_long: '',
      type_media_principal: 'texte',
      categorie_id: '',
      equipe_id: '',
      featured: false,
      published: true,
      image_url: ''
    });
    setEditingPublication(null);
  };

  const resetEventForm = () => {
    setEventForm({
      titre: '',
      description_long: '',
      statut: 'a_venir',
      date_debut: '',
      date_fin: '',
      heure: '',
      lieu: '',
      type_event_id: '',
      keywords: [],
      keywordInput: '',
      max_participants: 100,
      prix: '',
      gratuit: true,
      image_url: ''
    });
    setEditingEvent(null);
  };

  const openEditPublication = (pub: Publication) => {
    setEditingPublication(pub);
    setPublicationForm({
      titre: pub.titre,
      chapeau: pub.chapeau,
      contenu_long: pub.contenu_long,
      type_media_principal: pub.type_media_principal as any,
      categorie_id: pub.categorie_id || '',
      equipe_id: pub.equipe_id || '',
      featured: pub.featured,
      published: pub.published,
      image_url: pub.media_url || ''
    });
    setShowPublicationModal(true);
  };

  const openEditEvent = (evt: Event) => {
    setEditingEvent(evt);
    setEventForm({
      titre: evt.titre,
      description_long: evt.description_long,
      statut: evt.statut,
      date_debut: evt.date_debut,
      date_fin: evt.date_fin || '',
      heure: evt.heure || '',
      lieu: evt.lieu,
      type_event_id: evt.type_event_id || '',
      keywords: evt.keywords || [],
      keywordInput: '',
      max_participants: evt.max_participants,
      prix: evt.prix || '',
      gratuit: evt.gratuit,
      image_url: evt.media?.url || ''
    });
    setShowEventModal(true);
  };

  const addKeyword = () => {
    if (eventForm.keywordInput.trim() && eventForm.keywords.length < 4) {
      setEventForm({
        ...eventForm,
        keywords: [...eventForm.keywords, eventForm.keywordInput.trim()],
        keywordInput: ''
      });
    }
  };

  const removeKeyword = (index: number) => {
    setEventForm({
      ...eventForm,
      keywords: eventForm.keywords.filter((_, i) => i !== index)
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Administration CDHPE</CardTitle>
            <CardDescription>Accès réservé aux administrateurs</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Administration CDHPE</h1>
              <p className="text-muted-foreground">Interface de gestion du contenu</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/')}>Voir le site</Button>
              <Button variant="outline" onClick={() => setIsAuthenticated(false)}>Déconnexion</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="publications">
              <FileText className="w-4 h-4 mr-2" />Publications
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="w-4 h-4 mr-2" />Événements
            </TabsTrigger>
            <TabsTrigger value="participants">
              <Users className="w-4 h-4 mr-2" />Participants
            </TabsTrigger>
            <TabsTrigger value="media">
              <Image className="w-4 h-4 mr-2" />Médias
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="w-4 h-4 mr-2" />Messages
            </TabsTrigger>
            <TabsTrigger value="settings">
              <FolderTree className="w-4 h-4 mr-2" />Paramètres
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Activity className="w-4 h-4 mr-2" />Logs
            </TabsTrigger>
          </TabsList>

          {/* Publications Tab */}
          <TabsContent value="publications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Publications</h2>
              <Button onClick={() => { resetPublicationForm(); setShowPublicationModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Nouvelle Publication
              </Button>
            </div>

            <div className="grid gap-4">
              {publications.map((pub) => (
                <Card key={pub.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{pub.titre}</h3>
                          {pub.featured && <Badge variant="secondary">À la une</Badge>}
                          {!pub.published && <Badge variant="outline">Brouillon</Badge>}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{pub.chapeau}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>Catégorie: {pub.categories?.nom || 'Non définie'}</span>
                          <span>Équipe: {pub.teams?.nom || 'Non définie'}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditPublication(pub)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePublication(pub.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Événements</h2>
              <Button onClick={() => { resetEventForm(); setShowEventModal(true); }}>
                <Plus className="w-4 h-4 mr-2" />Nouvel Événement
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map((evt) => (
                <Card key={evt.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{evt.titre}</h3>
                          <Badge variant={evt.statut === 'a_venir' ? 'default' : 'secondary'}>
                            {evt.statut === 'a_venir' ? 'À venir' : 'Terminé'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {evt.description_long ? evt.description_long.substring(0, 150) : 'Aucune description'}...
                        </p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>📅 {new Date(evt.date_debut).toLocaleDateString('fr-FR')}</span>
                          <span>📍 {evt.lieu}</span>
                          {evt.event_types && <span>Type: {evt.event_types.nom}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditEvent(evt)}>
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(evt.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-6">
            <h2 className="text-xl font-semibold">Participants aux événements</h2>
            <div className="grid gap-4">
              {participants.map((p) => (
                <Card key={p.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{p.nom}</p>
                        <p className="text-sm text-muted-foreground">{p.email}</p>
                      </div>
                      <Badge>{p.confirmed ? 'Confirmé' : 'En attente'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="space-y-6">
            <h2 className="text-xl font-semibold">Galerie multimédia</h2>
            <FileUploader onUpload={handleFileUpload} multiple />
            <div className="grid grid-cols-3 gap-4">
              {media.map((m) => (
                <Card key={m.id}>
                  <CardContent className="p-4">
                    {m.type === 'image' && <img src={m.url} alt={m.nom_fichier} className="w-full h-32 object-cover rounded" />}
                    <p className="text-sm mt-2 truncate">{m.nom_fichier}</p>
                    <Button variant="ghost" size="sm" onClick={() => apiService.adminDeleteMedia(m.id).then(() => setMedia(media.filter(me => me.id !== m.id)))}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <h2 className="text-xl font-semibold">Messages reçus</h2>
            <div className="grid gap-4">
              {messages.map((msg) => (
                <Card key={msg.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{msg.nom} - {msg.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                      </div>
                      <Badge variant={msg.lu ? 'secondary' : 'default'}>{msg.lu ? 'Lu' : 'Non lu'}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Catégories</CardTitle>
                    <Button onClick={() => { setCategoryForm({ nom: '', description: '' }); setEditingCategory(null); setShowCategoryModal(true); }}>
                      <Plus className="w-4 h-4 mr-2" />Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{cat.nom}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingCategory(cat); setCategoryForm({ nom: cat.nom, description: cat.description || '' }); setShowCategoryModal(true); }}>
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteCategory(cat.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Teams */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Équipes</CardTitle>
                    <Button onClick={() => { setTeamForm({ nom: '', description: '' }); setEditingTeam(null); setShowTeamModal(true); }}>
                      <Plus className="w-4 h-4 mr-2" />Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {teams.map((team) => (
                      <div key={team.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{team.nom}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingTeam(team); setTeamForm({ nom: team.nom, description: team.description || '' }); setShowTeamModal(true); }}>
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteTeam(team.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Event Types */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Types d'événements</CardTitle>
                    <Button onClick={() => { setEventTypeForm({ nom: '', description: '' }); setEditingEventType(null); setShowEventTypeModal(true); }}>
                      <Plus className="w-4 h-4 mr-2" />Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {eventTypes.map((et) => (
                      <div key={et.id} className="flex justify-between items-center p-2 border rounded">
                        <span>{et.nom}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingEventType(et); setEventTypeForm({ nom: et.nom, description: et.description || '' }); setShowEventTypeModal(true); }}>
                            <EditIcon className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteEventType(et.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <h2 className="text-xl font-semibold">Journal d'activité</h2>
            <div className="space-y-2">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{log.action}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(log.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publication Modal */}
      <Dialog open={showPublicationModal} onOpenChange={setShowPublicationModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPublication ? 'Modifier' : 'Créer'} une Publication</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input value={publicationForm.titre} onChange={(e) => setPublicationForm({ ...publicationForm, titre: e.target.value })} />
            </div>
            <div>
              <Label>Chapeau (résumé court)</Label>
              <Textarea value={publicationForm.chapeau} onChange={(e) => setPublicationForm({ ...publicationForm, chapeau: e.target.value })} />
            </div>
            <div>
              <Label>Contenu long</Label>
              <Textarea rows={10} value={publicationForm.contenu_long} onChange={(e) => setPublicationForm({ ...publicationForm, contenu_long: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type de média</Label>
                <Select value={publicationForm.type_media_principal} onValueChange={(v: any) => setPublicationForm({ ...publicationForm, type_media_principal: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="texte">Texte</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Catégorie</Label>
                <Select value={publicationForm.categorie_id} onValueChange={(v) => setPublicationForm({ ...publicationForm, categorie_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Équipe</Label>
              <Select value={publicationForm.equipe_id} onValueChange={(v) => setPublicationForm({ ...publicationForm, equipe_id: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  {teams.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={publicationForm.featured} onCheckedChange={(v) => setPublicationForm({ ...publicationForm, featured: v })} />
                <Label>À la une</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={publicationForm.published} onCheckedChange={(v) => setPublicationForm({ ...publicationForm, published: v })} />
                <Label>Publié</Label>
              </div>
            </div>
            <FileUploader onUpload={async (file) => { const m = await handleFileUpload(file); setPublicationForm({ ...publicationForm, image_url: m.url }); }} acceptedTypes={['image/*']} maxSize={10} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublicationModal(false)}>Annuler</Button>
            <Button onClick={handleSavePublication}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Modal */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Modifier' : 'Créer'} un Événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Titre</Label>
              <Input value={eventForm.titre} onChange={(e) => setEventForm({ ...eventForm, titre: e.target.value })} />
            </div>
            <div>
              <Label>Description longue</Label>
              <Textarea rows={6} value={eventForm.description_long} onChange={(e) => setEventForm({ ...eventForm, description_long: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <Input type="date" value={eventForm.date_debut} onChange={(e) => setEventForm({ ...eventForm, date_debut: e.target.value })} />
              </div>
              <div>
                <Label>Date de fin (optionnel)</Label>
                <Input type="date" value={eventForm.date_fin} onChange={(e) => setEventForm({ ...eventForm, date_fin: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Heure</Label>
                <Input type="time" value={eventForm.heure} onChange={(e) => setEventForm({ ...eventForm, heure: e.target.value })} />
              </div>
              <div>
                <Label>Lieu</Label>
                <Input value={eventForm.lieu} onChange={(e) => setEventForm({ ...eventForm, lieu: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type d'événement</Label>
                <Select value={eventForm.type_event_id} onValueChange={(v) => setEventForm({ ...eventForm, type_event_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((et) => (
                      <SelectItem key={et.id} value={et.id}>{et.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Statut</Label>
                <Select value={eventForm.statut} onValueChange={(v: any) => setEventForm({ ...eventForm, statut: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a_venir">À venir</SelectItem>
                    <SelectItem value="termine">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Mots-clés (max 4)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={eventForm.keywordInput}
                  onChange={(e) => setEventForm({ ...eventForm, keywordInput: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }}
                  placeholder="Ajouter un mot-clé"
                  disabled={eventForm.keywords.length >= 4}
                />
                <Button type="button" onClick={addKeyword} disabled={eventForm.keywords.length >= 4}>Ajouter</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {eventForm.keywords.map((kw, i) => (
                  <Badge key={i} variant="secondary">
                    {kw}
                    <button onClick={() => removeKeyword(i)} className="ml-2">×</button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Participants max</Label>
                <Input type="number" value={eventForm.max_participants} onChange={(e) => setEventForm({ ...eventForm, max_participants: parseInt(e.target.value) })} />
              </div>
              <div>
                <Label>Prix</Label>
                <Input value={eventForm.prix} onChange={(e) => setEventForm({ ...eventForm, prix: e.target.value })} disabled={eventForm.gratuit} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={eventForm.gratuit} onCheckedChange={(v) => setEventForm({ ...eventForm, gratuit: v })} />
              <Label>Gratuit</Label>
            </div>
            <FileUploader onUpload={async (file) => { const m = await handleFileUpload(file); setEventForm({ ...eventForm, image_url: m.url }); }} acceptedTypes={['image/*']} maxSize={10} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventModal(false)}>Annuler</Button>
            <Button onClick={handleSaveEvent}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Modal */}
      <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Modifier' : 'Ajouter'} une catégorie</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={categoryForm.nom} onChange={(e) => setCategoryForm({ ...categoryForm, nom: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCategoryModal(false)}>Annuler</Button>
            <Button onClick={handleSaveCategory}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Team Modal */}
      <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Modifier' : 'Ajouter'} une équipe</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={teamForm.nom} onChange={(e) => setTeamForm({ ...teamForm, nom: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={teamForm.description} onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTeamModal(false)}>Annuler</Button>
            <Button onClick={handleSaveTeam}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Event Type Modal */}
      <Dialog open={showEventTypeModal} onOpenChange={setShowEventTypeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingEventType ? 'Modifier' : 'Ajouter'} un type d'événement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input value={eventTypeForm.nom} onChange={(e) => setEventTypeForm({ ...eventTypeForm, nom: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={eventTypeForm.description} onChange={(e) => setEventTypeForm({ ...eventTypeForm, description: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEventTypeModal(false)}>Annuler</Button>
            <Button onClick={handleSaveEventType}><Save className="w-4 h-4 mr-2" />Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
