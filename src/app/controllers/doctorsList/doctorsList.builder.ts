import { DoctorsListOutputDTOSchema } from 'src/app/entities/dtos/output/doctorsList.output.dto';
import { DoctorModel } from 'src/app/entities/models/doctor.model';
import { DoctorsListInteractor } from 'src/app/interactors/doctorsList/doctorsList.interactor';
import { ResponseInteractor } from 'src/app/interactors/response/response.interactor';
import { SuccessResponseStrategy } from 'src/app/interactors/response/strategies/successResponse.strategy';
import { GetDoctorImagesRepository } from 'src/app/repositories/rest/getDoctorImages.repository';
import { GetDoctorsRepository } from 'src/app/repositories/soap/getDoctors.repository';

import { DoctorsListController } from './doctorsList.controller';

export class DoctorsListBuilder {
  static build(): DoctorsListController {
    const getDoctors = new GetDoctorsRepository();
    const getImages = new GetDoctorImagesRepository();
    const responseStrategy = new SuccessResponseStrategy(DoctorsListOutputDTOSchema);
    const doctorsInteractor = new DoctorsListInteractor(getDoctors, getImages);
    const responseInteractor = new ResponseInteractor<DoctorModel[]>(responseStrategy);

    return new DoctorsListController(doctorsInteractor, responseInteractor);
  }
}
