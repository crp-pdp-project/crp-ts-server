import { CardDTO } from 'src/app/entities/dtos/service/card.dto';
import { Devices } from 'src/app/entities/models/device/device.model';
import { NiubizClient } from 'src/clients/niubiz/niubiz.client';

export interface IGetPOSCardTokenRepository {
  execute(transactionToken: string, token: string): Promise<CardDTO>;
}

export class GetPOSCardTokenRepository implements IGetPOSCardTokenRepository {
  async execute(transactionToken: string, token: string): Promise<CardDTO> {
    const client = await NiubizClient.createClinet(Devices.WEB);
    const card = await client.getCardToken(transactionToken, token);
    return card;
  }
}

export class GetPOSCardTokenRepositoryMock implements IGetPOSCardTokenRepository {
  async execute(): Promise<CardDTO> {
    return Promise.resolve({
      errorCode: 0,
      errorMessage: 'OK',
      header: {
        ecoreTransactionUUID: '51e19cf3-da83-4101-9dbe-a45220b70ebe',
        ecoreTransactionDate: 1604164339933,
        millis: 82,
      },
      card: {
        cardNumber: '428597******7724',
        brand: 'visa',
        expirationMonth: '02',
        expirationYear: '2028',
        firstName: 'Juan',
        lastName: 'Perez',
      },
      order: {
        transactionToken: '3ECC447FB24D438F8C447FB24D338FAF',
        purchaseNumber: 2020103102,
        amount: 10.5,
        currency: 'PEN',
        actionCode: '000',
        actionDescription: 'Aprobado y completado con exito',
        status: 'Verified',
        traceNumber: '296021',
        transactionDate: '201031121115',
        transactionId: '993203050276247',
      },
      token: {
        tokenId: '7000010038737742',
        ownerId: 'QA124',
        expireOn: '251030121119',
      },
    });
  }
}
