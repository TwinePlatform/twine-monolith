import * as PdfMake from 'pdfmake/build/pdfmake';
import { Dictionary } from 'ramda';
import { ValueOf } from '../../types/internal';


export enum PdfTemplateEnum {
  VISITOR_QR_CODE = 'visitor_qr_code',
}

export type PdfTemplateDefinition = {
  createTemplate: (a: Dictionary<any>) => Promise<PdfMake.TDocumentDefinitions>
  fontDescriptors: Dictionary<PdfMake.TFontFamilyTypes>
};

export type PdfTemplateModels = {
  [PdfTemplateEnum.VISITOR_QR_CODE]: { qrCodeDataUrl: string, logoUrl?: string }
};

export type PdfTemplateModel = ValueOf<PdfTemplateModels>;
