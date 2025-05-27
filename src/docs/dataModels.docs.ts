import { AccountDMSchema } from 'src/app/entities/dms/accounts.dm';
import { AuthAttemptsDMSchema } from 'src/app/entities/dms/authAttempts.dm';
import { FamilyDMSchema } from 'src/app/entities/dms/families.dm';
import { PatientDMSchema } from 'src/app/entities/dms/patients.dm';
import { RelationshipDMSchema } from 'src/app/entities/dms/relationships.dm';
import { SessionDMSchema } from 'src/app/entities/dms/sessions.dm';
import { IOpenApiManager } from 'src/general/managers/openapi.manager';

export class DMDocs {
  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerSchema('Patient Data Model', PatientDMSchema);
    this.manager.registerSchema('Account Data Model', AccountDMSchema);
    this.manager.registerSchema('Session Data Model', SessionDMSchema);
    this.manager.registerSchema('Family Data Model', FamilyDMSchema);
    this.manager.registerSchema('Relationship Data Model', RelationshipDMSchema);
    this.manager.registerSchema('Auth Attempt Data Model', AuthAttemptsDMSchema);
  }
}
