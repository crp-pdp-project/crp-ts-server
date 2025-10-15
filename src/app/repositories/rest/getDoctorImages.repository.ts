import { DoctorDTO } from 'src/app/entities/dtos/service/doctor.dto';
import { SpecialtyDTO } from 'src/app/entities/dtos/service/specialty.dto';
import { PDPClient, PDPServicePaths } from 'src/clients/pdp/pdp.client';
import { HttpMethod } from 'src/general/enums/methods.enum';

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
  private readonly pdp = PDPClient.instance;

  async execute(specialtyId?: SpecialtyDTO['id'], doctorId?: DoctorDTO['id']): Promise<DoctorDTO[]> {
    const methodPayload = this.parseInput(specialtyId, doctorId);
    const rawResult = await this.pdp.call<GetDoctorImagesOutput>({
      method: HttpMethod.POST,
      path: PDPServicePaths.GET_DOCTOR_IMAGES,
      body: methodPayload,
    });
    return this.parseOutput(rawResult);
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
    return Promise.resolve([
      {
        id: '000075631',
        profileImage:
          'https://svsiwnapdev02.crp.com.pe/DatosMedicosApiRest/api/Medico/VerImagen?nombreImagen=bMgK7XmYN6gC2lPS3uC2Vg',
      },
    ]);
  }
}
