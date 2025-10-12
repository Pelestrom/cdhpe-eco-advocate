import { useState, useEffect } from 'react';
import { Heart, Users, Handshake, Mail, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiClient, ContactForm } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

import contactBg from '@/assets/contact-bg.jpg';

const NousSoutenir = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
    helpType: 'volunteer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Smooth scroll to contact section when hash is #contact
  useEffect(() => {
    if (location.hash === '#contact') {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location]);

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiClient.submitContactForm(formData);
      if (result.success) {
        toast({
          title: "Message envoyé",
          description: result.message,
        });
        setFormData({
          name: '',
          email: '',
          message: '',
          helpType: 'volunteer'
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'envoi du message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const supportOptions = [
    {
      icon: Users,
      title: "Bénévolat",
      description: "Rejoignez notre équipe de bénévoles et participez activement à nos actions sur le terrain.",
      benefits: [
        "Formation aux droits de l'homme",
        "Accompagnement juridique des victimes",
        "Sensibilisation communautaire",
        "Actions environnementales"
      ]
    },
    {
      icon: Heart,
      title: "Dons",
      description: "Soutenez financièrement nos actions pour amplifier notre impact sur le terrain.",
      benefits: [
        "Accompagnement juridique gratuit",
        "Formations communautaires",
        "Campagnes de sensibilisation",
        "Actions de protection environnementale"
      ]
    },
    {
      icon: Handshake,
      title: "Partenariats",
      description: "Collaborez avec nous en tant qu'organisation, entreprise ou institution.",
      benefits: [
        "Projets conjoints",
        "Expertise technique",
        "Plaidoyer collectif",
        "Échange de bonnes pratiques"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <section 
        className="relative py-20"
        style={{
          backgroundImage: `url(${contactBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Nous Soutenir
            </h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Ensemble, nous pouvons créer un monde plus juste où les droits de l'homme sont respectés 
              et l'environnement protégé. Découvrez comment vous pouvez contribuer à notre mission.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <Card key={index} className="card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <CardDescription className="text-center">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
          <div id="contact">
            <h2 className="text-2xl font-bold mb-6">Contactez-nous</h2>
            <Card>
              <CardHeader>
                <CardTitle>Comment souhaitez-vous nous aider ?</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et nous vous recontacterons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="focus-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="focus-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="helpType">Type d'aide *</Label>
                    <Select
                      value={formData.helpType}
                      onValueChange={(value: any) => handleInputChange('helpType', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volunteer">Bénévolat</SelectItem>
                        <SelectItem value="donation">Don financier</SelectItem>
                        <SelectItem value="partnership">Partenariat</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Parlez-nous de votre motivation et de la façon dont vous souhaitez contribuer à notre mission..."
                      required
                      className="focus-ring"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-hero"
                  >
                    {isLoading ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information & Impact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Nos coordonnées</h2>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>contact@cdhpe.org</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+243 XX XXX XXXX</span>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Nous nous engageons à répondre à tous les messages dans les 48 heures.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Notre impact</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">500+</div>
                      <div className="text-sm text-muted-foreground">Personnes aidées</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-secondary mb-1">25+</div>
                      <div className="text-sm text-muted-foreground">Formations données</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold gradient-text mb-1">15+</div>
                      <div className="text-sm text-muted-foreground">Victoires juridiques</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-primary mb-1">10+</div>
                      <div className="text-sm text-muted-foreground">Ans d'expérience</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t mt-6">
                    <p className="text-sm text-muted-foreground text-center">
                      Chaque contribution compte et nous rapproche de notre objectif 
                      d'un monde plus juste et durable.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Informations bancaires</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2 text-sm">
                    <div><strong>Banque:</strong> [Nom de la banque]</div>
                    <div><strong>Compte:</strong> [Numéro de compte]</div>
                    <div><strong>Titulaire:</strong> CDHPE</div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Pour les dons internationaux, contactez-nous pour les détails des virements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NousSoutenir;