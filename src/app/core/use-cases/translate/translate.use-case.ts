import { environment } from 'environments/environment';
export async function* translateStreamUseCase(prompt: string, lang: string, signal: AbortSignal) {
  try {
    const resp = await fetch(`${environment.backendApi}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, lang }),
      signal
    });

    if (!resp.ok) throw new Error('No se pudo realizar la corrección');
    const reader = resp.body?.getReader();
    if (!reader) throw new Error('No se pudo leer la respuesta del servidor');

    const decoder = new TextDecoder('utf-8');
    let text = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      text += chunk;
      yield text;
    }
    return text;
  } catch (error) {
    return null;
  }
}
