import { PosConstants } from 'src/general/contants/pos.constants';
import { PatientDocumentType } from 'src/general/enums/patientInfo.enum';

import { SignInSessionModel } from '../../session/signInSession.model';
import { GenerateMDDStrategy, MDDVariants } from '../posConfig.model';

export class MDD32Strategy implements GenerateMDDStrategy {
  genMDD(session: SignInSessionModel): Record<string, string> {
    const documentPrefix = this.getDocumentPrefix(session.patient.documentType);
    return { [MDDVariants.MDD32]: `${documentPrefix}${session.patient.documentNumber}` };
  }

  private getDocumentPrefix(documentType: PatientDocumentType): string {
    switch (documentType) {
      case PatientDocumentType.DNI:
        return PosConstants.DNI_TYPE;
      case PatientDocumentType.CE:
        return PosConstants.CE_TYPE;
      case PatientDocumentType.PASS:
        return PosConstants.PASSPORT_TYPE;
    }
  }
}
