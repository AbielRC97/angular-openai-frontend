import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-gpt-message-editable-image',
  standalone: true,
  imports: [],
  templateUrl: './gptMessageEditableImage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GptMessageEditableImageComponent {

  @Input({ required: true }) text!: string;
  @Input({ required: true }) imageInfo!: { url: string; alt: string }
  @Output() onSelectedImage = new EventEmitter<string>();

  handleClick(){
    this.onSelectedImage.emit(this.imageInfo.url);
  }
}
