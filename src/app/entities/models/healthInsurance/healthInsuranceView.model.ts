import { HealthInsuranceDTO } from '../../dtos/service/healthInsurance.dto';
import { BulletsElementModel } from '../view/bulletsElement.model';
import { ImageElementModel } from '../view/imageElement.model';
import { ParagraphElementModel } from '../view/paragraphElement.model';
import { SubTitleElementModel } from '../view/subTitleElement.model';
import { TitleElementModel } from '../view/titleElement.model';
import { ViewModel } from '../view/view.model';

export class HealthInsuranceViewModel extends ViewModel {
  readonly pdfUrl?: string;

  constructor(healthInsurance: HealthInsuranceDTO) {
    super();

    this.pdfUrl = healthInsurance.pdfUrl;
    if (healthInsurance.banner) this.addElement(new ImageElementModel({ path: healthInsurance.banner }));
    if (healthInsurance.title) this.addElement(new TitleElementModel({ text: healthInsurance.title }));
    if (healthInsurance.paragraph) this.addElement(new ParagraphElementModel({ text: healthInsurance.paragraph }));
    if (healthInsurance.subtitle) this.addElement(new SubTitleElementModel({ text: healthInsurance.subtitle }));
    if (healthInsurance.bullets) this.addElement(new BulletsElementModel({ items: healthInsurance.bullets }));
  }
}
