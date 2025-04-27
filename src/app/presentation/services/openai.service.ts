import { Injectable } from '@angular/core';
import { orthographyUseCase, prosConsStreamUseCase } from '@use-cases/index';
import { from } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class OpenAiService {

  checkOrthography(text: string) {
    return from(orthographyUseCase(text));
  }

  prosConsStreamDiscusser(text: string, signal: AbortSignal) {
    return prosConsStreamUseCase(text, signal);
  }
}
