/*
 * pdfmake templates for document displaying a visitor's QR code
 */
import * as path from 'path';
import { mergeDeepRight } from 'ramda';
import { toDataUrl, isDataUrl } from '../../../utils';
import { getConfig } from '../../../../config';
import { PdfTemplateDefinition } from '../types';

const { root: ROOT } = getConfig(process.env.NODE_ENV);


const fontDescriptors = {
  Roboto: {
    normal: path.resolve(__dirname, '..', 'fonts', 'Roboto', 'Roboto-Regular.ttf'),
    bold: path.resolve(__dirname, '..', 'fonts', 'Roboto', 'Roboto-Medium.ttf'),
    italics: path.resolve(__dirname, '..', 'fonts', 'Roboto', 'Roboto-Italic.ttf'),
    bolditalics: path.resolve(__dirname, '..', 'fonts', 'Roboto', 'Roboto-MediumItalic.ttf'),
  },
};


const baseDocumentDefinition = {
  info: {
    title: 'Visitor QR Code',
    author: 'Twine',
  },

  pageSize: 'C8',
  pageOrientation: 'landscape',
  pageMargins: [5, 5, 5, 5],
};


const createCustomLogoTemplate = (qrCodeDataUrl: string, logoDataUrl: string) =>
  mergeDeepRight(baseDocumentDefinition, {
    content: [
      {
        columns: [
          {
            image: logoDataUrl,
            margin: [5, 5, 0, 0],
            fit: [100, 100],
          },
          {
            image: qrCodeDataUrl,
            margin: [-5, -3, 5, 0],
            fit: [115, 115],
          },
        ],
      },
      {
        text: 'Use this QR Code to sign in',
        fontSize: 14,
        alignment: 'center',
        margin: [0, 10, 10, 0],
        color: '#0a092a',
      },
    ],
  });

const createDefaultLogoTemplate = (qrCodeDataUrl: string) =>
  mergeDeepRight(baseDocumentDefinition, {
    content: [
      {
        columns: [
          {
            image: path.resolve(ROOT, 'assets', 'png', 'power_to_change_logo_small.png'),
            width: 38,
            height: 129.5,
            margin: [0, 10, 0, 0],
          },
          {
            image: qrCodeDataUrl,
            margin: [25, 5, 0, 0],
            fit: [125, 125],
          },
        ],
      },
      {
        text: 'Use this QR Code to sign in',
        fontSize: 14,
        alignment: 'right',
        margin: [0, -10, 10, 0],
        color: '#0a092a',
      },
    ],
  });

const createTemplate = async (
  { qrCodeDataUrl, logoUrl }: { qrCodeDataUrl: string, logoUrl?: string }
) => {
  if (logoUrl) {
    if (isDataUrl(logoUrl)) {
      return createCustomLogoTemplate(qrCodeDataUrl, logoUrl);
    } else {
      const logoDataUrl = await toDataUrl(logoUrl);
      return createCustomLogoTemplate(qrCodeDataUrl, logoDataUrl);
    }
  } else {
    return createDefaultLogoTemplate(qrCodeDataUrl);
  }
};

const main: PdfTemplateDefinition = {
  fontDescriptors,
  createTemplate,
};

export default main;
