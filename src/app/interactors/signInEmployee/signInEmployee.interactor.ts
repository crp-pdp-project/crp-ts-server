import { SignInEmployeeBodyDTO } from 'src/app/entities/dtos/input/signInEmployee.input.dto';
import { EmployeeSessionPayloadDTO } from 'src/app/entities/dtos/service/employeeSessionPayload.dto';
import { EmployeeModel } from 'src/app/entities/models/employee/employee.model';
import { EmployeeTokenModel } from 'src/app/entities/models/employee/employeeToken.model';
import {
  IUpsertEmployeeSessionRepository,
  UpsertEmployeeSessionRepository,
} from 'src/app/repositories/database/upsertEmployeeSession.respository';
import {
  ISignInEmployeeRepository,
  SignInEmployeeRepository,
} from 'src/app/repositories/rest/signInEmployee.repository';
import { IJWTManager, JWTManagerBuilder } from 'src/general/managers/jwt/jwt.manager';

export interface ISignInEmployeeInteractor {
  signIn(body: SignInEmployeeBodyDTO): Promise<EmployeeTokenModel>;
}

export class SignInEmployeeInteractor implements ISignInEmployeeInteractor {
  constructor(
    private readonly signInEmployee: ISignInEmployeeRepository,
    private readonly saveSessionRepository: IUpsertEmployeeSessionRepository,
    private readonly jwtManager: IJWTManager<EmployeeSessionPayloadDTO>,
  ) {}

  async signIn(body: SignInEmployeeBodyDTO): Promise<EmployeeTokenModel> {
    const employeeModel = await this.getEmployee(body);
    const sessionModel = await this.generateJwtToken(employeeModel);
    await this.persistSession(sessionModel);

    return sessionModel;
  }

  private async getEmployee(body: SignInEmployeeBodyDTO): Promise<EmployeeModel> {
    const employee = await this.signInEmployee.execute(body.username, body.password);
    const model = new EmployeeModel(employee);

    return model;
  }

  private async generateJwtToken(employee: EmployeeModel): Promise<EmployeeTokenModel> {
    const token = await this.jwtManager.generateToken(employee.toSessionPayload());
    const employeeTokenModel = new EmployeeTokenModel(employee, token);

    return employeeTokenModel;
  }

  private async persistSession(sessionModel: EmployeeTokenModel): Promise<void> {
    await this.saveSessionRepository.execute(sessionModel.toPersisSessionPayload());
  }
}

export class SignInEmployeeInteractorBuilder {
  static build(): SignInEmployeeInteractor {
    return new SignInEmployeeInteractor(
      new SignInEmployeeRepository(),
      new UpsertEmployeeSessionRepository(),
      JWTManagerBuilder.buildEmployeeConfig(),
    );
  }
}
