export interface DataRow {
  PTM_collapse_key: string;
  "EG.ModifiedPeptide": string;
  "PEP.StrippedSequence": string;
  "PG.UniProtIds": string;
  "PTM_localization": number;
  primaryID: string;
  From: string;
  Entry: string;
  "Entry Name": string;
  [key: string]: string | number | boolean | null;
}
