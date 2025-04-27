import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatMessageComponent, GptMessageOrthographyComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-pros-cons-stream-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
  ],
  templateUrl: './prosConsStreamPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProsConsStreamPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public abortSignal = new AbortController();



  async handleMessage(prompt: string) {
    this.abortSignal.abort();
    this.abortSignal = new AbortController();
    this.messages.update((prev) => [...prev, { text: prompt, isGpt: false }, { text: '...', isGpt: true }]);
    this.isLoading.set(true);
    const stream = this.openAiService.prosConsStreamDiscusser(prompt, this.abortSignal.signal);
    this.isLoading.set(false);
    for await (const message of stream) {
      this.handleStreamResponse(message);
    }
  }

  handleStreamResponse(message: string) {
    this.messages().pop();
    const messages = this.messages();
    this.messages.set([...messages, { text: message, isGpt: true }]);
  }

}
