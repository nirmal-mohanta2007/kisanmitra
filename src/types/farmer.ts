import { User } from './user';

export interface LandDetails {
  id: string;
  areaAcres: number;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
}

export interface FarmerProfile extends User {
  farmerId: string;
  landDetails: LandDetails[];
  bankDetails: BankDetails;
}
