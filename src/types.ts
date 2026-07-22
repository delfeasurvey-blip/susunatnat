export interface Product {
  id: string;
  name: string;
  type: 'Pasteurisasi' | 'UHT' | 'Steril';
  volume: string; // e.g., '125 ml'
  packaging: string; // e.g., 'Cup Higienis'
  price: number; // in IDR
  targetAudience: string; // e.g., 'Anak SD, Ibu Hamil'
  nutrients: {
    energy: string; // e.g., '88 kcal'
    protein: string; // e.g., '4.3 g'
    calcium: string; // e.g., '135 mg'
    totalFat: string; // e.g., '6.7 g'
    saturatedFat: string; // e.g., '3.0 g'
    carbohydrates: string; // e.g., '5.6 g'
  };
  description: string;
  certifications: string[];
}

export interface MitraSPPG {
  id: string;
  name: string;
  location: string; // District/City
  address: string;
  coordinator: string;
  phone: string;
  beneficiariesCount: number; // Number of students/recipients
  dailyQuota: number; // Cups per day
}

export interface Order {
  id: string;
  mitraId: string;
  mitraName: string;
  productName: string;
  quantity: number;
  deliveryDate: string;
  status: 'Dipesan' | 'Dalam Perjalanan' | 'Selesai' | 'Dibatalkan';
  orderDate: string;
  notes?: string;
  signedBy?: string; // Signature name for BAST
  signatureData?: string; // Base64 signature stroke data
  receivedDate?: string;
}

export interface DeliveryLog {
  id: string;
  orderId: string;
  driverName: string;
  vehicleNo: string;
  departureTime: string;
  status: 'Dalam Perjalanan' | 'Selesai' | 'Kendala';
  currentTemp: number; // in Celsius (must be kept cold, ideally 2-4 C)
  tempHistory: { time: string; temp: number }[];
  routeCoordinates: { lat: number; lng: number }[];
  currentStepIndex: number;
}

export interface Ticket {
  id: string;
  mitraId: string;
  mitraName: string;
  type: 'Kemasan Rusak' | 'Rasa Masam / Basi' | 'Suhu Rantai Dingin Naik' | 'Keterlambatan' | 'Lainnya';
  description: string;
  date: string;
  status: 'Baru' | 'Diproses QC' | 'Selesai' | 'Ditolak';
  resolution?: string;
  severity: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Gizi' | 'SOP Distribusi' | 'Siaran Pers';
  date: string;
  author: string;
}

export interface LabReport {
  id: string;
  batchNo: string;
  testDate: string;
  bacteriaCount: string; // e.g. < 10,000 CFU/ml (standard is secure)
  fatContent: string; // e.g. 3.4%
  proteinContent: string; // e.g. 3.2%
  sensoryTest: 'Sesuai Standar' | 'Tidak Sesuai';
  status: 'Lulus Uji' | 'Gagal Uji';
  certifiedBy: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaUrl: string; // URL of image or video embed link
  linkUrl?: string; // Destination URL
  buttonText?: string; // CTA button text
  isActive: boolean;
}

