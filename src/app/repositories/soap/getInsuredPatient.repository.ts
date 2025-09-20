import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { SitedsClient, SitedsServices } from 'src/clients/siteds.client';

type GetInsuradePatientInput = {
  getConsultaAsegNomRequest: {
    coExcepcion: string;
    txNombre: string;
    coIafa: string;
    txPeticion: string;
  };
};

type GetInsuradePatientOutput = {
  getConsultaAsegNomResponse: {
    coError: string;
    txNombre: string;
    coIafa: string;
    txRespuesta: string;
  };
};

export interface IGetInsuradePatientRepository {
  execute(iafaId: string, x12: string): Promise<string>;
}

export class GetInsuradePatientRepository implements IGetInsuradePatientRepository {
  async execute(iafaId: string, x12: string): Promise<string> {
    const methodPayload = this.parseInput(iafaId, x12);
    const instance = await SitedsClient.getInstance();
    const rawResult = await instance.client.call<GetInsuradePatientOutput>(
      SitedsServices.INSURANCE_DETAILS,
      methodPayload,
    );
    return this.parseOutput(rawResult);
  }

  private parseInput(iafaId: string, x12: string): GetInsuradePatientInput {
    return {
      getConsultaAsegNomRequest: {
        coExcepcion: '0000',
        txNombre: '270_CON_ASE',
        coIafa: iafaId,
        txPeticion: x12,
      },
    };
  }

  private parseOutput(rawResult: GetInsuradePatientOutput): string {
    const { getConsultaAsegNomResponse: result } = rawResult;

    if (result.coError !== '0000') {
      throw ErrorModel.badRequest({ message: 'Error consulting Siteds endpoints' });
    }

    return result.txRespuesta;
  }
}

export class GetInsuradePatientRepositoryMock implements IGetInsuradePatientRepository {
  async execute(): Promise<string> {
    return `
      ISA*00* *00* *ZZ*40007*ZZ*980001C*171025*13:5*|*00501*250000003*0*T*:~
      GS*HB*40007*980001C*20171025*13:56:23*041002113*X*00501~
      ST*271*83646481~
      BHT*0022*11~
      HL*1**20*1~
      NM1*PR*2********PI*40007~
      REF*OL*X***Y8:X:::::~
      DTP*163*D8*00000000~
      HL*2*1*21*1~
      NM1*1P*2********FI*20100054184~
      HL*3*2*22*0~
      NM1*3*1*DELGADO*MERY ISABEL******MI*9468332***EDUARDO~
      REF*ACC*6~
      REF*DD*1***4A:72208776::::~
      REF*EI*9468332~
      REF*CT****AZ::ID:TY:1~
      REF*PRT*E1*AMI ACCIT.ESTUDIANTE~
      REF*18*118830***IMP:3:ZZ:1:::~
      REF*ZZ*1~
      REF*ZZ*S***3B:Q00::::~
      DMG*D8*19950415*2*1~
      DTP*356*D8*20170901~
      DTP*357*D8*20180228~
      NM1*P5*2*UNIVERSIDAD CATOLICA DE SANTA MARIA*UNIVERSIDAD CATOLICA DE SANTA MARIA*******UNIVERSIDAD CATOLICA DE SANTA MARIA~
      REF*DD*8***XX5:20141637941::::~
      NM1*C9*1*DELGADO*MERY ISABEL******MI*9468332***EDUARDO~
      REF*DD*1***4A:72208776::::~
      DTP*382*D8*20170901~
      EB*1***2***0*0*1*1***ZZ:1:::::::~
      REF*D7*2***ZZ:101::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***4***0*0*1*1***ZZ:1:::::::~
      REF*D7*4***ZZ:118::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***6***0*0*1*1***ZZ:2:::::::~
      REF*D7*6***ZZ:101::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***4***0*0*1*1***ZZ:1:::::::~
      REF*D7*4***ZZ:401::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***6***0*0*1*1***ZZ:1:::::::~
      REF*D7*6***ZZ:401::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***5***0*0*1*1***ZZ:1:::::::~
      REF*D7*5***ZZ:200::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***5***0*0*1*1***ZZ:1:::::::~
      REF*D7*5***ZZ:101::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      EB*1***4***0*0*1*1***ZZ:1:::::::~
      REF*D7*4***ZZ:600::::~
      MSG**~
      MSG**~
      EB*C***1***0***VS*0***~
      EB*1***100~~~~
      EB*0~~~ 
      DTP*327*D8*00000000~
      DTP*338*D8*00000000~
      SE*100*83646481~
      GE*1*041002113~
      IEA*1*250000003~
    `;
  }
}
