import { Injectable } from '@angular/core';
import { orthographyUseCase, prosConsStreamUseCase, translateStreamUseCase } from '@use-cases/index';
import { from } from 'rxjs';



@Injectable({ providedIn: 'root' })
export class OpenAiService {

  checkOrthography(text: string) {
    return from(orthographyUseCase(text));
  }

  prosConsStreamDiscusser(text: string, signal: AbortSignal) {
    return prosConsStreamUseCase(text, signal);
  }
  translate(text: string, lang: string, signal: AbortSignal) {
    return translateStreamUseCase(text, lang, signal);
  }
}
