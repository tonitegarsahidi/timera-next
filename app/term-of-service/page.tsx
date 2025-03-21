import React from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
                <span className="text-emerald-600">Timera</span> - Ketentuan Layanan
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Selamat datang di Timera! Dengan mengakses atau menggunakan layanan kami, Anda menyetujui ketentuan berikut.
              </p>
              
              <h2 className="text-gray-700">1. Penggunaan Layanan</h2>
              <p className="text-gray-700">
                Timera menyediakan layanan jadwal sholat digital yang dapat disesuaikan dan disinkronkan dengan akun Google Anda.
                Anda setuju untuk menggunakan layanan ini hanya untuk keperluan yang sah, tidak melanggar hukum, dan tidak merugikan pihak lain.
              </p>
              
              <h2 className="text-gray-700">2. Akun dan Keamanan</h2>
              <p className="text-gray-700">
                Untuk mengakses fitur sinkronisasi, Anda dapat masuk menggunakan akun Google Anda. Anda bertanggung jawab atas keamanan akun Anda,
                termasuk menjaga kerahasiaan kredensial login dan tidak membagikannya dengan pihak lain.
              </p>
              
              <h2 className="text-gray-700">3. Privasi dan Data</h2>
              <p className="text-gray-700">
                Kami menghargai privasi Anda. Data pengaturan jadwal sholat Anda akan disimpan di cloud secara aman dan hanya digunakan untuk memberikan layanan yang lebih baik.
                Kami tidak akan membagikan data Anda kepada pihak ketiga tanpa izin eksplisit dari Anda. Untuk informasi lebih lanjut, silakan lihat Kebijakan Privasi kami.
              </p>
              
              <h2 className="text-gray-700">4. Perubahan dan Pembaruan</h2>
              <p className="text-gray-700">
                Timera berhak untuk mengubah atau memperbarui ketentuan layanan ini kapan saja. Perubahan akan diberitahukan melalui situs web atau email jika diperlukan.
                Dengan terus menggunakan layanan kami setelah perubahan, Anda dianggap menyetujui ketentuan terbaru.
              </p>
              
              <h2 className="text-gray-700">5. Pembatasan Tanggung Jawab</h2>
              <p className="text-gray-700">
                Timera disediakan sebagaimana adanya tanpa jaminan apa pun. Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan layanan ini,
                termasuk tetapi tidak terbatas pada gangguan teknis atau kesalahan dalam jadwal sholat.
              </p>
              
              <h2 className="text-gray-700">6. Kontak</h2>
              <p className="text-gray-700">
                Jika Anda memiliki pertanyaan atau memerlukan bantuan terkait ketentuan layanan ini, silakan hubungi kami di <a href="mailto:admin@timera.my.id">admin@timera.my.id</a>.
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

export default TermsOfServicePage;
