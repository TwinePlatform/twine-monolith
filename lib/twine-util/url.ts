import axios from 'axios';

export const isDataUrl = (s: string) => s.startsWith('data:');

export const isJpeg = (url: string) => ['.jpg', '.jpeg'].some((s) => url.endsWith(s));

export const toPngUrl = (url: string) => url.replace(/\.[A-Za-z]+$/, '.png')

export const toDataUrl = async (url: string) => {
  const result = await axios.get(url, { responseType: 'arraybuffer' });
  const contentType = result.headers['content-type'];
  const content = Buffer.from(result.data, 'binary').toString('base64');

  if (!contentType) {
    throw new Error('No content type');
  }

  return `data:${contentType};base64,${content}`;
}
