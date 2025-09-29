import { DocumentTypeMapper } from 'src/general/enums/patientInfo.enum';

import { SignInSessionModel } from '../../session/signInSession.model';
import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD32Strategy implements GenerateMDDStrategy {
  genMDD(session: SignInSessionModel): Record<string, string> {
    const documentPrefix = DocumentTypeMapper.getPosDocumentType(session.patient.documentType);
    return { [MDDVariants.MDD32]: `${documentPrefix}${session.patient.documentNumber}` };
  }
}
