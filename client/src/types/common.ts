export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface RecordBase {
  id: string;
  createdAt: string;
  updatedAt: string;
}
