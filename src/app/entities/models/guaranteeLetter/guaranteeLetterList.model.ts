import { GuaranteeLetterDTO } from '../../dtos/service/guaranteeLetter.dto';
import { BaseModel } from '../base.model';

import { GuaranteeLetterModel } from './guaranteeLetter.model';

export class GuaranteeLetterListModel extends BaseModel {
  readonly letters: GuaranteeLetterModel[];

  constructor(guaranteeLetters: GuaranteeLetterDTO[]) {
    super();

    this.letters = this.generateLettersList(guaranteeLetters);
  }

  private generateLettersList(guaranteeLetters: GuaranteeLetterDTO[]): GuaranteeLetterModel[] {
    return guaranteeLetters.map((letter) => new GuaranteeLetterModel(letter));
  }
}
