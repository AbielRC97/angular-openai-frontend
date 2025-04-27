
import { AudioToTextResponse } from '@interfaces/index';
import { environment } from 'environments/environment';
export  const audioToTextUseCase = async (audiofile: File, prompt?: string) => {
  try {
    const form = new FormData();
    form.append('file', audiofile);
    if (prompt) {
      form.append('prompt', prompt);
    }
    const resp = await fetch(`${environment.backendApi}/audio-to-text`,{
      method: 'POST',
      body: form,
    } );
    const data = await resp.json() as AudioToTextResponse;
    return data;
  } catch (error) {
    console.error('Error in audioToTextUseCase:', error);
    return null;
  }
}
