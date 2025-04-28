import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatMessageComponent, MyMessageComponent, TypingLoaderComponent, TextMessageBoxComponent, GptMessageEditableImageComponent } from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-image-tunning-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxComponent,
    GptMessageEditableImageComponent
  ],
  templateUrl: './imageTunningPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ImageTunningPageComponent {

  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);
  public originalImage = signal<string | undefined>(undefined);
  public messages = signal<Message[]>([{ text: "", isGpt: true, imageInfo: { url: "http://localhost:3000/gpt/image-generation/1745816070755.png", alt: "" } }, { text: "", isGpt: true, imageInfo: { url: "http://localhost:3000/gpt/image-generation/1745848349509.png", alt: "" } },]);

  handleMessage(prompt: string) {
    this.isLoading.set(true);
    this.messages.update((prev) => [...prev, { text: prompt, isGpt: false }]);
    this.openAiService.imageGereneration(prompt).subscribe(resp => {
      this.isLoading.set(false);
      if (!resp) return;
      this.messages.update((prev) => [...prev, { text: resp.alt, isGpt: true, imageInfo: resp }]);
    });
  }

  generatedVariation() {
    if (!this.originalImage()) return;
    this.isLoading.set(true);
    this.openAiService
      .imageVariation(this.originalImage()!)
      .subscribe(resp => {
        this.isLoading.set(false);
        if (!resp) return;
        this.messages.update((prev) => [...prev, {
          isGpt: true,
          text: resp.alt,
          imageInfo: resp
        }])
      });
  }

  handleImageChange(newImage: string, originalImage: string) {
    this.originalImage.set(originalImage)
    console.log({ newImage, originalImage });
  }
}
