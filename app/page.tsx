import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Clock,
  Timer,
  Monitor,
  Smartphone,
  Settings,
  ArrowRight,
  CheckCircle2,
  Laptop,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-900">TimerA</h2>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-emerald-900">
              Home
            </Link>
            <Link href="/#fitur" className="text-emerald-900">
              Fitur
            </Link>
            <Link href="/faq" className="text-emerald-900">
              FAQ
            </Link>
            <Link href="/help" className="text-emerald-900">
              Help
            </Link>
            <div className="relative group">
              <button className="focus:outline-none text-emerald-900">
                App Timer
              </button>
              <div className="absolute left-0 hidden group-hover:flex flex-col bg-white shadow-md rounded py-2 w-48 z-50 pointer-events-auto">
                <Link
                  href="/app"
                  className="block px-4 py-2 hover:bg-gray-100 text-emerald-900"
                >
                  Versi 1 (utama)
                </Link>
                <Link
                  href="/app/v2"
                  className="block px-4 py-2 hover:bg-gray-100 text-emerald-900"
                >
                  Versi 2
                </Link>
                <Link
                  href="/app/v3"
                  className="block px-4 py-2 hover:bg-gray-100 text-emerald-900"
                >
                  Versi 3
                </Link>
                <Link
                  href="/app/settings"
                  className="block px-4 py-2 hover:bg-gray-100 text-emerald-900"
                >
                  Setting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-gradient-to-r from-emerald-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="islamic-pattern w-full h-full"></div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 mb-4">
                <span className="text-emerald-600">TimerA</span> - Jadwal Sholat
                Digital
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Solusi gratis dan mudah untuk menampilkan jadwal sholat, timer
                iqomah, dan informasi masjid di layar TV Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app">
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Mulai Sekarang
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#fitur">
                  <Button variant="outline" size="lg">
                    Lihat Fitur
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="/jadwal sholat digital - timer iqomah - timer adzan - timer masjid - TIMERA.jpg?height=600&width=800"
                  alt="TimerA Preview"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-4 text-white">
                    <p className="text-sm md:text-base">
                      Tampilan jadwal sholat yang informatif dan menarik
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="fitur" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Utama
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TimerA menyediakan semua yang Anda butuhkan untuk menampilkan
              jadwal sholat digital di masjid Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="rounded-full bg-emerald-100 w-14 h-14 flex items-center justify-center mb-4">
                  <Clock className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Jadwal Sholat Akurat
                </h3>
                <p className="text-gray-700">
                  Tampilkan jadwal sholat yang akurat berdasarkan lokasi masjid
                  Anda dengan penyesuaian waktu yang fleksibel.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="rounded-full bg-emerald-100 w-14 h-14 flex items-center justify-center mb-4">
                  <Timer className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Timer Iqomah
                </h3>
                <p className="text-gray-700">
                  Atur durasi iqomah untuk setiap waktu sholat dan tampilkan
                  countdown yang jelas untuk jamaah.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-6">
                <div className="rounded-full bg-emerald-100 w-14 h-14 flex items-center justify-center mb-4">
                  <Settings className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Kustomisasi Penuh
                </h3>
                <p className="text-gray-700">
                  Sesuaikan tampilan dengan logo masjid, warna, font, dan
                  background sesuai keinginan Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cara Penggunaan
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mulai menggunakan TimerA hanya dalam beberapa langkah sederhana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-emerald-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Buka Aplikasi</h3>
              <p className="text-gray-600">
                Buka TimerA di browser TV Android atau perangkat yang terhubung
                ke TV
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-emerald-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Atur Pengaturan</h3>
              <p className="text-gray-600">
                Sesuaikan lokasi, waktu iqomah, dan tampilan sesuai kebutuhan
                masjid Anda
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-emerald-100 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Tampilkan di TV</h3>
              <p className="text-gray-600">
                Biarkan aplikasi berjalan di TV masjid Anda untuk menampilkan
                jadwal sholat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compatible Devices */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kompatibel dengan Berbagai Perangkat
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              TimerA dapat dijalankan di berbagai perangkat yang terhubung ke TV
              masjid Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-emerald-100 w-14 h-14 flex items-center justify-center mr-4">
                  <Laptop className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-gray-900">
                    Semua Browser
                  </h3>
                  <p className="text-gray-700">
                    Buka browser di manapun (PC/laptop/tablet/TV Android) dan
                    akses TimerA langsung
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-6 flex items-center">
                <div className="rounded-full bg-emerald-100 w-14 h-14 flex items-center justify-center mr-4">
                  <Monitor className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1 text-gray-900">
                    TV / STB Android
                  </h3>
                  <p className="text-gray-700">
                    Gunakan Set-Top Box Android yang terhubung ke TV biasa
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-emerald-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Keunggulan TimerA
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Mengapa memilih TimerA untuk masjid Anda?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1">Gratis Sepenuhnya</h3>
                <p className="text-gray-600">
                  Tidak ada biaya berlangganan atau pembelian. TimerA sepenuhnya
                  gratis untuk digunakan.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1">Mudah Digunakan</h3>
                <p className="text-gray-600">
                  Antarmuka yang sederhana dan intuitif, tidak memerlukan
                  keahlian teknis khusus untuk mengoperasikannya.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1">
                  Tidak Perlu Instalasi
                </h3>
                <p className="text-gray-600">
                  Cukup buka browser dan akses TimerA. Tidak perlu menginstal
                  aplikasi tambahan.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold mb-1">Tampilan Menarik</h3>
                <p className="text-gray-600">
                  Desain yang elegan dan profesional untuk meningkatkan estetika
                  masjid Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Mulai Gunakan TimerA Sekarang
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Tingkatkan pengalaman jamaah dengan jadwal sholat digital yang
            informatif dan menarik
          </p>
          <Link href="/app">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              Buka Aplikasi
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">TimerA</h2>
              <p className="text-gray-400">
                Jadwal Sholat Digital untuk Masjid
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link href="/app" className="text-gray-300 hover:text-white">
                Aplikasi
              </Link>
              <Link href="#fitur" className="text-gray-300 hover:text-white">
                Fitur
              </Link>
              <Link
                href="/term-of-service"
                className="text-gray-300 hover:text-white"
              >
                Terms Of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-gray-300 hover:text-white"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} TimerA. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
