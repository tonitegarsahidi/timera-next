import React from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
                <span className="text-emerald-600">Timera</span> - Kebijakan Privasi
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Kebijakan Privasi ini menjelaskan bagaimana Timera mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami.
              </p>
              
              <h2 className="text-gray-700">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-700">
                Saat Anda menggunakan Timera, kami dapat mengumpulkan informasi berikut:
              </p>
              <ul className="text-gray-700">
                <li className="text-gray-700">Nama dan alamat email yang digunakan untuk login dengan akun Google.</li>
                <li className="text-gray-700">Pengaturan jadwal sholat yang Anda simpan di layanan kami.</li>
                <li className="text-gray-700">Data teknis seperti jenis perangkat dan browser yang digunakan untuk mengakses layanan kami.</li>
              </ul>
              
              <h2 className="text-gray-700">2. Bagaimana Kami Menggunakan Informasi Anda</h2>
              <p className="text-gray-700">
                Informasi yang kami kumpulkan digunakan untuk:
              </p>
              <ul className="text-gray-700">
                <li className="text-gray-700">Menyediakan dan meningkatkan layanan Timera.</li>
                <li className="text-gray-700">Menyinkronkan pengaturan jadwal sholat Anda ke cloud.</li>
                <li className="text-gray-700">Mengirimkan pemberitahuan atau pembaruan layanan jika diperlukan.</li>
              </ul>
              
              <h2 className="text-gray-700">3. Perlindungan dan Keamanan Data</h2>
              <p className="text-gray-700">
                Kami menjaga keamanan data pengguna dengan menggunakan enkripsi dan langkah-langkah perlindungan lainnya. Kami tidak akan membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin eksplisit dari Anda, kecuali diwajibkan oleh hukum.
              </p>
              
              <h2 className="text-gray-700">4. Hak Anda</h2>
              <p className="text-gray-700">
                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda kapan saja. Jika Anda ingin menghapus akun atau data Anda, silakan hubungi kami.
              </p>
              
              <h2 className="text-gray-700">5. Perubahan Kebijakan</h2>
              <p className="text-gray-700">
                Kebijakan Privasi ini dapat diperbarui dari waktu ke waktu. Perubahan akan diinformasikan melalui situs web kami atau email jika diperlukan.
              </p>
              
              <h2 className="text-gray-700">6. Kontak</h2>
              <p className="text-gray-700">
                Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di <a href="mailto:admin@timera.my.id">admin@timera.my.id</a>.
              </p>
              <Link href="/">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Kembali ke Aplikasi
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default PrivacyPolicyPage;
