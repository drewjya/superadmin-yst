import type { Gender, OrderStatus } from "@prisma/client";

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

export type VTreatment = {
  id: number;
  nama: string;
  durasi: number;
  category: {
    nama: string;
  };
  tags: {
    name: string;
  } | null;
};

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
};

export type VOrder = {
  id: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  guestGender: Gender;
  orderId: string;
  confirmationTime: Date | null;
  orderTime: Date | null;
  cabang: {
    nama: string;
    id: number;
  };
  picture: {
    path: string;
  } | null;
  therapist: {
    nama: string;
    no: string | null;
  } | null;
};

export type VOrderDetail = VOrder & {
  orderDetails: {
    nama: string;
    price: number;
    duration: number;
    treatment: {
      nama: string;
      category: {
        nama: string;
      };
      tags: {
        name: string;
      } | null;
    };
  }[];
  therapistGender: Gender;
  user: {
    name: string;
    email: string;
    phoneNumber: string;
    gender: Gender | null;
    id: number;
  };
  createdAt: Date;
};

export type State<T> = {
  data: T | undefined;
  loading: boolean;
};
