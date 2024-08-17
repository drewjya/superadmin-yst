import type { Gender } from "@prisma/client";

export type KeyFunction<T> = (data: T) => string;

export type VTableColumn<T> = {
  label: string;
  key: string;
  display?: (data: T) => string;
  class: string;
  sorting?: () => void;
};

export type VCabang = {
  id: number;
  nama: string;
  phoneNumber: string;
  openHour: string;
  closeHour: string;
  alamat: string;
  picture: {
    path: string;
  } | null;
};

export type VTreatment= {
  id: number;
  nama: string;
  durasi: number;
  category: {
      nama: string;
  };
  tags: {
      name: string;
  } | null;
}

export type VTherapist = {
  id: number;
  gender: Gender;
  nama: string;
  no: string | null;
  attendance?: {
      id: number;
      checkIn: Date | null;
      checkOut: Date | null;
  };
  cabang: {
      id: number;
      nama: string;
  } | null;
}