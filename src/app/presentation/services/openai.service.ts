import { Injectable } from '@angular/core';
import { orthographyUseCase } from '@use-cases/index';
import { from } from 'rxjs';



@Injectable({providedIn: 'root'})
export class OpenAiService {

  checkOrthography(text: string) {
    return from(orthographyUseCase(text));
  }

}
