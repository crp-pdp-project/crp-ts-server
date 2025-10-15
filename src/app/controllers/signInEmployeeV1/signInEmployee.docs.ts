import { SignInEmployeeBodyDTOSchema } from 'src/app/entities/dtos/input/signInEmployee.input.dto';
import { SignInEmployeeOutputDTOSchema } from 'src/app/entities/dtos/output/signInEmployee.output.dto';
import { OkResponseDTOSchema } from 'src/app/entities/dtos/response/ok.response.dto';
import { HttpSpecMethod } from 'src/general/enums/methods.enum';
import { StatusCode } from 'src/general/enums/status.enum';
import { IOpenApiManager } from 'src/general/managers/openapi/openapi.manager';

export class SignInEmployeeV1Docs {
  private readonly version: string = '/v1';

  constructor(private readonly manager: IOpenApiManager) {}

  registerDocs(): void {
    this.manager.registerRoute({
      method: HttpSpecMethod.POST,
      path: `${this.version}/employees/sign-in`,
      description: 'Sign in a patient',
      tags: ['back-office', 'employees'],
      body: SignInEmployeeBodyDTOSchema,
      responses: {
        [StatusCode.OK]: OkResponseDTOSchema.extend({
          data: SignInEmployeeOutputDTOSchema,
        }),
      },
    });
  }
}
