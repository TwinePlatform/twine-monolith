import * as PdfMake from 'pdfmake/build/pdfmake';
import { Dictionary } from 'ramda';


export enum PdfTemplateEnum {
  VISITOR_QR_CODE = 'visitor_qr_code',
}

export type PdfTemplateDefinition = {
  createTemplate: (a: Dictionary<any>) => Promise<PdfMake.TDocumentDefinitions>
  fontDescriptors: Dictionary<PdfMake.TFontFamilyTypes>
};
