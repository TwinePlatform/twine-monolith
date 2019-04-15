/*
 * PDF generator service
 *
 * Currently only supports creation of one PDF template, but extensible
 * to allow others to be added.
 */
import { pipeStreamToPromise } from '../../utils';
import { PdfTemplateEnum, PdfTemplateModel } from './types';
import visitorQrCodeTemplate from './templates/visitor_qr_code';
const PdfMake = require('pdfmake');


const getTemplate = (template: PdfTemplateEnum) => {
  switch (template) {
    case PdfTemplateEnum.VISITOR_QR_CODE:
      return visitorQrCodeTemplate;

    /* istanbul ignore next */
    default:
      throw new Error('Switch case statement is non-exhaustive');
  }
};

export const fromTemplate = async (templateType: PdfTemplateEnum, model: PdfTemplateModel) => {
  const { fontDescriptors, createTemplate } = getTemplate(templateType);

  const printer = new PdfMake(fontDescriptors);
  const template = await createTemplate(model);
  const document = printer.createPdfKitDocument(template);
  const pData = pipeStreamToPromise(document);
  document.end();
  const data = await pData;

  return Buffer.concat(data).toString('base64');
};


export { PdfTemplateEnum };
