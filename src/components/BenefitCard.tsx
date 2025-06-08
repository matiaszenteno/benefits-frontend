import { memo } from 'react';
import { Benefit } from '../types/benefit';

interface BenefitCardProps {
  benefit: Benefit;
}

const BenefitCard = memo(({ benefit }: BenefitCardProps) => (
  <div className="benefit-card">
    <div className="benefit-badge">30%</div>
    <div>
      <h3>{benefit.name}</h3>
      <p>{benefit.description}</p>
    </div>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

export default BenefitCard; 