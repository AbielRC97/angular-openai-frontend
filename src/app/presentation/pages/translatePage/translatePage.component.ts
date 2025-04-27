import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';
import { TextMessageBoxEvent, TextMessageBoxSelectComponent } from '../../components/text-boxes/textMessageBoxSelect/textMessageBoxSelect.component';

@Component({
  selector: 'app-translate-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './translatePage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TranslatePageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public abortSignal = new AbortController();
  public languages = signal([
    { id: 'Mandarín', text: 'Mandarín' },  // Chino Mandarín
    { id: 'Español', text: 'Español' },   // Español
    { id: 'Inglés', text: 'Inglés' },    // Inglés
    { id: 'Hindi', text: 'Hindi' },     // Hindi
    { id: 'Árabe', text: 'Árabe' },     // Árabe
    { id: 'Bengalí', text: 'Bengalí' },   // Bengalí
    { id: 'Portugués', text: 'Portugués' }, // Portugués
    { id: 'Ruso', text: 'Ruso' },      // Ruso
    { id: 'Japonés', text: 'Japonés' },   // Japonés
    { id: 'Lahnda', text: 'Lahnda' },   // (Punjabi occidental)
  ]);



  async handleMessageWithSelect(event: TextMessageBoxEvent) {
    this.abortSignal.abort();
    this.abortSignal = new AbortController();
    this.messages.update((prev) => [...prev, { text: `Traduce el siguiente texto al idioma ${event.selectedOption}:${event.prompt}`, isGpt: false }, { text: '...', isGpt: true }]);
    this.isLoading.set(true);
    const stream = this.openAiService.translate(event.prompt, event.selectedOption, this.abortSignal.signal);
    this.isLoading.set(false);
    for await (const message of stream) {

      this.handleStreamResponse(message);
    }
  }

  handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();
    this.messages.set([...messages, { text: `La traducción es: ${message}`, isGpt: true }]);
  }
}
