import { OperateX12BodyDTO, OperateX12ParamsDTO } from 'src/app/entities/dtos/input/operateX12.input.dto';
import { X12OperationModel } from 'src/app/entities/models/x12Operation/x12Operation.model';
import { X12Formats, X12Operations } from 'src/general/enums/x12.enum';
import { ConAse270Config } from 'src/general/managers/x12/config/270ConAse.config';
import { ConCod271Config } from 'src/general/managers/x12/config/271ConCod.config';
import { ConNom271Config } from 'src/general/managers/x12/config/271ConNom.config';
import { X12Manager } from 'src/general/managers/x12/x12.manager';

type X12ConfigByFormat = {
  [X12Formats.CON_ASE]: ConAse270Config;
  [X12Formats.CON_NOM]: ConNom271Config;
  [X12Formats.CON_COD]: ConCod271Config;
};

type X12ManagerByFormat<T extends X12Formats> = X12Manager<X12ConfigByFormat[T], X12ConfigByFormat[T]>;

export interface IOperateX12Interactor {
  operate(params: OperateX12ParamsDTO, body: OperateX12BodyDTO): Promise<X12OperationModel>;
}

export class OperateX12Interactor implements IOperateX12Interactor {
  async operate(params: OperateX12ParamsDTO, body: OperateX12BodyDTO): Promise<X12OperationModel> {
    const x12Manager = this.x12Factory(params.format);
    const model = this.operateX12(params.operation, body, x12Manager);

    return Promise.resolve(model);
  }

  private x12Factory<T extends X12Formats>(format: T): X12ManagerByFormat<T> {
    switch (format) {
      case X12Formats.CON_ASE:
        return new X12Manager(new ConAse270Config());
      case X12Formats.CON_NOM:
        return new X12Manager(new ConNom271Config());
      case X12Formats.CON_COD:
        return new X12Manager(new ConCod271Config());
    }
  }

  private operateX12(
    operation: X12Operations,
    body: OperateX12BodyDTO,
    x12Manager: X12ManagerByFormat<X12Formats>,
  ): X12OperationModel {
    switch (operation) {
      case X12Operations.ENCODE:
        return new X12OperationModel(x12Manager.encode(body.payload as Record<string, unknown>));
      case X12Operations.DECODE:
        return new X12OperationModel(x12Manager.decode(body.payload as string));
    }
  }
}

export class OperateX12InteractorBuilder {
  static build(): OperateX12Interactor {
    return new OperateX12Interactor();
  }
}
