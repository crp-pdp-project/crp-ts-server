import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SitedsClient, SitedsServices } from 'src/clients/siteds.client';

type GetInsuradePricesInput = {
  getConsultaAsegCodRequest: {
    coExcepcion: string;
    txNombre: string;
    coIafa: string;
    txPeticion: string;
  };
};

type GetInsuradePricesOutput = {
  getConsultaAsegCodResponse: {
    coError: string;
    txNombre: string;
    coIafa: string;
    txRespuesta: string;
  };
};

export interface IGetInsuradePricesRepository {
  execute(iafaId: string, x12: string): Promise<string>;
}

export class GetInsuradePricesRepository implements IGetInsuradePricesRepository {
  async execute(iafaId: string, x12: string): Promise<string> {
    const methodPayload = this.parseInput(iafaId, x12);
    const instance = await SitedsClient.getInstance();
    const rawResult = await instance.client.call<GetInsuradePricesOutput>(
      SitedsServices.INSURANCE_PRICES,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(iafaId: string, x12: string): GetInsuradePricesInput {
    return {
      getConsultaAsegCodRequest: {
        coExcepcion: '0000',
        txNombre: '270_CON_ASE',
        coIafa: iafaId,
        txPeticion: x12,
      },
    };
  }

  private parseOutput(rawResult: GetInsuradePricesOutput): string {
    const { getConsultaAsegCodResponse: result } = rawResult;

    if (result.coError !== '0000') {
      throw ErrorModel.badRequest({ message: 'Error consulting Siteds endpoints' });
    }

    return result.txRespuesta;
  }
}

export class GetInsuradePricesRepositoryMock implements IGetInsuradePricesRepository {
  async execute(): Promise<string> {
    return `
      ISA*00* *00* *ZZ*20001*ZZ*980001C*171025*10:0*|*00501*250000001*0*T*:~
      GS*HB*20001*980001C*20171025*10:04:53*041210389*X*00501~
      ST*271*70545879~
      BHT*0022*11~
      HL*1**20*1~
      NM1*PR*2********PI*20001~
      HL*2*1*21*1~
      NM1*1P*2********FI*20100054184~
      HL*3*2*22*0~
      NM1*IL*1*DELGADO*MARY ISABEL******MI*9468332***EDUARDO~
      REF*ACC*1~
      REF*DD*1***4A:72208776:::::~
      REF*CT*1~
      REF*PRT*S*SALUD EPS*ZZ:20250101::::~
      REF*ZZ*1~
      REF*18*114255~
      DMG*D8*19950415*2*1~
      NM1*P5*2*LADRILLERA EL DIAMANTE*LADRILLERA EL DIAMANTE*******LADRILLERA EL DIAMANTE~
      REF*DD*8***XX5:20120877055::::~
      NM1*IL*1*DELGADO*MARY ISABEL******MI*9468332***EDUARDO~
      REF*ACC*6~
      REF*DD*1***4A:72208776::::~
      REF*CT*1~
      REF*PRT*E2*ACC. ESTUD. COMP.*ZZ:20160901::::~
      REF*ZZ*1~
      REF*18*118831~
      DMG*D8*19950415*2*1~
      NM1*P5*2*SANTA MARIA*SANTA MARIA*******SANTA MARIA~
      REF*DD*8***XX5:20141637941::::~
      NM1*IL*1*DELGADO*MARY ISABEL******MI*9468332***EDUARDO~
      REF*ACC*6~
      REF*DD*1***4A:72208776::::~
      REF*CT*1~
      REF*PRT*E1*AMI ACCIT.ESTUDIANTE*ZZ:20170901::::~
      REF*ZZ*1~
      REF*18*118830~
      DMG*D8*19950415*2*1~
      NM1*P5*2*SANTA MARIA*SANTA MARIA*******SANTA MARIA~
      REF*DD*8***XX5:20141637941::::~
      SE*39*70545879~
      GE*1*041210389~
      IEA*1*250000001~
    `;
  }
}
