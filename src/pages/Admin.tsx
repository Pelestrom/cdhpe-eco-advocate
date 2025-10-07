import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, FileText, Calendar, Users, Image, MessageSquare, Settings, Activity, Plus, CreditCard as Edit, Trash2, Eye, Upload, Save, X } from 'lucide-react';
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
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Form states
  const [publicationForm, setPublicationForm] = useState<{
    titre: string;
    chapeau: string;
    contenu_long: string;
    type_media_principal: 'texte' | 'image' | 'video' | 'audio';
    categorie_id: string;
    equipe_id: string;
    featured: boolean;
    published: boolean;
  }>({
    titre: '',
    chapeau: '',
    contenu_long: '',
    type_media_principal: 'texte',
    categorie_id: '',
    equipe_id: '',
    featured: false,
    published: true
  });

  const [eventForm, setEventForm] = useState({
    titre: '',
    description_long: '',
    statut: 'a_venir' as const,
    date_debut: '',
    date_fin: '',
    heure: '',
    lieu: '',
    type_event_id: '',
    keywords: [] as string[],
    max_participants: 100,
    prix: '',
    gratuit: true
  });

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

  const handleCreatePublication = async () => {
    try {
      const newPublication = await apiService.adminCreatePublication(publicationForm);
      setPublications([newPublication, ...publications]);
      setShowPublicationModal(false);
      resetPublicationForm();
      toast({
        title: "Publication créée",
        description: "La publication a été créée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de la publication",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePublication = async () => {
    if (!editingPublication) return;

    try {
      const updatedPublication = await apiService.adminUpdatePublication(
        editingPublication.id, 
        publicationForm
      );
      setPublications(publications.map(p => 
        p.id === editingPublication.id ? updatedPublication : p
      ));
      setShowPublicationModal(false);
      setEditingPublication(null);
      resetPublicationForm();
      toast({
        title: "Publication mise à jour",
        description: "La publication a été mise à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la publication",
        variant: "destructive"
      });
    }
  };

  const handleDeletePublication = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;

    try {
      await apiService.adminDeletePublication(id);
      setPublications(publications.filter(p => p.id !== id));
      toast({
        title: "Publication supprimée",
        description: "La publication a été supprimée avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la publication",
        variant: "destructive"
      });
    }
  };

  const handleCreateEvent = async () => {
    try {
      const newEvent = await apiService.adminCreateEvent(eventForm);
      setEvents([newEvent, ...events]);
      setShowEventModal(false);
      resetEventForm();
      toast({
        title: "Événement créé",
        description: "L'événement a été créé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'événement",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const uploadedMedia = await apiService.adminUploadMedia(file);
      setMedia([uploadedMedia, ...media]);
      toast({
        title: "Fichier uploadé",
        description: "Le fichier a été uploadé avec succès",
      });
      return uploadedMedia;
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'upload du fichier",
        variant: "destructive"
      });
      throw error;
    }
  };

  const resetPublicationForm = () => {
    setPublicationForm({
      titre: '',
      chapeau: '',
      contenu_long: '',
      type_media_principal: 'texte',
      categorie_id: '',
      equipe_id: '',
      featured: false,
      published: true
    });
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
      max_participants: 100,
      prix: '',
      gratuit: true
    });
  };

  const openEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setPublicationForm({
      titre: publication.titre,
      chapeau: publication.chapeau,
      contenu_long: publication.contenu_long,
      type_media_principal: publication.type_media_principal as 'texte' | 'image' | 'video' | 'audio',
      categorie_id: publication.categorie_id || '',
      equipe_id: publication.equipe_id || '',
      featured: publication.featured,
      published: publication.published
    });
    setShowPublicationModal(true);
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
            <CardDescription>
              Accès réservé aux administrateurs
            </CardDescription>
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
                  className="focus-ring"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-hero"
              >
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
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Voir le site
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAuthenticated(false);
                  setPassword('');
                }}
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="publications" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Publications</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Événements</span>
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Participants</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Médias</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Logs</span>
            </TabsTrigger>
          </TabsList>

          {/* Publications Tab */}
          <TabsContent value="publications" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestion des Publications</h2>
              <Button
                onClick={() => {
                  resetPublicationForm();
                  setEditingPublication(null);
                  setShowPublicationModal(true);
                }}
                className="btn-hero"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Publication
              </Button>
            </div>

            <div className="grid gap-4">
              {publications.map((publication) => (
                <Card key={publication.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{publication.titre}</h3>
                          {publication.featured && (
                            <Badge variant="secondary">À la une</Badge>
                          )}
                          {!publication.published && (
                            <Badge variant="outline">Brouillon</Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {publication.chapeau}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Catégorie: {publication.categories?.nom || 'Non définie'}</span>
                          <span>Équipe: {publication.teams?.nom || 'Non définie'}</span>
                          <span>
                            {new Date(publication.date_publication).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditPublication(publication)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePublication(publication.id)}
                        >
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
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Gestion des Événements</h2>
              <Button
                onClick={() => {
                  resetEventForm();
                  setEditingEvent(null);
                  setShowEventModal(true);
                }}
                className="btn-hero"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Événement
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{event.titre}</h3>
                          <Badge variant={event.statut === 'a_venir' ? 'default' : 'secondary'}>
                            {event.statut === 'a_venir' ? 'À venir' : 'Terminé'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">
                          {event.description_long.substring(0, 150)}...
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>
                            {new Date(event.date_debut).toLocaleDateString('fr-FR')}
                          </span>
                          <span>{event.lieu}</span>
                          <span>{event.participants_count}/{event.max_participants} participants</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Open edit modal
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Delete event
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="participants">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Participants aux Événements</h2>
              {/* Participants list */}
            </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Galerie Multimédia</h2>
              {/* Media gallery */}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Messages de Contact</h2>
              {/* Messages list */}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Paramètres</h2>
              {/* Settings forms */}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Journal d'Activité</h2>
              {/* Activity logs */}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publication Modal */}
      <Dialog open={showPublicationModal} onOpenChange={setShowPublicationModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPublication ? 'Modifier la Publication' : 'Nouvelle Publication'}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de la publication
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titre">Titre *</Label>
                <Input
                  id="titre"
                  value={publicationForm.titre}
                  onChange={(e) => setPublicationForm(prev => ({ ...prev, titre: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type_media">Type de média</Label>
                <Select
                  value={publicationForm.type_media_principal}
                  onValueChange={(value: any) => setPublicationForm(prev => ({ ...prev, type_media_principal: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="texte">Texte</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chapeau">Chapeau (résumé) *</Label>
              <Textarea
                id="chapeau"
                value={publicationForm.chapeau}
                onChange={(e) => setPublicationForm(prev => ({ ...prev, chapeau: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contenu">Contenu complet *</Label>
              <Textarea
                id="contenu"
                value={publicationForm.contenu_long}
                onChange={(e) => setPublicationForm(prev => ({ ...prev, contenu_long: e.target.value }))}
                rows={10}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select
                  value={publicationForm.categorie_id}
                  onValueChange={(value) => setPublicationForm(prev => ({ ...prev, categorie_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipe">Équipe</Label>
                <Select
                  value={publicationForm.equipe_id}
                  onValueChange={(value) => setPublicationForm(prev => ({ ...prev, equipe_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une équipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={publicationForm.featured}
                  onCheckedChange={(checked) => setPublicationForm(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">À la une</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={publicationForm.published}
                  onCheckedChange={(checked) => setPublicationForm(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Publié</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublicationModal(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={editingPublication ? handleUpdatePublication : handleCreatePublication}
              className="btn-hero"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingPublication ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;