export type KeyFunction<T> = (data: T) => string;

export type VTableColumn<T> = {
  label: string;
  key: string;
  display: (data: T) => string;
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
