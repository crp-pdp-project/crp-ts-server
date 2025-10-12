import { EmployeeDTO } from 'src/app/entities/dtos/service/employee.dto';
import { ErrorModel } from 'src/app/entities/models/error/error.model';
import { CRPClient, CRPServicePaths } from 'src/clients/crp/crp.client';
import { EmployeeConstants } from 'src/general/contants/employee.constants';
import { ClientErrorMessages } from 'src/general/enums/clientErrorMessages.enum';
import { HttpMethod } from 'src/general/enums/methods.enum';

type LoginEmployeeInput = {
  usuario: string;
  contrasenia: string;
};

type LoginEmployeeOutput = {
  data: {
    status: string;
    mensaje: string;
    autorizaciones: [
      {
        descripcion: string;
        detalles: [
          {
            valor: string;
            parametro: string;
            mensaje: string;
          },
        ];
      },
    ];
  };
  esCorrecto: boolean;
};

export interface ILoginEmployeeRepository {
  execute(username: string, password: string): Promise<EmployeeDTO>;
}

export class LoginEmployeeRepository implements ILoginEmployeeRepository {
  private readonly crp = CRPClient.instance;

  async execute(username: string, password: string): Promise<EmployeeDTO> {
    const input = this.parseInput(username, password);
    const rawResult = await this.crp.call<LoginEmployeeOutput>({
      method: HttpMethod.POST,
      path: CRPServicePaths.AUTH_EMPLOYEES,
      body: input,
    });
    return this.parseOutput(rawResult, username);
  }

  private parseInput(username: string, password: string): LoginEmployeeInput {
    return {
      usuario: username,
      contrasenia: password,
    };
  }

  private parseOutput(rawResult: LoginEmployeeOutput, username: string): EmployeeDTO {
    const { data, esCorrecto } = rawResult;

    if (!esCorrecto || !data) {
      throw ErrorModel.notFound({ detail: ClientErrorMessages.EMPLOYEE_AUTH_INVALID });
    }

    const usernameAuthorization = data.autorizaciones.find(
      (auth) => auth.descripcion === EmployeeConstants.USERNAME_AUTH,
    );
    const nameAuthorization = data.autorizaciones.find((auth) => auth.descripcion === EmployeeConstants.NAME_AUTH);

    return {
      username,
      internalUsername: usernameAuthorization?.detalles?.[0]?.valor,
      name: nameAuthorization?.detalles?.[0]?.valor,
    };
  }
}

export class LoginEmployeeRepositoryMock implements ILoginEmployeeRepository {
  async execute(): Promise<EmployeeDTO> {
    return Promise.resolve({
      username: 'PRUEBA',
      name: 'Prueba',
    });
  }
}
