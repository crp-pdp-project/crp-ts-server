import { HealthInsuranceDTO } from '../../dtos/service/healthInsurance.dto';
import { BaseModel } from '../base.model';
import { ErrorModel } from '../error/error.model';

export class HealthInsuranceModel extends BaseModel {
  readonly id?: number;
  readonly title?: string;
  readonly paragraph?: string;
  readonly subtitle?: string;
  readonly bullets?: string[];
  readonly banner?: string | null;
  readonly pdfUrl?: string;
  readonly enabled?: boolean;
  readonly createdAt?: string;
  readonly updatedAt?: string;

  constructor(healthInsurance?: HealthInsuranceDTO) {
    super();

    this.id = healthInsurance?.id;
    this.title = healthInsurance?.title;
    this.paragraph = healthInsurance?.paragraph;
    this.subtitle = healthInsurance?.subtitle;
    this.bullets = healthInsurance?.bullets;
    this.banner = healthInsurance?.banner;
    this.pdfUrl = healthInsurance?.pdfUrl;
    this.enabled = healthInsurance?.enabled;
    this.createdAt = healthInsurance?.createdAt;
    this.updatedAt = healthInsurance?.updatedAt;
  }

  validateInsurance(): this {
    if (!this.title) {
      throw ErrorModel.notFound({ message: 'No health insurance view available' });
    }
    return this;
  }
}
