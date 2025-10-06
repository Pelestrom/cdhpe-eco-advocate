import { useEffect, useState } from 'react';
import { Calendar, MapPin, Filter } from 'lucide-react';
import EventCard from '@/components/EventCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient } from '@/services/apiClient';

// Local Event interface for legacy data
interface EventLegacy {
  id: string;
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
  price: string | null; // Made required to match EventCard
  registrationDeadline: string;
  tags: string[];
}

const Evenement = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<EventLegacy[]>([]);
  const [pastEvents, setPastEvents] = useState<EventLegacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const [upcoming, past] = await Promise.all([
          apiClient.getUpcomingEvents(),
          apiClient.getPastEvents()
        ]);
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getFilteredEvents = (events: EventLegacy[]) => {
    if (typeFilter === 'all') return events;
    return events.filter(event => event.type === typeFilter);
  };

  const allEvents = [...upcomingEvents, ...pastEvents];
  const eventTypes = Array.from(new Set(allEvents.map(event => event.type)));

  const upcomingFiltered = getFilteredEvents(upcomingEvents);
  const pastFiltered = getFilteredEvents(pastEvents);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Événements</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participez à nos conférences, formations et actions pour promouvoir 
            les droits de l'homme et protéger l'environnement.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {upcomingEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">Événements à venir</div>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {pastEvents.length}
            </div>
            <div className="text-sm text-muted-foreground">Événements organisés</div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-secondary/5 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold gradient-text mb-2">
              {allEvents.reduce((sum, event) => sum + event.currentParticipants, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Participants total</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
            <TabsList className="grid w-full md:w-auto grid-cols-2">
              <TabsTrigger value="upcoming" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>À venir ({upcomingFiltered.length})</span>
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Passés ({pastFiltered.length})</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="upcoming">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                    <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : upcomingFiltered.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun événement à venir</h3>
                <p className="text-muted-foreground">
                  {typeFilter !== 'all' 
                    ? `Aucun événement de type "${typeFilter}" prévu pour le moment.`
                    : 'Aucun événement prévu pour le moment. Revenez bientôt !'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingFiltered.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card rounded-lg p-6 animate-pulse">
                    <div className="w-full h-48 bg-muted rounded-lg mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : pastFiltered.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun événement passé</h3>
                <p className="text-muted-foreground">
                  {typeFilter !== 'all' 
                    ? `Aucun événement de type "${typeFilter}" dans l'historique.`
                    : 'Aucun événement dans l\'historique pour le moment.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastFiltered.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Organisez un événement avec nous
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Vous souhaitez organiser un événement en partenariat avec le CDHPE ? 
            Contactez-nous pour discuter de votre projet.
          </p>
          <Button className="btn-hero">
            Proposer un événement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Evenement;