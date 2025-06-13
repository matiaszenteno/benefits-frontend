import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Calendar, 
  Building, 
  Star, 
  Clock, 
  FileText, 
  CreditCard, 
  Phone,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Benefit } from '../types/benefit';

interface BenefitModalProps {
  benefit: Benefit;
  isOpen: boolean;
  onClose: () => void;
}

const BenefitModal: React.FC<BenefitModalProps> = ({ benefit, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const location = benefit.location || 'Sin ubicación';

  const handleCopyContact = () => {
    if (benefit.contactInfo) {
      navigator.clipboard.writeText(benefit.contactInfo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {benefit.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {benefit.description}
              </DialogDescription>
            </div>
            {benefit.discount && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-lg px-3 py-1 ml-4">
                {benefit.discount} OFF
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-56 rounded-lg overflow-hidden">
            <img
              src={benefit.imageUrl || './placeholder.svg'}
              alt={benefit.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-foreground">
                {benefit.category}
              </Badge>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{location}</span>
            </div>
            {benefit.provider && (
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-green-500" />
                <span className="font-medium">{benefit.provider}</span>
              </div>
            )}
            {benefit.rating && (
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{benefit.rating} / 5.0</span>
              </div>
            )}
            {benefit.validUntil && (
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Hasta {new Date(benefit.validUntil).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Full Description */}
          {benefit.fullDescription && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-500" />
                Descripción Completa
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.fullDescription}
              </p>
            </div>
          )}

          {/* Valid Days */}
          {benefit.validDays && benefit.validDays.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Días Válidos
              </h3>
              <div className="flex flex-wrap gap-2">
                {benefit.validDays.map((day) => (
                  <Badge 
                    key={day} 
                    variant="outline" 
                    className="border-purple-200 text-purple-600 px-3 py-1"
                  >
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* How to Redeem */}
          {benefit.howToRedeem && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-500" />
                Cómo Canjear
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.howToRedeem}
              </p>
            </div>
          )}

          {/* Terms */}
          {benefit.terms && (
            <div>
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-red-500" />
                Términos y Condiciones
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {benefit.terms}
              </p>
            </div>
          )}

          {/* Contact Info */}
          {benefit.contactInfo && (
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-blue-500" />
                Información de Contacto
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {benefit.contactInfo}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyContact}
                  className="ml-2"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="lg"
          >
            Usar este Beneficio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BenefitModal; 