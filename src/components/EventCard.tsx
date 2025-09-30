import { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Euro } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/services/apiClient';

interface Event {
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
  price: string | null;
  registrationDeadline: string;
  tags: string[];
}
import { useToast } from '@/hooks/use-toast';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'upcoming' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground';
  };

  const getStatusText = (status: string) => {
    return status === 'upcoming' ? 'À venir' : 'Terminé';
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiClient.registerForEvent(event.id, formData);
      if (result.success) {
        toast({
          title: "Inscription confirmée",
          description: result.message,
        });
        setIsModalOpen(false);
        setFormData({ name: '', email: '' });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableSpots = event.maxParticipants - event.currentParticipants;
  const isFull = availableSpots <= 0;

  return (
    <>
      <div className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 card-3d">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium animate-glow ${
              event.status === 'upcoming' 
                ? 'bg-green-500 text-white' 
                : event.status === 'past'
                ? 'bg-gray-500 text-white'
                : 'bg-blue-500 text-white'
            }`}>
              {event.status === 'upcoming' ? 'À venir' : 
               event.status === 'past' ? 'Terminé' : 'En cours'}
            </span>
            <Badge variant="outline" className="bg-background/90">
              {event.type}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold leading-tight">{event.title}</h3>

            <p className="text-muted-foreground text-sm">
              {event.description}
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDate(event.date)}
                  {event.date !== event.endDate && ` - ${formatDate(event.endDate)}`}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{event.time}</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{event.location}</span>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <span>
                  {event.currentParticipants}/{event.maxParticipants} participants
                  {isFull && <span className="text-destructive ml-1">(Complet)</span>}
                </span>
              </div>

              {!event.isFree && (
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-primary" />
                  <span>{event.price}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4">
            {event.status === 'upcoming' && !isFull && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="w-full btn-hero button-3d"
              >
                Je participe
              </Button>
            )}
            {event.status === 'upcoming' && isFull && (
              <Button disabled className="w-full">
                Événement complet
              </Button>
            )}
            {event.status === 'past' && (
              <Button disabled variant="outline" className="w-full">
                Événement terminé
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inscription à l'événement</DialogTitle>
            <DialogDescription>
              {event.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="btn-hero">
                {isLoading ? 'Inscription...' : 'Confirmer l\'inscription'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventCard;