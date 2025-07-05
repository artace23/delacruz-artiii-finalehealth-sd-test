export interface Patient {
  _id?: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phoneNumber: string;
  address: string;
  dateCreated?: string;
  dateUpdated?: string;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  phoneNumber: string;
  address: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {} 