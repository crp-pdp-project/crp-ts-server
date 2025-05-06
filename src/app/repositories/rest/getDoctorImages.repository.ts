import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { RestClient } from 'src/clients/rest.client';
import { HttpMethod } from 'src/general/enums/methods.enum';
import { DateHelper } from 'src/general/helpers/date.helper';

type AuthTokenInput = {
  Usuario: string;
  Contrasenia: string;
};

type AuthTokenOutput = {
  data: string;
  esCorrecto: boolean;
  mensaje: string;
};

type GetDoctorImagesInput = {
  Documento: string;
  Seccion: string;
};

type GetDoctorImagesOutput = {
  data: {
    documento: string;
    imagen: string;
  }[];
};

export interface IGetDoctorImagesRepository {
  execute(specialtyId?: SpecialtyDTO['id'], doctorId?: DoctorDTO['id']): Promise<DoctorDTO[]>;
}

export class GetDoctorImagesRepository implements IGetDoctorImagesRepository {
  private token = '';
  private tokenExpiresAt = '';
  private tokenPromise: Promise<string> | null = null;
  private readonly rest = RestClient.instance;

  async execute(specialtyId?: SpecialtyDTO['id'], doctorId?: DoctorDTO['id']): Promise<DoctorDTO[]> {
    const token = await this.getToken();
    const methodPayload = this.parseInput(specialtyId, doctorId);
    const rawResult = await this.rest.send<GetDoctorImagesOutput>({
      method: HttpMethod.POST,
      url: process.env.CRP_IMAGES_URL ?? '',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: methodPayload,
    });
    return this.parseOutput(rawResult);
  }

  private async getToken(): Promise<AuthTokenOutput['data']> {
    if (this.isTokenValid()) {
      return this.token;
    }

    if (this.tokenPromise) return this.tokenPromise;

    this.tokenPromise = this.fetchNewToken();
    const token = await this.tokenPromise;

    this.tokenPromise = null;

    return token;
  }

  private async fetchNewToken(): Promise<string> {
    const authTokenInput = this.parseTokenInput();

    const tokenResponse = await this.rest.send<AuthTokenOutput>({
      method: HttpMethod.POST,
      url: process.env.CRP_TOKEN_URL ?? '',
      body: authTokenInput,
    });

    this.token = tokenResponse.data;
    this.tokenExpiresAt = DateHelper.tokenRefreshTime(Number(process.env.CRP_TOKEN_TIMEOUT ?? 55));
    return this.token;
  }

  private isTokenValid(): boolean {
    return !!this.token && !DateHelper.checkExpired(this.tokenExpiresAt);
  }

  private parseTokenInput(): AuthTokenInput {
    return {
      Usuario: process.env.CRP_USER ?? '',
      Contrasenia: process.env.CRP_PASSWORD ?? '',
    };
  }

  private parseInput(specialtyId?: SpecialtyDTO['id'], doctorId?: DoctorDTO['id']): GetDoctorImagesInput {
    return {
      Documento: doctorId ?? '',
      Seccion: specialtyId ?? '',
    };
  }

  private parseOutput(rawResult: GetDoctorImagesOutput): DoctorDTO[] {
    const images: DoctorDTO[] =
      rawResult?.data?.map((doctor) => ({
        id: doctor.documento,
        profileImage: doctor.imagen,
      })) || [];

    return images;
  }
}

export class GetDoctorImagesRepositoryMock implements IGetDoctorImagesRepository {
  async execute(): Promise<DoctorDTO[]> {
    return [
      {
        id: '000075631',
        profileImage:
          'https://svsiwnapdev02.crp.com.pe/DatosMedicosApiRest/api/Medico/VerImagen?nombreImagen=bMgK7XmYN6gC2lPS3uC2Vg',
      },
    ];
  }
}
