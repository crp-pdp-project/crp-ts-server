import { PatientDM } from 'src/app/entities/dms/patients.dm';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { InetumClient, InetumHistoryServices } from 'src/clients/inetum.client';
import { CRPConstants } from 'src/general/contants/crp.constants';
import { EnvHelper } from 'src/general/helpers/env.helper';

type ObtainPDFDocumentInput = {
  usuario: string;
  contrasena: string;
  peticionObtenerInformePdf: {
    IdEpisodio: string;
    IdCentro: string;
    IdPaciente: string;
    CanalEntrada: string;
  };
};

type ObtainPDFDocumentOutput = {
  ObtenerInformePdfResult: {
    FicheroPdf?: string;
  };
};

export interface IObtainPDFDocumentRepository {
  execute(fmpId: PatientDM['fmpId'], documentId: string): Promise<string>;
}

export class ObtainPDFDocumentRepository implements IObtainPDFDocumentRepository {
  private readonly user: string = EnvHelper.get('INETUM_USER');
  private readonly password: string = EnvHelper.get('INETUM_PASSWORD');

  async execute(fmpId: PatientDM['fmpId'], documentId: string): Promise<string> {
    const methodPayload = this.parseInput(fmpId, documentId);
    const instance = await InetumClient.getInstance();
    const rawResult = await instance.history.call<ObtainPDFDocumentOutput>(
      InetumHistoryServices.GET_PDF_DOCUMENT,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(fmpId: PatientDM['fmpId'], documentId: string): ObtainPDFDocumentInput {
    return {
      usuario: this.user,
      contrasena: this.password,
      peticionObtenerInformePdf: {
        IdEpisodio: documentId,
        IdCentro: CRPConstants.CENTER_ID,
        IdPaciente: fmpId,
        CanalEntrada: CRPConstants.ORIGIN,
      },
    };
  }

  private parseOutput(rawResult: ObtainPDFDocumentOutput): string {
    const file = rawResult?.ObtenerInformePdfResult?.FicheroPdf;
    if (!file) {
      throw ErrorModel.notFound({ message: 'PDF file not found' });
    }

    return file;
  }
}

export class ObtainPDFDocumentRepositoryMock implements IObtainPDFDocumentRepository {
  async execute(): Promise<string> {
    return 'base64';
  }
}
